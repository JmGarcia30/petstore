# Quick Start Guide

**Status**: Ready for Development  
**Updated**: April 28, 2026

---

## Prerequisites

### System Requirements
- **Java**: OpenJDK 17 or later (for backend development)
- **Node.js**: 18.x or later (for frontend development)
- **PostgreSQL**: 14+ (local or Docker)
- **Git**: Latest version
- **Docker**: (optional, for containerized local development)
- **Maven**: 3.8+ (bundled with Spring Boot projects)
- **npm**: 9.x or later (bundled with Node.js)

### Development Tools
- **IDE**: VS Code (recommended) with Java and React extensions
- **Postman or Thunder Client**: For API testing
- **Docker Desktop**: (optional, for PostgreSQL container)

---

## Backend Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd petstore
```

### 2. Set Up PostgreSQL

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL 14+ (macOS)
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb petstore

# Create user (optional)
createuser petstore_user -P
```

#### Option B: Docker PostgreSQL

```bash
docker run -d \
  --name petstore-db \
  -e POSTGRES_DB=petstore \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14
```

### 3. Configure Backend

Create `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/petstore
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Flyway (Database Migrations)
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
spring.flyway.out-of-order=false

# Logging
logging.level.root=INFO
logging.level.com.petstore=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n

# JWT/Security
app.jwt.secret=your-super-secret-jwt-key-change-in-production
app.jwt.expiration=3600000
app.jwt.refresh-token-expiration=2592000000

# Stripe (add after signing up)
stripe.api.key=sk_test_your_stripe_key
stripe.webhook.secret=whsec_your_webhook_secret

# Email Service (SendGrid or AWS SES)
mail.smtp.host=smtp.sendgrid.net
mail.smtp.port=587
mail.smtp.username=apikey
mail.smtp.password=SG.your_sendgrid_api_key
mail.from=noreply@petstore.example.com

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

### 4. Build Backend

```bash
cd backend

# Build with Maven
mvn clean install -DskipTests

# Or use Maven wrapper
./mvnw clean install -DskipTests
```

### 5. Run Database Migrations

```bash
# Flyway will run automatically on application startup
# Or manually with Maven
mvn flyway:migrate -Dflyway.configFiles=backend/src/main/resources/application.properties
```

### 6. Start Backend Server

```bash
# Option A: Maven
mvn spring-boot:run

# Option B: IDE - Right-click PetstoreApplication.java → Run as Spring Boot App

# Option C: JAR
java -jar backend/target/petstore-application.jar
```

Backend will be available at: **http://localhost:8080**

### Testing Backend

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=PetControllerTest

# With coverage
mvn test jacoco:report
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend

# Using npm
npm install

# Or using yarn
yarn install
```

### 2. Configure Environment

Create `frontend/.env.local`:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

### 3. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

Frontend will be available at: **http://localhost:5173** (Vite default)

### 4. Build for Production

```bash
# Build static files
npm run build

# Output: frontend/dist/

# Preview build
npm run preview
```

### Testing Frontend

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## Running the Full Application Locally

### 1. Start All Services

Terminal 1 - PostgreSQL:
```bash
# If using Docker
docker start petstore-db
```

Terminal 2 - Backend:
```bash
cd backend
mvn spring-boot:run
```

Terminal 3 - Frontend:
```bash
cd frontend
npm run dev
```

### 2. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/v1
- **API Documentation**: http://localhost:8080/swagger-ui.html (if Swagger enabled)

### 3. Test Checkout Flow

1. Open frontend
2. Browse catalog (GET /api/v1/pets)
3. Add items to cart (POST /api/v1/cart/items)
4. View cart (GET /api/v1/cart)
5. Proceed to checkout (POST /api/v1/checkout)
6. Use Stripe test card: `4242 4242 4242 4242` with any future date and CVC
7. Complete order (POST /api/v1/orders)

---

## Database Schema

### Run Migrations Manually

```bash
# List pending migrations
mvn flyway:info

# Migrate to latest
mvn flyway:migrate

# Validate schema
mvn flyway:validate

# Clean (⚠️ drops all data)
mvn flyway:clean
```

### Seed Data

Seed data is included in `V1__init.sql`:

```sql
INSERT INTO category (name, description) VALUES
('Dogs', 'Friendly canine companions'),
('Cats', 'Independent feline friends'),
('Birds', 'Colorful feathered pets'),
('Fishes', 'Aquatic companions');

INSERT INTO pet (category_id, name, species, breed, age_months, price, stock_quantity, ...) VALUES
(1, 'Golden Retriever Puppy', 'Dog', 'Golden Retriever', 6, 1500.00, 5, ...),
...
```

---

## API Testing

### Using cURL

```bash
# List pets
curl http://localhost:8080/api/v1/pets

# Get pet details
curl http://localhost:8080/api/v1/pets/1

# Register user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'

# Add to cart
curl -X POST http://localhost:8080/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -d '{"petId":1,"quantity":2}'
```

### Using Postman

1. Import `postman_collection.json` (if provided)
2. Set environment variable: `base_url = http://localhost:8080/api/v1`
3. Set JWT token from login response to `{{token}}`
4. Run requests from collection

---

## Common Issues & Troubleshooting

### Issue: PostgreSQL Connection Refused

**Solution**:
```bash
# Check if PostgreSQL is running
brew services list  # macOS
systemctl status postgresql  # Linux

# Restart PostgreSQL
brew services restart postgresql
```

### Issue: Port 8080 Already in Use

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Issue: Port 5173 Already in Use (Frontend)

**Solution**:
```bash
# Kill process using port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or run on different port
VITE_PORT=5174 npm run dev
```

### Issue: Flyway Migration Failed

**Solution**:
```bash
# Check Flyway history
mvn flyway:info

# Repair if needed
mvn flyway:repair

# Rebuild schema
mvn flyway:clean flyway:migrate
```

### Issue: Node modules corruption

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## IDE Configuration

### VS Code

1. **Install Extensions**:
   - Extension Pack for Java (Microsoft)
   - Spring Boot Extension Pack (Pivotal Software)
   - ES7+ React/Redux/React-Native snippets (dsznajder)
   - Thunder Client (Rangav) - for API testing

2. **Java Configuration** (`settings.json`):
   ```json
   {
     "java.home": "/path/to/jdk-17",
     "java.configuration.updateBuildConfiguration": "automatic",
     "java.debug.settings.hotCodeReplace": "auto"
   }
   ```

3. **Launch Backend** (F5 key with `.vscode/launch.json`):
   ```json
   {
     "name": "Spring Boot App",
     "type": "java",
     "name": "Spring Boot App",
     "request": "launch",
     "cwd": "${workspaceFolder}",
     "console": "integratedTerminal",
     "mainClass": "com.petstore.PetstoreApplication",
     "projectName": "petstore",
     "args": "",
     "envFile": "${workspaceFolder}/backend/.env"
   }
   ```

---

## Continuous Integration

### GitHub Actions

Pre-configured workflows in `.github/workflows/`:

- `backend-test.yml` - Run backend tests on push
- `frontend-test.yml` - Run frontend tests on push
- `backend-deploy.yml` - Deploy backend to Render
- `frontend-deploy.yml` - Deploy frontend to Render

Push to trigger:
```bash
git commit -m "Feature: Add pet filtering"
git push origin feature/add-pet-filtering
```

---

## Deployment

### Deploy to Render

#### Backend

1. Create Render account and connect GitHub
2. Create new Web Service:
   - **Build Command**: `cd backend && ./mvnw clean install -DskipTests`
   - **Start Command**: `java -Xmx256m -jar backend/target/petstore-application.jar`
   - **Environment Variables**:
     - `SPRING_DATASOURCE_URL`: PostgreSQL connection string
     - `SPRING_DATASOURCE_PASSWORD`: DB password
     - `APP_JWT_SECRET`: Your JWT secret
     - `STRIPE_API_KEY`: Stripe secret key

#### Frontend

1. Create Static Site in Render:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

#### Database

1. Create PostgreSQL instance on Render
2. Note connection URL
3. Update backend environment variables with Render PostgreSQL URL

### Environment Setup for Production

```bash
# Use environment variables instead of properties files
export SPRING_DATASOURCE_URL=postgresql://render-host:5432/dbname
export SPRING_DATASOURCE_PASSWORD=password
export APP_JWT_SECRET=$(openssl rand -base64 32)
export STRIPE_API_KEY=sk_live_xxx
export CORS_ALLOWED_ORIGINS=https://petstore.example.com
```

---

## Next Steps

1. ✅ Clone and set up repository
2. ✅ Configure PostgreSQL
3. ✅ Start backend and frontend locally
4. ✅ Test catalog → cart → checkout flow
5. 📋 Review API contracts in `/specs/001-petstore-ecommerce/contracts/`
6. 📋 Run full test suite
7. 📋 Configure Stripe account and webhooks
8. 📋 Deploy to Render staging environment
9. 📋 Configure production environment variables
10. 📋 Go live!

---

## Development Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit regularly
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create PR for review
# → CI tests run automatically
# → Deploy to staging on approval
```

### Code Style

- **Backend**: Follow Google Java Style Guide (enforced by Checkstyle)
- **Frontend**: ESLint + Prettier (auto-format on save)

### Testing Requirements

- Backend: ≥80% unit test coverage
- Frontend: ≥70% component test coverage
- All PRs must pass CI tests before merge

---

## Documentation

- **API**: [Product API Contract](./contracts/products-api.md)
- **Database**: [Data Model](./data-model.md)
- **Architecture**: [Implementation Plan](./plan.md)
- **Research**: [Design Decisions](./research.md)

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review API contracts and data model docs
3. Check GitHub Issues
4. Open new issue with detailed description

---

## License

[Add your license here]
