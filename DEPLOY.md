# 🚀 คู่มือการ Deploy แยกส่วน

## 📋 ภาพรวม
- **Frontend**: Vercel (React/Vite)
- **Backend**: Vercel (Express.js API)
- **Database**: Supabase (PostgreSQL)

## 🎯 1. ตั้งค่า Database (Supabase)

### สร้าง Project ใน Supabase:
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง account และ project ใหม่
3. เลือก region ที่ใกล้ที่สุด
4. บันทึก Database Password

### รัน SQL Migration:
```sql
-- คัดลอกโค้ดจากไฟล์ init.sql และรันใน Supabase SQL Editor
```

### ได้ Database URL:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 🎯 2. Deploy Backend (Vercel)

### ขั้นตอน:
1. ไปที่ [vercel.com](https://vercel.com)
2. Import repository นี้
3. เลือกโฟลเดอร์ `backend` เป็น Root Directory
4. ตั้งค่า Environment Variables:
   - `DATABASE_URL`: URL จาก Supabase
   - `JWT_SECRET`: สร้าง secret key แบบสุ่ม
   - `NODE_ENV`: production

### Environment Variables ที่ต้องตั้ง:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

## 🎯 3. Deploy Frontend (Vercel)

### ขั้นตอน:
1. สร้าง project ใหม่ใน Vercel
2. Import repository เดียวกัน
3. เลือกโฟลเดอร์ `frontend` เป็น Root Directory
4. ตั้งค่า Environment Variables:
   - `VITE_API_URL`: URL ของ Backend API ที่ deploy แล้ว

### Environment Variables ที่ต้องตั้ง:
```
VITE_API_URL=https://your-backend-api.vercel.app
VITE_APP_NAME=My Personal Blog 2025
VITE_APP_VERSION=1.0.0
```

## 🔧 การทดสอบ

### ทดสอบ Backend API:
```bash
curl https://your-backend-api.vercel.app/api/health
```

### ทดสอบ Frontend:
เปิดเว็บไซต์และตรวจสอบว่าสามารถเชื่อมต่อกับ API ได้

## 📝 หมายเหตุ

1. **แยก Repository**: แต่ละส่วนจะ deploy จาก repository เดียวกันแต่คนละโฟลเดอร์
2. **Environment Variables**: ต้องตั้งค่าใน Vercel Dashboard สำหรับแต่ละ project
3. **CORS**: Backend ต้องอนุญาต Frontend domain
4. **Database**: ใช้ Supabase แทน local PostgreSQL

## 🆘 แก้ไขปัญหา

### ถ้า Frontend ไม่สามารถเชื่อมต่อ Backend:
1. ตรวจสอบ `VITE_API_URL` ใน Frontend
2. ตรวจสอบ CORS settings ใน Backend
3. ตรวจสอบ Network tab ใน Browser DevTools

### ถ้า Backend ไม่สามารถเชื่อมต่อ Database:
1. ตรวจสอบ `DATABASE_URL` format
2. ตรวจสอบ Supabase project status
3. ตรวจสอบ database connection ใน Vercel logs 