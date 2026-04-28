# Cart API Contract

**Version**: 1.0  
**Base URL**: `http://localhost:8080/api/v1`  
**Content-Type**: `application/json`

---

## 1. Get Cart

### Endpoint

```
GET /api/v1/cart
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | JWT token for authenticated users; if missing, cart retrieved by session_id cookie |
| `X-Session-Id` | No | Guest session ID (ULID); used if Authorization header not present |

### Response (200 OK)

```json
{
  "data": {
    "id": 123,
    "sessionId": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    "userId": 5,
    "items": [
      {
        "id": 456,
        "petId": 1,
        "petName": "Golden Retriever Puppy",
        "petImageUrl": "https://cdn.example.com/pets/1.jpg",
        "quantity": 2,
        "unitPrice": 1500.00,
        "lineTotal": 3000.00
      },
      {
        "id": 457,
        "petId": 3,
        "petName": "Siamese Cat",
        "petImageUrl": "https://cdn.example.com/pets/3.jpg",
        "quantity": 1,
        "unitPrice": 800.00,
        "lineTotal": 800.00
      }
    ],
    "subtotal": 3800.00,
    "itemCount": 3,
    "createdAt": "2026-04-28T10:00:00Z",
    "updatedAt": "2026-04-28T10:30:00Z"
  }
}
```

### Response (200 OK) - Empty Cart

```json
{
  "data": {
    "id": 123,
    "sessionId": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
    "userId": null,
    "items": [],
    "subtotal": 0.00,
    "itemCount": 0,
    "createdAt": "2026-04-28T10:00:00Z",
    "updatedAt": "2026-04-28T10:00:00Z"
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

## 2. Add Item to Cart

### Endpoint

```
POST /api/v1/cart/items
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | application/json |
| `Authorization` | No | JWT token for authenticated users |
| `X-Session-Id` | No | Guest session ID |

### Request Body

```json
{
  "petId": 1,
  "quantity": 2
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `petId` | long | Yes | > 0 | ID of the pet to add |
| `quantity` | integer | Yes | >= 1, <= 10 | Number of units |

### Response (201 Created)

```json
{
  "data": {
    "id": 458,
    "cartId": 123,
    "petId": 1,
    "petName": "Golden Retriever Puppy",
    "petImageUrl": "https://cdn.example.com/pets/1.jpg",
    "quantity": 2,
    "unitPrice": 1500.00,
    "lineTotal": 3000.00,
    "addedAt": "2026-04-28T10:30:00Z"
  },
  "message": "Pet added to cart successfully"
}
```

### Response (400 Bad Request) - Invalid Quantity

```json
{
  "error": "BAD_REQUEST",
  "message": "Quantity must be between 1 and 10",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (404 Not Found)

```json
{
  "error": "PET_NOT_FOUND",
  "message": "Pet with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict) - Out of Stock

```json
{
  "error": "ITEM_OUT_OF_STOCK",
  "message": "Pet 'Golden Retriever Puppy' is currently out of stock",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict) - Insufficient Stock

```json
{
  "error": "INSUFFICIENT_STOCK",
  "message": "Only 3 units available, but 5 requested",
  "availableQuantity": 3,
  "requestedQuantity": 5,
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Error Codes

| Code | Message | Cause |
|------|---------|-------|
| `BAD_REQUEST` | Quantity must be between 1 and 10 | quantity < 1 or > 10 |
| `PET_NOT_FOUND` | Pet with ID {id} not found | Invalid pet ID |
| `ITEM_OUT_OF_STOCK` | Pet is out of stock | Pet.stockQuantity = 0 |
| `INSUFFICIENT_STOCK` | Insufficient stock available | Pet.stockQuantity < requested quantity |

---

## 3. Update Cart Item Quantity

### Endpoint

```
PUT /api/v1/cart/items/{id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | long | Cart item ID |

### Request Body

```json
{
  "quantity": 3
}
```

### Response (200 OK)

```json
{
  "data": {
    "id": 458,
    "cartId": 123,
    "petId": 1,
    "petName": "Golden Retriever Puppy",
    "quantity": 3,
    "unitPrice": 1500.00,
    "lineTotal": 4500.00
  },
  "message": "Cart item updated successfully"
}
```

### Response (400 Bad Request)

```json
{
  "error": "BAD_REQUEST",
  "message": "Quantity must be between 1 and 10",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (404 Not Found)

```json
{
  "error": "CART_ITEM_NOT_FOUND",
  "message": "Cart item with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict)

```json
{
  "error": "INSUFFICIENT_STOCK",
  "message": "Only 2 units available, but 5 requested",
  "availableQuantity": 2,
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 4. Remove Item from Cart

### Endpoint

```
DELETE /api/v1/cart/items/{id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | long | Cart item ID |

### Response (204 No Content)

```
(empty body)
```

### Response (404 Not Found)

```json
{
  "error": "CART_ITEM_NOT_FOUND",
  "message": "Cart item with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 5. Clear Cart

### Endpoint

```
DELETE /api/v1/cart
```

### Response (204 No Content)

```
(empty body)
```

### Response (200 OK) - Alternative

```json
{
  "message": "Cart cleared successfully"
}
```

---

## Cart Item Object Schema

```json
{
  "id": "long",
  "cartId": "long",
  "petId": "long",
  "petName": "string",
  "petImageUrl": "string or null",
  "quantity": "integer (1-10)",
  "unitPrice": "decimal",
  "lineTotal": "decimal (unitPrice * quantity)",
  "addedAt": "ISO 8601 datetime (optional)"
}
```

---

## Cart Object Schema

```json
{
  "id": "long",
  "sessionId": "string (ULID)",
  "userId": "long or null",
  "items": "CartItem[]",
  "subtotal": "decimal",
  "itemCount": "integer",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

---

## Notes

- **Session Management**: Guests identified by X-Session-Id header or cookie; authenticated users by JWT
- **Cart Merging**: When guest logs in, guest cart items merged with user's database cart (no duplicates)
- **Persistence**: Guest carts stored in browser localStorage (synced via sessionId); user carts in database
- **Quantity Limits**: Max 10 units per item to prevent abuse; backend validates on add/update
- **Stock Validation**: Stock checked against real-time Pet.stockQuantity; cart does not reserve stock until checkout
- **Price Accuracy**: Unit price captured at add-time; reflects current pet price on successful addition
- **Timestamps**: All times in UTC (ISO 8601 format)

---

## Rate Limiting

- **Limit**: 60 cart operations per minute per session/user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No content (success, empty response) |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |
| 409 | Conflict (stock issue, duplicate item) |
| 500 | Server error |
