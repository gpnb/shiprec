#from kafka import KafkaProducer
import pandas as pd
import dask.dataframe as dd
import json
import time


# producer = KafkaProducer(
#     bootstrap_servers='localhost:9092', # where to connect
#     value_serializer=lambda v: json.dumps(v).encode('utf-8') # the dictionary that will be given as a value to send to kafka will be seriallized into a json string
# )

nari_dynamic_df = dd.read_csv('./data/nari_dynamic.csv', assume_missing=True)
nari_sar_df = dd.read_csv('./data/nari_dynamic_sar.csv', assume_missing=True)
nari_static_df = dd.read_csv('./data/nari_static.csv', assume_missing=True)

nari_sar_df = nari_sar_df.rename(columns={'ts': 't'})
nari_sar_df = nari_sar_df.drop(columns=['altitude'])

combined_df = dd.concat([nari_dynamic_df, nari_sar_df, nari_static_df], axis=0, interleave_partitions=True)

combined_df = combined_df.sort_values('t')

vessel_tracking_df = combined_df[['sourcemmsi', 'navigationalstatus', 'rateofturn', 'speedoverground', 'courseoverground', 'trueheading', 'lon', 'lat', 't', 'eta', 'destination', 'draught', 'mothershipmmsi']]
vessel_df = combined_df[['sourcemmsi', 'imonumber', 'callsign', 'shipname', 'shiptype', 'tobow', 'tostern', 'tostarboard', 'toport']]

vessel_df.drop_duplicates()

vessel_df.to_csv('output/vessel_*.csv', index=False)
#data = pd.read_csv("./data.csv") # here goes the real name of the file with the location data

# here the real dataframe will be sorted according to the timestamps

# for index, row in data.iterrows():
#     row_dict = row.to_dict()
#     producer.send('test-topic', value=row_dict)

#     print("Producer sent message: ", row_dict)

#     time.sleep(3) # here producer will sleep for the difference of seconds between the timestamp of this record and the next one