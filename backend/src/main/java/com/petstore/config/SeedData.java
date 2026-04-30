package com.petstore.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.petstore.model.Category;
import com.petstore.model.Pet;
import com.petstore.repository.CategoryRepository;
import com.petstore.repository.PetRepository;

@Component
public class SeedData implements CommandLineRunner {
    private final PetRepository petRepo;
    private final CategoryRepository categoryRepo;

    public SeedData(PetRepository petRepo, CategoryRepository categoryRepo) { 
        this.petRepo = petRepo;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepo.count() == 0) {
            // Create categories
            Category dogs = categoryRepo.save(new Category("Dogs", "Friendly canine companions"));
            Category cats = categoryRepo.save(new Category("Cats", "Independent feline friends"));
            Category birds = categoryRepo.save(new Category("Birds", "Colorful feathered pets"));
            Category fish = categoryRepo.save(new Category("Fishes", "Aquatic companions"));

            // Create pets with categories
            List<Pet> sample = List.of(
                    create("Buddy", "Dog", "Friendly golden retriever", new BigDecimal("499.99"), dogs),
                    create("Mittens", "Cat", "Playful tabby", new BigDecimal("149.99"), cats),
                    create("Tweety", "Bird", "Yellow canary", new BigDecimal("39.99"), birds),
                    create("Goldie", "Fish", "Small goldfish", new BigDecimal("9.99"), fish)
            );
            petRepo.saveAll(sample);
        }
    }

    private Pet create(String name, String type, String desc, BigDecimal price, Category category) {
        Pet p = new Pet();
        p.setName(name);
        p.setType(type);
        p.setDescription(desc);
        p.setPrice(price);
        p.setAvailable(true);
        p.setCategory(category);
        return p;
    }
}
