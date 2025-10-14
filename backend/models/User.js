const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData, callback) {
    const { email, password, role = 'user' } = userData;
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      
      const sql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
      db.run(sql, [email, hashedPassword, role], function(err) {
        callback(err, { id: this.lastID, email, role });
      });
    });
  }

  static findByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], callback);
  }

  static findById(id, callback) {
    const sql = `SELECT id, email, role, created_at FROM users WHERE id = ?`;
    db.get(sql, [id], callback);
  }

  static comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, callback);
  }
}

module.exports = User;