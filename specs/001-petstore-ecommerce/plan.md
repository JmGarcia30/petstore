# Implementation Plan: Petstore E-Commerce Application

**Branch**: `001-petstore-ecommerce` | **Date**: April 28, 2026 | **Spec**: [specs/001-petstore-ecommerce/spec.md](specs/001-petstore-ecommerce/spec.md)
**Input**: Feature specification from `/specs/001-petstore-ecommerce/spec.md`

## Summary

Build a full-stack e-commerce application for selling pets (dogs, cats, birds, fishes) with a Java Spring Boot backend, React frontend, and PostgreSQL database. The system supports product browsing with category filtering, shopping cart management with persistence, checkout flow with payment processing, user authentication, and order tracking. Deployed on Render with emphasis on simplicity, cost-efficiency, and test coverage per project constitution.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 3.2.x) + React 18  
**Primary Dependencies**: 
- Backend: Spring Boot Web, Spring Data JPA, Spring Security, Spring Mail, Flyway (migrations)
- Frontend: React, React Router v6, Tailwind CSS, Material-UI (MUI), TanStack Query, Axios
- Payment: Stripe Java SDK (tokenization and payment processing)
  
**Storage**: PostgreSQL 14+ (Render free-tier or local development)  
**Testing**: 
- Backend: JUnit 5, Mockito, Spring Test, TestContainers (PostgreSQL)
- Frontend: Jest, React Testing Library, Vitest

**Target Platform**: Render.com (Linux, Docker containerization)  
**Project Type**: Web-service + Frontend SPA  
**Performance Goals**: 
- API response time: <2s p95 for all endpoints
- Frontend initial load: <3s on 4G (Lighthouse target: 80+)
- Support 100+ concurrent users on free-tier Render instance

**Constraints**: 
- Render free-tier: 0.5 CPU, 512MB RAM (backend), 3GB storage (PostgreSQL)
- Database: 100GB free-tier PostgreSQL storage
- Build time: <5 minutes (Docker image size <500MB)
✅ **Product-First, API-Driven**: All backend functionality exposed via REST API with versioning strategy (v1 prefix on endpoints)  
✅ **Technology Pragmatism (Stack Lock)**: Strictly adheres to Java Spring Boot + PostgreSQL + React + Tailwind + MUI stack defined in constitution  
✅ **Test-First Discipline**: Unit tests for all business logic, integration tests for service-database, E2E smoke tests for catalog→cart→checkout  
✅ **Security & Data Protection**: Passwords hashed with bcrypt, PII encrypted in database, payment data delegated to Stripe PCI-compliant service  
✅ **Observability, Simplicity & Cost-Awareness**: Structured logging via SLF4J, minimal dependencies, single Spring Boot container + React static bundle on Render free-tier
**Scale/Scope**: 
- v1: 100-1000 pets, 10-100 concurrent users
- Architecture designed to scale to 10k+ pets, 1000+ concurrent users with minimal changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)

```text
backend/
├── pom.xml                                    # Maven dependencies, plugins
├── Dockerfile                                 # Container image for Render deployment
├── src/main/java/com/petstore/
│   ├── PetstoreApplication.java              # Spring Boot entry point
│   ├── config/                               # Configuration classes (security, CORS, etc.)
│   ├── controller/                           # REST controllers (Pet, Cart, Order, Auth, etc.)
│   ├── service/                              # Business logic services
│   ├── repository/                           # JPA repositories (Spring Data)
│   ├── model/                                # JPA entities (Pet, User, Cart, Order, etc.)
│   ├── dto/                                  # Data transfer objects (requests/responses)
│   ├── exception/                            # Custom exceptions and global error handler
│   ├── security/                             # JWT auth provider, custom user details
│   └── util/                                 # Utilities (validators, mappers)
├── src/main/resources/
│   ├── application.properties                # Spring Boot configuration (DB, port, etc.)
│   ├── db/migration/                         # Flyway SQL migration files (V1__init.sql, etc.)
│   └── schema.sql                            # Database schema definition (reference)
└── src/test/
    ├── java/com/petstore/
    │   ├── controller/                       # Integration tests for endpoints
    │   ├── service/                          # Unit tests for business logic
    │   └── repository/                       # Repository tests with TestContainers
    └── resources/test-data.sql               # Test fixture data

frontend/
├── package.json                              # Node dependencies, build scripts
├── vite.config.js                            # Vite build configuration
├── tailwind.config.js                        # Tailwind CSS configuration
├── index.html                                # HTML entry point
├── Dockerfile                                # Optional: for development/frontend-specific builds
├── src/
│   ├── main.jsx                              # React entry point
│   ├── App.jsx                               # Root component
│   ├── index.css                             # Global styles + Tailwind imports
│   ├── components/
│   │   ├── common/                           # Reusable components (Header, Footer, Button, Modal)
│   │   ├── product/                          # Product-related components (ProductList, ProductCard, ProductDetail)
│   │   ├── cart/                             # Cart components (CartPage, CartItem, CartSummary)
│   │   ├── checkout/                         # Checkout flow (ShippingForm, PaymentForm, OrderConfirmation)
│   │   ├── auth/                             # Auth components (LoginForm, RegisterForm, Profile)
│   │   └── orders/                           # Order tracking components (OrderHistory, OrderDetail)
│   ├── pages/
│   │   ├── HomePage.jsx                      # Landing page with featured products
│   │   ├── CatalogPage.jsx                   # Product listing with filters
│   │   ├── ProductDetailPage.jsx             # Single product details
│   │   ├── CartPage.jsx                      # Shopping cart view
│   │   ├── CheckoutPage.jsx                  # Multi-step checkout flow
│   │   ├── LoginPage.jsx                     # Authentication page
│   │   ├── ProfilePage.jsx                   # User profile and addresses
│   │   ├── OrdersPage.jsx                    # Order history
│   │   └── NotFoundPage.jsx                  # 404 page
│   ├── services/
│   │   ├── api.js                            # Axios instance with interceptors
│   │   ├── petService.js                     # API calls for pet catalog
│   │   ├── cartService.js                    # API calls for cart operations
│   │   ├── orderService.js                   # API calls for orders and checkout
│   │   ├── authService.js                    # API calls for authentication
│   │   └── userService.js                    # API calls for user profile
│   ├── hooks/
│   │   ├── useAuth.js                        # Auth state management
│   │   ├── useCart.js                        # Cart state with persistence
│   │   └── useQuery.js                       # TanStack Query integration
│   ├── context/
│   │   ├── AuthContext.jsx                   # Global auth context provider
│   │   └── NotificationContext.jsx           # Global toast/notification state
│   ├── utils/
│   │   ├── format.js                         # Number, currency, date formatting
│   │   ├── validation.js                     # Form validation utilities
│   │   └── constants.js                      # App-wide constants, API URLs
│   └── styles/                               # Component-scoped or utility styles
└── src/test/
    ├── components/                           # Component tests with React Testing Library
    ├── services/                             # Service/hook tests
    └── utils/                                # Utility function tests

.github/
├── workflows/
│   ├── backend-test.yml                      # CI: test backend on push
│   ├── frontend-test.yml                     # CI: test frontend on push
│   ├── backend-deploy.yml                    # CD: build and deploy backend to Render
│   └── frontend-deploy.yml                   # CD: build and deploy frontend to Render
└── copilot-instructions.md                   # Agent context (this file)

.specify/
├── memory/
│   └── constitution.md                       # Project governance and principles
├── scripts/powershell/
│   ├── setup-plan.ps1                        # Initialize implementation plan
│   └── ... (other workflow scripts)
└── templates/
    └── plan-template.md                      # Plan template

specs/
└── 001-petstore-ecommerce/
    ├── spec.md                               # Feature specification (user stories, requirements, constraints)
    ├── plan.md                               # This file - implementation plan
    ├── research.md                           # Phase 0 - research findings and design decisions
    ├── data-model.md                         # Phase 1 - entity definitions and database schema
    ├── quickstart.md                         # Phase 1 - setup and running instructions
    ├── contracts/                            # Phase 1 - API endpoint contracts
    │   ├── products-api.md
    │   ├── cart-api.md
    │   ├── checkout-api.md
    │   ├── orders-api.md
    │   ├── auth-api.md
    │   └── user-api.md
    ├── checklists/
    │   ├── requirements.md                   # Requirements tracking checklist
    │   └── quality.md                        # Quality assurance checklist
    └── tasks.md                              # Phase 2 - breakdown of implementation tasks (generated by /speckit.tasks)
```

**Structure Decision**: Selected Option 2 (Web application with separate frontend/backend) as the repository already has `backend/` and `frontend/` directories. This separation allows independent scaling, testing, and deployment of each tier while sharing a single PostgreSQL database and Git repository.

---

## Feature & Component Breakdowncture: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

**Quality Gates Phase 4**:
- Lighthouse score: ≥80 on all metrics
- E2E test coverage: ≥90% of critical user flows
- Security scan: Zero critical vulnerabilities
- Load testing: Sustained 100 concurrent users with <2s p95 response time

---

## Feature & Component Breakdown

### Phase 1: Core Catalog & Cart Implementation

**Backend Components**:
1. `PetController` - REST endpoints for pet catalog
   - `GET /api/v1/pets` - List with pagination, filtering, sorting
   - `GET /api/v1/pets/{id}` - Individual pet detail
   - `GET /api/v1/categories` - List categories
   - `GET /api/v1/pets/search?q=...` - Search functionality

2. `PetService` - Business logic
   - Fetch pets with filters (category, price range, availability)
   - Search and sorting logic
   - Inventory status calculation

3. `PetRepository` - Data access
   - Spring Data JPA repository with custom queries
   - Pagination and sorting

4. `CartController` - Shopping cart endpoints
   - `GET /api/v1/cart` - Retrieve cart
   - `POST /api/v1/cart/items` - Add item
   - `PUT /api/v1/cart/items/{id}` - Update quantity
   - `DELETE /api/v1/cart/items/{id}` - Remove item
   - `DELETE /api/v1/cart` - Clear cart

5. `CartService` - Cart business logic
   - Add/remove/update cart items
   - Calculate totals (subtotal, tax estimate, shipping)
   - Validate stock availability
   - Handle guest vs. user carts

6. Database Migrations
   - `V1__init.sql` - Create category and pet tables, seed data
   - `V2__create_cart_tables.sql` - Create cart and cart_item tables

**Frontend Components**:
1. `HomePage.jsx` - Landing page
   - Featured pets carousel
   - Call-to-action buttons
   - Quick category links

2. `CatalogPage.jsx` - Product listing
   - Product grid with filters
   - Category sidebar
   - Search bar
   - Sort options
   - Pagination controls

3. `ProductCard.jsx` - Individual pet card
   - Image, name, price, stock status
   - "Add to Cart" button
   - Link to detail page

4. `ProductDetailPage.jsx` - Pet details
   - Full product information
   - Images (carousel)
   - Description, health status, age, breed
   - Add to cart with quantity selector
   - Related products

5. `CartPage.jsx` - Shopping cart view
   - List of cart items with images
   - Quantity controls
   - Remove item buttons
   - Cart summary (subtotal, shipping, tax estimate, total)
   - "Proceed to Checkout" button
   - Empty cart message

6. `petService.js` - API calls
   - `GET /api/v1/pets` with filters
   - `GET /api/v1/pets/{id}`
   - `GET /api/v1/categories`
   - `GET /api/v1/pets/search`

7. `cartService.js` - Cart API calls
   - `GET /api/v1/cart`
   - `POST /api/v1/cart/items`
   - `PUT /api/v1/cart/items/{id}`
   - `DELETE /api/v1/cart/items/{id}`

8. `useCart()` - Custom hook
   - Cart state management
   - LocalStorage persistence for guests
   - Add/remove/update logic
   - Sync with backend on login

9. Styling
   - Tailwind CSS for layouts
   - MUI components (Button, Card, TextField, Dialog)
   - Responsive design (mobile-first)

**Testing**:
- Backend unit tests: `PetServiceTest`, `CartServiceTest`
- Backend integration tests: `PetControllerTest`, `CartControllerTest`
- Frontend component tests: `CatalogPage.test.jsx`, `CartPage.test.jsx`
- E2E test: Browse catalog → Add to cart → View cart

---

### Phase 2: Authentication & Checkout

**Backend Components**:
1. `AuthController` - Authentication endpoints
   - `POST /api/v1/auth/register` - User registration
   - `POST /api/v1/auth/login` - Login
   - `POST /api/v1/auth/logout` - Logout
   - `POST /api/v1/auth/refresh` - Refresh token

2. `AuthService` - Authentication logic
   - Password hashing with bcrypt
   - JWT token generation and validation
   - User session management

3. `UserController` - User profile endpoints
   - `GET /api/v1/users/profile` - Get profile
   - `PUT /api/v1/users/profile` - Update profile
   - `GET /api/v1/users/addresses` - List addresses
   - `POST /api/v1/users/addresses` - Add address
   - `PUT /api/v1/users/addresses/{id}` - Update address
   - `DELETE /api/v1/users/addresses/{id}` - Delete address

4. `UserService` - User business logic
   - Profile management
   - Address validation (basic format checking)
   - Default address handling

5. `CheckoutController` - Checkout endpoints
   - `POST /api/v1/checkout` - Initiate checkout (calculate totals)

6. `CheckoutService` - Checkout logic
   - Cart validation
   - Inventory locking (pessimistic)
   - Tax calculation (external service)
   - Shipping cost calculation
   - Order creation

7. `OrderController` - Order endpoints
   - `POST /api/v1/orders` - Create order
   - `GET /api/v1/orders` - Get order history
   - `GET /api/v1/orders/{orderNumber}` - Get order detail

8. `OrderService` - Order business logic
   - Order creation with stock deduction
   - Order status management
   - Email notification triggering

9. `StripePaymentService` - Payment processing
   - Payment intent creation
   - Webhook handling for payment confirmations

10. Security Configuration
    - Spring Security with JWT
    - CORS configuration
    - CSRF protection

11. Database Migrations
    - `V3__create_user_tables.sql` - User, Address tables
    - `V4__create_order_tables.sql` - Order, OrderItem, Payment tables

**Frontend Components**:
1. `AuthContext.jsx` - Global auth state
   - Current user
   - JWT token
   - Login/logout functions

2. `LoginPage.jsx` - Login form
   - Email and password fields
   - Submit button
   - Link to registration
   - Error message display

3. `RegisterPage.jsx` - Registration form
   - Email, password, name fields
   - Password strength indicator
   - Submit button

4. `ProfilePage.jsx` - User profile
   - Display profile information
   - Edit form for name, phone
   - Address management (list, add, edit, delete)

5. `CheckoutPage.jsx` - Multi-step checkout
   - Step 1: Shipping address selection/entry
   - Step 2: Review order summary
   - Step 3: Payment form (Stripe Elements)
   - Step 4: Order confirmation

6. `ShippingForm.jsx` - Shipping address form
   - Address fields with validation
   - Address lookup/autocomplete (optional)
   - Shipping cost display

7. `PaymentForm.jsx` - Payment form
   - Stripe Elements integration
   - Card details input
   - Billing address handling

8. `OrderConfirmation.jsx` - Confirmation page
   - Order number
   - Order summary
   - Shipping address
   - Estimated delivery date
   - Confirmation email notice

9. `OrdersPage.jsx` - Order history
   - List of user's orders
   - Order status badges
   - Link to order detail

10. `authService.js` - Auth API calls
    - Register, login, logout, refresh token

11. `userService.js` - User API calls
    - Profile management
    - Address CRUD operations

12. `useAuth()` - Custom hook
    - Auth state management
    - JWT token persistence
    - Login/logout functions

**Testing**:
- Backend unit tests: `AuthServiceTest`, `OrderServiceTest`
- Backend integration tests: `CheckoutControllerTest`, `OrderControllerTest`
- Security tests: JWT validation, CORS, CSRF
- Frontend component tests: `CheckoutPage.test.jsx`, `PaymentForm.test.jsx`
- E2E test: Register → Login → Checkout → Order

---

### Phase 3: Payment Integration & Advanced Features

**Backend Components**:
1. `StripeWebhookController` - Webhook endpoint
   - `POST /api/webhooks/stripe` - Receive payment confirmations

2. Enhanced `PaymentService`
   - Idempotency key handling
   - Retry logic
   - Payment status tracking
   - Webhook signature validation

3. `EmailService` - Transactional email
   - Order confirmation email
   - Shipping notification email
   - Payment receipt email

4. `InventoryService` - Inventory management
   - Real-time stock updates
   - Backorder tracking (optional)
   - Stock reallocation on cancellation

5. `AdminController` - Admin endpoints (out of scope for Phase 1, included for planning)
   - Order management
   - Inventory updates
   - User management (minimal)

**Frontend Components**:
1. Order Tracking UI
   - Order status timeline
   - Tracking number and link
   - Estimated delivery date
   - Real-time status updates (polling)

2. Payment Error Handling
   - Retry payment option
   - Clear error messages
   - Alternative payment method option

**Testing**:
- Payment processor mocking
- Webhook security and signature validation
- Email notification tests
- Payment retry logic tests

---

### Phase 4: Polish & Deployment

**Backend**:
1. Observability & Logging
   - Structured JSON logging via Logback
   - Request/response logging interceptor
   - Error tracking integration (optional)

2. Performance Optimization
   - Query optimization and indexes
   - Lazy loading for relationships
   - Caching strategy (HTTP caching headers)

3. Security Hardening
   - Rate limiting (Resilience4j CircuitBreaker)
   - Input validation and sanitization
   - SQL injection prevention (already via ORM)
   - XSS prevention (already via REST API)
   - HTTPS enforcement (Render handles)

4. API Documentation
   - Swagger/OpenAPI integration (springdoc-openapi)
   - API endpoint documentation
   - Example requests/responses

5. Deployment Configuration
   - Dockerfile for backend
   - `application-prod.properties` for production settings
   - Health check endpoints

**Frontend**:
1. Performance Optimization
   - Code splitting and lazy loading
   - Image optimization (compression, responsive)
   - Bundle size analysis and reduction
   - Caching strategy (service worker, optional)

2. Accessibility
   - WCAG 2.1 AA audit
   - Screen reader testing
   - Keyboard navigation
   - Color contrast validation
   - Form labels and ARIA attributes

3. Browser Compatibility
   - Testing on Chrome, Firefox, Safari, Edge
   - Polyfills for older browsers (if needed)
   - Responsive design testing (mobile, tablet, desktop)

4. CI/CD Pipeline
   - GitHub Actions workflows
   - Automated testing on push
   - Build and deploy to Render

5. Monitoring & Analytics (optional)
   - Error tracking (Sentry)
   - Performance monitoring (optional)
   - User analytics (optional)

---

## Success Metrics & Quality Gates

### Phase 1 Success Criteria
- ✅ All catalog endpoints tested and working
- ✅ Cart persistence works (localStorage for guests, database for users)
- ✅ Unit test coverage ≥80% for services
- ✅ Integration test coverage: ≥5 tests per controller
- ✅ Catalog page loads <2 seconds
- ✅ Search results return within 500ms

### Phase 2 Success Criteria
- ✅ Registration and login working
- ✅ Checkout flow complete end-to-end
- ✅ Order created successfully
- ✅ Payment processing works (Stripe test mode)
- ✅ Security tests passing (JWT, CORS, CSRF)
- ✅ E2E test: Catalog → Cart → Checkout → Order ✓

### Phase 3 Success Criteria
- ✅ Payment webhooks received and processed
- ✅ Order status updates reflect payment confirmation
- ✅ Confirmation emails sent successfully
- ✅ Inventory automatically decremented on order

### Phase 4 Success Criteria
- ✅ Lighthouse score ≥80
- ✅ Zero security vulnerabilities
- ✅ Load test: 100 concurrent users, <2s p95
- ✅ Deployed to Render and accessible
- ✅ All critical workflows tested

---

## Dependencies & External Services

### Required Services
- **PostgreSQL** (Render or self-hosted)
- **Stripe** (Payment processing) - Free account for testing
- **Email Service** (SendGrid free tier or AWS SES)

### Optional Services (Phase 2+)
- **Sentry** (Error tracking) - Optional for v1
- **DataDog/New Relic** (APM) - Optional for v1
- **Cloudflare** (CDN) - Optional for v1

### Libraries & Frameworks

**Backend**:
- Spring Boot 3.2.x
- Spring Data JPA / Hibernate
- Spring Security
- Stripe Java SDK
- Flyway (database migrations)
- JUnit 5 / Mockito (testing)
- SLF4J / Logback (logging)

**Frontend**:
- React 18
- React Router v6
- Tailwind CSS
- Material-UI (MUI)
- Axios
- TanStack Query (React Query)
- Stripe.js / @stripe/react-stripe-js
- Jest / React Testing Library (testing)

---

## Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Render free-tier resource limits | App downtime/slowness | Medium | Optimize JVM heap, monitor resource usage, plan upgrade path |
| Payment processing integration delays | Checkout unavailable | Low | Pre-test Stripe integration, allocate extra time for webhooks |
| Database migration issues | Data loss/corruption | Low | Test migrations in staging, maintain backup strategy |
| CORS/CSRF issues between frontend/backend | Frontend cannot call backend | Low | Configure CORS properly, Spring Security handles CSRF |
| Stock overselling race condition | Inventory inconsistency | Medium | Use pessimistic locking in checkout, thorough testing |
| JWT token expiration handling | Users logged out unexpectedly | Low | Implement refresh token flow, test token rotation |

---

## Definition of Done

### Acceptance Criteria for Each Phase

**Phase 1 - Catalog & Cart**:
- [ ] All catalog endpoints tested with ≥5 integration tests per endpoint
- [ ] Cart persistence works for both guests and users
- [ ] Search, filtering, pagination working correctly
- [ ] Unit tests ≥80% coverage for services
- [ ] Frontend pages render correctly on mobile/desktop
- [ ] No console errors in browser

**Phase 2 - Auth & Checkout**:
- [ ] User registration validates email and password requirements
- [ ] Login generates valid JWT token
- [ ] Checkout flow calculates totals correctly
- [ ] Order created in database on successful payment
- [ ] Confirmation email sent to customer
- [ ] E2E test passes (catalog → cart → checkout → order)

**Phase 3 - Payment & Advanced**:
- [ ] Stripe webhooks received and validated
- [ ] Payment status updates order status
- [ ] Inventory decremented atomically on order creation
- [ ] Refund/cancellation flow works (if implemented)

**Phase 4 - Deployment**:
- [ ] Application deployed to Render (backend + frontend)
- [ ] Database migrations run on deploy
- [ ] All environment variables configured
- [ ] HTTPS enforced
- [ ] Performance metrics meet targets
- [ ] Security scan shows zero critical issues
- [ ] Load test successful (100 concurrent users)

---

## References & Links

- **Feature Specification**: [specs/001-petstore-ecommerce/spec.md](spec.md)
- **Research & Design**: [specs/001-petstore-ecommerce/research.md](research.md)
- **Data Model**: [specs/001-petstore-ecommerce/data-model.md](data-model.md)
- **Quick Start**: [specs/001-petstore-ecommerce/quickstart.md](quickstart.md)
- **API Contracts**: [specs/001-petstore-ecommerce/contracts/](contracts/)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

---

## Appendix: Estimated Effort & Timeline

### Development Team

**Recommended**: 2-3 developers
- 1 Backend Developer (Java/Spring)
- 1 Frontend Developer (React)
- 1 Full-stack/DevOps (Database, Deployment, CI/CD)

### Timeline Estimate

| Phase | Duration | Effort | Key Deliverables |
|-------|----------|--------|------------------|
| Phase 0 (Research) | 1 day | 8h | research.md, design decisions |
| Phase 1 (Catalog & Cart) | 2 weeks | 80h | Catalog pages, Cart, database, tests |
| Phase 2 (Auth & Checkout) | 2 weeks | 80h | Auth system, Checkout flow, Orders |
| Phase 3 (Payments & Advanced) | 2 weeks | 80h | Stripe integration, Webhooks, Email |
| Phase 4 (Polish & Deploy) | 1 week | 40h | Performance, Security, Deployment |
| **Total** | **7 weeks** | **288h** | **Production-ready MVP** |

*Note: Estimates assume full-time development, experienced team, minimal external blockers.*

### Velocity Assumptions
- Backend development: 30-40 story points/week
- Frontend development: 25-35 story points/week
- 25-30 story points total per week for team

---

**Plan Status**: ✅ COMPLETE - Ready for Implementation  
**Last Updated**: April 28, 2026  
**Next Step**: Generate detailed task breakdown with `/speckit.tasks` command

### Phase 0: Research & Design Decisions ✅
*Duration: Concurrent (1 day) | Output: research.md*

Key research areas resolved in [research.md](research.md):
- Payment processor selection and PCI-compliance strategy (Stripe)
- Database schema normalization and relationship design
- Session management strategy for guest and authenticated users
- Inventory management and concurrency control (pessimistic locking)
- Deployment target evaluation (Render vs. alternatives)
- Frontend state management approach (TanStack Query + Context API)

### Phase 1: Core Catalog & Cart (Weeks 1-2)
*Dependent: Phase 0 complete | Outputs: data-model.md, contracts/, quickstart.md*

**Backend Components**:
- Data models: `Pet`, `Category`, database schema with Flyway migrations
- REST endpoints: GET /api/pets, GET /api/pets/{id}, GET /api/categories
- Service layer: `PetService`, `CategoryService`
- Repository layer: `PetRepository`, `CategoryRepository` (Spring Data JPA)
- Error handling: Global exception handler, validation framework
- Tests: Unit tests for services, integration tests for controllers

**Frontend Components**:
- Pages: `HomePage`, `CatalogPage`, `ProductDetailPage`
- Components: `ProductCard`, `ProductList`, `CategoryFilter`, `SearchBar`
- Services: `petService.js` for API calls
- State: TanStack Query for caching and server state management
- Styling: Tailwind + MUI for responsive design
- Tests: Component tests, service mocking

**Database**:
- V1 migration: `Pet`, `Category` tables with indexes
- Seed data: 100+ sample pets across 4 categories

**Cart System** (still Phase 1):
- Data models: `Cart`, `CartItem`
- REST endpoints: GET/POST/PUT/DELETE /api/cart/items
- Persistent storage: LocalStorage for guests, database for users
- Service layer: `CartService` with business logic
- Tests: Unit tests for cart calculations, integration tests for endpoints

**Frontend Cart Components**:
- Pages: `CartPage`
- Components: `CartItem`, `CartSummary`, `EmptyCart`
- Hooks: `useCart()` for cart state management
- Persistence: LocalStorage + IndexedDB for offline support

**Quality Gates Phase 1**:
- Unit test coverage: ≥80% for service layer
- Integration tests: ≥5 tests per controller
- Frontend tests: ≥70% coverage for components
- Performance: Catalog load <2s, search <500ms
- No regressions in existing endpoints

### Phase 2: Authentication & Checkout (Weeks 3-4)
*Dependent: Phase 1 complete*

**Backend Components**:
- Data models: `User`, `Address`, `Order`, `OrderItem`, `Payment`
- REST endpoints: Auth (register, login, logout), User profile, Addresses, Orders
- Security: Spring Security, JWT token authentication
- Service layer: `AuthService`, `UserService`, `OrderService`
- Checkout logic: Inventory locking, order creation, payment initiation
- Email service: Transactional emails for confirmations
- Tests: Security tests, checkout flow integration tests

**Frontend Components**:
- Pages: `LoginPage`, `ProfilePage`, `CheckoutPage`, `OrdersPage`
- Components: `LoginForm`, `RegisterForm`, `ShippingForm`, `PaymentForm`, `OrderConfirmation`
- Hooks: `useAuth()` for authentication state
- Services: `authService.js`, `orderService.js`
- State: Auth context + localStorage for token persistence

**Database**:
- V2 migration: `User`, `Address`, `Order`, `OrderItem`, `Payment` tables
- V3 migration: Foreign keys, constraints, indexes

**Quality Gates Phase 2**:
- Authentication tests: Login, logout, token refresh
- Checkout tests: Order creation, inventory updates, payment processing
- Security tests: SQL injection, XSS, CSRF protection verified
- E2E test: Full catalog→cart→checkout→confirmation flow

### Phase 3: Payment Integration & Order Management (Weeks 5-6)
*Dependent: Phase 2 complete*

**Backend**:
- Stripe integration: Payment intent creation, webhook handling
- Order status tracking: processing, shipped, delivered states
- Inventory management: Real-time updates, backorder handling
- Admin endpoints: Order management, inventory updates
- Webhooks: Payment confirmations, shipping updates
- Tests: Payment processor mocking, webhook security tests

**Frontend**:
- Payment form: Stripe Elements integration
- Order tracking: Real-time status updates via polling or WebSocket
- Admin dashboard: Order list, inventory management (out of scope for v1)

**Quality Gates Phase 3**:
- Payment processing success rate: ≥99.5%
- Webhook reliability: ≥99.9% delivery
- Order status accuracy: 100%

### Phase 4: Polish, Testing, Deployment (Week 7)
*Dependent: Phases 1-3 complete*

**Backend**:
- Observability: Structured logging, basic metrics
- Performance optimization: Query optimization, caching strategies
- Security hardening: Rate limiting, HTTPS enforcement, input sanitization
- Documentation: API docs (Swagger/OpenAPI), deployment guide

**Frontend**:
- Performance: Code splitting, lazy loading, image optimization
- Accessibility: WCAG 2.1 AA compliance audit
- Browser testing: Chrome, Firefox, Safari, Edge
- Mobile responsiveness: Testing on iOS and Android

**Deployment**:
- Docker builds: Backend and frontend containerization
- GitHub Actions: CI/CD pipelines for testing and deployment
- Render setup: Database, backend service, frontend static site
- Monitoring: Error tracking, performance monitoring setup

**Quality Gates Phase 4**:
- Lighthouse score: ≥80 on all metrics
- E2E test coverage: ≥90% of critical user flows
- Security scan: Zero critical vulnerabilities
- Load testing: Sustained 100 concurrent users with <2s p95 response time
