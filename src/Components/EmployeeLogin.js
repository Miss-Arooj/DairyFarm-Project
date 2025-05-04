import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'danger' });
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
    
    if (!formData.username || !formData.password) {
      setAlert({
        show: true,
        message: 'Please fill in all fields',
        variant: 'danger'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/employee-login', formData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('employeeToken', response.data.token);
        localStorage.setItem('employeeData', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          role: response.data.role
        }));
        navigate('/employee/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAlert({
        show: true,
        message: err.response?.data?.message || err.message || 'Login failed. Please try again.',
        variant: 'danger'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
            {alert.message}
          </Alert>
        )}
        
        <h2 className="text-center mb-3">Employee Login</h2>
        <p className="text-center mb-4">Enter your credentials to access the employee dashboard</p>
        
        {/* Home Button */}
        <div className="d-flex justify-content-center mb-4">
          <Link to="/" className="btn btn-outline-secondary">
            Back to Home
          </Link>
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
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeLogin;