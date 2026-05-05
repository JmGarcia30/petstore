package com.garcia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.garcia.dto.CategoryDto;
import com.garcia.service.CategoryService;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> get(@PathVariable Integer id) {
        CategoryDto category = service.findById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }
}
