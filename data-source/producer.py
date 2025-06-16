from kafka import KafkaProducer
import pandas as pd
import dask.dataframe as dd
import json
import time

# --- Kafka Producer Setup ---
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Load data from csv
nari_dynamic = dd.read_csv('./data/nari_dynamic.csv', assume_missing=True, blocksize="64MB")
nari_dynamic_sar = dd.read_csv('./data/nari_dynamic_sar.csv', assume_missing=True, blocksize="64MB")
nari_static = dd.read_csv('./data/nari_static.csv',usecols=['sourcemmsi', 'eta', 'destination', 'draught', 'mothershipmmsi', 't'],assume_missing=True, blocksize="64MB", low_memory=False)

# 
nari_dynamic_sar = nari_dynamic_sar.rename(columns={'ts': 't'}).drop(columns=['altitude'])
df = dd.concat([nari_dynamic, nari_dynamic_sar], interleave_partitions=True)

# Convert unix epochs to dates
df['t'] = dd.to_datetime(df['t'], errors='coerce')
nari_static['t'] = dd.to_datetime(nari_static['t'], errors='coerce')
df = df.dropna(subset=['t'])
nari_static = nari_static.dropna(subset=['t'])
df['t'] = dd.to_numeric(df['t'], errors='coerce')
nari_static['t'] = dd.to_numeric(nari_static['t'], errors='coerce')
df['t'] = dd.to_datetime(df['t'], unit='s', errors='coerce')
nari_static['t'] = dd.to_datetime(nari_static['t'], unit='s', errors='coerce')



# Merge and compute
df = nari_static.merge(df, on=['sourcemmsi', 't'], how='inner')
df = df.compute()
df = df.sort_values('t')  # Safe to sort after compute


print(df.head(3))

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


