import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const ManagerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [alert, setAlert] = useState({ 
    show: false, 
    message: '', 
    variant: 'success' 
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
    
    // Simulate login API call
    console.log('Manager login data:', formData);
    
    // Show success alert
    setAlert({
      show: true,
      message: 'Login successful! Redirecting to dashboard...',
      variant: 'success'
    });

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/manager/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-container">
      {/* Alert notification */}
      {alert.show && (
        <Alert 
          variant={alert.variant}
          onClose={() => setAlert({...alert, show: false})}
          dismissible
          className="position-absolute top-0 start-50 translate-middle-x mt-3"
          style={{ width: '90%', maxWidth: '500px' }}
        >
          {alert.message}
        </Alert>
      )}

      <div className="auth-card">
        <h2 className="text-center mb-3">Welcome</h2>
        <p className="text-center mb-4 text-muted">Enter your Manager username and password to login</p>
        
        <div className="d-flex justify-content-between mb-4">
          <Link to="/manager/signup" className="btn btn-outline-primary">Sign Up</Link>
          <Link to="/" className="btn btn-outline-secondary">Home</Link>
        </div>

        <div className="text-center mb-4">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
            alt="Manager" 
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

export default ManagerLogin;