package com.garcia.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.garcia.dto.PetDto;
import com.garcia.model.Pet;
import com.garcia.repository.PetRepository;

@Service
@Transactional(readOnly = true)
public class PetService {
    private final PetRepository repo;

    public PetService(PetRepository repo) {
        this.repo = repo;
    }

    public List<Pet> listAll() {
        return repo.findAll();
    }

    public Optional<Pet> findById(Integer id) {
        return repo.findById(id);
    }

    public PetDto findByIdDto(Integer id) {
        return repo.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public List<PetDto> listAllWithFilters(int page, int pageSize, String category, String search) {
        List<Pet> pets = repo.findAll();
        
        // Filter by category if provided
        if (category != null && !category.isEmpty()) {
            pets = pets.stream()
                    .filter(p -> p.getCategory() != null && 
                           (p.getCategory().getId().toString().equals(category) ||
                            p.getCategory().getName().equalsIgnoreCase(category)))
                    .collect(Collectors.toList());
        }
        
        // Filter by search term if provided
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            pets = pets.stream()
                    .filter(p -> p.getName().toLowerCase().contains(searchLower) ||
                               (p.getDescription() != null && p.getDescription().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        // Apply pagination
        int startIdx = page * pageSize;
        int endIdx = Math.min(startIdx + pageSize, pets.size());
        
        if (startIdx >= pets.size()) {
            return List.of();
        }
        
        return pets.subList(startIdx, endIdx).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Pet create(Pet pet) {
        return repo.save(pet);
    }

    private PetDto toDto(Pet pet) {
        return new PetDto(
                pet.getId(),
                pet.getName(),
                pet.getType(),
                pet.getDescription(),
                pet.getPrice(),
                pet.getAvailable(),
                pet.getCategory() != null ? pet.getCategory().getId() : null,
                pet.getCategory() != null ? pet.getCategory().getName() : null,
                null,
                null
        );
    }
}
