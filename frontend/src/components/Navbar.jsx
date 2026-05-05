import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Team Task Manager</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">Projects</Link>
            </li>
            {user.role === 'Admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/tasks">All Tasks</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/my-tasks">My Tasks</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center text-white">
            <span className="me-3">Hi, {user.name} ({user.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
