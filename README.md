# Petstore

Minimal e-commerce pet store (dogs, cats, birds, fishes).

## Live Links

- **Frontend:** [https://petstore-1-v3cb.onrender.com](https://petstore-1-v3cb.onrender.com)
- **Backend API:** [https://petstore-l0ok.onrender.com/api/v1/pets](https://petstore-l0ok.onrender.com/api/v1/pets)

## Sample Credentials

- **Email:** `sample@mail.com`
- **Password:** `12345678`

*(Note: Authentication is not yet implemented)*

## Stack

- Backend: Java Spring Boot + PostgreSQL (Flyway for migrations)
- Frontend: React + Tailwind CSS
- Deployment: Render (PostgreSQL, Dockerized Web Service, Static Site)

## Quickstart

### Backend

```bash
# Navigate to backend directory
cd backend

# Run with Maven
mvn spring-boot:run
```

**Environment variables (example):**
- `SPRING_DATASOURCE_URL` (e.g., `jdbc:postgresql://host:port/db`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Next Steps
- Implement authentication, payment, and checkout flows.
- Configure CI/CD for automated deployments.
