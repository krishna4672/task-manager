import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const CreateTask = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      const fetchData = async () => {
        try {
          const [projRes, usersRes] = await Promise.all([
            axiosInstance.get('/projects'),
            axiosInstance.get('/users'),
          ]);
          setProjects(projRes.data);
          setUsers(usersRes.data);
        } catch (err) {
          setError('Failed to load projects or users.');
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Admin') return <Navigate to="/tasks" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !project) {
      setError('Task title and project are required.');
      return;
    }

    try {
      await axiosInstance.post('/tasks', {
        title,
        description,
        project,
        assignedTo: assignedTo || undefined,
        dueDate: dueDate || undefined,
        priority,
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 mt-4">
            <div className="card-body p-5">
              <h3 className="mb-4 text-center fw-bold">Assign New Task</h3>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Task Title</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="E.g., Build login page"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Details about the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Project</label>
                  <select
                    className="form-select form-select-lg"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Assign To</label>
                  <select
                    className="form-select form-select-lg"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Priority</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-grid gap-3 d-md-flex justify-content-md-end mt-3">
                  <button type="button" className="btn btn-light btn-lg px-4" onClick={() => navigate('/tasks')}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">Assign Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
