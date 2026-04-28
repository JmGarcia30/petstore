package com.petstore.controller;

import com.petstore.model.Pet;
import com.petstore.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService service;

    public PetController(PetService service) { this.service = service; }

    @GetMapping
    public List<Pet> list() { return service.listAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pet> create(@RequestBody Pet pet) {
        Pet saved = service.create(pet);
        return ResponseEntity.created(URI.create("/api/pets/" + saved.getId())).body(saved);
    }
}
