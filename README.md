# Dokumentasi API

## Endpoint Xiaomi Device Store

Berikut adalah daftar endpoint yang tersedia:

- `GET /public/devices`
- `GET /public/devices/:id`
- `POST /ai`

- `POST /register`
- `POST /login`
- `POST /login/google`

- `GET /devices`
- `GET /devices/:id`
- `PUT /users/update`
- `POST /favorites/:XiaomiDeviceId`
- `GET /favorites`
- `DELETE /favorites/:XiaomiDeviceId`

&nbsp;

## 1. GET /public/devices

Description:

- Mendapatkan daftar semua perangkat Xiaomi dengan informasi terbatas

Request:

- Query parameters:

```json
{
  "search": "string (optional)",
  "sort": "string (optional, format: field:order, contoh: price:asc)",
  "minPrice": "integer (optional)",
  "maxPrice": "integer (optional)"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "key": "xiaomi-13-pro",
    "device_name": "Xiaomi 13 Pro",
    "device_image": "url_gambar",
    "price": 12000000
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 2. GET /public/devices/:id

Description:

- Mendapatkan detail perangkat Xiaomi berdasarkan ID dengan informasi terbatas

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "key": "xiaomi-13-pro",
  "device_name": "Xiaomi 13 Pro",
  "device_image": "url_gambar",
  "price": 12000000
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Device tidak ditemukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 3. POST /ai

Description:

- Mendapatkan informasi menggunakan AI Gemini tentang perangkat Xiaomi

Request:

- body:

```json
{
  "prompt": "string (required)"
}
```

_Response (200 - OK)_

```json
{
  "response": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Prompt diperlukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 4. POST /register

Description:

- Registrasi user baru

Request:

- body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username tidak boleh kosong"
}
OR
{
  "message": "Email tidak boleh kosong"
}
OR
{
  "message": "Password tidak boleh kosong"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 5. POST /login

Description:

- Login user

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email and password are required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid password"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 6. POST /login/google

Description:

- Login dengan Google

Request:

- body:

```json
{
  "googleToken": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 7. GET /devices

Description:

- Mendapatkan daftar semua perangkat Xiaomi dengan informasi lengkap

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "key": "xiaomi-13-pro",
    "device_name": "Xiaomi 13 Pro",
    "device_image": "url_gambar",
    "display_size": "6.73 inci",
    "display_res": "1440 x 3200 pixel",
    "camera": "50MP + 50MP + 50MP",
    "video": "8K@24fps",
    "ram": "12GB",
    "chipset": "Snapdragon 8 Gen 2",
    "battery": "4820 mAh",
    "batteryType": "Li-Po",
    "body": "Ceramic/Glass",
    "os_type": "Android 13, MIUI 14",
    "storage": "256GB/512GB",
    "comment": "Flagship 2023",
    "price": 12000000
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 8. GET /devices/:id

Description:

- Mendapatkan detail perangkat Xiaomi berdasarkan ID dengan informasi lengkap

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "key": "xiaomi-13-pro",
  "device_name": "Xiaomi 13 Pro",
  "device_image": "url_gambar",
  "display_size": "6.73 inci",
  "display_res": "1440 x 3200 pixel",
  "camera": "50MP + 50MP + 50MP",
  "video": "8K@24fps",
  "ram": "12GB",
  "chipset": "Snapdragon 8 Gen 2",
  "battery": "4820 mAh",
  "batteryType": "Li-Po",
  "body": "Ceramic/Glass",
  "os_type": "Android 13, MIUI 14",
  "storage": "256GB/512GB",
  "comment": "Flagship 2023",
  "price": 12000000
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Device tidak ditemukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 9. PUT /users/update

Description:

- Memperbarui data profil user

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "username": "string (optional)",
  "email": "string (optional)"
}
```

_Response (200 - OK)_

```json
{
  "message": "User berhasil diupdate",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Tidak ada data yang diupdate"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User tidak ditemukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 10. POST /favorites/:XiaomiDeviceId

Description:

- Menambahkan device ke daftar favorit

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "XiaomiDeviceId": "integer (required)"
}
```

_Response (201 - Created)_

```json
{
  "message": "Device berhasil ditambahkan ke favorit"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Device sudah ada di daftar favorit Anda"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Device tidak ditemukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 11. GET /favorites

Description:

- Mendapatkan daftar device favorit user

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "key": "xiaomi-13-pro",
    "device_name": "Xiaomi 13 Pro",
    "device_image": "url_gambar",
    "display_size": "6.73 inci",
    "display_res": "1440 x 3200 pixel",
    "camera": "50MP + 50MP + 50MP",
    "video": "8K@24fps",
    "ram": "12GB",
    "chipset": "Snapdragon 8 Gen 2",
    "battery": "4820 mAh",
    "batteryType": "Li-Po",
    "body": "Ceramic/Glass",
    "os_type": "Android 13, MIUI 14",
    "storage": "256GB/512GB",
    "comment": "Flagship 2023",
    "price": 12000000
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 12. DELETE /favorites/:XiaomiDeviceId

Description:

- Menghapus device dari daftar favorit

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "XiaomiDeviceId": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "Device berhasil dihapus dari favorit"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Device tidak ada di daftar favorit Anda"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
OR
{
  "message": "Authentication required"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
