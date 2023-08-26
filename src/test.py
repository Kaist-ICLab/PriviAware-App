import os
import datetime
from pymongo import MongoClient
import pandas as pd 
import time
from dotenv import load_dotenv
import math

if __name__ == "__main__":
    # mongodb connection
    user_id = "abcreader"
    password = "abcreader"
    mongodb_URI = "mongodb://%s:%s@server3.iclab.dev:50031" % (user_id, password)
    client = MongoClient(mongodb_URI)
    db = client.abc
    collection = db.datum #users


datatype = "APP_USAGE_EVENT"

hour=60*60*1000
day=60*60*1000*24
end_timestamp = time.time()*1000 
start_timestamp = end_timestamp - day*2

query = {
        "$and": [{
            "subject.email": 'priviztester02@gmail.com',
            "datumType": datatype
        },  
        {"timestamp": {"$gt": 1691107200000}}, 
        {"timestamp": {"$lt": 1691374306000}}
            ]
        }

all_data = collection.find_one(query)
res = list(collection.find(query))


print('all data', res[:5])

df = pd.json_normalize(all_data)
print('normalized')
df.to_csv('test.csv')


'''
filter with data from location record

BASEDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv()

ABC_MONGODB_URI = os.getenv("ABC_MONGODB_URI")
ABC_MONGODB_DB_NAME = os.getenv("ABC_MONGODB_DB_NAME")
ABC_MONGODB_COLLECTION = os.getenv("ABC_MONGODB_COLLECTION")
MEMBER_MONGODB_URI = os.getenv("MEMBER_MONGODB_URI")
MEMBER_MONGODB_DB_NAME = os.getenv("MEMBER_MONGODB_DB_NAME")
MEMBER_MONGODB_COLLECTION = os.getenv("MEMBER_MONGODB_COLLECTION")
LOCATION_MONGODB_COLLECTION = os.getenv("LOCATION_MONGODB_COLLECTION")

TIMEZONE_OFFSET = 9
INTERVAL_BETWEEN_LOCATION_RECORDS = 11 * 60 * 1000


# return the distance between 2 points in km
def calDistance(lat1, lon1, lat2, lon2):
    # Radius of the Earth in km
    radius = 6371
    # Convert latitude and longitude to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    # Distance in km
    distance = radius * c
    return distance


def getTSfromLocation(locationRecord, targetLat, targetLong, targetRadius):
    targetRadius = int(targetRadius) / 1000
    tsArray = []
    
    for i, loc in enumerate(locationRecord):
        tsArrayObj = {"startTS": 0, "endTS": 0}
        # within deletion region
        print('loc', loc)
        if(calDistance(loc["latitude"], loc["longitude"], targetLat, targetLong) <= targetRadius):
            print(calDistance(loc["latitude"], loc["longitude"], targetLat, targetLong),targetRadius, 'distance')
            # first entry
            if len(tsArray)== 0:
                tsArrayObj["startTS"] = loc["timestamp"]
                tsArray.append(tsArrayObj)
            # all other non-continuous entries
            elif loc["timestamp"] - locationRecord[i - 1]["timestamp"] >= INTERVAL_BETWEEN_LOCATION_RECORDS:
                tsArray[len(tsArray) - 1]["endTS"] = locationRecord[i - 1]["timestamp"]
                tsArrayObj["startTS"] = loc["timestamp"]
                tsArray.append(tsArrayObj)
        # outside of deletion region
        else:
            if len(tsArray) > 0 and i > 0:
                tsArray[len(tsArray) - 1]["endTS"] = locationRecord[i - 1]["timestamp"]
                tsArrayObj["startTS"] = loc["timestamp"]
                tsArray.append(tsArrayObj)

        print(tsArray)
    # set the last ts of tsArray as last entry in Location Member DB
    if len(tsArray) > 0:
        tsArray[len(tsArray) - 1]["endTS"] = locationRecord[len(locationRecord) - 1]["timestamp"]
    return tsArray

def tryScheduler():
    print("[Flask server.py] running scheduler at " + time.ctime())
    memberClient = MongoClient(MEMBER_MONGODB_URI)
    memberDB = memberClient[MEMBER_MONGODB_DB_NAME]
    memberDatum = memberDB[MEMBER_MONGODB_COLLECTION]
    ABCClient = MongoClient(ABC_MONGODB_URI)
    ABCDB = ABCClient[ABC_MONGODB_DB_NAME]
    ABCDatum = ABCDB[ABC_MONGODB_COLLECTION]
    user = list(memberDatum.find({}))
    
    # for each user
    for u in user:
        # for each datatype's status

        for s in u["status"]:
            # handle filtering conditions
            if u["status"][s] == "filter":
                # handle filtering conditions one by one
                for cf in u["filteringCondition"][s]:

                    if "L" in cf["type"]:
                        print("[Flask server.py] Handling location filtering for", s, "from user", u["email"])
                        targetLat = cf["latitude"]
                        targetLong = cf["longitude"]
                        targetRadius = cf["radius"]
                        print("Targeting on", targetLat, targetLong, "for data type", s)
                        query = {
                                "$and": [
                                    {
                                         "subject.email": u['email'],
                                         "datumType": 'LOCATION'
                                    },  
                                    {
                                        "timestamp": {"$gt": cf["applyTS"]}
                                    },
                                    {
                                        "timestamp": {"$lt": int(time.time() * 1000)}
                                    }
                                ]
                            }
                        print(query)

                        locationRecord = list(ABCDatum.find(query))

                        def convert(record):
                            return {
                                "timestamp": record["timestamp"],
                                "latitude": record["value"]["latitude"],
                                "longitude": record["value"]["longitude"]
                            } 
                        convertedRecord = list(map(convert, locationRecord))
                        # get the time ranges for deletion

                        tsArray = getTSfromLocation(convertedRecord, targetLat, targetLong, targetRadius)

                        print(tsArray, "here is tsArray")
                        # delete the data within the ts on ABCLogger DB
                        for ts in tsArray:
                            print(ts["startTS"], ts["endTS"])
                            query = {
                                "$and": [
                                    {
                                        "subject.email": u["email"],
                                        "datumType": s.upper()
                                    },  
                                    {
                                        "timestamp": {"$gt": ts["startTS"]}
                                    },
                                    {
                                        "timestamp": {"$lt": ts["endTS"]}
                                    }
                                ]
                            }
                            deletion = ABCDatum.delete_many(query)
                            print(deletion.deleted_count)
            # handle data collection off
            if u["status"][s] == "off":
                print("[Flask server.py] Handling data collection off for", s, "from user", u["email"])
                applyTS = u["offTS"][s]
                query = {
                    "$and": [
                        {
                            "subject.email": u["email"],
                            "datumType": s.upper()
                        },  
                        {
                            "timestamp": {"$gt": applyTS}
                        },
                        {
                            "timestamp": {"$lt": int(time.time() * 1000)}
                        }
                    ]
                }
                deletion = ABCDatum.delete_many(query)
                print(deletion.deleted_count)
    memberClient.close()
    ABCClient.close()
    return

tryScheduler()

'''