import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ManagerSignup from './Components/ManagerSignup';
import ManagerLogin from './Components/ManagerLogin';
import EmployeeLogin from './Components/EmployeeLogin';
import ManagerDashboard from './Components/ManagerDashboard';
import EmployeeDashboard from './Components/EmployeeDashboard';
import CustomerOrder from './Components/CustomerOrder'; // Add this import
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
     <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/manager/signup" element={<ManagerSignup />} />
      <Route path="/manager/login" element={<ManagerLogin />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/customer/order" element={<CustomerOrder />} /> {/* Add this route */}
     </Routes>
     <h1>{message}</h1>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="app-container">
      <div className="background-image"></div>
      <div className="overlay"></div>
      
      <div className="content-container">
        <h1 className="display-3 fw-bold mb-5 text-uppercase">EXPLORE THE UNKNOWN</h1>
        
        <div className="quote-box bg-light bg-opacity-25 p-4 rounded mb-5 backdrop-blur">
          <p className="fs-3 fst-italic mb-0">
            "Welcome to our Dairy Farm, where farm-fresh milk meets wholesome goodness!"
          </p>
        </div>
        
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link 
            to="/manager/signup"
            className="btn btn-success btn-lg px-4 py-2 fw-bold text-uppercase hover-scale"
          >
            SIGN UP
          </Link>
          <Link 
            to="/manager/login"
            className="btn btn-success btn-lg px-4 py-2 fw-bold text-uppercase hover-scale"
          >
            LOGIN
          </Link>
          <Link 
            to="/employee/login"
            className="btn btn-warning btn-lg px-4 py-2 fw-bold text-uppercase hover-scale"
          >
            Employee login
          </Link>
          <Link 
            to="/customer/order"
            className="btn btn-info btn-lg px-4 py-2 fw-bold text-uppercase hover-scale"
          >
            Order Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;