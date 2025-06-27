#!/bin/bash

# VERSION 1 - will launch 3 terminals


# gnome-terminal -- bash -c "cd ./kafka && ./run-kafka.sh; exec bash" &
# sleep 2

# gnome-terminal -- bash -c "cd ./backend && ./mvnw spring-boot:run; exec bash" &
# sleep 2

# gnome-terminal -- bash -c "cd ./frontend && npm start; exec bash" &





# VERSION 2 - will redirect the output of each of the 3 terminals to a corresponding log file

#!/bin/bash

echo "Starting Kafka..."
(cd ./kafka && ./run-kafka.sh > ../logs/kafka.log 2>&1 &) 

echo "Starting Backend..."
(cd ./backend && ./mvnw spring-boot:run > ../logs/backend.log 2>&1 &)

echo "Starting Frontend..."
(cd ./frontend && npm start > ../logs/frontend.log 2>&1 &)

echo "All processes started. Logs are in the 'logs/' directory."