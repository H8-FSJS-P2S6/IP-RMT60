# IP-RMT60

# SNS NDT Learning Platform API Documentation

This is the server-side API documentation for the SNS NDT Learning Platform, built with Express.js, Sequelize, and PostgreSQL. The API supports user authentication, course management, cart functionality, payment processing with Midtrans, and a Dialogflow-powered chatbot.

---

## Table of Contents
1. [Available Endpoints](#available-endpoints)
2. [Public Endpoints](#public-endpoints)
3. [Authenticated Endpoints](#authenticated-endpoints)
4. [Admin-Only Endpoints](#admin-only-endpoints)
5. [Global Error Handling](#global-error-handling)

---

## Available Endpoints

### Public Endpoints
- `GET /` - Welcome message for the platform
- `GET /public/categories` - Retrieve all categories
- `GET /public/categories/:id` - Retrieve a specific category by ID
- `GET /public/lectures` - Retrieve all lectures
- `GET /public/lectures/:id` - Retrieve a specific lecture by ID
- `GET /public/homepage-bundle` - Retrieve curated homepage content
- `POST /chatbot/send` - Send a message to the chatbot

### Authenticated Endpoints
- `POST /users/register` - Register a new user
- `POST /users/login` - User login to obtain access token
- `POST /users/login/google` - Google OAuth login
- `GET /users/profile` - Retrieve authenticated user profile
- `GET /carts` - Retrieve user’s cart
- `POST /carts/add` - Add a lecture to the cart
- `DELETE /carts/:id` - Remove a lecture from the cart
- `GET /transactions/user` - Retrieve user’s transactions
- `POST /transactions` - Create a new transaction
- `GET /transactions/:id` - Retrieve a specific transaction by ID
- `POST /payments/create` - Create a payment token
- `GET /payments/status/:invoice` - Check payment status
- `POST /payments/notification` - Handle Midtrans webhook notifications

### Admin-Only Endpoints
- `GET /admin/statistics` - Retrieve platform statistics
- `GET /admin/recent-users` - Retrieve recently registered users
- `GET /admin/orders` - Retrieve recent orders
- `GET /admin/categories/stats` - Retrieve category statistics
- `GET /admin/orders/monthly` - Retrieve monthly sales data
- `GET /admin/categories` - Retrieve all categories
- `POST /admin/categories` - Create a new category
- `PUT /admin/categories/:id` - Update a category by ID
- `DELETE /admin/categories/:id` - Delete a category by ID
- `GET /admin/lectures` - Retrieve all lectures
- `POST /admin/lectures` - Create a new lecture
- `PUT /admin/lectures/:id` - Update a lecture by ID
- `DELETE /admin/lectures/:id` - Delete a lecture by ID
- `GET /admin/users` - Retrieve all users
- `POST /admin/users` - Create a new user
- `PUT /admin/users/:id` - Update a user by ID
- `DELETE /admin/users/:id` - Delete a user by ID
- `GET /transactions` - Retrieve all transactions
- `PUT /transactions/:id/status` - Update transaction status by ID

---

## Public Endpoints

### 1. GET /

**Description**: Displays a welcome message for the SNS NDT Learning Platform.

**Response (200 - OK)**:
```json
{
  "message": "SNS NDT Learning Platform API"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 2. GET /public/categories

**Description**: Retrieves all categories available on the platform.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Advanced NDT",
    "description": "Advanced non-destructive testing methods like Ultrasonic Testing...",
    "techniques": ["Ultrasonic Testing (UT)", "Phased Array Ultrasonic Testing (PAUT)"]
  },
  ...
]
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 3. GET /public/categories/:id

**Description**: Retrieves a specific category by its ID.

**Parameters**:
- `id` (required): Category ID (integer)

**Response (200 - OK)**:
```json
{
  "id": 1,
  "name": "Advanced NDT",
  "description": "Advanced non-destructive testing methods like Ultrasonic Testing...",
  "techniques": ["Ultrasonic Testing (UT)", "Phased Array Ultrasonic Testing (PAUT)"]
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Invalid category ID"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Category not found"
}
```

---

### 4. GET /public/lectures

**Description**: Retrieves all lectures available on the platform.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Saenal Aladin Rapi",
    "title": "Lead NDT Instructor",
    "technique": "Ultrasonic Testing (UT)",
    "CategoryId": 1,
    "experience_years": 20,
    "certifications": ["ASNT Level III", "API 510"],
    "description": "Expert in ultrasonic testing for weld imperfections...",
    "price": 7990000,
    "availability": "Available",
    "image": "https://gammabuana.com/...",
    "UserId": 1
  },
  ...
]
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 5. GET /public/lectures/:id

**Description**: Retrieves a specific lecture by its ID.

**Parameters**:
- `id` (required): Lecture ID (integer)

**Response (200 - OK)**:
```json
{
  "id": 1,
  "name": "Saenal Aladin Rapi",
  "title": "Lead NDT Instructor",
  "technique": "Ultrasonic Testing (UT)",
  "CategoryId": 1,
  "experience_years": 20,
  "certifications": ["ASNT Level III", "API 510"],
  "description": "Expert in ultrasonic testing for weld imperfections...",
  "price": 7990000,
  "availability": "Available",
  "image": "https://gammabuana.com/...",
  "UserId": 1
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Invalid lecture ID"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Lecture not found"
}
```

---

### 6. GET /public/homepage-bundle

**Description**: Retrieves a curated bundle of content for the platform’s homepage.

**Response (200 - OK)**:
```json
{
  "categories": [...],
  "lectures": [...],
  "featured": [...]
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 7. POST /chatbot/send

**Description**: Sends a message to the Dialogflow-powered chatbot.

**Body**:
```json
{
  "text": "string",
  "sessionId": "string" // Optional
}
```

**Response (200 - OK)**:
```json
{
  "text": "Chatbot response",
  "intent": "string",
  "parameters": {},
  "sessionId": "string"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Text is required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Failed to communicate with chatbot"
}
```

---

## Authenticated Endpoints

All endpoints below require an `Authorization` header with a Bearer token obtained from the `/users/login` or `/users/login/google` endpoint.

**Headers**:
```json
{
  "Authorization": "Bearer <access_token>"
}
```

### 8. POST /users/register

**Description**: Registers a new user.

**Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

**Response (201 - Created)**:
```json
{
  "id": 3,
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "User"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Username is required"
}
```
*Or similar validation errors for email, password, phoneNumber, or address.*

**Response (400 - Bad Request)**:
```json
{
  "message": "Data already exists"
}
```

---

### 9. POST /users/login

**Description**: Authenticates a user and returns an access token.

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 - OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Email is required"
}
```
*Or*:
```json
{
  "message": "Password is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Invalid email/password"
}
```

---

### 10. POST /users/login/google

**Description**: Authenticates a user using Google OAuth and returns an access token.

**Body**:
```json
{
  "token": "string" // Google OAuth token
}
```

**Response (200 - OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Invalid Google token"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 11. GET /users/profile

**Description**: Retrieves the authenticated user’s profile.

**Response (200 - OK)**:
```json
{
  "id": 2,
  "username": "User",
  "email": "user@example.com",
  "role": "User",
  "phoneNumber": "081234567891",
  "address": "Jl. Raya No. 2, Jakarta"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 12. GET /carts

**Description**: Retrieves the authenticated user’s cart.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "UserId": 2,
    "LectureId": 1
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 13. POST /carts/add

**Description**: Adds a lecture to the authenticated user’s cart.

**Body**:
```json
{
  "LectureId": "integer"
}
```

**Response (201 - Created)**:
```json
{
  "id": 5,
  "UserId": 2,
  "LectureId": 8
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "LectureId is required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Lecture not found"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

---

### 14. DELETE /carts/:id

**Description**: Removes a lecture from the authenticated user’s cart.

**Parameters**:
- `id` (required): Cart item ID (integer)

**Response (200 - OK)**:
```json
{
  "message": "Item removed from cart"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Cart item not found"
}
```

---

### 15. GET /transactions/user

**Description**: Retrieves the authenticated user’s transactions.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "invoice_number": "INV-001",
    "total_amount": 7990000,
    "UserId": 2,
    "createdAt": "2025-04-30T10:00:00.000Z",
    "updatedAt": "2025-04-30T10:00:00.000Z"
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 16. POST /transactions

**Description**: Creates a new transaction for the authenticated user.

**Body**:
```json
{
  "total_amount": "integer",
  "items": [
    {
      "LectureId": "integer"
    }
  ]
}
```

**Response (201 - Created)**:
```json
{
  "id": 2,
  "invoice_number": "INV-002",
  "total_amount": 7990000,
  "UserId": 2,
  "createdAt": "2025-04-30T10:00:00.000Z",
  "updatedAt": "2025-04-30T10:00:00.000Z"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Total amount is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Lecture not found"
}
```

---

### 17. GET /transactions/:id

**Description**: Retrieves a specific transaction by its ID for the authenticated user.

**Parameters**:
- `id` (required): Transaction ID (integer)

**Response (200 - OK)**:
```json
{
  "id": 1,
  "invoice_number": "INV-001",
  "total_amount": 7990000,
  "UserId": 2,
  "createdAt": "2025-04-30T10:00:00.000Z",
  "updatedAt": "2025-04-30T10:00:00.000Z"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Transaction not found"
}
```

---

### 18. POST /payments/create

**Description**: Creates a payment token for a transaction using Midtrans.

**Body**:
```json
{
  "transactionId": "integer"
}
```

**Response (201 - Created)**:
```json
{
  "token": "midtrans_token",
  "redirect_url": "https://app.midtrans.com/..."
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Transaction ID is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Transaction not found"
}
```

---

### 19. GET /payments/status/:invoice

**Description**: Checks the status of a payment by invoice number.

**Parameters**:
- `invoice` (required): Invoice number (string)

**Response (200 - OK)**:
```json
{
  "orderId": "INV-001",
  "transactionStatus": "settlement",
  "fraudStatus": "accept"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Invalid invoice number"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Payment not found"
}
```

---

### 20. POST /payments/notification

**Description**: Handles webhook notifications from Midtrans.

**Body**:
```json
{
  "order_id": "string",
  "transaction_status": "string",
  "fraud_status": "string",
  ...
}
```

**Response (200 - OK)**:
```json
{
  "orderId": "INV-001",
  "transactionStatus": "settlement",
  "fraudStatus": "accept"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Invalid notification data"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

## Admin-Only Endpoints

These endpoints require both authentication and admin authorization.

### 21. GET /admin/statistics

**Description**: Retrieves platform statistics (e.g., user count, lecture count).

**Response (200 - OK)**:
```json
{
  "totalUsers": 100,
  "totalLectures": 50,
  "totalTransactions": 200
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 22. GET /admin/recent-users

**Description**: Retrieves recently registered users.

**Response (200 - OK)**:
```json
[
  {
    "id": 3,
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "User",
    "phoneNumber": "081234567892",
    "address": "Jl. Raya No. 3, Jakarta"
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 23. GET /admin/orders

**Description**: Retrieves recent orders (transactions).

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "invoice_number": "INV-001",
    "total_amount": 7990000,
    "UserId": 2,
    "createdAt": "2025-04-30T10:00:00.000Z"
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 24. GET /admin/categories/stats

**Description**: Retrieves statistics for categories (e.g., lecture count per category).

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Advanced NDT",
    "lectureCount": 2
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 25. GET /admin/orders/monthly

**Description**: Retrieves monthly sales data.

**Response (200 - OK)**:
```json
[
  {
    "month": "2025-04",
    "totalSales": 15980000,
    "transactionCount": 2
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 26. GET /admin/categories

**Description**: Retrieves all categories (admin view).

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Advanced NDT",
    "description": "Advanced non-destructive testing methods...",
    "techniques": ["Ultrasonic Testing (UT)", "Phased Array Ultrasonic Testing (PAUT)"]
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 27. POST /admin/categories

**Description**: Creates a new category.

**Body**:
```json
{
  "name": "string",
  "description": "string",
  "techniques": ["string"]
}
```

**Response (201 - Created)**:
```json
{
  "data": {
    "id": 6,
    "name": "New Category",
    "description": "Description of new category",
    "techniques": ["New Technique"],
    "createdAt": "2025-04-30T10:00:00.000Z",
    "updatedAt": "2025-04-30T10:00:00.000Z"
  },
  "message": "Category New Category created"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Name is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

---

### 28. PUT /admin/categories/:id

**Description**: Updates a category by its ID.

**Parameters**:
- `id` (required): Category ID (integer)

**Body**:
```json
{
  "name": "string",
  "description": "string",
  "techniques": ["string"]
}
```

**Response (200 - OK)**:
```json
{
  "message": "Category id:1 updated"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Name is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Category id:999 not found"
}
```

---

### 29. DELETE /admin/categories/:id

**Description**: Deletes a category by its ID.

**Parameters**:
- `id` (required): Category ID (integer)

**Response (200 - OK)**:
```json
{
  "message": "Category id:1 deleted"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Category id:999 not found"
}
```

---

### 30. GET /admin/lectures

**Description**: Retrieves all lectures (admin view).

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "name": "Saenal Aladin Rapi",
    "title": "Lead NDT Instructor",
    "technique": "Ultrasonic Testing (UT)",
    "CategoryId": 1,
    "experience_years": 20,
    "certifications": ["ASNT Level III", "API 510"],
    "description": "Expert in ultrasonic testing...",
    "price": 7990000,
    "availability": "Available",
    "image": "https://gammabuana.com/...",
    "UserId": 1
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 31. POST /admin/lectures

**Description**: Creates a new lecture.

**Body**:
```json
{
  "name": "string",
  "title": "string",
  "technique": "string",
  "CategoryId": "integer",
  "experience_years": "integer",
  "certifications": ["string"],
  "description": "string",
  "price": "integer",
  "availability": "string",
  "image": "string",
  "UserId": "integer"
}
```

**Response (201 - Created)**:
```json
{
  "data": {
    "id": 11,
    "name": "New Instructor",
    "title": "Lead NDT Instructor",
    "technique": "New Technique",
    "CategoryId": 1,
    "experience_years": 15,
    "certifications": ["ASNT Level II"],
    "description": "Expert in new technique...",
    "price": 7000000,
    "availability": "Available",
    "image": "https://example.com/...",
    "UserId": 1,
    "createdAt": "2025-04-30T10:00:00.000Z",
    "updatedAt": "2025-04-30T10:00:00.000Z"
  },
  "message": "Lecture New Instructor created"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Name is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

---

### 32. PUT /admin/lectures/:id

**Description**: Updates a lecture by its ID.

**Parameters**:
- `id` (required): Lecture ID (integer)

**Body**:
```json
{
  "name": "string",
  "title": "string",
  "technique": "string",
  "CategoryId": "integer",
  "experience_years": "integer",
  "certifications": ["string"],
  "description": "string",
  "price": "integer",
  "availability": "string",
  "image": "string",
  "UserId": "integer"
}
```

**Response (200 - OK)**:
```json
{
  "message": "Lecture id:1 updated"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Name is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Lecture id:999 not found"
}
```

---

### 33. DELETE /admin/lectures/:id

**Description**: Deletes a lecture by its ID.

**Parameters**:
- `id` (required): Lecture ID (integer)

**Response (200 - OK)**:
```json
{
  "message": "Lecture id:1 deleted"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Lecture id:999 not found"
}
```

---

### 34. GET /admin/users

**Description**: Retrieves all users.

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "username": "Admin",
    "email": "admin@example.com",
    "role": "Admin",
    "phoneNumber": "081234567890",
    "address": "Jl. Raya No. 1, Jakarta"
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 35. POST /admin/users

**Description**: Creates a new user.

**Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

**Response (201 - Created)**:
```json
{
  "id": 4,
  "username": "newadmin",
  "email": "newadmin@example.com",
  "role": "Admin"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Username is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

---

### 36. PUT /admin/users/:id

**Description**: Updates a user by their ID.

**Parameters**:
- `id` (required): User ID (integer)

**Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

**Response (200 - OK)**:
```json
{
  "message": "User id:1 updated"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Username is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "User id:999 not found"
}
```

---

### 37. DELETE /admin/users/:id

**Description**: Deletes a user by their ID.

**Parameters**:
- `id` (required): User ID (integer)

**Response (200 - OK)**:
```json
{
  "message": "User id:1 deleted"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "User id:999 not found"
}
```

---

### 38. GET /transactions

**Description**: Retrieves all transactions (admin view).

**Response (200 - OK)**:
```json
[
  {
    "id": 1,
    "invoice_number": "INV-001",
    "total_amount": 7990000,
    "UserId": 2,
    "createdAt": "2025-04-30T10:00:00.000Z",
    "updatedAt": "2025-04-30T10:00:00.000Z"
  },
  ...
]
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

### 39. PUT /transactions/:id/status

**Description**: Updates the status of a transaction by its ID.

**Parameters**:
- `id` (required): Transaction ID (integer)

**Body**:
```json
{
  "status": "string"
}
```

**Response (200 - OK)**:
```json
{
  "message": "Transaction id:1 status updated"
}
```

**Response (400 - Bad Request)**:
```json
{
  "message": "Status is required"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Transaction id:999 not found"
}
```

---

## Global Error Handling

**Response (400 - Bad Request)**:
```json
{
  "message": "Validation error message"
}
```

**Response (401 - Unauthorized)**:
```json
{
  "message": "Authentication required"
}
```
*Or*:
```json
{
  "message": "Invalid token"
}
```

**Response (403 - Forbidden)**:
```json
{
  "message": "Admin access required"
}
```

**Response (404 - Not Found)**:
```json
{
  "message": "Resource not found"
}
```

**Response (500 - Internal Server Error)**:
```json
{
  "message": "Internal Server Error"
}
```

---

This API documentation is designed to provide clear guidance for developers interacting with the SNS NDT Learning Platform. For further details, refer to the source code or contact the development team.