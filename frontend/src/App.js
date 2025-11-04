import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backendStatus, setBackendStatus] = useState('Checking...');

  // ✅ Use environment variable or fallback to localhost
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // ✅ Test backend connection on component mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/health`)
      .then(() => setBackendStatus('Connected to backend ✓'))
      .catch(() => setBackendStatus('Backend connection failed ✗'));
  }, [API_BASE_URL]);

  const addTask = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Task Management App</h1>
        <p className="status">Status: {backendStatus}</p>
        
        {/* Add Task Form */}
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-input"
          />
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="task-textarea"
          />
          <button type="submit" className="add-btn">Add Task</button>
        </form>

        {/* Tasks List */}
        <div className="tasks-container">
          <h2>Your Tasks ({tasks.filter(t => !t.completed).length} pending)</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>Created: {task.createdAt}</small>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`toggle-btn ${task.completed ? 'undo' : 'complete'}`}
                  >
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
