import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const CreateProject = () => {
  const { user, loading } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Admin') return <Navigate to="/projects" />; // Ensure protection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Project title is required');
      return;
    }

    try {
      await axiosInstance.post('/projects', { title, description });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 mt-4">
            <div className="card-body p-5">
              <h3 className="mb-4 text-center fw-bold">Create New Project</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Project Title</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg"
                    placeholder="E.g., Website Redesign"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Description</label>
                  <textarea 
                    className="form-control form-control-lg"
                    rows="4"
                    placeholder="Brief overview of the project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="d-grid gap-3 d-md-flex justify-content-md-end">
                  <button type="button" className="btn btn-light btn-lg px-4" onClick={() => navigate('/projects')}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
