from kafka import KafkaProducer
import pandas as pd
import dask.dataframe as dd
import json
import time


producer = KafkaProducer(
    bootstrap_servers='localhost:9092', # where to connect
    value_serializer=lambda v: json.dumps(v).encode('utf-8') # the dictionary that will be given as a value to send to kafka will be seriallized into a json string
)


# here the real dataframe will be sorted according to the timestamps

nari_dynamic = dd.read_csv('./data/nari_dynamic.csv', assume_missing=True)
nari_dynamic_sar = dd.read_csv('./data/nari_dynamic_sar.csv', assume_missing=True)
nari_dynamic_sar = nari_dynamic_sar.rename(columns={'ts': 't'})
nari_dynamic_sar = nari_dynamic_sar.drop(columns=['altitude'])

df =  dd.concat([nari_dynamic,nari_dynamic_sar], axis=0, interleave_partitions=True)


df.sort_values(by='t',ascending=True)
df['t'] = dd.to_datetime(df['t'], unit='s')  

prev_time = None
for _, row in df.iterrows():
    
    current_time = row['t']

    if prev_time is not None:
        # Sleep based on real delta between timestamps
        delta = (current_time - prev_time).total_seconds()
        if delta > 0:
            time.sleep(delta)

    # Convert row to JSON-safe dict
    record = row.to_dict()
    record['t'] = row['t'].strftime('%Y-%m-%d %H:%M:%S')

    # Send to Kafka
    producer.send('ais-data', record)
    print(f"Sent at {record['t']}: {record}")

    prev_time = current_time
