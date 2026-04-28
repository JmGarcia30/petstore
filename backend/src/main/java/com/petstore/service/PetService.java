package com.petstore.service;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    public Optional<Pet> findById(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public Pet create(Pet pet) {
        return repo.save(pet);
    }
}
