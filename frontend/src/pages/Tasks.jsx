import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Tasks = () => {
  const { user, loading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          const res = await axiosInstance.get('/tasks');
          setTasks(res.data);
        } catch (err) {
          setError('Failed to fetch tasks.');
        }
      };
      fetchTasks();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const getPriorityBadge = (priority) => {
    const map = { High: 'danger', Medium: 'warning', Low: 'info' };
    return <span className={`badge bg-${map[priority] || 'secondary'} rounded-pill`}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const map = { Pending: 'secondary', 'In Progress': 'primary', Completed: 'success' };
    return <span className={`badge bg-${map[status] || 'secondary'} rounded-pill`}>{status}</span>;
  };

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Tasks</h2>
        {user.role === 'Admin' && (
          <Link to="/tasks/new" className="btn btn-primary rounded-pill px-4 shadow-sm">
            + Assign Task
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {tasks.length === 0 && !error ? (
        <div className="text-center mt-5"><h4 className="text-muted">No tasks found.</h4></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white shadow-sm rounded-4 overflow-hidden">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                {user.role === 'Admin' && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td className="fw-semibold">{task.title}</td>
                  <td>{task.project?.title || '—'}</td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>{getStatusBadge(task.status)}</td>
                  <td>{getPriorityBadge(task.priority)}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                  {user.role === 'Admin' && (
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tasks;
