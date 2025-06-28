package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Query;
import com.example.backend.repo.QueryRepo;

@Service
public class QueryService {

    @Autowired
    private final QueryRepo queryRepo;

    public QueryService(QueryRepo queryRepo) {
        this.queryRepo = queryRepo;
    }

    public Query saveQuery(Query query) {
        return queryRepo.save(query);
    }

    public List<Query> getAllQueries() {
        return queryRepo.findAll();
    }

    public Page<Query> getPaginatedQueries(Pageable pageable) {
        return queryRepo.findAll(pageable);
    }
}
