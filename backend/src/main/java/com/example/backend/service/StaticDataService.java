package com.example.backend.service;

import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.CountryCodes;
import com.example.backend.repo.CountryRepo;
import org.apache.commons.csv.*;

import jakarta.annotation.PostConstruct;

@Service
public class StaticDataService {
    
    @Autowired
    private CountryRepo countryRepo;

    public static final String COMMA_DELIMITER = ",";
    
    // reads the contents of any csv file
    public List<String[]> readCSV(String fileName) {
        
        String filePath = "../data-source/data/" + fileName;
        List<String[]> result = new ArrayList<>();
        Reader reader = null;
        CSVParser parser = null;

        try {
            reader = new FileReader(filePath);
            parser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build());

            for (CSVRecord record : parser) {
                String[] row = new String[record.size()];
                for (int i = 0; i < record.size(); i++) {
                    row[i] = record.get(i);
                }
                result.add(row);
            }
        } 
        
        catch (Exception e) {
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
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        return result;
    }
    





    @PostConstruct
    public void init() {

        
        // initialize the countries table
        // if(countryRepo.count()<=0) {
            
        //     List<String[]> allData = this.readCSV("MMSI Country Codes.csv");
        //     for (String[] row : allData) {
        //         CountryCodes countryCode = new CountryCodes(Integer.parseInt(row[0]),row[1]);
        //         countryRepo.save(countryCode);
        //     }
        // }
        
        

    }
}

