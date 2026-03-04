/**
 * Project Model
 */

const { getPool } = require('../config/database');

class Project {
  static async findByUser(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT p.*, COUNT(t.id) as task_count 
       FROM projects p 
       LEFT JOIN tasks t ON p.id = t.project_id 
       WHERE p.user_id = $1 
       GROUP BY p.id 
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async create(projectData, userId) {
    const { name, description, color = '#6366f1' } = projectData;
    const pool = getPool();
    
    const result = await pool.query(
      `INSERT INTO projects (name, description, color, user_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, description, color, userId]
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
      UPDATE projects 
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
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Project;