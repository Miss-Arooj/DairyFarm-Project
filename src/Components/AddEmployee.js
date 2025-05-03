import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Form,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';
import api from '../api';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    contact: '',
    salary: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await api.post('/api/employees', formData);
      
      setAlert({
        show: true,
        message: 'Employee added successfully!',
        variant: 'success'
      });
      
      setTimeout(() => {
        navigate('/manager/dashboard');
      }, 1500);
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || 'Failed to add employee',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
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
        
        <h2 className="text-center mb-3">Add New Employee</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salary (Rs)</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </Form.Group>

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

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Adding Employee...</span>
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/manager/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddEmployee;