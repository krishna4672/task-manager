import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Form Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // API Integration
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      const { token, ...userData } = response.data;
      
      // Store JWT in localStorage (handled inside context) and update state
      login(userData, token);
      
      // Redirect after login
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 font-weight-bold">Welcome Back</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
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
                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100">Log In</button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted">Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
