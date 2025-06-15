package com.example.backend.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.CountryCode;
import com.example.backend.entity.NavigationalStatus;
import com.example.backend.entity.ShipType;
import com.example.backend.entity.Vessel;
import com.example.backend.repo.CountryRepo;
import com.example.backend.repo.ShipTypeRepo;
import com.example.backend.repo.StatusRepo;
import com.example.backend.repo.VesselRepo;

import jakarta.annotation.PostConstruct;

@Service
public class StaticDataService {
    
    @Autowired
    private CountryRepo countryRepo;


    @Autowired
    private StatusRepo statusRepo;

    @Autowired
    private ShipTypeRepo typeRepo;

    @Autowired
    private VesselRepo vesselRepo;
    
    // reads the contents of any csv file
    @SuppressWarnings({"CallToPrintStackTrace", "ConvertToStringSwitch"})
    public List<String[]> readCSV(String fileName) {
        
        String filePath = "../data-source/data/" + fileName;
        List<String[]> result = new ArrayList<>();
        Reader reader = null;
        CSVParser parser = null;

        
        try {
            reader = new FileReader(filePath);

            if("../data-source/data/Navigational Status.csv".equals(filePath)) {
                parser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setDelimiter(';').setSkipHeaderRecord(false).build());
            }
            else if("../data-source/data/Ship Types List.csv".equals(filePath) ||"../data-source/data/vessels.csv".equals(filePath) ) {
                parser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build());
            }

            else {
                parser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setSkipHeaderRecord(false).build());
            }


            for (CSVRecord record : parser) {
                String[] row = new String[record.size()];
                for (int i = 0; i < record.size(); i++) {
                    row[i] = record.get(i);
                }
                result.add(row);
            }
        } 
        
        catch (IOException e) {
            e.printStackTrace();
        } 
        
        finally {
            try {
                if (parser != null) {
                    parser.close(); // Close parser explicitly
                }
                if (reader != null) {
                    reader.close(); // Close reader explicitly
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }

        return result;
    }
    

    @SuppressWarnings("UseSpecificCatch")
    public String executePythonScript(String scriptPath) {
        StringBuilder output = new StringBuilder();
        StringBuilder errors = new StringBuilder();
        
        try {
            // Normalize the path and change working directory
            File scriptFile = new File(scriptPath);
            String absolutePath = scriptFile.getAbsolutePath();
            File workingDir = scriptFile.getParentFile();
            
            ProcessBuilder pb = new ProcessBuilder("python3", absolutePath);
            pb.directory(workingDir);  // Set working directory to script location
            pb.redirectErrorStream(false);
            
            Process process = pb.start();
            
            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                output.append("Script failed with exit code: ").append(exitCode)
                    .append("\nError Output:\n").append(errors);
            }
            
        } 
        catch (Exception e) {
            output.append("Execution failed: ").append(e.getMessage());
        }
        
        return output.toString();
    }




    @PostConstruct
    public void init() {

       

        
        // initialize the countries table
        if(countryRepo.count()<=0) {
            
            List<String[]> allData = this.readCSV("MMSI Country Codes.csv");
            for (String[] row : allData) {
                CountryCode countryCode = new CountryCode(Integer.parseInt(row[0]),row[1]);
                countryRepo.save(countryCode);
            }
        }

        // initialize the Navigational Status table
        if(statusRepo.count()<=0) {
            
            List<String[]> allData = this.readCSV("Navigational Status.csv");
            for (String[] row : allData) {
                NavigationalStatus status = new NavigationalStatus(Integer.parseInt(row[0]),row[1]);
                statusRepo.save(status);
            }
        }


        // initialize the Ship Type table
        if(typeRepo.count()<=0) {
            
            List<String[]> allData = this.readCSV("Ship Types List.csv");
            for (String[] row : allData) {
                ShipType type = new ShipType(Integer.parseInt(row[0]),Integer.parseInt(row[1]),Integer.parseInt(row[2]),row[3],row[4]);
                typeRepo.save(type);
            }
        }

        // initialize the vessels table
        if(vesselRepo.count()<=0) {
            

            final int THREADS = 9;
            final int BATCH_SIZE = 538;
            final String FILE_PATH = "../data-source/data/vessels.csv";
            
            executePythonScript("../data-source/create_vessels.py");
            ExecutorService executor = Executors.newFixedThreadPool(THREADS);

            try (
                Reader reader = new BufferedReader(new FileReader(FILE_PATH));
                CSVParser parser = new CSVParser(reader,CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build())) 
                
            {

                List<CSVRecord> batch = new ArrayList<>(BATCH_SIZE);

                for (CSVRecord record : parser) {
                    batch.add(record);

                    if (batch.size() >= BATCH_SIZE) {
                        List<CSVRecord> taskBatch = new ArrayList<>(batch);
                        executor.submit(() -> processBatch(taskBatch));
                        batch.clear();
                    }
                }

                // Submit any remaining records
                if (!batch.isEmpty()) {
                    List<CSVRecord> taskBatch = new ArrayList<>(batch);
                    executor.submit(() -> processBatch(taskBatch));
                }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            executor.shutdown();

            try {
                if (!executor.awaitTermination(5, TimeUnit.MINUTES)) {
                    executor.shutdownNow();
                }
            } 
            
            catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
        }
        

    }

    private void processBatch(List<CSVRecord> allData) {
        List<Vessel> vessels = new ArrayList<>();
        for (CSVRecord row : allData) {
        
            try {
                // Create Vessel instance from CSV fields
                Vessel vessel = new Vessel(
                    Integer.parseInt(row.get("sourcemmsi")),     // mmsi
                    Integer.parseInt(row.get("imonumber")),      // imonumber
                    row.get("callsign"),                         // callsign
                    row.get("shipname"),                         // shipname
                    Integer.parseInt(row.get("shiptype")),       // shiptype
                    Integer.parseInt(row.get("tobow")),          // to_bow
                    Integer.parseInt(row.get("tostern")),        // to_stern
                    Integer.parseInt(row.get("tostarboard")),    // to_starboard
                    Integer.parseInt(row.get("toport"))          // to_port
                );

                // Get countryId from first 3 digits of MMSI
                int countryId = Integer.parseInt(String.valueOf(vessel.getMmsi()).substring(0, 3));

                // Lookup and assign relations
                vessel.setCountry(countryRepo.findById(countryId).orElse(null));
                vessel.setShiptype(typeRepo.findType(vessel.getShiptype_code()));
                
                vessels.add(vessel);
                // Save to DB
                vesselRepo.save(vessel);
            } 
            
            catch (NumberFormatException e) {
                System.err.println("Failed to parse or save row: " + row.toString());
                e.printStackTrace();
            }
        }

        if (!vessels.isEmpty()) {
                vesselRepo.saveAll(vessels); 
            }
        }

}

