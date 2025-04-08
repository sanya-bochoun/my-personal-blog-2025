# คู่มือการใช้งาน Middleware ในระบบ

เอกสารนี้อธิบายรายละเอียดของ middleware แต่ละตัวที่ใช้ในระบบ backend ของโปรเจค My Personal Blog

## สารบัญ

1. [Helmet](#helmet)
2. [Rate Limiting](#rate-limiting)
3. [XSS Protection](#xss-protection)
4. [CORS](#cors)
5. [Body Parser](#body-parser)
6. [Logging (Morgan)](#logging-morgan)
7. [Error Handling](#error-handling)
8. [Authentication Middleware](#authentication-middleware)

## Helmet

Helmet เป็น middleware ที่ช่วยเพิ่มความปลอดภัยให้กับแอปพลิเคชัน Express โดยการตั้งค่า HTTP headers ต่างๆ

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### ประโยชน์ที่ได้รับ

- **Content-Security-Policy**: ป้องกันการโจมตี XSS และการฉีดโค้ดอื่นๆ
- **X-Frame-Options**: ป้องกัน clickjacking
- **X-XSS-Protection**: เปิดใช้งานการป้องกัน XSS ของเบราว์เซอร์
- **X-Content-Type-Options**: ป้องกันการตีความประเภทของ MIME
- **Strict-Transport-Security**: บังคับให้ใช้ HTTPS
- **และ headers อื่นๆ อีกมากมาย**

### การปรับแต่ง

หากต้องการปรับแต่งการตั้งค่าของ Helmet:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  // ตัวเลือกอื่นๆ
}));
```

## Rate Limiting

Rate limiting ช่วยป้องกันการโจมตีแบบ brute force หรือ DDoS โดยการจำกัดจำนวน requests ที่มาจาก IP เดียวกันในช่วงเวลาหนึ่ง

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 100, // จำกัด 100 requests ต่อ IP ใน 15 นาที
  standardHeaders: true,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', limiter);
```

### พารามิเตอร์หลัก

- **windowMs**: ช่วงเวลาที่ใช้ในการนับจำนวน requests (หน่วยเป็นมิลลิวินาที)
- **max**: จำนวน requests สูงสุดที่อนุญาตต่อ IP ในช่วงเวลาที่กำหนด
- **message**: ข้อความที่ส่งกลับเมื่อเกินขีดจำกัด
- **statusCode**: รหัสสถานะ HTTP ที่ส่งกลับเมื่อเกินขีดจำกัด (ค่าเริ่มต้นคือ 429)

### การปรับใช้กับบาง routes

หากต้องการใช้ rate limiting เฉพาะบาง routes:

```javascript
// rate limiting เข้มงวดสำหรับ login
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
  max: 5, // 5 ครั้งต่อชั่วโมง
  message: 'Too many login attempts, please try again after an hour'
});

app.use('/api/auth/login', loginLimiter);
```

## XSS Protection

XSS-Clean เป็น middleware ที่ช่วยทำความสะอาดข้อมูลที่ผู้ใช้ป้อนเข้ามา เพื่อป้องกันการโจมตีแบบ Cross-Site Scripting (XSS)

```javascript
const xss = require('xss-clean');
app.use(xss());
```

### การทำงานของ XSS-Clean

- ทำความสะอาด HTML, JavaScript, และอักขระพิเศษที่อาจถูกใช้ในการโจมตีแบบ XSS
- แปลงอักขระพิเศษ (เช่น <, >, &, ") เป็น HTML entities
- ทำงานกับข้อมูลที่อยู่ใน body, query string, และ URL parameters

### ตัวอย่างการใช้งาน

```javascript
// ถ้าผู้ใช้ส่ง: { "name": "<script>alert('XSS')</script>" }
// หลังจากผ่าน xss middleware: { "name": "&lt;script&gt;alert('XSS')&lt;/script&gt;" }
```

## CORS

CORS (Cross-Origin Resource Sharing) ช่วยควบคุมการเข้าถึง API จากแหล่งต้นทางอื่น (origins) ที่ไม่ใช่โดเมนเดียวกับ API

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
```

### พารามิเตอร์หลัก

- **origin**: กำหนด domain ที่สามารถเข้าถึง API ได้ (อาจเป็น string, array, function, หรือ boolean)
- **methods**: HTTP methods ที่อนุญาต
- **credentials**: อนุญาตให้ส่ง cookies ข้าม domain หรือไม่
- **maxAge**: ระยะเวลาที่ browser จะ cache ผลลัพธ์ของ preflight request
- **allowedHeaders**: headers ที่อนุญาตให้ client ส่งมาได้
- **exposedHeaders**: headers ที่อนุญาตให้ client อ่านได้

### การอนุญาตหลาย origins

```javascript
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://my-production-site.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

## Body Parser

Body Parser เป็น middleware ที่แปลงข้อมูลที่ส่งมาใน HTTP request body ให้อยู่ในรูปแบบที่ใช้งานได้ (เช่น JSON, URL-encoded)

```javascript
// แปลง JSON
app.use(express.json({ limit: '10kb' })); 

// แปลง URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

### พารามิเตอร์หลัก

- **limit**: จำกัดขนาดของ request body (ป้องกันการโจมตีด้วยข้อมูลขนาดใหญ่)
- **extended**: ถ้าเป็น true จะใช้ library 'qs' ในการแปลง URL-encoded data (รองรับโครงสร้างข้อมูลที่ซับซ้อนกว่า)

### ข้อควรระวัง

- ควรกำหนด limit เพื่อป้องกันการโจมตี DoS
- อย่าลืมตรวจสอบและทำความสะอาดข้อมูลหลังจากแปลงแล้ว

## Logging (Morgan)

Morgan เป็น middleware สำหรับบันทึกข้อมูล HTTP requests เพื่อช่วยในการแก้ไขข้อผิดพลาดและตรวจสอบการใช้งาน

```javascript
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

### รูปแบบการบันทึก (Formats)

- **dev**: `:method :url :status :response-time ms`
- **combined**: Apache combined log format
- **common**: Apache common log format
- **short**: `:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms`
- **tiny**: `:method :url :status :res[content-length] - :response-time ms`

### การกำหนดรูปแบบเอง

```javascript
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :user-agent'));
```

### การบันทึกลงไฟล์

```javascript
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
```

## Error Handling

Middleware สำหรับจัดการข้อผิดพลาดทั้งหมดในแอปพลิเคชัน โดยทำหน้าที่แปลงข้อผิดพลาดให้อยู่ในรูปแบบที่เหมาะสมก่อนส่งกลับไปยัง client

```javascript
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

### การใช้งานกับ async functions

สำหรับ async functions ควรใช้ wrapper เพื่อจับข้อผิดพลาดและส่งต่อไปยัง error handler:

```javascript
// ฟังก์ชันช่วยจับข้อผิดพลาดใน async functions
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// ตัวอย่างการใช้งาน
app.get('/api/users', catchAsync(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

## Authentication Middleware

Middleware สำหรับตรวจสอบและยืนยันตัวตนของผู้ใช้จาก JWT token

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ตัวอย่างการใช้งาน
app.get('/api/protected-route', authenticateToken, (req, res) => {
  // ตรงนี้ req.userId จะมีค่าเป็น ID ของผู้ใช้ที่ยืนยันตัวตนแล้ว
  res.json({ message: 'You have access to this protected route' });
});
```

### การตรวจสอบบทบาท (Role-based Authorization)

```javascript
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ req.userId
      const user = await User.findByPk(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'You do not have permission to perform this action' 
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// ตัวอย่างการใช้งาน
app.delete('/api/users/:id', 
  authenticateToken, 
  checkRole(['admin']), 
  (req, res) => {
    // ดำเนินการลบผู้ใช้
  }
);
```

### การจัดการ Refresh Token

```javascript
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  
  try {
    // ตรวจสอบว่า refresh token มีอยู่ในฐานข้อมูลหรือไม่
    const tokenRecord = await RefreshToken.findOne({ 
      where: { 
        token: refreshToken,
        expires_at: { [Op.gt]: new Date() }
      } 
    });
    
    if (!tokenRecord) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    const userId = tokenRecord.user_id;
    
    // สร้าง access token ใหม่
    const newAccessToken = jwt.sign(
      { userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};
``` 