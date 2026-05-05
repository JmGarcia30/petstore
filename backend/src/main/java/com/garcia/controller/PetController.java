package com.garcia.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.garcia.dto.PetDto;
import com.garcia.model.Pet;
import com.garcia.service.PetService;

@RestController
@RequestMapping("/api/v1/pets")
public class PetController {
    private final PetService service;

    public PetController(PetService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<PetDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<PetDto> pets = service.listAllWithFilters(page, pageSize, category, search);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDto> get(@PathVariable Integer id) {
        PetDto pet = service.findByIdDto(id);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pet);
    }

    @PostMapping
    public ResponseEntity<Pet> create(@RequestBody Pet pet) {
        Pet saved = service.create(pet);
        return ResponseEntity.created(URI.create("/api/v1/pets/" + saved.getId())).body(saved);
    }
}
