import db from '../utils/db.mjs';

export class User {
    static async findOne({ email }) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async findById(userId) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
} 