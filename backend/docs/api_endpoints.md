# API Endpoints สำหรับระบบ Authentication

เอกสารนี้อธิบาย API Endpoints ที่ใช้สำหรับระบบ Authentication และการจัดการผู้ใช้ในแอพพลิเคชันบล็อกส่วนตัว

## Base URL

```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. ลงทะเบียนผู้ใช้ใหม่

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: สร้างบัญชีผู้ใช้ใหม่
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "Test User" // optional
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "full_name": "Test User",
      "created_at": "2025-04-08T08:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ข้อมูลไม่ครบหรือไม่ถูกต้อง
  - `409 Conflict`: อีเมลหรือ username มีอยู่ในระบบแล้ว

### 2. เข้าสู่ระบบ

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: เข้าสู่ระบบและรับ tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "full_name": "Test User",
      "avatar_url": null,
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ข้อมูลไม่ครบหรือไม่ถูกต้อง
  - `401 Unauthorized`: อีเมลหรือรหัสผ่านไม่ถูกต้อง

### 3. ดึงข้อมูลผู้ใช้ปัจจุบัน

- **URL**: `/auth/me`
- **Method**: `GET`
- **Description**: ดึงข้อมูลของผู้ใช้ที่เข้าสู่ระบบอยู่
- **Authentication**: Bearer Token (JWT)
- **Response**: `200 OK`
  ```json
  {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "full_name": "Test User",
      "avatar_url": null,
      "bio": null,
      "role": "user",
      "created_at": "2025-04-08T08:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: ไม่มี token หรือ token ไม่ถูกต้อง
  - `404 Not Found`: ไม่พบผู้ใช้

### 4. รีเฟรช Token

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Description**: สร้าง access token ใหม่โดยใช้ refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ไม่มี refresh token
  - `403 Forbidden`: refresh token ไม่ถูกต้องหรือหมดอายุ

### 5. ออกจากระบบ

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: ออกจากระบบและเพิกถอน refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: ไม่มี refresh token

## User Management Endpoints

### 1. อัปเดตข้อมูลผู้ใช้

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Description**: อัปเดตข้อมูลโปรไฟล์ของผู้ใช้
- **Authentication**: Bearer Token (JWT)
- **Request Body**:
  ```json
  {
    "full_name": "Updated Name",
    "bio": "This is my updated bio",
    "avatar_url": "https://example.com/avatar.jpg"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "full_name": "Updated Name",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "This is my updated bio",
      "updated_at": "2025-04-08T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: ไม่มี token หรือ token ไม่ถูกต้อง
  - `400 Bad Request`: ข้อมูลไม่ถูกต้อง

### 2. เปลี่ยนรหัสผ่าน

- **URL**: `/users/change-password`
- **Method**: `PUT`
- **Description**: เปลี่ยนรหัสผ่านของผู้ใช้
- **Authentication**: Bearer Token (JWT)
- **Request Body**:
  ```json
  {
    "current_password": "currentpassword",
    "new_password": "newpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Password changed successfully"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: ไม่มี token หรือ token ไม่ถูกต้อง
  - `400 Bad Request`: รหัสผ่านปัจจุบันไม่ถูกต้อง หรือรหัสผ่านใหม่ไม่ตรงตามเงื่อนไข

## การใช้ Authentication

สำหรับ endpoints ที่ต้องการการยืนยันตัวตน ต้องส่ง token ในรูปแบบ Bearer Token ในส่วนของ HTTP header ดังนี้:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## รูปแบบข้อความผิดพลาด

เมื่อเกิดข้อผิดพลาด API จะส่งข้อความในรูปแบบต่อไปนี้:

```json
{
  "message": "Error message explanation"
}
```

สำหรับข้อผิดพลาดที่เกี่ยวกับการตรวจสอบข้อมูล:

```json
{
  "errors": [
    {
      "param": "email",
      "msg": "Must be a valid email address"
    },
    {
      "param": "password",
      "msg": "Password must be at least 6 characters"
    }
  ]
}
```

## Authentication Flow

1. **การลงทะเบียน/เข้าสู่ระบบ**:
   - Client ส่งข้อมูลไปยังเซิร์ฟเวอร์
   - Server ตรวจสอบข้อมูล และสร้าง access token และ refresh token
   - Client เก็บ tokens ไว้

2. **การเรียกใช้ API ที่ต้องการการยืนยันตัวตน**:
   - Client ส่ง access token ในรูปแบบ Bearer token
   - Server ตรวจสอบความถูกต้องของ token และดำเนินการตามที่ร้องขอ

3. **เมื่อ access token หมดอายุ**:
   - Client ใช้ refresh token เพื่อขอ access token ใหม่
   - Server ตรวจสอบ refresh token และสร้าง access token ใหม่
   - Client ใช้ access token ใหม่แทนตัวเดิม

4. **การออกจากระบบ**:
   - Client ส่ง refresh token ไปยังเซิร์ฟเวอร์
   - Server เพิกถอน refresh token
   - Client ลบ tokens ที่เก็บไว้ 