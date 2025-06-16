#!/bin/bash



rm -f .cluster-initialized

if [ ! -f .cluster-initialized ]; then
    KAFKA_CLUSTER_ID="$(./bin/kafka-storage.sh random-uuid)"
    ./bin/kafka-storage.sh format --standalone -t "$KAFKA_CLUSTER_ID" -c config/server.properties
    touch .cluster-initialized
fi

# Start Kafka in background
./bin/kafka-server-start.sh config/server.properties &
KAFKA_PID=$!

# Wait for Kafka to be ready
while ! nc -z localhost 9092; do
    echo "Waiting for Kafka to start..."
    sleep 2
done

# Start Python producer in background
cd ../data-source
python3 producer.py &
PYTHON_PID=$!
cd -

# Trap Ctrl+C to stop both processes
trap "echo -e '\nStopping Kafka and Python...'; kill $KAFKA_PID $PYTHON_PID; wait; exit" SIGINT

# Wait for both to finish
wait $KAFKA_PID $PYTHON_PID

