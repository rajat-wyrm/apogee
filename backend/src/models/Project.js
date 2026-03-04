/**
 * Project Model
 * Handles all database operations related to projects
 */

const { getPool } = require('../config/database');

class Project {
  // Find all projects for a user
  static async findByUser(userId) {
    try {
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
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }

  // Find project by ID
  static async findById(id, userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        `SELECT p.*, 
          COUNT(t.id) as task_count,
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
         FROM projects p 
         LEFT JOIN tasks t ON p.id = t.project_id 
         WHERE p.id = $1 AND p.user_id = $2 
         GROUP BY p.id`,
        [id, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  // Create new project
  static async create(projectData, userId) {
    try {
      const { name, description, color = '#6366f1' } = projectData;
      const pool = getPool();
      
      const result = await pool.query(
        `INSERT INTO projects (name, description, color, user_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [name, description, color, userId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  // Update project
  static async update(id, updates, userId) {
    try {
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
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  // Delete project
  static async delete(id, userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  // Get project statistics
  static async getStats(userId) {
    try {
      const pool = getPool();
      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_projects,
          SUM(CASE 
            WHEN (SELECT COUNT(*) FROM tasks WHERE project_id = projects.id AND status != 'completed') > 0 
            THEN 1 ELSE 0 END) as active_projects,
          SUM((SELECT COUNT(*) FROM tasks WHERE project_id = projects.id)) as total_tasks,
          SUM((SELECT COUNT(*) FROM tasks WHERE project_id = projects.id AND status = 'completed')) as completed_tasks
         FROM projects 
         WHERE user_id = $1`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }
}

module.exports = Project;