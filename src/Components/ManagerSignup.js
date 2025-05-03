import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    contact: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    fullName: '',
    password: '',
    contact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {
      username: formData.username.length <= 6 ? 'Username must be greater than 6 characters' : '',
      fullName: formData.fullName.length <= 6 ? 'Name must be greater than 6 characters' : '',
      password: formData.password.length <= 4 ? 'Password must be greater than 4 characters' : '',
      contact: isNaN(formData.contact) ? 'Contact must be numeric' : ''
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(x => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          username: formData.username,
          fullName: formData.fullName,
          password: formData.password,
          contact: formData.contact
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify({
            username: res.data.username,
            role: res.data.role
          }));
          navigate('/manager/dashboard');
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert(err.response?.data?.message || 
             err.message || 
             'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-3">Welcome</h2>
        <p className="text-center mb-4 text-muted">You are 30 seconds from managing your farm</p>
        
        <div className="d-flex justify-content-between mb-4">
          <Link to="/manager/login" className="btn btn-outline-primary">Login</Link>
          <Link to="/" className="btn btn-outline-secondary">Home</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username && 'is-invalid'}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName && 'is-invalid'}`}
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password && 'is-invalid'}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              type="text"
              className={`form-control ${errors.contact && 'is-invalid'}`}
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
        </form>
      </div>
    </div>
  );
};

export default ManagerSignup;