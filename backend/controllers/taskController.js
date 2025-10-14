const Task = require('../models/Task');

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, status } = req.body;
      
      Task.create(
        { title, description, status, user_id: req.user.id },
        (err, newTask) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to create task' });
          }
          
          res.status(201).json({
            message: 'Task created successfully',
            task: newTask
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllTasks: async (req, res) => {
    try {
      Task.findAll(req.user.id, req.user.role, (err, tasks) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        
        res.json({ tasks });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      
      Task.findById(id, (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json({ task });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      Task.findById(id, (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        Task.update(id, { title, description, status }, (err, changes) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update task' });
          }
          
          res.json({ message: 'Task updated successfully' });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      Task.findById(id, (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }

        Task.delete(id, (err, changes) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to delete task' });
          }
          
          res.json({ message: 'Task deleted successfully' });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = taskController;