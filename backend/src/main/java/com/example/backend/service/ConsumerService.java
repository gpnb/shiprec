package com.example.backend.service;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Service;

// for now we assume that the springboot application, (and thus the consumer) starts before the producer, so the consumer will be the one to create the topic on kafka
// the spring boot consumer first makes a topic on kafka and then waits to consume the data that the producer will post on this kafka topic

@Service
@Configuration
public class ConsumerService {

    @Bean
    public NewTopic topic() {
        return TopicBuilder.name("test-topic") // here goes real topic name (e.g. ais-data or ship-locations)
                .partitions(1)
                .replicas(1)
                .build();
    }

    // called automatically whenever something is posted on the "test-topic" topic
    @KafkaListener(id = "listener-1", topics = "test-topic")
    public void listen(String in) {
        System.out.println("Received message: " + in);
    }

}
