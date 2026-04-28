package com.petstore.config;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SeedData implements CommandLineRunner {
    private final PetRepository repo;

    public SeedData(PetRepository repo) { this.repo = repo; }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() == 0) {
            List<Pet> sample = List.of(
                    create("Buddy", "Dog", "Friendly golden retriever", 499.99),
                    create("Mittens", "Cat", "Playful tabby", 149.99),
                    create("Tweety", "Bird", "Yellow canary", 39.99),
                    create("Goldie", "Fish", "Small goldfish", 9.99)
            );
            repo.saveAll(sample);
        }
    }

    private Pet create(String name, String type, String desc, double price) {
        Pet p = new Pet();
        p.setName(name);
        p.setType(type);
        p.setDescription(desc);
        p.setPrice(price);
        p.setAvailable(true);
        return p;
    }
}
