import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // API Integration
      const response = await axiosInstance.post('/auth/signup', { name, email, password });
      
      const { token, ...userData } = response.data;
      
      // Store JWT in localStorage (handled inside context) and update state
      login(userData, token);
      
      // Redirect after signup
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 font-weight-bold">Create Account</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Email address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100">Sign Up</button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted">Already have an account? <Link to="/login" className="text-decoration-none">Log in</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
