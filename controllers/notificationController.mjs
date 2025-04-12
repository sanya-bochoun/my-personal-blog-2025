import db from '../utils/db.mjs';

/**
 * ดึงรายการแจ้งเตือน
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({
      status: 'success',
      data: {
        notifications: result.rows
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงการแจ้งเตือน'
    });
  }
};

/**
 * ทำเครื่องหมายว่าอ่านแล้ว
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await db.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบการแจ้งเตือน'
      });
    }

    res.json({
      status: 'success',
      data: {
        notification: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการทำเครื่องหมายว่าอ่านแล้ว'
    });
  }
};

/**
 * ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      status: 'success',
      message: 'ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการทำเครื่องหมายว่าอ่านทั้งหมด'
    });
  }
};

/**
 * ลบการแจ้งเตือน
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await db.query(
      `DELETE FROM notifications 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบการแจ้งเตือน'
      });
    }

    res.json({
      status: 'success',
      message: 'ลบการแจ้งเตือนสำเร็จ'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการลบการแจ้งเตือน'
    });
  }
};

/**
 * สร้างการแจ้งเตือนใหม่
 */
export const createNotification = async (userId, type, message, link = null, data = {}) => {
  try {
    const result = await db.query(
      `INSERT INTO notifications (user_id, type, message, link, data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, type, message, link, JSON.stringify(data)]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
}; 