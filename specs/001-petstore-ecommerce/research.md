# Phase 0 Research: Petstore E-Commerce Architecture

**Date**: April 28, 2026  
**Status**: Complete  
**Output**: Design decisions and rationale for implementation plan

## 1. Payment Processing & PCI Compliance

### Decision: Use Stripe for payment processing

**Rationale**:
- PCI-DSS compliance delegated to Stripe; backend never handles raw card data
- Stripe JavaScript Elements handles tokenization on client side
- Stripe Java SDK simplifies backend integration (Payment Intent API)
- Webhook support for asynchronous payment confirmations
- Developer-friendly with extensive documentation and test mode

**Alternatives Considered**:
- Square: Similar but larger feature set than needed for v1
- PayPal: Higher transaction fees (3.49% + $0.49) vs. Stripe (2.9% + $0.30)
- Direct payment processor integration: Requires SOC 2 compliance, rejected due to complexity

**Implementation**:
- Stripe Payment Intent flow (3D Secure compatible)
- `StripePaymentService` wraps Stripe Java SDK
- Idempotency keys on order creation to handle retries safely
- Webhook endpoint at POST /api/webhooks/stripe for payment.intent.succeeded

---

## 2. Database Schema Design & Normalization

### Decision: Relational schema with normalization, Flyway migrations

**Rationale**:
- PostgreSQL offers ACID guarantees needed for inventory and financial transactions
- Normalized schema (3NF) prevents data anomalies and supports scaling
- Flyway SQL migrations version control all schema changes
- Foreign keys enforce referential integrity at database level
- Indexes on frequently filtered columns (category_id, user_id, status)

**Schema Entities**:
- **Pet**: Product inventory with stock tracking
- **Category**: Pet type grouping
- **User**: Customer accounts
- **Address**: Shipping/billing addresses (supports multiple per user)
- **Cart**: Shopping session container
- **CartItem**: Link table for pets in cart
- **Order**: Purchase transaction
- **OrderItem**: Link table for pets in order
- **Payment**: Payment transaction tracking

**Alternatives Considered**:
- NoSQL (MongoDB): Would sacrifice ACID guarantees and require application-level joins
- Elasticsearch: Rejected for primary storage; useful later for search optimization
- Document database: Cargo cult; not justified for structured e-commerce data

---

## 3. Session Management & Cart Persistence

### Decision: Dual-mode cart persistence (localStorage for guests, database for users)

**Rationale**:
- **Guests**: Cart stored in browser localStorage, survives page reloads via JSON serialization
- **Authenticated users**: Cart stored in database (cart + cart_items tables), synced on login
- Eliminates server-side session state complexity
- Supports multi-device shopping (user logs in on mobile, previously added items available)
- No session invalidation issues with stateless JWT architecture

**Guest Cart Flow**:
1. User adds pet to cart → stored in localStorage
2. Browser sends `X-Cart-Token` header (ULID-based temporary ID) on API calls
3. On checkout, guest provides email; cart converted to Order without user creation
4. On login later, user's database cart synced with any prior guest shopping

**User Cart Flow**:
1. Login creates JWT token stored in localStorage
2. Cart operations target database via authenticated endpoints
3. User can shop across multiple devices, all carts sync to user_id
4. Logout clears JWT but preserves user's database cart

**Alternatives Considered**:
- Server-side sessions (Redis): Requires additional infrastructure, complicates stateless deployment
- Merge-on-login only: Users lose guest cart if they register after shopping as guest
- Browser-only storage: Guest loses cart if browser cache cleared or uses different device

---

## 4. Inventory Management & Concurrency Control

### Decision: Pessimistic row locking during checkout, inventory validation at cart-add

**Rationale**:
- **Cart Add**: Check `pet.stock_quantity > 0` and add to cart; allows overbooking temporarily
- **Checkout**: Lock row in Pet table (`SELECT * FROM pet FOR UPDATE`), verify sufficient stock exists
- Prevents most overselling scenarios while maintaining performance
- Spring Data JPA `@Lock(LockModeType.PESSIMISTIC_WRITE)` handles locking
- Rollback on insufficient inventory; user notified to reduce quantity

**Inventory Update Process**:
1. Order created with locked pet rows
2. Stock decremented atomically: `pet.stock_quantity -= orderItem.quantity`
3. Transaction commits; locks released
4. If pet now stock_quantity = 0, set available_for_sale flag for UI filtering

**Alternatives Considered**:
- Optimistic locking (version field): Allows more concurrency but requires retry logic on conflict
- Distributed lock (Redis): Over-engineered for free-tier Render resources
- No locking: Simple but risks overselling (e.g., 2 users buy last 1 pet)

---

## 5. Frontend State Management

### Decision: TanStack Query (React Query) + Context API

**Rationale**:
- **Server State (TanStack Query)**: Pet catalog, orders, user profile (fetched data)
  - Automatic caching and deduplication
  - Stale-while-revalidate pattern reduces API calls
  - Built-in retry and error handling
- **Client State (Context API)**: Auth token, user identity, notifications
  - Avoids Redux boilerplate for simple app
  - Sufficient for current scope; upgradeable to Redux Toolkit if needed

**Architecture**:
- `AuthContext` wraps app, provides JWT token and user identity
- `useQuery` hooks wrap TanStack Query for each data domain (pets, orders, etc.)
- `useCart()` custom hook manages cart state with localStorage sync
- Axios interceptor attaches JWT to outgoing requests

**Alternatives Considered**:
- Redux: Over-engineered complexity for this scope; adds 30+ kb to bundle
- MobX: Steeper learning curve; overkill for structured e-commerce data
- Prop drilling only: Would require heavy refactoring as features scale

---

## 6. Frontend Styling & Component Library

### Decision: Tailwind CSS + Material-UI (MUI) components

**Rationale**:
- **Tailwind CSS**: Utility-first, minimal CSS bundle, highly customizable
- **MUI**: Provides pre-built, accessible components (Button, Dialog, Form, etc.) to reduce development time
- Together: Best of both—Tailwind for app-specific layouts, MUI for polished components
- MUI theme system integrates with Tailwind configuration
- Accessibility built into MUI components (WCAG 2.1 AA compliant)

**Implementation**:
- MUI Button, TextField, Card, Dialog for core UI
- Tailwind for page layouts, spacing, custom styling
- MUI theme overrides in `tailwind.config.js`

**Alternatives Considered**:
- Bootstrap: Larger bundle, less customizable, steeper learning curve
- Tailwind only: Would require more time building custom components (button, form, etc.)
- Ant Design: Overkill for e-commerce; enterprise-focused

---

## 7. API Architecture & Versioning

### Decision: RESTful API with v1 prefix, forward-compatible design

**Rationale**:
- REST follows HTTP semantics, easy to reason about
- v1 prefix allows non-breaking evolution (`/api/v1/pets`, `/api/v2/pets` later if needed)
- JSON request/response format standard
- Endpoints follow resource-oriented design (nouns, not verbs)

**Versioning Strategy**:
- Current endpoints: `GET /api/v1/pets`, `POST /api/v1/orders`, etc.
- Breaking changes trigger version bump (v1 → v2)
- Deprecated endpoints supported for 6 months in v1 with warnings

**Alternatives Considered**:
- GraphQL: Overkill for v1 scope; adds query parser complexity
- No versioning: Inflexible; forces all clients to upgrade simultaneously

---

## 8. Deployment Platform & Architecture

### Decision: Render.com free-tier with manual scaling strategy

**Rationale**:
- **Backend**: Single Spring Boot container on Render (0.5 CPU, 512MB RAM)
  - JVM optimized with `-Xmx256m` heap limit
  - Startup optimized (AOT compilation future option)
- **Frontend**: Static site on Render (3GB free storage)
  - Vite build output (single-page app, ~500KB gzipped)
  - No server-side rendering needed
- **Database**: PostgreSQL on Render (free tier, auto-backups)
  - 100GB storage, sufficient for thousands of pets and orders
  - Archive old orders annually to keep active database lean

**Scaling Beyond Free-Tier** (future):
- Add Redis for session caching (paid Render tier)
- Multi-region database read replicas (managed PostgreSQL)
- Content delivery network (Cloudflare) for static assets

**Alternatives Considered**:
- Heroku: Cost increased 2025, less favorable pricing than Render
- AWS EC2: More complex ops, no free tier; would require cost optimization from day 1
- Docker local: Works for development, not production-ready without orchestration

---

## 9. Testing Strategy

### Backend Testing

**Unit Tests**:
- Test business logic in services (PetService, CartService, OrderService)
- Mock repositories and external services (Stripe SDK)
- Target: ≥80% coverage of service methods

**Integration Tests**:
- Test controller endpoints with Spring Test framework
- Mock Stripe SDK, use real PostgreSQL (TestContainers)
- Test request/response serialization, error handling
- Target: ≥5 tests per controller method

**Contract Tests**:
- Define API contract expectations (OpenAPI spec)
- Validate responses match contract (e.g., pet.price always present, is number)

### Frontend Testing

**Unit Tests**:
- Utilities and hooks tested with Jest
- Mock API calls with MSW (Mock Service Worker)

**Component Tests**:
- React Testing Library for user-centric testing
- Test component renders, user interactions, state changes
- Mock TanStack Query to control data fetching

**E2E Tests** (Phase 4):
- Playwright or Cypress for critical user flows
- Test: Catalog → Cart → Checkout → Confirmation

---

## 10. Security Considerations

### Data Protection
- **Passwords**: bcrypt hashing with salt cost 12
- **PII**: Stored encrypted in database using AES-256 (if applicable, e.g., SSN for gift cards later)
- **Secrets**: Environment variables for API keys, never committed to Git
- **HTTPS**: Enforced on all endpoints; Render provides free SSL certificates

### Authentication & Authorization
- **JWT tokens**: Signed with HS256, short-lived (1 hour), refresh tokens for extended sessions
- **CORS**: Restricted to frontend origin only (or configurable for dev)
- **CSRF**: Spring Security CSRF tokens on state-changing requests (for form-based submission)

### API Security
- **Input validation**: All request bodies validated via `@Valid` annotations, custom validators
- **SQL injection**: ORM (Spring Data JPA) with parameterized queries prevents injection
- **XSS prevention**: React's JSX escapes by default; output encoding on custom HTML
- **Rate limiting**: Spring Cloud CircuitBreaker + Resilience4j limits requests per IP (v1 basic, enhanced in v2)

### Payment Security
- **PCI compliance**: Delegated entirely to Stripe; no raw card data touches backend
- **Webhook verification**: Stripe webhook signature validated using secret key
- **Idempotency**: Orders use idempotency keys to prevent duplicate charges on retries

---

## 11. Observability & Logging

### Logging Strategy
- **SLF4J + Logback**: Structured logging in JSON format
- **Log levels**:
  - INFO: API requests/responses, order creation, payment events
  - WARN: Inventory low stock, payment retries, validation failures
  - ERROR: Unhandled exceptions, database errors, external service failures
- **Log destinations**: Console (Render logs), optionally Loggly/DataDog (paid tier)

### Metrics
- **Basic metrics** collected via Spring Boot Actuator:
  - HTTP endpoint count, error rate, response times
  - JVM heap usage, garbage collection
  - Database connection pool utilization

### Alerting
- Manual checks initially (logs in Render dashboard)
- Automated alerts added in Phase 4 if budget allows

---

## 12. Email & Notifications

### Decision: AWS SES or SendGrid for transactional email

**Rationale**:
- Reliable delivery (99%+) for order confirmations
- Templating support for order receipts, shipping updates
- Webhook support for bounce/complaint tracking
- Both offer free tier (50-100 emails/day)

**Implementation**:
- `EmailService` encapsulates email logic
- Async job queue (optional, Phase 2+): Spring Scheduler triggers emails in background

**Alternatives Considered**:
- SMTP (localhost): Not viable in containerized environment without mail server
- No notifications: Risks customer support burden (where's my order?)

---

## 13. Database Backup & Disaster Recovery

### Strategy
- **Automated backups**: Render PostgreSQL free-tier includes daily backups (7-day retention)
- **Backup testing**: Manual restore from backup quarterly
- **Data retention**: Keep orders indefinitely (audit trail); archive old backups annually

**Alternatives Considered**:
- No backups: Unacceptable for e-commerce (financial data loss)
- Manual dumps: Unreliable; too error-prone

---

## Summary of Key Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Stripe payments | Simplifies PCI compliance | 2.9% transaction fee |
| PostgreSQL + Flyway | ACID guarantees, version control | Requires schema versioning discipline |
| TanStack Query + Context | Simplicity + scalability | Overkill if scope shrinks to static site |
| Tailwind + MUI | Faster development, polished UI | Larger CSS/JS bundle than Tailwind alone |
| Render free-tier | No cost, quick to deploy | Resource constraints, requires optimization |
| Pessimistic locking | Prevents overselling | Slightly lower checkout throughput |

---

## Resolved Unknowns from Specification

✅ **Payment Processor**: Stripe (PCI-compliant, developer-friendly)  
✅ **Session Storage**: Hybrid localStorage + database  
✅ **Inventory Concurrency**: Pessimistic row locking  
✅ **Frontend State**: TanStack Query + Context API  
✅ **Deployment Target**: Render free-tier with JVM optimization  
✅ **Email Service**: SendGrid or AWS SES  
✅ **Logging/Monitoring**: SLF4J structured logging, basic Spring Boot metrics  

All NEEDS CLARIFICATION items from the specification have been resolved and documented above.
