import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MyTasks = () => {
  const { user, loading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchMyTasks = async () => {
        try {
          const res = await axiosInstance.get('/tasks');
          setTasks(res.data);
        } catch (err) {
          setError('Failed to fetch your tasks.');
        }
      };
      fetchMyTasks();
    }
  }, [user]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError('Failed to update task status.');
    }
  };

  const getPriorityBadge = (priority) => {
    const map = { High: 'danger', Medium: 'warning', Low: 'info' };
    return <span className={`badge bg-${map[priority] || 'secondary'} rounded-pill`}>{priority}</span>;
  };

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <h2 className="mb-4">My Tasks</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {tasks.length === 0 && !error ? (
        <div className="text-center mt-5"><h4 className="text-muted">You have no tasks assigned.</h4></div>
      ) : (
        <div className="row g-4">
          {tasks.map(task => (
            <div key={task._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0">{task.title}</h5>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-muted small mb-2">{task.project?.title || '—'}</p>
                  <p className="card-text mb-3">{task.description || 'No description.'}</p>

                  {task.dueDate && (
                    <p className="text-muted small mb-3">
                      Due: <span className="fw-semibold">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </p>
                  )}

                  <label className="form-label text-muted small">Update Status</label>
                  <select
                    className="form-select"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
