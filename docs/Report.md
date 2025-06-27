# Importing the data fom zenodo
When we first inspected the contents of the `P1` folder in zenodo, we noticed that most files contained data that was irrelevant to our project or did not need 
to be transfered to our server via kafka. We kept the data stored in the following files:

- MMSI Country Codes.csv
- Ship Types List.csv
- nari_static.csv
- Navigational Status.csv
- nari_dynamic.csv
- nari_dynamic_sar.csv

The files above contain all the static data related to countries, vessels and navigational status, as well as details about the position of vessels at specific timestamps. We did not keep any of the files that referred to "aton" vessels, as we did not mention them at our original SRS.

# Importing the static data in our database
In order to import the static data to the database, we use the `init` method in the `StaticDataService` class. This method checks if there are any records stored in the tables `Country`, `ShipType`, `NavigationalStatus` and if there aren't it reads the data from the corresponding csv and stores it to the database. The process of storing the vessel data is slightly more compllicated, as we first have to execute the `create_vessels.py` program, which filters the data from nari_static.csv and generates the `vessels.csv` file. Finally, as we did not find any data about ports in the files from zenodo, we retrieved from the `nari_dynamic` files the ports that are stored in the `destination` field and found data for each of them in `world port index`. We then stored the data in the `ports.csv` file and followed the same process as with the other tables.

# Dynamic data management
The dynamic data used to track the vessels in real time is located in the files `nari_dynamic.csv`, `nari_dynamic_sar.csv` and `nari_static.csv`. As opposed to the static data above, the data corresponding to the tracking of the ships is way too large to be able to store it at once when the server is first initialized. As such, we used `kafka` in order to send the data in real time to the server. In order to achieve this, we used a producer and a consumer, that were hosted on `localhost:9092`. The producer runs through the `producer.py` script. At first it filters and sorts the data based on the timestamp, and then sends it in real time, to the `ais-data` topic. Then, the consumer, which is a method in our `InstanceService` class and is subscribed to the ais-data topic, retrieves the data in json form.

# Map Page

## Backend
The consumer, after getting the data from the kafka topic sends it to the frontend via a websocket, only if the vessel's name and type is valid. The vessel's data is passed to the websocket via a Dto class, which only keeps the data needed by the client, in order to reduce the overhead. Afterwards, the vessel instance that was sent to the client is stored to the database, so that we can have access to the vessel's tracking history.

## Frontend
The map is rendered on the screen, using the library `Leaflet.js`. Whenever the backend server sends data to the websocket, the data transmitted is displayed on the map using `Marker`. The additional info regarding the vessel is displayed using a `Popup` that is opened only whenever the user clicks on the vessel. The map interface also supports dark mode, search, zoom and filters so that a user can only see specific types of vessels. Finally, depending on the user's role(registered,admin,guest) they have different privileges. A non-registered user cannot create areas of interest on the map and does not have access to the filters that can be applied on the search bar.