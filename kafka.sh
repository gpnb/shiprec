#!/bin/bash

# Install latest version of Kafka
curl -O https://downloads.apache.org/kafka/4.0.0/kafka_2.13-4.0.0.tgz 
tar -xvzf kafka_2.13-4.0.0.tgz 
mv kafka_2.13-4.0.0 kafka
rm -rf kafka_2.13-4.0.0.tgz


# Create KRaft config directory
mkdir -p kafka/config/kraft
# Create minimal config if not exists
touch kafka/config/kraft/server.properties
cat <<EOF > kafka/config/kraft/server.properties
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@localhost:9093
listeners=PLAINTEXT://localhost:9092,CONTROLLER://localhost:9093
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
inter.broker.listener.name=PLAINTEXT
controller.listener.names=CONTROLLER
log.dirs=/tmp/kraft-combined-logs
num.network.threads=3
num.io.threads=8
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
EOF

# Format the storage directory (only once)
kafka/bin/kafka-storage.sh format -t $(kafka/bin/kafka-storage.sh random-uuid) -c kafka/config/kraft/server.properties

# Start Kafka
echo "Starting Kafka (KRaft mode)..."
nohup kafka/bin/kafka-server-start.sh kafka/config/kraft/server.properties > kafka.log 2>&1 &
tail -f kafka.log
