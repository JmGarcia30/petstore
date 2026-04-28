# Petstore

Minimal e-commerce pet store (dogs, cats, birds, fishes).

Stack
- Backend: Java Spring Boot + PostgreSQL (Flyway for migrations)
- Frontend: React + Tailwind CSS + MUI
- Deployment target: Render (free-tier Postgres, web service, static site)

Quickstart

Backend

```bash
cd backend
mvn spring-boot:run
```

Environment variables (example):
- `SPRING_DATASOURCE_URL` (jdbc:postgresql://host:port/db)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Frontend

```bash
cd frontend
npm install
npm run dev
```

Next steps
- Add authentication, payment, and checkout flows.
- Wire CI/CD and Render deployment.
