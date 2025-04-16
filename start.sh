echo "Starting Kafka (KRaft mode)..."
nohup kafka/bin/kafka-server-start.sh kafka/config/kraft/server.properties > kafka.log 2>&1 &
tail -f kafka.log