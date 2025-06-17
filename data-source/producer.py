from kafka import KafkaProducer
import pandas as pd
import dask.dataframe as dd
import json
import time
import re

def clean_eta(eta_value):
    if pd.isna(eta_value) or eta_value in ['', '00-00 24:60', 'NaN']:
        return None
    try:
        if isinstance(eta_value, str):
            if re.match(r'\d{2}-\d{2} \d{2}:\d{2}', eta_value):
                month, day, hour, minute = map(int, re.findall(r'\d+', eta_value))
                if all([
                    1 <= month <= 12,
                    1 <= day <= 31,
                    0 <= hour <= 23,
                    0 <= minute <= 59
                ]):
                    return f"{month:02d}-{day:02d} {hour:02d}:{minute:02d}"
        return None
    except:
        return None



# setup the producer
producer = KafkaProducer(
    bootstrap_servers='localhost:9092', # where to connect
    value_serializer=lambda v: json.dumps(v).encode('utf-8') # the dictionary that will be given as a value to send to kafka will be seriallized into a json string
)


# load the data from the csv's
nari_dynamic = dd.read_csv('./data/nari_dynamic.csv', assume_missing=True)
nari_dynamic_sar = dd.read_csv('./data/nari_dynamic_sar.csv', assume_missing=True)
nari_dynamic_sar = nari_dynamic_sar.rename(columns={'ts': 't'})
nari_dynamic_sar = nari_dynamic_sar.drop(columns=['altitude'])
nari_static = pd.read_csv('./data/nari_static.csv',low_memory=False)

# preprocess the data
nari_static = nari_static[['sourcemmsi', 't', 'eta', 'destination', 'draught', 'mothershipmmsi']]
df =  dd.concat([nari_dynamic,nari_dynamic_sar], axis=0, interleave_partitions=True)
df.sort_values(by='t',ascending=True)
df['t'] = dd.to_datetime(df['t'], unit='s',errors='coerce')  
nari_static['t'] = pd.to_datetime(nari_static['t'], unit='s',errors='coerce')  
df['t'] = df['t'].dt.round('1s')
nari_static['t'] = nari_static['t'].dt.round('1s')
df['sourcemmsi'] = df['sourcemmsi'].astype('int64')
nari_static['sourcemmsi'] = nari_static['sourcemmsi'].astype('int64')



df = dd.merge(df,nari_static, how='left', on=['t','sourcemmsi'])

prev_time = None

for _, row in df.iterrows():
    current_time = row['t']
    if prev_time is not None:
        delta = (current_time - prev_time).total_seconds()
        if delta > 0:
            time.sleep(delta)
    
    record ={}
    for key, value in row.to_dict().items():
        if pd.isna(value):
            record[key] = None
        elif key == 'eta':
            record[key] = clean_eta(value)  # Special handling for ETA
        elif isinstance(value, pd.Timestamp):
            record[key] = value.strftime('%Y-%m-%d %H:%M:%S')
        elif hasattr(value, 'item'):
            record[key] = value.item()
        else:
            record[key] = value
    
    # Send to Kafka
    producer.send('ais-data', record)
    print(f"Sent at {record['t']}: {record}")

    prev_time = current_time