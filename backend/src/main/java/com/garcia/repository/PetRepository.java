package com.garcia.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.garcia.model.Pet;

public interface PetRepository extends JpaRepository<Pet, Integer> {
}
