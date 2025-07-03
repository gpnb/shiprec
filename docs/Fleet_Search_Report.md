# Fleet Implementation

The basic information for fleets is stored in the "fleet" table of the database, and the "fleet_has_ships" table stores the ships that make each fleet and their active status in the fleet. The active status is something that the user owning the fleet can set (true by default) and is not yet used in anny function of the app. 
In the backend, one more entity is used for the relation between fleets and ships, the entity `FleetShipKey` that acts as the primary key for the "fleet_has_ships" table.

# Fleet Functions 

Fleets can be created in the vessels tab, or in the vessel details tab (either found from the vessels tab by clicking a vessel, or by selecting a vessel in the map and using the "Vessel Details" button), Only by a registered user. 
A registered user can manage their fleets in the "My Fleets" tab, under "My Account" page. There a user can see basic information about their fleets and delete them. By clicking the "View and Edit" button on any fleet, the user can then see a list of the vessels in the fleet, activate or deactivate them and remove them from the fleet by selecting them and clicking the bin icon.

# Search Functions 

The app also provides a search function in the main map, the vessels page and the ports page. In the vessels and ports page, it will only find a specific item by the name given. In the main map, a user has the ability to search for everything in the map by it's name, or select any combination between "My Fleets", "Ports" and "Vessels". The option "My Fleets" will display any active vessel (already in the map) that is part of the fleet given in the search.
While using the search function, the selected filters still apply.