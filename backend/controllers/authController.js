const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

/**
 * ลงทะเบียนผู้ใช้ใหม่
 */
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
    const userExists = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'อีเมลหรือชื่อผู้ใช้นี้มีในระบบแล้ว'
      });
    }

    // เข้ารหัสรหัสผ่าน
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // เพิ่มผู้ใช้ใหม่
    const result = await db.query(
      `INSERT INTO users (username, email, password, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, full_name, role, created_at`,
      [username, email, hashedPassword, full_name || null, 'user']
    );

    // สร้าง JWT token
    const accessToken = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // สร้าง refresh token
    const refreshToken = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // บันทึก refresh token ลงฐานข้อมูล
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 วัน
    
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, refreshToken, expiresAt]
    );

    res.status(201).json({
      status: 'success',
      message: 'ลงทะเบียนสำเร็จ',
      data: {
        user: result.rows[0],
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
};

/**
 * เข้าสู่ระบบ
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const result = await db.query(
      'SELECT id, username, email, password, role, full_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const user = result.rows[0];

    // ตรวจสอบรหัสผ่าน
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // สร้าง JWT token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // สร้าง refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // บันทึก refresh token ลงฐานข้อมูล
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 วัน
    
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // บันทึกข้อมูลการเข้าสู่ระบบ
    await db.query(
      `INSERT INTO user_sessions (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [user.id, req.ip, req.headers['user-agent'] || '']
    );

    res.json({
      status: 'success',
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
};

/**
 * ดึงข้อมูลผู้ใช้ปัจจุบัน
 */
const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, full_name, avatar_url, bio, role, created_at
       FROM users
       WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};

/**
 * รีเฟรช token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    // ตรวจสอบว่า refresh token มีอยู่ในฐานข้อมูลหรือไม่
    const tokenResult = await db.query(
      `SELECT user_id, expires_at
       FROM refresh_tokens
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token ไม่ถูกต้องหรือหมดอายุ'
      });
    }

    const userId = tokenResult.rows[0].user_id;

    // สร้าง access token ใหม่
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการรีเฟรช token'
    });
  }
};

/**
 * ออกจากระบบ
 */
const logout = async (req, res) => {
  try {
    // ลบ refresh token ออกจากฐานข้อมูล
    // ในกรณีจริงต้องส่ง refreshToken มาจาก client ด้วย
    // แต่ตอนนี้เราจะลบทุก token ของผู้ใช้นี้เพื่อความง่าย
    await db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      status: 'success',
      message: 'ออกจากระบบสำเร็จ'
    });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  logout
}; 