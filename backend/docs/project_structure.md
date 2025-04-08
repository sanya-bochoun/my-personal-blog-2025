# โครงสร้างโปรเจค Backend

เอกสารนี้อธิบายโครงสร้างโฟลเดอร์และไฟล์ของโปรเจค backend สำหรับระบบ authentication

## โครงสร้างโฟลเดอร์

```
/backend
  /config         # การตั้งค่าต่างๆ
  /controllers    # ตรรกะของแอพพลิเคชัน
  /middleware     # middleware functions
  /routes         # API endpoints
  /utils          # ฟังก์ชันช่วยเหลือ
  /docs           # เอกสาร
  .env            # ตัวแปรสภาพแวดล้อม
  server.js       # จุดเริ่มต้นของแอพพลิเคชัน
  package.json    # รายการ dependencies
```

## คำอธิบายโฟลเดอร์

### /config

เก็บไฟล์การตั้งค่าต่างๆ:
- `db.js`: การเชื่อมต่อกับฐานข้อมูล PostgreSQL
- `config.js`: ตัวแปรคงที่และการตั้งค่าอื่นๆ

### /controllers

เก็บตรรกะหลักของแอพพลิเคชัน (business logic):
- `authController.js`: ตรรกะสำหรับ authentication (register, login, logout, ฯลฯ)
- `userController.js`: ตรรกะสำหรับจัดการผู้ใช้ (อัปเดตโปรไฟล์, เปลี่ยนรหัสผ่าน, ฯลฯ)

### /middleware

เก็บ middleware สำหรับการประมวลผลคำขอ HTTP:
- `authMiddleware.js`: middleware สำหรับตรวจสอบ JWT token
- `validateMiddleware.js`: middleware สำหรับตรวจสอบข้อมูลที่ส่งมา

### /routes

เก็บการกำหนดเส้นทางของ API:
- `authRoutes.js`: เส้นทางสำหรับการยืนยันตัวตน
- `userRoutes.js`: เส้นทางสำหรับการจัดการผู้ใช้

### /utils

เก็บฟังก์ชันช่วยเหลือที่ใช้ในหลายส่วนของแอพพลิเคชัน:
- `jwtUtils.js`: ฟังก์ชันสำหรับจัดการ JWT
- `passwordUtils.js`: ฟังก์ชันสำหรับจัดการรหัสผ่าน
- `validationUtils.js`: ฟังก์ชันสำหรับตรวจสอบข้อมูล

### /docs

เก็บเอกสารสำหรับโปรเจค:
- `database_design.md`: ออกแบบโครงสร้างฐานข้อมูล
- `api_endpoints.md`: รายละเอียด API endpoints
- `project_structure.md`: อธิบายโครงสร้างโปรเจค

## ไฟล์หลัก

### server.js

จุดเริ่มต้นของแอพพลิเคชัน Express:
- ตั้งค่า middleware (express.json, cors, ฯลฯ)
- เชื่อมต่อกับฐานข้อมูล
- กำหนดเส้นทาง API
- เริ่มต้น server ที่พอร์ตที่กำหนด

### .env

ไฟล์เก็บค่าตัวแปรสภาพแวดล้อม:
- การเชื่อมต่อกับฐานข้อมูล
- พอร์ตของเซิร์ฟเวอร์
- คีย์ลับสำหรับ JWT
- การตั้งค่า CORS

### package.json

รายการ dependencies และ scripts:
- `npm start`: รันเซิร์ฟเวอร์
- `npm run dev`: รันเซิร์ฟเวอร์ในโหมดพัฒนา (ด้วย nodemon)

## Flow การทำงาน

1. คำขอ HTTP เข้ามาที่ `server.js`
2. ผ่าน middleware ที่เกี่ยวข้อง (auth, validation, ฯลฯ)
3. ถูกส่งไปยัง route ที่เหมาะสม
4. Route เรียกใช้ controller
5. Controller ทำงานกับฐานข้อมูลและจัดการตรรกะทางธุรกิจ
6. ส่งผลลัพธ์กลับไปยังผู้ใช้

## การติดตั้งและรัน

การติดตั้ง dependencies:
```bash
cd backend
npm install
```

การรันในโหมดพัฒนา:
```bash
npm run dev
```

การรันในโหมดการผลิต:
```bash
npm start
``` 