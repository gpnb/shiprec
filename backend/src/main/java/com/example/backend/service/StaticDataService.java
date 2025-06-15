package com.example.backend.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.CountryCodes;
import com.example.backend.entity.NavigationalStatus;
import com.example.backend.entity.ShipType;
import com.example.backend.repo.CountryRepo;
import com.example.backend.repo.ShipTypeRepo;
import com.example.backend.repo.StatusRepo;

import jakarta.annotation.PostConstruct;

@Service
public class StaticDataService {
    
    @Autowired
    private CountryRepo countryRepo;


    @Autowired
    private StatusRepo statusRepo;

    @Autowired
    private ShipTypeRepo typeRepo;

    
    // reads the contents of any csv file
    @SuppressWarnings("CallToPrintStackTrace")
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
            else if("../data-source/data/Ship Types List.csv".equals(filePath)) {
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
    

    public String executePythonScript(String scriptPath) {
        StringBuilder output = new StringBuilder();
        ProcessBuilder pb = new ProcessBuilder();
        
        // Build the command (python + script path + arguments)
        List<String> command = new ArrayList<>();
        command.add("python3");
        command.add(scriptPath);
        
        pb.command(command);
        pb.redirectErrorStream(true);
        
        try {
            Process process = pb.start();
            
            // // Read the output
            // BufferedReader reader = new BufferedReader(
            //     new InputStreamReader(process.getInputStream()));
            
            // String line;
            // while ((line = reader.readLine()) != null) {
            //     output.append(line).append("\n");
            // }
            
            int exitCode = process.waitFor();
            output.append("\nProcess exited with code: ").append(exitCode);
            
        } catch (IOException | InterruptedException e) {
            output.append("Error executing Python script: ").append(e.getMessage());
            e.printStackTrace();
        }
        

        return output.toString();
    }



    @PostConstruct
    public void init() {

        
        // initialize the countries table
        if(countryRepo.count()<=0) {
            
            List<String[]> allData = this.readCSV("MMSI Country Codes.csv");
            for (String[] row : allData) {
                CountryCodes countryCode = new CountryCodes(Integer.parseInt(row[0]),row[1]);
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

        

    }
}

