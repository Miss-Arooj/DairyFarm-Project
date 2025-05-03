import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/employee-login', formData);
      
      // Save token and user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data._id,
        role: 'employee',
        name: response.data.name
      }));
      
      setAlert({
        show: true,
        message: 'Login successful! Redirecting...',
        variant: 'success'
      });
      
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 1500);
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || 'Invalid credentials',
        variant: 'danger'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {alert.show && (
          <Alert 
            variant={alert.variant}
            onClose={() => setAlert({...alert, show: false})}
            dismissible
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}
        
        <h2 className="text-center mb-3">Employee Login</h2>
        <p className="text-center mb-4 text-muted">Enter your credentials to access your dashboard</p>
        
        <div className="d-flex justify-content-center mb-4">
          <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeLogin;