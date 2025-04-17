from kafka import KafkaProducer
import pandas as pd
import json
import time


producer = KafkaProducer(
    bootstrap_servers='localhost:9092', # where to connect
    value_serializer=lambda v: json.dumps(v).encode('utf-8') # the dictionary that will be given as a value to send to kafka will be seriallized into a json string
)

data = pd.read_csv("./data.csv") # here goes the real name of the file with the location data

# here the real dataframe will be sorted according to the timestamps

for index, row in data.iterrows():
    row_dict = row.to_dict()
    producer.send('test-topic', value=row_dict)

    print("Producer sent message: ", row_dict)

    time.sleep(3) # here producer will sleep for the difference of seconds between the timestamp of this record and the next one