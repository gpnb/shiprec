import pandas as pd

nari_static_df = pd.read_csv('./data/nari_static.csv')

vessels_df = nari_static_df.drop(['eta','destination', 'draught', 'mothershipmmsi'], axis=1)

vessels_df['sourcemmsi'] = vessels_df['sourcemmsi'].fillna(-1).astype('int64')
vessels_df['imonumber'] = vessels_df['imonumber'].fillna(-1).astype('int64')
vessels_df['shiptype'] = vessels_df['shiptype'].fillna(-1).astype('int64')
vessels_df['tobow'] = vessels_df['tobow'].fillna(-1).astype('int64')
vessels_df['toport'] = vessels_df['toport'].fillna(-1).astype('int64')
vessels_df['tostarboard'] = vessels_df['tostarboard'].fillna(-1).astype('int64')
vessels_df['tostern'] = vessels_df['tostern'].fillna(-1).astype('int64')
vessels_df.sort_values(by='t',ascending=True)
vessels_df = vessels_df.drop_duplicates(subset='sourcemmsi', keep='first')
vessels_df.to_csv('./data/vessels.csv', index=False)


