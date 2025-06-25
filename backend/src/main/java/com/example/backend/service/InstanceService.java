package com.example.backend.service;


import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import org.apache.kafka.clients.admin.NewTopic;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.example.backend.entity.NavigationalStatus;
import com.example.backend.entity.Vessel;
import com.example.backend.entity.VesselInstance;
import com.example.backend.entity.VesselInstanceId;
import com.example.backend.handler.WebSocketMessageHandler;
import com.example.backend.repo.ShipTypeRepo;
import com.example.backend.repo.StatusRepo;
import com.example.backend.repo.VesselInstanceRepo;
import com.example.backend.repo.VesselRepo;
import com.example.dto.VesselInstanceDto;
import com.fasterxml.jackson.databind.ObjectMapper;



// for now we assume that the springboot application, (and thus the consumer) starts before the producer, so the consumer will be the one to create the topic on kafka
// the spring boot consumer first makes a topic on kafka and then waits to consume the data that the producer will post on this kafka topic

@Service
public class InstanceService {

    @Autowired
    private VesselRepo vesselRepo;
    
    @Autowired
    private VesselInstanceRepo instanceRepo;

    @Autowired
    private StatusRepo statusRepo;

    @Autowired
    private ShipTypeRepo typeRepo;

    @Bean
    public NewTopic topic() {
        return TopicBuilder.name("ais-data")
                .partitions(1)
                .replicas(1)
                .build();
    }


    // saves instances sent from kafka to the database
    @SuppressWarnings("CallToPrintStackTrace")
    public void saveNewInstance(String message) throws ParseException {
        
        try {
            JSONObject data = new JSONObject(message);
            
            int source_mmsi = ((Number) data.get("sourcemmsi")).intValue();
            int nav_status =  ((Number) data.get("navigationalstatus")).intValue();

            // if we don't find a vessel in the vessels table, the vessel is invalid so we don't save the instance
            if(vesselRepo.findById(source_mmsi).isEmpty()) {
                return;
            }

            Vessel vessel = vesselRepo.findById(source_mmsi).get();

            // if we don't find the status in the status table, the status is invalid so we don't save the instance
            if(statusRepo.findById(nav_status).isEmpty()) {
                return;
            }
            NavigationalStatus status = statusRepo.findById(nav_status).get();

            
            // we convert the timestamp string to a Date object
            Date timestamp;
            try{
                String timestampStr = data.getString("t").replace("T", " ");
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                timestamp = formatter.parse(timestampStr);
            } 
            catch (ParseException e) {
                e.printStackTrace();
                return;
            }
            
            // we parse the rest of the dynamic data
            double rate_of_turn =  ((Number) data.get("rateofturn")).doubleValue();
            double speed_over_ground =  ((Number) data.get("speedoverground")).doubleValue();
            double course_over_ground = ((Number) data.get("courseoverground")).doubleValue();
            double true_heading = ((Number) data.get("trueheading")).doubleValue();
            double longitude = ((Number) data.get("lon")).doubleValue();
            double latitude = ((Number) data.get("lat")).doubleValue();

            Date eta;
            String destination;
            Vessel mothership =  null;
            double draught;

            // if the instance has a valid eta we save it
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (!data.isNull("eta")) {
                String etaStr = data.getString("eta").replace("T", " ");
                eta = formatter.parse(etaStr);
            } 
            
            // else we find the last valid eta and if we doesn't exist, we store a dummy eta
            else {
                Optional<Date> lastETA = instanceRepo.findLastETA(vessel, timestamp);
                if (lastETA.isPresent()) {
                    eta = lastETA.get();
                } else {
                    eta = formatter.parse("1970-01-01 12:53:42");
                }
            }

            // if the instance has a valid destination we save it
            if (!data.isNull("destination")) {
                destination = data.getString("destination");
            } 
            // else we find the last valid destination and if we doesn't exist, we save it as "Unknown"
            else {
                Optional<String> lastDestination = instanceRepo.findLastDestination(vessel, timestamp);
                if (lastDestination.isPresent()) {
                    destination = lastDestination.get();
                } else {
                    destination = "Unknown";
                }
            }

            // if the instance has a valid draught we save it
            if (!data.isNull("draught")) {
                draught = ((Number) data.get("draught")).doubleValue();
            } 
            
            // else we find the last valid draught and if we doesn't exist, we save it as -1
            else {
                Optional<Double> lastDraught = instanceRepo.findLastDraught(vessel, timestamp);
                if (lastDraught.isPresent()) {
                    draught = lastDraught.get();
                } else {
                    draught = -1.0;
                }
            }

            // find the mothership if it exists
            if (!data.isNull("mothershipmmsi")) {
                
                int mothership_mmsi  = ((Number) data.get("mothershipmmsi")).intValue();
                mothership = vesselRepo.findById(mothership_mmsi).get();
            }

  
            // create the instance's composite key (vessel,timestamp)
            VesselInstanceId id = new VesselInstanceId(vessel,timestamp);
            
            // fill the instance's fields
            VesselInstance instance = new VesselInstance();
            instance.setId(id);
            instance.setMmsi(vessel);
            instance.setStatus_id(status);
            instance.setEta(eta);
            instance.setDestination(destination);
            instance.setDraught(draught);
            instance.setRate_of_turn(rate_of_turn);
            instance.setLatitude(latitude);
            instance.setLongitude(longitude);
            instance.setSpeed_over_ground(speed_over_ground);
            instance.setCourse_over_ground(course_over_ground);
            instance.setMothership_mmsi(mothership);
            instance.setHeading(true_heading);


            // if the instance already exists in the database, return
            if(!instanceRepo.findById(id).isEmpty()) {
                return;
            }

            // save the instance in the database
            instanceRepo.save(instance);

        }
        catch(JSONException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("CallToPrintStackTrace")
    public VesselInstanceDto sendToClient(String message) {
        
        try {
            JSONObject data = new JSONObject(message);
            
            int source_mmsi = ((Number) data.get("sourcemmsi")).intValue();
            int nav_status =  ((Number) data.get("navigationalstatus")).intValue();

            // if we don't find a vessel in the vessels table, the vessel is invalid so we don't send  the instance
            if(vesselRepo.findById(source_mmsi).isEmpty()) {
                return null;
            }

            Vessel vessel = vesselRepo.findById(source_mmsi).get();

            // if we don't find the status in the status table, the status is invalid so we don't send the instance
            if(statusRepo.findById(nav_status).isEmpty()) {
                return null; 
            }
            NavigationalStatus status = statusRepo.findById(nav_status).get();

            
            // we convert the timestamp string to a Date object
            Date timestamp;
            try{
                String timestampStr = data.getString("t").replace("T", " ");
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                timestamp = formatter.parse(timestampStr);
            } 
            catch (ParseException e) {
                e.printStackTrace();
                return null;
            }
            
            // we parse the rest of the dynamic data
            double rate_of_turn =  ((Number) data.get("rateofturn")).doubleValue();
            double speed_over_ground =  ((Number) data.get("speedoverground")).doubleValue();
            double course_over_ground = ((Number) data.get("courseoverground")).doubleValue();
            double true_heading = ((Number) data.get("trueheading")).doubleValue();
            double longitude = ((Number) data.get("lon")).doubleValue();
            double latitude = ((Number) data.get("lat")).doubleValue();

            Date eta = null;
            String destination;
            double draught;

            // if the instance has a valid eta we save it
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (!data.isNull("eta")) {
                String etaStr = data.getString("eta").replace("T", " ");
                try {
                    eta = formatter.parse(etaStr);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            } 
            
            // else we find the last valid eta and if we doesn't exist, we store a dummy eta
            else {
                Optional<Date> lastETA = instanceRepo.findLastETA(vessel, timestamp);
                if (lastETA.isPresent()) {
                    eta = lastETA.get();
                } else {
                    try {
                        eta = formatter.parse("1970-01-01 12:53:42");
                    } 
                    catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }

            // if the instance has a valid destination we save it
            if (!data.isNull("destination")) {
                destination = data.getString("destination");
            } 
            // else we find the last valid destination and if we doesn't exist, we save it as "Unknown"
            else {
                Optional<String> lastDestination = instanceRepo.findLastDestination(vessel, timestamp);
                if (lastDestination.isPresent()) {
                    destination = lastDestination.get();
                } else {
                    destination = "Unknown";
                }
            }

            // if the instance has a valid draught we save it
            if (!data.isNull("draught")) {
                draught = ((Number) data.get("draught")).doubleValue();
            } 
            
            // else we find the last valid draught and if we doesn't exist, we save it as -1
            else {
                Optional<Double> lastDraught = instanceRepo.findLastDraught(vessel, timestamp);
                if (lastDraught.isPresent()) {
                    draught = lastDraught.get();
                } else {
                    draught = -1.0;
                }
            }
   
            // fill the instance's fields
            VesselInstanceDto instance = new VesselInstanceDto();
            instance.setMmsi(vessel.getMmsi());
            instance.setEta(eta);
            instance.setDestination(destination);
            instance.setDraught(draught);
            instance.setRate_of_turn(rate_of_turn);
            instance.setLatitude(latitude);
            instance.setLongitude(longitude);
            instance.setSpeed_over_ground(speed_over_ground);
            instance.setCourse_over_ground(course_over_ground);
            instance.setHeading(true_heading);
            instance.setTime_received(timestamp);
            instance.setImonumber(vessel.getImonumber());
            instance.setShip_name(vessel.getName());

            String type = typeRepo.findType(vessel.getShiptype_code());

            if(type!=null) {
                instance.setShip_type(type);
            }

            else {
                instance.setShip_type("other");
            }
            
            instance.setNavigational_status(status.getStatus());

            return instance;

            
        }

        catch(JSONException e) {
            e.printStackTrace();
        }
        return null;
    }


    // called automatically whenever something is posted on the "ais-data" topic
    @KafkaListener(id = "listener-1", topics = "ais-data")
    @SuppressWarnings("CallToPrintStackTrace")
    public void listen(String message) {

        ObjectMapper objectMapper = new ObjectMapper();


        for (WebSocketSession session : WebSocketMessageHandler.getWebSocketSessions()) {
            try {
                VesselInstanceDto vesselDto = sendToClient(message);
                
                if(vesselDto!=null) {
                    String vessel = objectMapper.writeValueAsString(vesselDto);
                    session.sendMessage(new TextMessage(vessel));
                }
               
            } 
            
            catch (IOException e) {
                e.printStackTrace();
            }
        }

        sendToClient(message);

        try {
            saveNewInstance(message);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }






}
