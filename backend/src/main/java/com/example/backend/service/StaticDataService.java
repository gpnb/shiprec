package com.example.backend.service;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

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
            
            executePythonScript("../data-source/create_vessels.py");
            List<String[]> allData = this.readCSV("vessels.csv");
            for (String[] row : allData) {
                Vessel vessel = new Vessel(
                    Integer.parseInt(row[0]), // mmsi
                    Integer.parseInt(row[1]), // imonumber
                    row[2],                   // callsign
                    row[3],                   // shipname
                    Integer.parseInt(row[4]), // shiptype
                    Integer.parseInt(row[5]), // to_bow
                    Integer.parseInt(row[6]), // to_stern 
                    Integer.parseInt(row[7]), // to_starboard 
                    Integer.parseInt(row[8])  // toport 
                );
                int countryId = Integer.parseInt(String.valueOf(vessel.getMmsi()).substring(0, 3));
                vessel.setCountry(countryRepo.findById(countryId).orElse(null));
                vessel.setShiptype(typeRepo.findType(vessel.getShiptype_code()));
                vesselRepo.save(vessel);



           }
        }
        

    }
}

