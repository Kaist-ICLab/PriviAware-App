import os
from pymongo import MongoClient
import pandas as pd
import time

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

# df = pd.json_normalize(all_data)
# print('normalized')
# df.to_csv('test.csv')