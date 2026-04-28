# Products API Contract

**Version**: 1.0  
**Base URL**: `http://localhost:8080/api/v1`  
**Content-Type**: `application/json`

---

## 1. List All Pets (with Filtering & Pagination)

### Endpoint

```
GET /api/v1/pets
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 0 | Zero-indexed page number |
| `pageSize` | integer | No | 20 | Items per page (max 100) |
| `category` | string | No | - | Filter by category ID or name (e.g., "Dogs", "1") |
| `sort` | string | No | "name" | Sort field: `name`, `price`, `createdAt` |
| `order` | string | No | "asc" | Sort order: `asc`, `desc` |
| `search` | string | No | - | Search by pet name or breed (partial match, case-insensitive) |
| `minPrice` | number | No | - | Filter by minimum price (inclusive) |
| `maxPrice` | number | No | - | Filter by maximum price (inclusive) |
| `inStockOnly` | boolean | No | false | Show only in-stock pets |

### Request Example

```bash
GET /api/v1/pets?page=0&pageSize=10&category=Dogs&sort=price&order=asc&inStockOnly=true
```

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Golden Retriever Puppy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "ageMonths": 6,
      "description": "Friendly and energetic puppy, great with families",
      "price": 1500.00,
      "healthStatus": "vaccinated",
      "stockStatus": "in_stock",
      "imageUrl": "https://cdn.example.com/pets/1.jpg",
      "categoryId": 1,
      "categoryName": "Dogs",
      "createdAt": "2026-04-28T10:00:00Z",
      "updatedAt": "2026-04-28T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Labrador Retriever",
      "species": "Dog",
      "breed": "Labrador Retriever",
      "ageMonths": 12,
      "description": "Loyal and intelligent companion",
      "price": 1200.00,
      "healthStatus": "healthy",
      "stockStatus": "low_stock",
      "imageUrl": "https://cdn.example.com/pets/2.jpg",
      "categoryId": 1,
      "categoryName": "Dogs",
      "createdAt": "2026-04-28T11:00:00Z",
      "updatedAt": "2026-04-28T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 0,
    "pageSize": 10,
    "totalElements": 152,
    "totalPages": 16,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Response (400 Bad Request)

```json
{
  "error": "BAD_REQUEST",
  "message": "Invalid page parameter: must be >= 0",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Error Codes

| Code | Message | Cause |
|------|---------|-------|
| `BAD_REQUEST` | Invalid query parameters | page < 0, pageSize > 100, invalid sort field |
| `UNAUTHORIZED` | User not authenticated | Token missing or invalid (if endpoint becomes protected) |

---

## 2. Get Pet Categories

### Endpoint

```
GET /api/v1/categories
```

### Query Parameters

None

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Dogs",
      "description": "Friendly canine companions"
    },
    {
      "id": 2,
      "name": "Cats",
      "description": "Independent feline friends"
    },
    {
      "id": 3,
      "name": "Birds",
      "description": "Colorful feathered pets"
    },
    {
      "id": 4,
      "name": "Fishes",
      "description": "Aquatic companions"
    }
  ]
}
```

---

## 3. Get Pet Details

### Endpoint

```
GET /api/v1/pets/{id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | long | Pet ID |

### Response (200 OK)

```json
{
  "data": {
    "id": 1,
    "name": "Golden Retriever Puppy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "ageMonths": 6,
    "description": "Friendly and energetic puppy, great with families. Fully vaccinated and microchipped.",
    "price": 1500.00,
    "healthStatus": "vaccinated",
    "stockQuantity": 5,
    "stockStatus": "in_stock",
    "imageUrl": "https://cdn.example.com/pets/1.jpg",
    "categoryId": 1,
    "categoryName": "Dogs",
    "createdAt": "2026-04-28T10:00:00Z",
    "updatedAt": "2026-04-28T10:00:00Z"
  }
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

### Error Codes

| Code | Message | Cause |
|------|---------|-------|
| `PET_NOT_FOUND` | Pet with ID {id} not found | Invalid pet ID |
| `BAD_REQUEST` | Pet ID must be a positive integer | Invalid ID format |

---

## 4. Search Pets

### Endpoint

```
GET /api/v1/pets/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (pet name, breed, species) |
| `page` | integer | No | Page number (default 0) |
| `pageSize` | integer | No | Items per page (default 20, max 100) |

### Request Example

```bash
GET /api/v1/pets/search?q=golden&page=0&pageSize=10
```

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Golden Retriever Puppy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "price": 1500.00,
      "imageUrl": "https://cdn.example.com/pets/1.jpg",
      "categoryId": 1,
      "categoryName": "Dogs"
    }
  ],
  "pagination": {
    "page": 0,
    "pageSize": 10,
    "totalElements": 3,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

### Response (400 Bad Request)

```json
{
  "error": "BAD_REQUEST",
  "message": "Search query 'q' is required",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## Response Schema Reference

### Pet Object

```json
{
  "id": "long",
  "name": "string",
  "species": "string (Dog|Cat|Bird|Fish)",
  "breed": "string or null",
  "ageMonths": "integer or null",
  "description": "string or null",
  "price": "decimal (2 places)",
  "healthStatus": "string (healthy|vaccinated|needs_vet|recovering)",
  "stockQuantity": "integer (>= 0)",
  "stockStatus": "string (in_stock|low_stock|out_of_stock)",
  "imageUrl": "string or null",
  "categoryId": "long",
  "categoryName": "string",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

### Category Object

```json
{
  "id": "long",
  "name": "string (unique)",
  "description": "string or null"
}
```

### Error Object

```json
{
  "error": "string (error code)",
  "message": "string (human-readable message)",
  "timestamp": "ISO 8601 datetime",
  "path": "string (endpoint path, optional)"
}
```

### Pagination Object

```json
{
  "page": "integer (0-indexed)",
  "pageSize": "integer",
  "totalElements": "integer",
  "totalPages": "integer",
  "hasNext": "boolean",
  "hasPrevious": "boolean"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Caching Strategy

- **Cache-Control**: `max-age=300` (5 minutes) for GET requests
- **ETag**: Included in response headers for conditional requests
- **Last-Modified**: Included for cache validation

---

## Notes

- All timestamps are in UTC (ISO 8601 format)
- Decimal prices always include 2 decimal places
- Search is case-insensitive and supports partial matches
- Filtering is additive (all filters applied with AND logic)
- Sort direction applies to the selected sort field
