package com.petstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.model.Pet;

public interface PetRepository extends JpaRepository<Pet, Integer> {
}
