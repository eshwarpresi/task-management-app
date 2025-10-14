const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, role } = req.body;

      User.findByEmail(email, (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        User.create({ email, password, role }, (err, newUser) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            user: {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role
            },
            token
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      User.findByEmail(email, (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err || !isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
          );

          res.json({
            message: 'Login successful',
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            },
            token
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getProfile: async (req, res) => {
    try {
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;