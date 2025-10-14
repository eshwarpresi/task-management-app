const db = require('../config/database');

class Task {
  static create(taskData, callback) {
    const { title, description, status = 'pending', user_id } = taskData;
    const sql = `INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [title, description, status, user_id], function(err) {
      callback(err, { 
        id: this.lastID, 
        title, 
        description, 
        status, 
        user_id,
        created_at: new Date().toISOString()
      });
    });
  }

  static findAll(userId, userRole, callback) {
    let sql = `SELECT t.*, u.email as user_email FROM tasks t 
               JOIN users u ON t.user_id = u.id`;
    let params = [];
    
    if (userRole !== 'admin') {
      sql += ` WHERE t.user_id = ?`;
      params = [userId];
    }
    
    sql += ` ORDER BY t.created_at DESC`;
    
    db.all(sql, params, callback);
  }

  static findById(id, callback) {
    const sql = `SELECT t.*, u.email as user_email FROM tasks t 
                 JOIN users u ON t.user_id = u.id 
                 WHERE t.id = ?`;
    db.get(sql, [id], callback);
  }

  static update(id, taskData, callback) {
    const { title, description, status } = taskData;
    const updated_at = new Date().toISOString();
    
    const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = ? 
                 WHERE id = ?`;
    
    db.run(sql, [title, description, status, updated_at, id], function(err) {
      callback(err, this.changes);
    });
  }

  static delete(id, callback) {
    const sql = `DELETE FROM tasks WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Task;