import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee login data:', formData);
    // Add your login API call here
    
    // Redirect to employee dashboard after login
    navigate('/employee/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-3">Welcome</h2>
        <p className="text-center mb-4 text-muted">Enter your Employee username and password to login</p>
        
        <div className="d-flex justify-content-center mb-4">
          <Link to="/" className="btn btn-outline-secondary">Home</Link>
        </div>

        <div className="text-center mb-4">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3237/3237472.png" 
            alt="Employee" 
            className="auth-image"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;