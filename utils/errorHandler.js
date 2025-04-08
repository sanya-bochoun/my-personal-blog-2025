/**
 * ฟังก์ชันสำหรับจับ error ใน async function
 * @param {Function} fn - ฟังก์ชัน async ที่ต้องการจับ error
 * @returns {Function} - middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class สำหรับใช้ในแอปพลิเคชัน
 * @example
 * throw new AppError('ไม่พบข้อมูลผู้ใช้', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  catchAsync,
  AppError
}; 