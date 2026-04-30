ALTER TABLE pets ADD COLUMN category_id INT;
ALTER TABLE pets ADD FOREIGN KEY (category_id) REFERENCES category(id);
CREATE INDEX idx_pet_category_id ON pets(category_id);

