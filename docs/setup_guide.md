# คู่มือการติดตั้งและใช้งาน Backend API

คู่มือนี้อธิบายวิธีการติดตั้ง การตั้งค่า และการใช้งาน Backend API สำหรับโปรเจค My Personal Blog

## สารบัญ

1. [ความต้องการของระบบ](#ความต้องการของระบบ)
2. [การติดตั้ง](#การติดตั้ง)
3. [การตั้งค่า](#การตั้งค่า)
4. [การสร้างฐานข้อมูล](#การสร้างฐานข้อมูล)
5. [การรันเซิร์ฟเวอร์](#การรันเซิร์ฟเวอร์)
6. [โครงสร้าง API](#โครงสร้าง-api)
7. [Middleware ที่ใช้](#middleware-ที่ใช้)
8. [การแก้ไขปัญหา](#การแก้ไขปัญหา)

## ความต้องการของระบบ

- Node.js (เวอร์ชัน 14.x ขึ้นไป)
- npm (เวอร์ชัน 6.x ขึ้นไป)
- PostgreSQL (เวอร์ชัน 12.x ขึ้นไป)

## การติดตั้ง

1. Clone โปรเจคจาก repository:
   ```bash
   git clone <repository-url>
   cd my-personal-blog-2025
   ```

2. ติดตั้ง dependencies:
   ```bash
   cd backend
   npm install
   ```

## การตั้งค่า

1. สร้างไฟล์ `.env` ในโฟลเดอร์ `backend` (หรือคัดลอกจาก `.env.example` ถ้ามี):
   ```bash
   cp .env.example .env   # ถ้ามีไฟล์ตัวอย่าง
   ```

2. แก้ไขไฟล์ `.env` และกำหนดค่าตามสภาพแวดล้อมของคุณ:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=my_blog_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRES_IN=1h
   REFRESH_TOKEN_EXPIRES_IN=7d
   
   # CORS Configuration
   CLIENT_URL=http://localhost:3000
   ```

   **หมายเหตุ**: ควรเปลี่ยน `JWT_SECRET` เป็นค่าที่ซับซ้อนและไม่คาดเดาเพื่อความปลอดภัย

## การสร้างฐานข้อมูล

1. เข้าสู่ PostgreSQL:
   ```bash
   # ถ้าใช้ psql โดยตรง
   psql -U postgres
   
   # หรือผ่าน pgAdmin หรือเครื่องมืออื่นๆ
   ```

2. สร้างฐานข้อมูล:
   ```sql
   CREATE DATABASE my_blog_db;
   ```

3. สร้างโครงสร้างตาราง (จากไฟล์ `database_design.md`):

   ```sql
   -- เชื่อมต่อกับฐานข้อมูล
   \c my_blog_db
   
   -- สร้างตาราง users
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(100) NOT NULL,
     full_name VARCHAR(100),
     avatar_url VARCHAR(255),
     bio TEXT,
     role VARCHAR(20) DEFAULT 'user',
     is_verified BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- สร้างตาราง refresh_tokens
   CREATE TABLE refresh_tokens (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     token VARCHAR(255) NOT NULL,
     expires_at TIMESTAMP NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- สร้างตาราง verification_tokens
   CREATE TABLE verification_tokens (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     token VARCHAR(100) NOT NULL,
     type VARCHAR(20) NOT NULL,
     expires_at TIMESTAMP NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- สร้างตาราง user_sessions
   CREATE TABLE user_sessions (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     ip_address VARCHAR(45),
     user_agent TEXT,
     last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## การรันเซิร์ฟเวอร์

1. รันเซิร์ฟเวอร์ในโหมดพัฒนา (มี auto-reload):
   ```bash
   npm run dev
   ```

2. หรือรันเซิร์ฟเวอร์ในโหมดปกติ:
   ```bash
   npm start
   ```

3. Server จะทำงานที่ http://localhost:5000 (หรือพอร์ตอื่นตามที่กำหนดในไฟล์ .env)

## โครงสร้าง API

เซิร์ฟเวอร์นี้ให้บริการ API สำหรับการ authentication และการจัดการผู้ใช้ ดูรายละเอียดเพิ่มเติมได้ที่ `api_endpoints.md`

โครงสร้างพื้นฐานของ endpoints:

- **Authentication**:
  - `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
  - `POST /api/auth/login` - เข้าสู่ระบบ
  - `GET /api/auth/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน
  - `POST /api/auth/refresh-token` - รีเฟรช token
  - `POST /api/auth/logout` - ออกจากระบบ

- **Users**:
  - `PUT /api/users/profile` - อัปเดตข้อมูลโปรไฟล์
  - `PUT /api/users/change-password` - เปลี่ยนรหัสผ่าน

## Middleware ที่ใช้

API นี้ใช้ middleware ต่างๆ เพื่อความปลอดภัยและประสิทธิภาพ:

1. **Helmet**
   - ช่วยตั้งค่า HTTP headers เพื่อเพิ่มความปลอดภัย
   - ป้องกันภัยคุกคามทั่วไปเช่น XSS, Clickjacking, MIME sniffing

2. **Rate Limiting**
   - จำกัดจำนวน requests ที่มาจาก IP เดียวกัน
   - ป้องกันการโจมตีแบบ Brute Force และ DoS

3. **XSS Protection**
   - ทำความสะอาดข้อมูลที่ผู้ใช้ป้อนเข้ามา
   - ป้องกัน Cross-Site Scripting

4. **CORS**
   - ควบคุมการเข้าถึงจากแหล่งต้นทางอื่น
   - อนุญาตเฉพาะ frontend ที่กำหนดไว้ใน CLIENT_URL

5. **Error Handling**
   - จัดการข้อผิดพลาดแบบรวมศูนย์
   - ปรับรูปแบบข้อความผิดพลาดตามสภาพแวดล้อม

6. **Logging**
   - บันทึกข้อมูล requests ในโหมด development

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล

1. ตรวจสอบว่าบริการ PostgreSQL กำลังทำงานอยู่
2. ตรวจสอบว่าข้อมูลการเชื่อมต่อใน `.env` ถูกต้อง
3. ตรวจสอบว่าฐานข้อมูลและตารางได้ถูกสร้างแล้ว

### ปัญหา CORS

1. ตรวจสอบว่า `CLIENT_URL` ใน `.env` ตรงกับ URL ของ frontend
2. ตรวจสอบว่า frontend ส่ง credentials และ headers ที่ถูกต้อง

### ปัญหาอื่นๆ

หากพบปัญหาอื่นๆ ที่ไม่ได้ระบุไว้ในที่นี้ โปรดตรวจสอบ logs ของเซิร์ฟเวอร์เพื่อดูข้อความผิดพลาด 