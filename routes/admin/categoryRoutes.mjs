import express from 'express';
import { authenticateToken, checkRole } from '../../middleware/authMiddleware.mjs';
import pool from '../../utils/db.mjs';
import { slugify } from '../../utils/helpers.mjs';

const router = express.Router();

// Create category
router.post('/', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'กรุณาระบุชื่อหมวดหมู่'
            });
        }

        // Check if category exists
        const categoryExists = await pool.query(
            'SELECT * FROM categories WHERE name = $1',
            [name]
        );

        if (categoryExists.rows.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'ชื่อหมวดหมู่นี้มีอยู่ในระบบแล้ว'
            });
        }

        // Create slug
        const slug = slugify(name);

        // Insert new category
        const newCategory = await pool.query(
            'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
            [name, slug, description]
        );

        res.status(201).json({
            status: 'success',
            data: newCategory.rows[0]
        });

    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่'
        });
    }
});

// Get all categories
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY created_at DESC'
        );

        res.json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
        });
    }
});

// Search categories
router.get('/search', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                status: 'error',
                message: 'กรุณาระบุคำค้นหา'
            });
        }

        // แก้ไขการค้นหาให้ค้นหาได้ทั้งจาก name, slug และ description
        const searchQuery = q.toLowerCase().trim();
        const result = await pool.query(
            `SELECT * FROM categories 
             WHERE LOWER(name) LIKE $1 
             OR LOWER(slug) LIKE $1 
             OR LOWER(description) LIKE $1 
             ORDER BY created_at DESC`,
            [`%${searchQuery}%`]
        );

        res.json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        console.error('Error searching categories:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการค้นหาหมวดหมู่'
        });
    }
});

// Get single category
router.get('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบหมวดหมู่ที่ต้องการ'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่'
        });
    }
});

// Update category
router.put('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'กรุณาระบุชื่อหมวดหมู่'
            });
        }

        // Check if category exists (excluding current category)
        const categoryExists = await pool.query(
            'SELECT * FROM categories WHERE name = $1 AND id != $2',
            [name, id]
        );

        if (categoryExists.rows.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'ชื่อหมวดหมู่นี้มีอยู่ในระบบแล้ว'
            });
        }

        // Create slug
        const slug = slugify(name);

        // Update category
        const updatedCategory = await pool.query(
            'UPDATE categories SET name = $1, slug = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [name, slug, description, id]
        );

        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข'
            });
        }

        res.json({
            status: 'success',
            data: updatedCategory.rows[0]
        });

    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่'
        });
    }
});

// Delete category
router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category is being used
        const postsUsingCategory = await pool.query(
            'SELECT COUNT(*) FROM posts WHERE category_id = $1',
            [id]
        );

        if (parseInt(postsUsingCategory.rows[0].count) > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'ไม่สามารถลบหมวดหมู่นี้ได้เนื่องจากมีบทความที่ใช้หมวดหมู่นี้อยู่'
            });
        }

        // Delete category
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบหมวดหมู่ที่ต้องการลบ'
            });
        }

        res.json({
            status: 'success',
            message: 'ลบหมวดหมู่เรียบร้อยแล้ว'
        });

    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการลบหมวดหมู่'
        });
    }
});

export default router; 