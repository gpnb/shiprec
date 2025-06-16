from kafka import KafkaProducer
import pandas as pd
import dask.dataframe as dd
import numpy as np
import json
import time

# --- Kafka Producer Setup ---
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# --- Load and preprocess data ---
nari_dynamic = dd.read_csv('./data/nari_dynamic.csv', assume_missing=True, blocksize="128MB")
nari_dynamic_sar = dd.read_csv('./data/nari_dynamic_sar.csv', assume_missing=True, blocksize="128MB")
nari_static = dd.read_csv(
    './data/nari_static.csv',
    usecols=['sourcemmsi', 'eta', 'destination', 'draught', 'mothershipmmsi', 't'],
    assume_missing=True,
    blocksize="128MB",
    low_memory=False
)

nari_dynamic_sar = nari_dynamic_sar.rename(columns={'ts': 't'}).drop(columns=['altitude'])
df = dd.concat([nari_dynamic, nari_dynamic_sar], interleave_partitions=True)

# Convert timestamps
df['t'] = dd.to_datetime(df['t'], errors='coerce')
nari_static['t'] = dd.to_datetime(nari_static['t'], errors='coerce')
df = df.dropna(subset=['t'])
nari_static = nari_static.dropna(subset=['t'])
df['t'] = dd.to_numeric(df['t'], errors='coerce')
nari_static['t'] = dd.to_numeric(nari_static['t'], errors='coerce')
df['t'] = dd.to_datetime(df['t'], unit='s', errors='coerce')
nari_static['t'] = dd.to_datetime(nari_static['t'], unit='s', errors='coerce')

# --- Compute once ---
print("Computing Dask DataFrames into memory...")
df = df.compute()
nari_static = nari_static.compute()

df = df.sort_values('t')
nari_static = nari_static.sort_values('t')

# --- Chunking setup ---
BATCH_SIZE = 1000
total_rows = len(df)
offset = 0

while offset < total_rows:
    dynamic_batch = df.iloc[offset:offset + BATCH_SIZE]
    static_batch = nari_static  # Same static data reused

    if dynamic_batch.empty:
        break

    # Merge using merge_asof
    merged = pd.merge_asof(
        dynamic_batch,
        static_batch,
        on='t',
        by='sourcemmsi',
        tolerance=pd.Timedelta('5min'),
        direction='nearest'
    )

    print(f"\nSending batch {offset} to {offset + BATCH_SIZE} (size: {len(merged)})")

    # Send each row to Kafka
    prev_time = None
    for _, row in merged.iterrows():
        try:
            current_time = row['t']
            if pd.isnull(current_time):
                continue

            if prev_time is not None:
                delta = (current_time - prev_time).total_seconds()
                if delta > 0:
                    time.sleep(min(delta, 1))  # Cap to 1 second

            record = {
                k: ("" if pd.isna(v) or v is np.nan else v)
                for k, v in row.to_dict().items()
            }
            record['t'] = current_time.strftime('%Y-%m-%d %H:%M:%S')

            producer.send('ais-data', record)
            print(f"Sent at {record['t']}: {record}")

            prev_time = current_time

        except Exception as e:
            print(f"Error: {e}")
            continue

    offset += BATCH_SIZE
