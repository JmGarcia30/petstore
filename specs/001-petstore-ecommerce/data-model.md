# Phase 1 Data Model: Petstore E-Commerce Database Schema

**Date**: April 28, 2026  
**Status**: Complete  
**Output**: Database schema design, JPA entity mappings, migration strategy

## Entity-Relationship Diagram (Conceptual)

```
User (1) ──────────(N) Address
  │
  ├─────────────────(N) Cart
  │                      │
  │                      └──────(N) CartItem ──(N)─ Pet
  │
  └─────────────────(N) Order
                          │
                          ├──────(N) OrderItem ──(N)─ Pet
                          │
                          └──────(1) Payment

Category (1) ──────────(N) Pet
```

---

## Entity Definitions

### 1. Category

**Purpose**: Pet type grouping for catalog navigation

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | `@Column(nullable = false, unique = true)` | E.g., "Dogs", "Cats" |
| `description` | TEXT | NULL | `@Column(columnDefinition = "TEXT")` | Optional category description |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Audit trail |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | `@UpdateTimestamp` | Audit trail |

**Indexes**:
- `UNIQUE INDEX idx_category_name (name)` - Prevent duplicate categories

**JPA Entity**:
```java
@Entity
@Table(name = "category", indexes = {
    @Index(name = "idx_category_name", columnList = "name", unique = true)
})
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Pet> pets = new ArrayList<>();
}
```

---

### 2. Pet

**Purpose**: Product inventory for sale

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `category_id` | BIGINT | NOT NULL, FK(category.id) | `@ManyToOne @JoinColumn(name = "category_id")` | Links to category |
| `name` | VARCHAR(255) | NOT NULL | `@Column(nullable = false, length = 255)` | Pet display name |
| `species` | VARCHAR(50) | NOT NULL | `@Column(nullable = false, length = 50)` | E.g., "Dog", "Cat", "Bird", "Fish" |
| `breed` | VARCHAR(100) | NULL | `@Column(length = 100)` | E.g., "Golden Retriever", "Siamese" |
| `age_months` | INT | NULL | `@Column(name = "age_months")` | Age in months |
| `description` | TEXT | NULL | `@Column(columnDefinition = "TEXT")` | Product description |
| `health_status` | VARCHAR(50) | NOT NULL, DEFAULT 'healthy' | `@Enumerated(EnumType.STRING)` | healthy, vaccinated, needs_vet, etc. |
| `price` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | `@Column(nullable = false, precision = 10, scale = 2)` | Unit price in USD |
| `stock_quantity` | INT | NOT NULL, DEFAULT 0, CHECK >= 0 | `@Column(nullable = false)` | Available units |
| `image_url` | VARCHAR(500) | NULL | `@Column(length = 500)` | S3 or CDN URL |
| `is_available_for_sale` | BOOLEAN | NOT NULL, DEFAULT true | `@Column(nullable = false)` | Can be added to cart |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Audit trail |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | `@UpdateTimestamp` | Audit trail |

**Indexes**:
- `INDEX idx_pet_category_id (category_id)` - Fast category filtering
- `INDEX idx_pet_name_search (name)` - Name-based search
- `INDEX idx_pet_is_available (is_available_for_sale)` - Filter available pets

**JPA Entity**:
```java
@Entity
@Table(name = "pet", indexes = {
    @Index(name = "idx_pet_category_id", columnList = "category_id"),
    @Index(name = "idx_pet_name_search", columnList = "name"),
    @Index(name = "idx_pet_is_available", columnList = "is_available_for_sale")
})
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String species;
    
    @Column(length = 100)
    private String breed;
    
    @Column(name = "age_months")
    private Integer ageMonths;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HealthStatus healthStatus = HealthStatus.HEALTHY;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stockQuantity = 0;
    
    @Column(length = 500)
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean isAvailableForSale = true;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<CartItem> cartItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();
}

enum HealthStatus {
    HEALTHY, VACCINATED, NEEDS_VET, RECOVERING
}
```

---

### 3. User

**Purpose**: Customer account and authentication

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column(nullable = false, unique = true, length = 255)` | Login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | `@Column(nullable = false, length = 255)` | bcrypt hash (cost 12) |
| `first_name` | VARCHAR(100) | NULL | `@Column(length = 100)` | Given name |
| `last_name` | VARCHAR(100) | NULL | `@Column(length = 100)` | Family name |
| `phone` | VARCHAR(20) | NULL | `@Column(length = 20)` | Contact phone |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | `@Column(nullable = false)` | Soft delete flag |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Account creation date |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | `@UpdateTimestamp` | Last modified date |

**Indexes**:
- `UNIQUE INDEX idx_user_email (email)` - Unique login
- `INDEX idx_user_is_active (is_active)` - Filter active users

**JPA Entity**:
```java
@Entity
@Table(name = "user", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_is_active", columnList = "is_active")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(length = 100)
    private String firstName;
    
    @Column(length = 100)
    private String lastName;
    
    @Column(length = 20)
    private String phone;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> addresses = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Cart> carts = new ArrayList<>();
}
```

---

### 4. Address

**Purpose**: Shipping and billing address storage

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `user_id` | BIGINT | NOT NULL, FK(user.id) | `@ManyToOne @JoinColumn(name = "user_id")` | Links to user |
| `street` | VARCHAR(255) | NOT NULL | `@Column(nullable = false, length = 255)` | Street address |
| `city` | VARCHAR(100) | NOT NULL | `@Column(nullable = false, length = 100)` | City name |
| `state` | VARCHAR(50) | NOT NULL | `@Column(nullable = false, length = 50)` | State/Province code (e.g., "CA") |
| `postal_code` | VARCHAR(20) | NOT NULL | `@Column(nullable = false, length = 20)` | Zip/postal code |
| `country` | VARCHAR(2) | NOT NULL, DEFAULT 'US' | `@Column(nullable = false, length = 2)` | ISO 3166-1 alpha-2 code |
| `is_default` | BOOLEAN | NOT NULL, DEFAULT false | `@Column(nullable = false)` | Default shipping address |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Audit trail |

**Indexes**:
- `INDEX idx_address_user_id (user_id)` - Fast user address lookup
- `INDEX idx_address_is_default (user_id, is_default)` - Default address lookup

**JPA Entity**:
```java
@Entity
@Table(name = "address", indexes = {
    @Index(name = "idx_address_user_id", columnList = "user_id"),
    @Index(name = "idx_address_is_default", columnList = "user_id,is_default")
})
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 255)
    private String street;
    
    @Column(nullable = false, length = 100)
    private String city;
    
    @Column(nullable = false, length = 50)
    private String state;
    
    @Column(nullable = false, length = 20)
    private String postalCode;
    
    @Column(nullable = false, length = 2)
    private String country = "US";
    
    @Column(nullable = false)
    private Boolean isDefault = false;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

---

### 5. Cart

**Purpose**: Shopping session container (active, not yet purchased)

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `user_id` | BIGINT | NULL, FK(user.id) | `@ManyToOne @JoinColumn(name = "user_id")` | NULL for guest carts |
| `session_id` | VARCHAR(50) | NOT NULL, UNIQUE | `@Column(nullable = false, unique = true, length = 50)` | ULID for guest tracking |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Cart creation date |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | `@UpdateTimestamp` | Last modified date |

**Indexes**:
- `UNIQUE INDEX idx_cart_session_id (session_id)` - Guest cart lookup
- `INDEX idx_cart_user_id (user_id)` - User cart lookup

**JPA Entity**:
```java
@Entity
@Table(name = "cart", indexes = {
    @Index(name = "idx_cart_session_id", columnList = "session_id", unique = true),
    @Index(name = "idx_cart_user_id", columnList = "user_id")
})
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, unique = true, length = 50)
    private String sessionId;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
    
    @Transient
    public BigDecimal getTotal() {
        return items.stream()
            .map(CartItem::getLineTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

---

### 6. CartItem

**Purpose**: Individual pet entry in a shopping cart

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `cart_id` | BIGINT | NOT NULL, FK(cart.id) | `@ManyToOne @JoinColumn(name = "cart_id")` | Links to cart |
| `pet_id` | BIGINT | NOT NULL, FK(pet.id) | `@ManyToOne @JoinColumn(name = "pet_id")` | Links to pet |
| `quantity` | INT | NOT NULL, CHECK > 0 | `@Column(nullable = false)` | Number of units |
| `price_at_add` | DECIMAL(10,2) | NOT NULL | `@Column(nullable = false, precision = 10, scale = 2)` | Price snapshot at add time |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | When added to cart |

**Indexes**:
- `INDEX idx_cartitem_cart_id (cart_id)` - Fast cart item lookup
- `UNIQUE INDEX idx_cartitem_cart_pet (cart_id, pet_id)` - Prevent duplicate entries

**JPA Entity**:
```java
@Entity
@Table(name = "cart_item", indexes = {
    @Index(name = "idx_cartitem_cart_id", columnList = "cart_id"),
    @Index(name = "idx_cartitem_cart_pet", columnList = "cart_id,pet_id", unique = true)
})
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtAdd;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedAt;
    
    @Transient
    public BigDecimal getLineTotal() {
        return priceAtAdd.multiply(new BigDecimal(quantity));
    }
}
```

---

### 7. Order

**Purpose**: Completed purchase transaction

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `user_id` | BIGINT | NOT NULL, FK(user.id) | `@ManyToOne @JoinColumn(name = "user_id")` | Links to user (never null for audit) |
| `order_number` | VARCHAR(50) | NOT NULL, UNIQUE | `@Column(nullable = false, unique = true, length = 50)` | Public order ID (e.g., "ORD-20260428-0001") |
| `subtotal` | DECIMAL(10,2) | NOT NULL | `@Column(nullable = false, precision = 10, scale = 2)` | Sum of items before tax/shipping |
| `shipping_cost` | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | `@Column(nullable = false, precision = 10, scale = 2)` | Shipping fee |
| `tax` | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | `@Column(nullable = false, precision = 10, scale = 2)` | Sales tax |
| `total_price` | DECIMAL(10,2) | NOT NULL | `@Column(nullable = false, precision = 10, scale = 2)` | Final total (subtotal + shipping + tax) |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'pending' | `@Enumerated(EnumType.STRING)` | pending, confirmed, shipped, delivered, cancelled |
| `shipping_address_id` | BIGINT | NOT NULL, FK(address.id) | `@ManyToOne @JoinColumn(name = "shipping_address_id")` | Denormalized address snapshot |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Order creation date |
| `confirmed_at` | TIMESTAMP | NULL | `@Column` | Payment confirmation date |
| `shipped_at` | TIMESTAMP | NULL | `@Column` | Shipment date |
| `estimated_delivery_at` | TIMESTAMP | NULL | `@Column` | Expected delivery date |

**Indexes**:
- `UNIQUE INDEX idx_order_number (order_number)` - Public order lookup
- `INDEX idx_order_user_id (user_id)` - User order history
- `INDEX idx_order_status (status)` - Filter by status

**JPA Entity**:
```java
@Entity
@Table(name = "order", indexes = {
    @Index(name = "idx_order_number", columnList = "order_number", unique = true),
    @Index(name = "idx_order_user_id", columnList = "user_id"),
    @Index(name = "idx_order_status", columnList = "status")
})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, unique = true, length = 50)
    private String orderNumber;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCost = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id", nullable = false)
    private Address shippingAddress;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime confirmedAt;
    
    @Column
    private LocalDateTime shippedAt;
    
    @Column
    private LocalDateTime estimatedDeliveryAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;
}

enum OrderStatus {
    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
}
```

---

### 8. OrderItem

**Purpose**: Individual pet in a completed order

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `order_id` | BIGINT | NOT NULL, FK(order.id) | `@ManyToOne @JoinColumn(name = "order_id")` | Links to order |
| `pet_id` | BIGINT | NOT NULL, FK(pet.id) | `@ManyToOne @JoinColumn(name = "pet_id")` | Links to pet (denormalized) |
| `quantity` | INT | NOT NULL, CHECK > 0 | `@Column(nullable = false)` | Quantity purchased |
| `price_at_purchase` | DECIMAL(10,2) | NOT NULL | `@Column(nullable = false, precision = 10, scale = 2)` | Price at purchase time |

**Indexes**:
- `INDEX idx_orderitem_order_id (order_id)` - Fast order item lookup

**JPA Entity**:
```java
@Entity
@Table(name = "order_item", indexes = {
    @Index(name = "idx_orderitem_order_id", columnList = "order_id")
})
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;
    
    @Transient
    public BigDecimal getLineTotal() {
        return priceAtPurchase.multiply(new BigDecimal(quantity));
    }
}
```

---

### 9. Payment

**Purpose**: Payment transaction tracking and Stripe integration

**Fields**:

| Column | Type | Constraints | JPA Mapping | Notes |
|--------|------|-------------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, AUTO INCREMENT | `@Id @GeneratedValue` | Unique identifier |
| `order_id` | BIGINT | NOT NULL, UNIQUE, FK(order.id) | `@OneToOne @JoinColumn(name = "order_id")` | Links to order (1:1 relationship) |
| `payment_method` | VARCHAR(50) | NOT NULL | `@Column(nullable = false, length = 50)` | E.g., "credit_card", "paypal", "bank_transfer" |
| `amount` | DECIMAL(10,2) | NOT NULL | `@Column(nullable = false, precision = 10, scale = 2)` | Amount charged |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'pending' | `@Enumerated(EnumType.STRING)` | pending, succeeded, failed, cancelled |
| `transaction_id` | VARCHAR(255) | NULL | `@Column(length = 255)` | Stripe payment intent ID (e.g., "pi_1234567890") |
| `idempotency_key` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column(nullable = false, unique = true, length = 255)` | UUID for retry safety |
| `processed_at` | TIMESTAMP | NULL | `@Column` | Timestamp when payment was processed |
| `error_message` | TEXT | NULL | `@Column(columnDefinition = "TEXT")` | Error details if failed |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | `@CreationTimestamp` | Payment creation date |

**Indexes**:
- `UNIQUE INDEX idx_payment_order_id (order_id)` - Payment lookup by order
- `INDEX idx_payment_status (status)` - Filter by status
- `UNIQUE INDEX idx_payment_idempotency (idempotency_key)` - Idempotency protection

**JPA Entity**:
```java
@Entity
@Table(name = "payment", indexes = {
    @Index(name = "idx_payment_order_id", columnList = "order_id", unique = true),
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_idempotency", columnList = "idempotency_key", unique = true)
})
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
    
    @Column(nullable = false, length = 50)
    private String paymentMethod;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(length = 255)
    private String transactionId;
    
    @Column(nullable = false, unique = true, length = 255)
    private String idempotencyKey;
    
    @Column
    private LocalDateTime processedAt;
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

enum PaymentStatus {
    PENDING, SUCCEEDED, FAILED, CANCELLED
}
```

---

## Database Migration Strategy

### Flyway Integration

**Path**: `backend/src/main/resources/db/migration/`

**Naming Convention**: `V{version}__{description}.sql`
- Example: `V1__init.sql`, `V2__add_pet_images.sql`, `V3__create_order_tables.sql`

### Seed Data

**File**: `V1__init.sql` includes INSERT statements for initial category and pet data

```sql
INSERT INTO category (name, description, created_at, updated_at) VALUES
('Dogs', 'Friendly canine companions', NOW(), NOW()),
('Cats', 'Independent feline friends', NOW(), NOW()),
('Birds', 'Colorful feathered pets', NOW(), NOW()),
('Fishes', 'Aquatic companions', NOW(), NOW());

INSERT INTO pet (category_id, name, species, breed, age_months, description, health_status, price, stock_quantity, image_url, is_available_for_sale, created_at, updated_at) VALUES
(1, 'Golden Retriever Puppy', 'Dog', 'Golden Retriever', 6, 'Friendly and energetic...', 'vaccinated', 1500.00, 5, 'https://...', true, NOW(), NOW()),
-- ... more seed data
```

### Rollback & Safety

- Flyway supports versioned migrations only (no automatic rollback)
- Rollback strategy: Create new migration with UNDO logic (e.g., `V4__undo_v3.sql`)
- Tested in local environment before production deployment

---

## Performance Considerations

### Indexes

Optimized for common query patterns:
- **Category filtering**: `idx_pet_category_id` on Pet.category_id
- **Availability filtering**: `idx_pet_is_available` for catalog browsing
- **Search**: `idx_pet_name_search` for name-based queries
- **User lookups**: `idx_user_email` for login, `idx_address_user_id` for address retrieval
- **Order history**: `idx_order_user_id`, `idx_order_status`

### Query Optimization

- N+1 problem avoided with `@ManyToOne(fetch = FetchType.LAZY)` and explicit JOIN FETCH in queries
- Pagination applied to catalog endpoints (`LIMIT 20` default)
- Denormalized fields in Order (shipping_address_id) to avoid multi-table JOINs

### Database Connection Pooling

- HikariCP (Spring Boot default)
- Pool size: 10 connections (optimized for free-tier Render instance)
- Maximum lifetime: 30 minutes

---

## Constraints & Validations

### Database Constraints

- **Primary Keys**: All entities have `BIGINT` primary key with auto-increment
- **Foreign Keys**: Enforced at database level with `ON DELETE CASCADE` for audit tables
- **Unique Constraints**: `category.name`, `user.email`, `order.order_number`, `payment.transaction_id`
- **Check Constraints**: `pet.price > 0`, `pet.stock_quantity >= 0`, `cartitem.quantity > 0`, `payment.amount > 0`

### Application Validations

Enforced via JPA/Hibernate validators:

```java
// User entity
@NotBlank(message = "Email is required")
@Email(message = "Email must be valid")
private String email;

// Pet entity
@NotNull
@Positive(message = "Price must be greater than 0")
private BigDecimal price;

// Cart item
@NotNull
@Positive(message = "Quantity must be at least 1")
private Integer quantity;
```

---

## Summary

The data model provides:
✅ Normalized relational schema preventing anomalies  
✅ Support for guest and authenticated users  
✅ Inventory management with pessimistic locking capability  
✅ Order tracking and payment transaction audit trail  
✅ Performance-optimized indexes for common queries  
✅ Flyway migrations for version-controlled schema evolution  
✅ JPA entity mappings with lazy loading and cascade rules  

Migration files ready to execute on database initialization.
