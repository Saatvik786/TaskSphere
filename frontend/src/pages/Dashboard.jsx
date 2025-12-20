import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { removeToken } from '../services/auth';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
    } catch (err) {
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }

      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save task. Please try again.'
      );
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const openModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pending' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pending' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#2196f3';
      default:
        return '#ff9800';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="btn btn-logout" onClick={handleLogout} title="Logout">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
        <div className="header-content">
          <h1>TaskSphere</h1>
          <p className="welcome-text">
            Welcome, {user?.name || 'User'}!
          </p>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <h2>My Tasks</h2>
          <button className="btn btn-primary" onClick={openModal}>
            + New Task
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span
                    className="task-status"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-footer">
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <div className="task-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

