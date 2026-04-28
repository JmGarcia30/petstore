# Authentication & User API Contract

**Version**: 1.0  
**Base URL**: `http://localhost:8080/api/v1`  
**Content-Type**: `application/json`

---

## 1. Register User

### Endpoint

```
POST /api/v1/auth/register
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | Valid email format, < 255 chars, unique | User email address |
| `password` | string | Yes | >= 8 chars, 1 uppercase, 1 digit, 1 special char | Strong password |
| `firstName` | string | No | < 100 chars | User's given name |
| `lastName` | string | No | < 100 chars | User's family name |

### Response (201 Created)

```json
{
  "data": {
    "id": 5,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2026-04-28T10:00:00Z"
  },
  "message": "User registered successfully"
}
```

### Response (400 Bad Request) - Invalid Email

```json
{
  "error": "BAD_REQUEST",
  "message": "Email must be a valid email format",
  "field": "email",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (400 Bad Request) - Weak Password

```json
{
  "error": "BAD_REQUEST",
  "message": "Password must be at least 8 characters and contain uppercase, digit, and special character",
  "field": "password",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (409 Conflict) - Email Exists

```json
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "Email 'john@example.com' is already registered",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 2. Login

### Endpoint

```
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

### Response (200 OK)

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": 5,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "message": "Login successful"
}
```

### Response (401 Unauthorized) - Invalid Credentials

```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

### Response (400 Bad Request) - Missing Fields

```json
{
  "error": "BAD_REQUEST",
  "message": "Email and password are required",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 3. Logout

### Endpoint

```
POST /api/v1/auth/logout
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |

### Response (200 OK)

```json
{
  "message": "Logout successful"
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

## 4. Refresh Token

### Endpoint

```
POST /api/v1/auth/refresh
```

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK)

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Response (401 Unauthorized)

```json
{
  "error": "INVALID_REFRESH_TOKEN",
  "message": "Refresh token is invalid or expired",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 5. Get User Profile

### Endpoint

```
GET /api/v1/users/profile
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |

### Response (200 OK)

```json
{
  "data": {
    "id": 5,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-123-4567",
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

## 6. Update User Profile

### Endpoint

```
PUT /api/v1/users/profile
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |
| `Content-Type` | Yes | application/json |

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567"
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `firstName` | string | No | < 100 chars | Updated first name |
| `lastName` | string | No | < 100 chars | Updated last name |
| `phone` | string | No | < 20 chars | Contact phone number |

### Response (200 OK)

```json
{
  "data": {
    "id": 5,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-123-4567",
    "updatedAt": "2026-04-28T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Response (400 Bad Request)

```json
{
  "error": "BAD_REQUEST",
  "message": "First name must be less than 100 characters",
  "field": "firstName",
  "timestamp": "2026-04-28T10:00:00Z"
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

## 7. Get User Addresses

### Endpoint

```
GET /api/v1/users/addresses
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 10,
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "US",
      "isDefault": true,
      "createdAt": "2026-04-28T10:00:00Z"
    },
    {
      "id": 11,
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US",
      "isDefault": false,
      "createdAt": "2026-04-28T10:05:00Z"
    }
  ]
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

## 8. Add User Address

### Endpoint

```
POST /api/v1/users/addresses
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | JWT token |
| `Content-Type` | Yes | application/json |

### Request Body

```json
{
  "street": "789 Elm Blvd",
  "city": "Seattle",
  "state": "WA",
  "postalCode": "98101",
  "country": "US",
  "isDefault": false
}
```

### Response (201 Created)

```json
{
  "data": {
    "id": 12,
    "street": "789 Elm Blvd",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "country": "US",
    "isDefault": false,
    "createdAt": "2026-04-28T10:30:00Z"
  },
  "message": "Address added successfully"
}
```

### Response (400 Bad Request)

```json
{
  "error": "BAD_REQUEST",
  "message": "All address fields are required",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 9. Update User Address

### Endpoint

```
PUT /api/v1/users/addresses/{id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | long | Address ID |

### Request Body

```json
{
  "street": "789 Elm Blvd",
  "city": "Seattle",
  "state": "WA",
  "postalCode": "98101",
  "country": "US",
  "isDefault": true
}
```

### Response (200 OK)

```json
{
  "data": {
    "id": 12,
    "street": "789 Elm Blvd",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "country": "US",
    "isDefault": true,
    "updatedAt": "2026-04-28T10:30:00Z"
  },
  "message": "Address updated successfully"
}
```

### Response (404 Not Found)

```json
{
  "error": "ADDRESS_NOT_FOUND",
  "message": "Address with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## 10. Delete User Address

### Endpoint

```
DELETE /api/v1/users/addresses/{id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | long | Address ID |

### Response (204 No Content)

```
(empty body)
```

### Response (404 Not Found)

```json
{
  "error": "ADDRESS_NOT_FOUND",
  "message": "Address with ID 999 not found",
  "timestamp": "2026-04-28T10:00:00Z"
}
```

---

## Object Schemas

### User Object

```json
{
  "id": "long",
  "email": "string",
  "firstName": "string or null",
  "lastName": "string or null",
  "phone": "string or null",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

### Address Object

```json
{
  "id": "long",
  "street": "string",
  "city": "string",
  "state": "string (2-char state code)",
  "postalCode": "string",
  "country": "string (2-char ISO code)",
  "isDefault": "boolean",
  "createdAt": "ISO 8601 datetime"
}
```

### Auth Response Object

```json
{
  "token": "string (JWT)",
  "refreshToken": "string (JWT)",
  "expiresIn": "integer (seconds)",
  "user": "User object"
}
```

---

## JWT Token Details

- **Algorithm**: HS256
- **Expiration**: 1 hour (3600 seconds)
- **Refresh Token Expiration**: 30 days
- **Claims**: user_id, email, roles (empty for users)
- **Location**: Sent in Authorization header as `Bearer {token}`

---

## Notes

- **Password Hashing**: bcrypt with cost 12
- **Email Verification**: Not required for v1 (optional for v2)
- **Password Reset**: Not in scope for v1
- **Social Login**: Not in scope for v1
- **Address Validation**: Basic validation only; advanced USPS validation out of scope
- **Default Address**: Only one address per user can be default; setting isDefault=true on an address unsets other defaults

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |
