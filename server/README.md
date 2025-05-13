# Paligada API Documentation

## Endpoints

List of available endpoints:

- `POST /login`
- `POST /register`
- `GET /products`
- `GET /products/:id`
- `GET /categories`

Routes below need authentication:

- `POST /chat`
- `POST /shipping`

Routes below need authorization:

> The request user should be an seller

- `GET /seller/products`
- `POST /seller/products`
- `PUT /seller/products/:id`
- `DELETE /seller/products/:id`

&nbsp;

## 1. POST /login

Description:

- Login into the system

Request:

- body: (using email)

```json
{
  "email": "string",
  "password": "string"
}
```

- body: (using username)

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /register

Description:

- Register into the system

Request:

- body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201 - OK)_

```json
{
  "data": {
    "status": "string",
    "id": "number",
    "email": "string",
    "name": "string",
    "updatedAt": "string",
    "createdAt": "string",
    "gender": "string",
    "birthdate": "string",
    "phone": "string",
    "country": "string",
    "province": "string",
    "regency": "string",
    "district": "string",
    "village": "string",
    "zipCode": "string",
    "address": "string",
    "profilePicture": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "email is required"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 3. GET /products

Description:

- Get all product from the database

Request:

- query

| Parameter            | Type    | Required | Default | Description                                   |
| -------------------- | ------- | -------- | ------- | --------------------------------------------- |
| `filter[categories]` | Integer | No       | -       | Filter posts by category ID                   |
| `q`                  | String  | No       | -       | Keyword to search product name                |
| `page[number]`       | Integer | No       | `1`     | Page number for pagination                    |
| `page[size]`         | Integer | No       | `5`     | Number of items per page                      |
| `sort[by]`           | String  | No       | -       | Field to sort by (`title`, `createdAt`, etc.) |
| `sort[order]`        | String  | No       | -       | Sorting direction: `asc` or `desc`            |

_Response (200 - OK)_

```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "status": "string",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "Images": [
        {
          "image": "string"
        },
        {
          "image": "string"
        }
      ],
      "Categories": [
        {
          "name": "string"
        }
      ]
    },
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "status": "string",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "Images": [
        {
          "image": "string"
        },
        {
          "image": "string"
        }
      ],
      "Categories": [
        {
          "name": "string"
        }
      ]
    }
  ],
  "totalPages": "number",
  "currentPage": "number",
  "totalData": "number",
  "dataPerPage": "number"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 4. GET /products/:id

Description:

- Get product from the database by id

Request

- params:

```json
{
  "id": "number (required)"
}
```

_Response (200 - OK)_

```json
{
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "status": "string",
    "UserId": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "Images": [
      {
        "image": "string"
      },
      {
        "image": "string"
      }
    ],
    "Categories": [
      {
        "name": "string"
      }
    ]
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "product with id <id> is not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

## 5. GET /categories

Description:

- Get all category from the database

_Response (200 - OK)_

```json
{
  "data": [
    {
      "id": "number",
      "name": "string"
    },
    {
      "id": "number",
      "name": "string"
    }
  ]
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 6. POST /chat

Description:

- Chat with AI

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "message": "string"
}
```

_Response (201 - OK)_

```json
{
  {
    "reply": "string",
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "message is required"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 7. POST /shipping

Description:

- Create new shipping address for user

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "fullName": "string",
  "phoneNumber": "string",
  "country": "string",
  "province": "string",
  "regency": "string",
  "district": "string",
  "village": "string",
  "address": "string",
  "zipCode": "string"
}
```

_Response (201 - OK)_

```json
{
  "data": {
    "id": "number",
    "fullName": "string",
    "phoneNumber": "string",
    "country": "string",
    "province": "string",
    "regency": "string",
    "district": "string",
    "village": "string",
    "address": "string",
    "zipCode": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "fullName is required"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 8. GET /seller/products

Description:

- Get all product from the database by seller ID

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "status": "string",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "Images": [
        {
          "image": "string"
        },
        {
          "image": "string"
        }
      ],
      "Categories": [
        {
          "name": "string"
        }
      ]
    },
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "status": "string",
      "UserId": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "Images": [
        {
          "image": "string"
        },
        {
          "image": "string"
        }
      ],
      "Categories": [
        {
          "name": "string"
        }
      ]
    }
  ]
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 9. POST /seller/products

Description:

- Create a new product

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number"
}
```

_Response (201 - OK)_

```json
{
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "status": "string",
    "UserId": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "Images": [
      {
        "image": "string"
      },
      {
        "image": "string"
      }
    ],
    "Categories": [
      {
        "name": "string"
      }
    ]
  }
},
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 10. PUT /seller/products/:id

Description:

- Update product by id and seller id

Request:

- params

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number"
}
```

_Response (200 - OK)_

```json
{
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "status": "string",
    "UserId": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "Images": [
      {
        "image": "string"
      },
      {
        "image": "string"
      }
    ],
    "Categories": [
      {
        "name": "string"
      }
    ]
  }
},
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> is not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 11. DELETE /seller/products/:id

Description:

- Delete product by id and seller id

Request:

- params

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "message": "<name> success to delete"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;
