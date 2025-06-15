# the script starts the kafka cluster
# it checks whether the file ".cluster-initialized" already exists in the kafka directory, and if not:

# - it generates a cluster id and formats the servers according to the configuration file (config/server.properties)
# - it creates the "./cluster-initialized" file

# then it starts the server (topic creation will be done by the consumer or producer)

rm -rf .cluster-initialized
if [ ! -f .cluster-initialized ] ; then
    KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
    ./bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/server.properties
    touch .cluster-initialized
fi


./bin/kafka-server-start.sh config/server.properties
