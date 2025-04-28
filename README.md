# My Personal Blog 2025 (React + Node.js + PostgreSQL)

โปรเจกต์นี้เป็นเว็บบล็อกส่วนตัวแบบ Full Stack ประกอบด้วย Frontend (React + Vite), Backend (Node.js/Express), และฐานข้อมูล PostgreSQL

## คุณสมบัติหลัก
- ระบบจัดการบทความ (CRUD)
- ระบบผู้ใช้ (สมัคร, ล็อกอิน, โปรไฟล์)
- ระบบหมวดหมู่, แท็ก, คอมเมนต์, ไลก์
- ระบบแจ้งเตือน (Notification)
- รองรับ Responsive (มือถือ/แท็บเล็ต)
- รองรับการ Deploy แยกฝั่ง (Frontend/Backend)

## โครงสร้างโปรเจกต์
```
my-personal-blog-2025/
├── backend/        # โค้ดฝั่งเซิร์ฟเวอร์ (Express, REST API)
├── frontend/       # โค้ดฝั่งผู้ใช้ (React + Vite)
├── init.sql        # ตัวอย่างสคริปต์สร้างฐานข้อมูล
├── package.json    # สคริปต์รวม, dev tool
└── README.md
```

## วิธีติดตั้งและรัน (Local)
### 1. เตรียมฐานข้อมูล PostgreSQL
- ติดตั้ง PostgreSQL ในเครื่อง หรือใช้ Cloud (เช่น Railway, Supabase)
- สร้างฐานข้อมูลใหม่ และรันไฟล์ `init.sql` เพื่อสร้างตารางตัวอย่าง

### 2. ติดตั้งและรัน Backend
```bash
cd backend
npm install
# สร้างไฟล์ .env แล้วตั้งค่า DATABASE_URL, JWT_SECRET, FRONTEND_URL
npm run dev
```

### 3. ติดตั้งและรัน Frontend
```bash
cd frontend
npm install
# สร้างไฟล์ .env แล้วตั้งค่า VITE_API_URL ให้ชี้ไปที่ backend
npm run dev
```

## การ Deploy
- **Frontend:** แนะนำใช้ Vercel, Netlify หรือ Firebase Hosting
- **Backend:** แนะนำใช้ Render, Railway หรือ VPS
- **Database:** แนะนำใช้ Railway, Supabase, ElephantSQL หรือ Managed PostgreSQL อื่น ๆ

## หมายเหตุ
- หากต้องการ deploy จริง ต้องใช้ Cloud Database เท่านั้น (localhost ใช้ได้เฉพาะ dev)
- สามารถปรับแต่ง UI ให้เหมาะกับมือถือได้ทันที (responsive)
- รองรับการแปลงเป็น PWA หรือสร้างแอปมือถือด้วย React Native ได้

---

> หากมีข้อสงสัยหรือปัญหาในการติดตั้ง/ใช้งาน สามารถสอบถามได้เลย!
