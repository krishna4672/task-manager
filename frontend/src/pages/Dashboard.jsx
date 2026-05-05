import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const res = await axiosInstance.get('/dashboard/stats');
          setStats(res.data);
        } catch (err) {
          setError('Failed to fetch dashboard statistics.');
        }
      };
      fetchStats();
    }
  }, [user]);

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Overview</h2>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {stats ? (
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card text-white bg-primary h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title opacity-75">Total Projects</h5>
                <h2 className="display-4 fw-bold">{stats.totalProjects}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card text-dark bg-light h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title text-muted">Total Tasks</h5>
                <h2 className="display-4 fw-bold">{stats.totalTasks}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card text-white bg-secondary h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title opacity-75">Pending</h5>
                <h2 className="display-4 fw-bold">{stats.pendingTasks}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card text-white bg-info h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title opacity-75">In Progress</h5>
                <h2 className="display-4 fw-bold">{stats.inProgressTasks}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card text-white bg-success h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title opacity-75">Completed</h5>
                <h2 className="display-4 fw-bold">{stats.completedTasks}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card text-white bg-danger h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title opacity-75">Overdue</h5>
                <h2 className="display-4 fw-bold">{stats.overdueTasks}</h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !error && <p>Loading statistics...</p>
      )}
    </div>
  );
};

export default Dashboard;
