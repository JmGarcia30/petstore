CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    available BOOLEAN DEFAULT true
);
