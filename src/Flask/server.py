import os
import time
import datetime
from flask import Flask
from flask import request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# get config from .env file
BASEDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(BASEDIR + "/../../.env")
SERVER_IP_ADDR = os.getenv("SERVER_IP_ADDR")
SERVER_PORT = os.getenv("SERVER_PORT")
ABC_MONGODB_URI = os.getenv("ABC_MONGODB_URI")
ABC_MONGODB_DB_NAME = os.getenv("ABC_MONGODB_DB_NAME")
ABC_MONGODB_COLLECTION = os.getenv("ABC_MONGODB_COLLECTION")
MEMBER_MONGODB_URI = os.getenv("MEMBER_MONGODB_URI")
MEMBER_MONGODB_DB_NAME = os.getenv("MEMBER_MONGODB_DB_NAME")
MEMBER_MONGODB_COLLECTION = os.getenv("MEMBER_MONGODB_COLLECTION")
LOCATION_MONGODB_COLLECTION = os.getenv("LOCATION_MONGODB_COLLECTION")

DATATYPE = [
    { "name": "bluetooth" },
    { "name": "wifi" },
    { "name": "battery" },
    { "name": "data_traffic" },
    { "name": "device_event" },
    { "name": "message" },
    { "name": "call_log" },
    { "name": "installed_app" },
    { "name": "location" },
    { "name": "fitness" },
    { "name": "physical_activity" },
    { "name": "physical_activity_transition" },
    { "name": "survey" }
]
TIMEZONE_OFFSET = 9


def tryScheduler():
    print("[Flask server.py] running scheduler at " + time.ctime())
    memberClient = MongoClient(MEMBER_MONGODB_URI)
    memberDB = memberClient[MEMBER_MONGODB_DB_NAME]
    memberDatum = memberDB[MEMBER_MONGODB_COLLECTION]
    locationDatum = memberDB[LOCATION_MONGODB_COLLECTION]
    ABCClient = MongoClient(ABC_MONGODB_URI)
    ABCDB = ABCClient[ABC_MONGODB_DB_NAME]
    ABCDatum = ABCDB[ABC_MONGODB_COLLECTION]
    user = list(memberDatum.find({}))
    # for each user
    for u in user:
        # for each datatype's status
        for s in u["status"]:
            # handle time filtering
            if u["status"][s] == "time":
                print("[Flask server.py] Handling time filtering for", s)
                initTime = 1680274800000    # only handle data after 01/04/2023
                currentTime = int(time.time() * 1000)
                startingTime = datetime.datetime.strptime(u["timeFiltering"][s]["startingTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
                endingTime = datetime.datetime.strptime(u["timeFiltering"][s]["endingTime"], '%Y-%m-%dT%H:%M:%S.%fZ')
                for t in range(initTime, currentTime, 24 * 60 * 60 * 1000):
                    startTS = t + (startingTime.hour + TIMEZONE_OFFSET) * 60 * 60 * 1000 + startingTime.minute * 60 * 1000
                    endTS = t + (endingTime.hour + TIMEZONE_OFFSET) * 60 * 60 * 1000 + endingTime.minute * 60 * 1000
                    query = {
                        "$and": [
                            {
                                "subject.email": u["email"],
                                "datumType": s.upper()
                            },  
                            {
                                "timestamp": {"$gt": startTS}
                            },
                            {
                                "timestamp": {"$lt": endTS}
                            }
                        ]
                    }
                    waitingForDelete = list(ABCDatum.find(query))
                    print(len(waitingForDelete))
            # handle location filtering
            if u["status"][s] == "location":
                print("[Flask server.py] Handling location filtering for", s)
                loc = list(locationDatum.find({"email": u["email"]}))
                print(len(loc))
    memberClient.close()
    ABCClient.close()
    return

# tryScheduler()

scheduler = BackgroundScheduler(daemon = True, timezone="Asia/Seoul")
scheduler.add_job(tryScheduler, 'cron', hour=18, minute=14)
scheduler.start()

# delete data from MongoDB which matches the condition
@app.route("/deletedata", methods=['POST'])
def dataDeletion():
    print("[Flask server.py] POST path /deletedata")
    print("[Flask server.py] Process delete with filter " + str(request.json["queryFilter"]))
    # MongoDB connection
    client = MongoClient(ABC_MONGODB_URI)
    db = client[ABC_MONGODB_DB_NAME]
    datum = db[ABC_MONGODB_COLLECTION]
    query = {
        "$and": [request.json["queryFilter"]]
        }
    res = datum.delete_many(query)
    print("[Flask server.py] Deleted " + str(res.deleted_count) + " row(s) of data")
    client.close()
    return { "result": "deletedata" }

# fetch data from MongoDB with the provided query filter
@app.route("/data", methods=['POST'])
def dataQuery():
    print("[Flask server.py] POST path /data")
    print("[Flask server.py] Process query with filter " + str(request.json["queryFilter"]))
    # MongoDB connection
    client = MongoClient(ABC_MONGODB_URI)
    db = client[ABC_MONGODB_DB_NAME]
    datum = db[ABC_MONGODB_COLLECTION]
    # start querying
    day=60*60*1000*24
    end_timestamp = time.time()*1000 
    start_timestamp = end_timestamp - day*2
    query = {
        "$and": [request.json["queryFilter"],  
        {"timestamp": {"$gt": start_timestamp}}, 
        {"timestamp": {"$lt": end_timestamp}}
            ]
        }
    all_data = list(datum.find(query))
    if(len(all_data) > 0):
        print("[Flask server.py] First entry of fetched data: " + str(all_data[0]))
    else:
        print("[Flask server.py] No data is founded")
    client.close()
    return { "result": "data" }

# fetch member data from PrivacyViz-Member MongoDB for login check
@app.route("/login", methods=['POST'])
def login():
    print("[Flask server.py] POST path /login")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[MEMBER_MONGODB_COLLECTION]
    user = datum.find_one({"email": request.json["email"]})
    client.close()
    if(user):
        if(bcrypt.check_password_hash(user["password"], request.json["password"])):
            return { "result": True }
    return { "result": False }

# create entry in PrivacyViz-Member MongoDB
@app.route("/createuser", methods=['POST'])
def createUser():
    print("[Flask server.py] POST path /createuser")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[MEMBER_MONGODB_COLLECTION]
    initStatus = {}
    initTimeFiltering = {}
    initLocationFiltering = {}
    for dt in DATATYPE:
        initStatus[dt['name']] = "on"
        initTimeFiltering[dt['name']] = {}
        initLocationFiltering[dt['name']] = {}
    duplicant = datum.find_one({"email": request.json["email"]})
    if(duplicant):
        client.close()
        return { "result": False }
    datum.insert_one({"email": request.json["email"], "password": bcrypt.generate_password_hash(request.json["password"]), "status": initStatus, "timeFiltering": initTimeFiltering, "locationFiltering": initLocationFiltering})
    client.close()
    return { "result": True }

# fetch status data from PrivacyViz-Member MongoDB for a specific user
@app.route("/status", methods=['POST'])
def getStatus():
    print("[Flask server.py] POST path /status")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[MEMBER_MONGODB_COLLECTION]
    user = datum.find_one({"email": request.json["email"]})
    client.close()
    if(user):
        return user["status"]
    return {}

# update status data from PrivacyViz-Member MongoDB for a specific user
@app.route("/setstatus", methods=['POST'])
def setStatus():
    print("[Flask server.py] POST path /setstatus")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[MEMBER_MONGODB_COLLECTION]
    user = datum.find_one_and_update({ "email": request.json["email"] }, { '$set': request.json["newStatus"] })
    client.close()
    if(user):
        return { "result": True }
    return {"result": False }

# fetch filtering setting data from PrivacyViz-Member MongoDB for a specific user
@app.route("/getfiltering", methods=['POST'])
def getFiltering():
    print("[Flask server.py] POST path /getfiltering")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[MEMBER_MONGODB_COLLECTION]
    user = datum.find_one({ "email": request.json["email"] })
    client.close()
    if(user):
        return { "timeFiltering": user["timeFiltering"], "locationFiltering": user["locationFiltering"]}
    return { "timeFiltering": [], "locationFiltering": [] }

# save location record in PrivacyViz-Member MongoDB
@app.route("/locationrecord", methods=['POST'])
def saveLocationRecord():
    print("[Flask server.py] POST path /locationrecord")
    client = MongoClient(MEMBER_MONGODB_URI)
    db = client[MEMBER_MONGODB_DB_NAME]
    datum = db[LOCATION_MONGODB_COLLECTION]
    datum.insert_one(request.json["locationRecord"])
    client.close()
    return { "result": True }

# test Flask server + PrivacyViz-Member MongoDB connection
@app.route("/test", methods=['GET'])
def testConnection():
    print("[Flask server.py] GET path /test")
    client = MongoClient(ABC_MONGODB_URI)
    db = client[ABC_MONGODB_DB_NAME]
    datum = db[ABC_MONGODB_COLLECTION]
    query = {
        "$and": [
            {
                "subject.email": 'emily@kse.kaist.ac.kr',
                "datumType": "BLUETOOTH"
            },  
            {
                "timestamp": {"$gt": 1680274800000} # Data after 01/04/2023
            }
        ]
    }
    res = datum.find_one(query)
    print(res)
    client.close()
    if(res):
        print("[Flask server.py] First entry of fetched data: " + str(res))
    else:
        print("[Flask server.py] No data is founded")
        return { "result": "ConnSucess but nothing found" }
    return { "result": "ConnSuccess" }

# test the background running function in RN
@app.route("/testbackground", methods=['POST'])
def testBackground():
    print("[Flask server.py] POST path /testbackground")
    print(request.json["body"])
    return { "result": True }

if __name__ == "__main__":
    app.run(debug=True, host=SERVER_IP_ADDR, port=SERVER_PORT)