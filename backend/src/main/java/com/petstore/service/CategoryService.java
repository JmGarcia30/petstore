package com.petstore.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.dto.CategoryDto;
import com.petstore.model.Category;
import com.petstore.repository.CategoryRepository;

@Service
@Transactional(readOnly = true)
public class CategoryService {
    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<CategoryDto> listAll() {
        return repo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CategoryDto findById(Integer id) {
        return repo.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public CategoryDto create(String name, String description) {
        Category category = new Category(name, description);
        Category saved = repo.save(category);
        return toDto(saved);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getDescription());
    }
}
