/**
 * Task Model
 */

const { getPool } = require('../config/database');

class Task {
  static async findByUser(userId, filters = {}) {
    const pool = getPool();
    let query = `
      SELECT t.*, p.name as project_name, p.color as project_color 
      FROM tasks t 
      LEFT JOIN projects p ON t.project_id = p.id 
      WHERE t.user_id = $1
    `;
    const values = [userId];
    let paramCount = 2;

    if (filters.status && filters.status !== 'all') {
      query += ` AND t.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.project_id) {
      query += ` AND t.project_id = $${paramCount}`;
      values.push(filters.project_id);
      paramCount++;
    }

    if (filters.priority) {
      query += ` AND t.priority = $${paramCount}`;
      values.push(filters.priority);
      paramCount++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async create(taskData, userId) {
    const { title, description, status = 'pending', priority = 'medium', due_date, project_id } = taskData;
    const pool = getPool();
    
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, project_id, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, status, priority, due_date, project_id, userId]
    );
    
    return result.rows[0];
  }

  static async update(id, updates, userId) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    values.push(id, userId);
    const query = `
      UPDATE tasks 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const pool = getPool();
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }

  static async toggleComplete(id, userId) {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE tasks 
       SET status = CASE 
         WHEN status = 'completed' THEN 'pending' 
         ELSE 'completed' 
       END,
       completed_at = CASE 
         WHEN status != 'completed' THEN CURRENT_TIMESTAMP 
         ELSE NULL 
       END,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  }

  static async getStats(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 1 END) as overdue
       FROM tasks 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = Task;