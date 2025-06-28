package com.example.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Query;
import com.example.backend.service.QueryService;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "http://localhost:3000")
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping
    public Query submitQuery(@RequestBody Query query) {
        return queryService.saveQuery(query);
    }

    @GetMapping("/all")
    public List<Query> getAllQueries() {
        return queryService.getAllQueries();
    }

    @GetMapping
    public Page<Query> getQueries(Pageable pageable) {
        System.out.println("Fetching paginated queries...");
        return queryService.getPaginatedQueries(pageable);
    }
}
