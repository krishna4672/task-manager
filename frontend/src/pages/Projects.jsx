import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Projects = () => {
  const { user, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          const res = await axiosInstance.get('/projects');
          setProjects(res.data);
        } catch (err) {
          setError('Failed to fetch projects.');
        }
      };
      fetchProjects();
    }
  }, [user]);

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        {user.role === 'Admin' && (
          <Link to="/projects/new" className="btn btn-primary rounded-pill px-4 shadow-sm">
            + Create Project
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {projects.length === 0 && !error ? (
          <div className="col-12 text-center mt-5">
            <h4 className="text-muted">No projects found.</h4>
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 bg-light">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold text-dark">{project.title}</h5>
                  <p className="card-text text-muted mb-0">{project.description || 'No description provided.'}</p>
                </div>
                <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                  <div className="d-flex align-items-center mt-3">
                    <small className="text-muted">Created By: <span className="fw-semibold">{project.createdBy?.name || 'Unknown'}</span></small>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
