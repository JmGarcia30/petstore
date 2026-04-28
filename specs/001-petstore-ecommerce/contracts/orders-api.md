# Orders & Checkout API Contract

**Version**: 1.0  
**Base URL**: `http://localhost:8080/api/v1`  
**Content-Type**: `application/json`

---

## 1. Initiate Checkout

### Endpoint

```
POST /api/v1/checkout
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | JWT token for authenticated users |
| `X-Session-Id` | No | Guest session ID |
| `Content-Type` | Yes | application/json |

### Request Body

```json
{
  "email": "john@example.com",
  "shippingAddressId": 10,
  "billingAddressId": 10,
  "useSameForBilling": true
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Conditional | Required for guests; optional for authenticated users |
| `shippingAddressId` | long | Yes | User's address ID (for authenticated users) |
| `billingAddressId` | long | Conditional | Required if useSameForBilling = false |
| `useSameForBilling` | boolean | No | Use shipping address for billing (default: true) |

### Response (200 OK)

```json
{
  "data": {
    "checkoutSessionId": "checkout_abc123",
    "subtotal": 3800.00,
    "shippingCost": 25.00,
    "estimatedTax": 305.00,
    "total": 4130.00,
    "shippingEstimate": "2-5 business days",
    "items": [
      {
        "petId": 1,
        "petName": "Golden Retriever Puppy",
        "quantity": 2,
        "pricePerUnit": 1500.00,
        "subtotal": 3000.00
      },
      {
        "petId": 3,
        "petName": "Siamese Cat",
        "quantity": 1,
        "pricePerUnit": 800.00,
        "subtotal": 800.00
      }
    ]
  }
}
```

### Response (400 Bad Request) - Empty Cart

```json
{
  "error": "EMPTY_CART",
  "message": "Cannot checkout with empty cart",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (400 Bad Request) - Invalid Address

```json
{
  "error": "INVALID_SHIPPING_ADDRESS",
  "message": "Shipping address is invalid or unsupported region",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (404 Not Found) - Address Not Found

```json
{
  "error": "ADDRESS_NOT_FOUND",
  "message": "Shipping address with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict) - Stock Issue

```json
{
  "error": "OUT_OF_STOCK",
  "message": "Item 'Golden Retriever Puppy' is no longer available",
  "unavailableItems": [
    {
      "petId": 1,
      "petName": "Golden Retriever Puppy",
      "reason": "out_of_stock"
    }
  ],
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 2. Create Order

### Endpoint

```
POST /api/v1/orders
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | JWT token for authenticated users |
| `X-Session-Id` | No | Guest session ID |
| `Content-Type` | Yes | application/json |
| `Idempotency-Key` | Yes | UUID for preventing duplicate orders |

### Request Body

```json
{
  "checkoutSessionId": "checkout_abc123",
  "paymentMethodId": "pm_1234567890",
  "email": "john@example.com",
  "phone": "+1-555-123-4567"
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `checkoutSessionId` | string | Yes | From checkout response |
| `paymentMethodId` | string | Yes | Stripe payment method ID (from Stripe Elements) |
| `email` | string | Conditional | Required for guests |
| `phone` | string | No | Contact phone for order |

### Response (201 Created)

```json
{
  "data": {
    "id": 150,
    "orderNumber": "ORD-20260428-0001",
    "userId": 5,
    "status": "confirmed",
    "subtotal": 3800.00,
    "shippingCost": 25.00,
    "tax": 305.00,
    "total": 4130.00,
    "items": [
      {
        "petId": 1,
        "petName": "Golden Retriever Puppy",
        "quantity": 2,
        "priceAtPurchase": 1500.00,
        "lineTotal": 3000.00
      },
      {
        "petId": 3,
        "petName": "Siamese Cat",
        "quantity": 1,
        "priceAtPurchase": 800.00,
        "lineTotal": 800.00
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "US"
    },
    "createdAt": "2026-04-28T10:30:00Z",
    "estimatedDeliveryAt": "2026-05-03T23:59:59Z",
    "confirmationToken": "conf_abc123xyz"
  },
  "message": "Order created successfully. Confirmation email sent to john@example.com"
}
```

### Response (400 Bad Request) - Invalid Session

```json
{
  "error": "INVALID_CHECKOUT_SESSION",
  "message": "Checkout session 'checkout_abc123' is invalid or expired",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (400 Bad Request) - Missing Payment Method

```json
{
  "error": "BAD_REQUEST",
  "message": "Payment method ID is required",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict) - Duplicate Order

```json
{
  "error": "DUPLICATE_REQUEST",
  "message": "Order already created with this Idempotency-Key",
  "existingOrderNumber": "ORD-20260428-0001",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (402 Payment Required) - Payment Failed

```json
{
  "error": "PAYMENT_FAILED",
  "message": "Payment processing failed: card_declined",
  "paymentError": {
    "code": "card_declined",
    "message": "Your card was declined",
    "declineCode": "generic_decline"
  },
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 3. Get Order History

### Endpoint

```
GET /api/v1/orders
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 0 | Page number (0-indexed) |
| `pageSize` | integer | No | 10 | Items per page |
| `status` | string | No | - | Filter by status: pending, confirmed, shipped, delivered, cancelled |
| `sort` | string | No | "createdAt" | Sort field: createdAt, total, status |
| `order` | string | No | "desc" | Sort order: asc, desc |

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 150,
      "orderNumber": "ORD-20260428-0001",
      "status": "confirmed",
      "subtotal": 3800.00,
      "total": 4130.00,
      "itemCount": 3,
      "createdAt": "2026-04-28T10:30:00Z",
      "estimatedDeliveryAt": "2026-05-03T23:59:59Z"
    },
    {
      "id": 149,
      "orderNumber": "ORD-20260427-0005",
      "status": "delivered",
      "subtotal": 1500.00,
      "total": 1605.00,
      "itemCount": 1,
      "createdAt": "2026-04-27T15:00:00Z",
      "deliveredAt": "2026-04-30T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 0,
    "pageSize": 10,
    "totalElements": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

### Response (401 Unauthorized)

```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 4. Get Order Details

### Endpoint

```
GET /api/v1/orders/{orderNumber}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderNumber` | string | Public order number (e.g., "ORD-20260428-0001") |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | JWT token (required if not order creator) |
| `X-Confirmation-Token` | No | Confirmation token (for guest order access) |

### Response (200 OK)

```json
{
  "data": {
    "id": 150,
    "orderNumber": "ORD-20260428-0001",
    "userId": 5,
    "status": "confirmed",
    "subtotal": 3800.00,
    "shippingCost": 25.00,
    "tax": 305.00,
    "total": 4130.00,
    "items": [
      {
        "petId": 1,
        "petName": "Golden Retriever Puppy",
        "quantity": 2,
        "priceAtPurchase": 1500.00,
        "lineTotal": 3000.00
      },
      {
        "petId": 3,
        "petName": "Siamese Cat",
        "quantity": 1,
        "priceAtPurchase": 800.00,
        "lineTotal": 800.00
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "US"
    },
    "payment": {
      "status": "succeeded",
      "method": "credit_card",
      "last4": "4242",
      "processedAt": "2026-04-28T10:30:00Z"
    },
    "timeline": {
      "createdAt": "2026-04-28T10:30:00Z",
      "confirmedAt": "2026-04-28T10:30:00Z",
      "shippedAt": null,
      "estimatedDeliveryAt": "2026-05-03T23:59:59Z",
      "deliveredAt": null
    },
    "trackingNumber": null,
    "trackingUrl": null
  }
}
```

### Response (404 Not Found)

```json
{
  "error": "ORDER_NOT_FOUND",
  "message": "Order 'ORD-20260428-0001' not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (403 Forbidden)

```json
{
  "error": "FORBIDDEN",
  "message": "You do not have access to this order",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 5. Cancel Order

### Endpoint

```
POST /api/v1/orders/{orderNumber}/cancel
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderNumber` | string | Public order number |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |

### Response (200 OK)

```json
{
  "data": {
    "orderNumber": "ORD-20260428-0001",
    "status": "cancelled",
    "cancelledAt": "2026-04-28T10:35:00Z"
  },
  "message": "Order cancelled successfully"
}
```

### Response (400 Bad Request) - Cannot Cancel

```json
{
  "error": "CANNOT_CANCEL_ORDER",
  "message": "Order cannot be cancelled in 'shipped' status",
  "currentStatus": "shipped",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## Object Schemas

### Order Object

```json
{
  "id": "long",
  "orderNumber": "string (ORD-YYYYMMDD-NNNNN)",
  "userId": "long",
  "status": "string (pending|confirmed|shipped|delivered|cancelled)",
  "subtotal": "decimal",
  "shippingCost": "decimal",
  "tax": "decimal",
  "total": "decimal",
  "items": "OrderItem[]",
  "shippingAddress": "Address",
  "payment": "Payment",
  "createdAt": "ISO 8601 datetime",
  "estimatedDeliveryAt": "ISO 8601 datetime",
  "deliveredAt": "ISO 8601 datetime or null"
}
```

### OrderItem Object

```json
{
  "petId": "long",
  "petName": "string",
  "quantity": "integer",
  "priceAtPurchase": "decimal",
  "lineTotal": "decimal"
}
```

### Payment Object

```json
{
  "status": "string (pending|succeeded|failed|cancelled)",
  "method": "string (credit_card|paypal|etc)",
  "last4": "string (last 4 digits of card)",
  "processedAt": "ISO 8601 datetime or null",
  "errorMessage": "string or null"
}
```

---

## Notes

- **Order Numbers**: Generated as ORD-YYYYMMDD-NNNNN (auto-incremented per day)
- **Idempotency**: Order creation is idempotent using Idempotency-Key header; same key returns same order
- **Email Notifications**: Sent to customer immediately on order creation and on status changes
- **Guest Orders**: Guests can view orders with confirmation token; users with JWT token
- **Order Cancellation**: Only possible in pending/confirmed status; shipped/delivered orders cannot be cancelled
- **Refunds**: Not automated; manual processing required (v2 feature)
- **Tax Calculation**: Based on shipping address state and local rates (external tax service)
- **Shipping**: Fixed cost ($25) for MVP; variable shipping (Phase 2+)

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 402 | Payment required |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |
