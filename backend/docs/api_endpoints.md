# API Endpoints

เอกสารนี้อธิบาย API endpoints ทั้งหมดของ Blog API

## การยืนยันตัวตน (Authentication)

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|-------------------------|
| `/api/auth/register` | POST | ลงทะเบียนผู้ใช้ใหม่ | No |
| `/api/auth/login` | POST | เข้าสู่ระบบ | No |
| `/api/auth/refresh-token` | POST | รีเฟรช access token | No |
| `/api/auth/logout` | POST | ออกจากระบบ | Yes |
| `/api/auth/me` | GET | ดึงข้อมูลผู้ใช้ปัจจุบัน | Yes |

### ลงทะเบียนผู้ใช้ใหม่

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123",
    "full_name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "ลงทะเบียนสำเร็จ",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "role": "user"
      }
    }
  }
  ```

### เข้าสู่ระบบ

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "เข้าสู่ระบบสำเร็จ",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "role": "user"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### รีเฟรช Token

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### ออกจากระบบ

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "ออกจากระบบสำเร็จ"
  }
  ```

### ดึงข้อมูลผู้ใช้ปัจจุบัน

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "full_name": "John Doe",
        "avatar_url": null,
        "bio": null,
        "role": "user",
        "created_at": "2023-09-01T13:45:30.000Z"
      }
    }
  }
  ```

## ผู้ใช้ (Users)

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|-------------------------|
| `/api/users/profile` | PUT | อัปเดตโปรไฟล์ผู้ใช้ | Yes |
| `/api/users/change-password` | PUT | เปลี่ยนรหัสผ่าน | Yes |

### อัปเดตโปรไฟล์ผู้ใช้

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Body**:
  ```json
  {
    "full_name": "John Smith",
    "bio": "I'm a software developer",
    "avatar_url": "https://example.com/avatar.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "อัปเดตโปรไฟล์สำเร็จ",
    "data": {
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "full_name": "John Smith",
        "avatar_url": "https://example.com/avatar.jpg",
        "bio": "I'm a software developer",
        "role": "user"
      }
    }
  }
  ```

### เปลี่ยนรหัสผ่าน

- **URL**: `/api/users/change-password`
- **Method**: `PUT`
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Body**:
  ```json
  {
    "current_password": "Password123",
    "new_password": "NewPassword456"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "เปลี่ยนรหัสผ่านสำเร็จ"
  }
  ```

## บทความ (Posts)

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|-------------------------|
| `/api/posts` | GET | ดึงรายการบทความทั้งหมด | No |
| `/api/posts/:slug` | GET | ดึงบทความตาม slug | No |
| `/api/posts` | POST | สร้างบทความใหม่ | Yes |
| `/api/posts/:id` | PUT | อัปเดตบทความ | Yes |
| `/api/posts/:id` | DELETE | ลบบทความ | Yes |
| `/api/posts/:id/like` | POST | กดไลค์บทความ | Yes |

### ดึงรายการบทความทั้งหมด

- **URL**: `/api/posts`
- **Method**: `GET`
- **Query Parameters**:
  - `page` - หน้าที่ต้องการ (เริ่มต้นที่ 1)
  - `limit` - จำนวนบทความต่อหน้า (เริ่มต้นที่ 10)
  - `category` - กรองตามหมวดหมู่
  - `tag` - กรองตามแท็ก
  - `search` - ค้นหาบทความ
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "posts": [
        {
          "id": 1,
          "title": "บทความแรกของฉัน",
          "slug": "my-first-post",
          "excerpt": "นี่คือบทความแรกของฉัน...",
          "featured_image": "https://example.com/image.jpg",
          "author": {
            "id": 1,
            "username": "johndoe",
            "full_name": "John Doe"
          },
          "category": {
            "id": 1,
            "name": "เทคโนโลยี",
            "slug": "technology"
          },
          "published_at": "2023-09-05T10:30:00.000Z"
        },
        // ... more posts
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      }
    }
  }
  ```

### ดึงบทความตาม slug

- **URL**: `/api/posts/:slug`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "post": {
        "id": 1,
        "title": "บทความแรกของฉัน",
        "slug": "my-first-post",
        "content": "เนื้อหาบทความ...",
        "featured_image": "https://example.com/image.jpg",
        "view_count": 150,
        "author": {
          "id": 1,
          "username": "johndoe",
          "full_name": "John Doe",
          "avatar_url": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": 1,
          "name": "เทคโนโลยี",
          "slug": "technology"
        },
        "tags": [
          {
            "id": 1,
            "name": "JavaScript",
            "slug": "javascript"
          },
          {
            "id": 2,
            "name": "React",
            "slug": "react"
          }
        ],
        "published_at": "2023-09-05T10:30:00.000Z",
        "likes_count": 25,
        "is_liked": false
      }
    }
  }
  ```

### สร้างบทความใหม่

- **URL**: `/api/posts`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Body**:
  ```json
  {
    "title": "บทความใหม่ของฉัน",
    "content": "เนื้อหาบทความ...",
    "excerpt": "สรุปสั้นๆ ของบทความ",
    "featured_image": "https://example.com/image.jpg",
    "category_id": 1,
    "tags": [1, 2],
    "published": true
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "สร้างบทความสำเร็จ",
    "data": {
      "post": {
        "id": 3,
        "title": "บทความใหม่ของฉัน",
        "slug": "my-new-post",
        "content": "เนื้อหาบทความ...",
        "excerpt": "สรุปสั้นๆ ของบทความ",
        "featured_image": "https://example.com/image.jpg",
        "author_id": 1,
        "category_id": 1,
        "published": true,
        "published_at": "2023-09-10T15:20:30.000Z",
        "created_at": "2023-09-10T15:20:30.000Z"
      }
    }
  }
  ```

## ความคิดเห็น (Comments)

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|-------------------------|
| `/api/posts/:postId/comments` | GET | ดึงความคิดเห็นของบทความ | No |
| `/api/posts/:postId/comments` | POST | เพิ่มความคิดเห็นใหม่ | Yes |
| `/api/comments/:id` | PUT | แก้ไขความคิดเห็น | Yes |
| `/api/comments/:id` | DELETE | ลบความคิดเห็น | Yes |

### ดึงความคิดเห็นของบทความ

- **URL**: `/api/posts/:postId/comments`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "comments": [
        {
          "id": 1,
          "content": "ความคิดเห็นแรก",
          "user": {
            "id": 2,
            "username": "janedoe",
            "full_name": "Jane Doe",
            "avatar_url": "https://example.com/jane-avatar.jpg"
          },
          "created_at": "2023-09-06T08:15:00.000Z",
          "replies": [
            {
              "id": 2,
              "content": "การตอบกลับความคิดเห็นแรก",
              "user": {
                "id": 1,
                "username": "johndoe",
                "full_name": "John Doe",
                "avatar_url": "https://example.com/john-avatar.jpg"
              },
              "created_at": "2023-09-06T09:30:00.000Z"
            }
          ]
        }
      ]
    }
  }
  ```

## หมวดหมู่และแท็ก

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|-------------------------|
| `/api/categories` | GET | ดึงรายการหมวดหมู่ทั้งหมด | No |
| `/api/tags` | GET | ดึงรายการแท็กทั้งหมด | No |

### ดึงรายการหมวดหมู่ทั้งหมด

- **URL**: `/api/categories`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "categories": [
        {
          "id": 1,
          "name": "เทคโนโลยี",
          "slug": "technology",
          "description": "บทความเกี่ยวกับเทคโนโลยี"
        },
        {
          "id": 2,
          "name": "ไลฟ์สไตล์",
          "slug": "lifestyle",
          "description": "บทความเกี่ยวกับไลฟ์สไตล์"
        }
      ]
    }
  }
  ```

### ดึงรายการแท็กทั้งหมด

- **URL**: `/api/tags`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "tags": [
        {
          "id": 1,
          "name": "JavaScript",
          "slug": "javascript"
        },
        {
          "id": 2,
          "name": "React",
          "slug": "react"
        }
      ]
    }
  }
  ```

## การจัดการข้อผิดพลาด

API จะส่งรหัสสถานะ HTTP และข้อความแสดงข้อผิดพลาดในรูปแบบต่อไปนี้:

```json
{
  "status": "error",
  "message": "ข้อความแสดงข้อผิดพลาด"
}
```

หรือในกรณีที่มีข้อผิดพลาดของการตรวจสอบข้อมูล:

```json
{
  "status": "error",
  "errors": [
    {
      "field": "email",
      "message": "รูปแบบอีเมลไม่ถูกต้อง"
    },
    {
      "field": "password",
      "message": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
    }
  ]
}
```

## รหัสสถานะ HTTP

| Code | Description |
|------|-------------|
| 200 | OK - คำขอสำเร็จ |
| 201 | Created - สร้างรายการใหม่สำเร็จ |
| 400 | Bad Request - คำขอไม่ถูกต้อง |
| 401 | Unauthorized - ไม่ได้รับอนุญาตให้เข้าถึง (ไม่ได้เข้าสู่ระบบ) |
| 403 | Forbidden - ไม่มีสิทธิ์เข้าถึง (เข้าสู่ระบบแล้วแต่ไม่มีสิทธิ์) |
| 404 | Not Found - ไม่พบรายการที่ร้องขอ |
| 429 | Too Many Requests - ส่งคำขอมากเกินไป |
| 500 | Internal Server Error - ข้อผิดพลาดภายในเซิร์ฟเวอร์ | 