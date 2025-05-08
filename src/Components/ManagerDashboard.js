import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
         CategoryScale, 
         LinearScale, 
         BarElement, 
         LineElement, 
         PointElement, 
         Title, 
         Tooltip, 
         Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('employees');

  // Employee State
  const [activeEmpTab, setActiveEmpTab] = useState('view');
  const [employees, setEmployees] = useState([]);
  const [empSearchTerm, setEmpSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    gender: 'Male',
    contact: '',
    salary: '',
    username: '',
    password: ''
  });

  // Milk Production State
  const [activeMilkTab, setActiveMilkTab] = useState('daily');
  const [milkData, setMilkData] = useState([]);
  const [milkSearchTerm, setMilkSearchTerm] = useState('');
  // Stats declarations
  const [milkStats, setMilkStats] = useState([]);
  const [loadingMilkStats, setLoadingMilkStats] = useState(false);

  // Sales State
  const [activeSalesTab, setActiveSalesTab] = useState('records');
  const [salesData, setSalesData] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [salesStats, setSalesStats] = useState([]);
  const [loadingSalesStats, setLoadingSalesStats] = useState(false);

  // Finance State
  const [activeFinanceTab, setActiveFinanceTab] = useState('expense');
  const [financeData, setFinanceData] = useState([]);
  const [financeSearchTerm, setFinanceSearchTerm] = useState('');
  const [financeStats, setFinanceStats] = useState([]);
  const [loadingFinanceStats, setLoadingFinanceStats] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (activeSection === 'employees' && activeEmpTab === 'view') {
      fetchEmployees();
    } else if (activeSection === 'milk' && activeMilkTab === 'daily') {
      fetchMilkRecords();
    } else if (activeSection === 'milk' && activeMilkTab === 'stats') {
      fetchMilkStats();
    }  else if (activeSection === 'sales' && activeSalesTab === 'records') {
      fetchSalesRecords();
    } else if (activeSection === 'sales' && activeSalesTab === 'stats') {
      fetchSalesStats();
    } else if (activeSection === 'finance' && activeFinanceTab === 'expense') {
      fetchFinanceRecords();
    } else if (activeSection === 'finance' && activeFinanceTab === 'stats') {
      fetchFinanceStats();
    }
  }, [activeSection, activeEmpTab, activeMilkTab, activeSalesTab, activeFinanceTab]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load employees', 'danger');
    }
  };

  const fetchMilkRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/milk', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMilkData(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load milk records', 'danger');
    }
  };

  const fetchMilkStats = async () => {
    setLoadingMilkStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/milk/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMilkStats(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load milk statistics', 'danger');
    } finally {
      setLoadingMilkStats(false);
    }
  };

  const fetchSalesRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sales', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSalesData(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load sales records', 'danger');
    }
  };

  const fetchSalesStats = async () => {
    setLoadingSalesStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sales/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSalesStats(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load sales statistics', 'danger');
    } finally {
      setLoadingSalesStats(false);
    }
  };

  const fetchFinanceStats = async () => {
    setLoadingFinanceStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/finance/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFinanceStats(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load finance statistics', 'danger');
    } finally {
      setLoadingFinanceStats(false);
    }
  };

  const fetchFinanceRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/finance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFinanceData(response.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load finance records', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/employees',
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setEmployees(prev => [...prev, response.data]);
      setNewEmployee({
        name: '',
        gender: 'Male',
        contact: '',
        salary: '',
        username: '',
        password: ''
      });
      showAlert('Employee added successfully!', 'success');
      setActiveEmpTab('view');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add employee', 'danger');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.employeeId?.toString().includes(empSearchTerm) ||
    emp.name?.toLowerCase().includes(empSearchTerm.toLowerCase())
  );

  const filteredMilkData = milkData.filter(item =>
    item.animalId?.toLowerCase().includes(milkSearchTerm.toLowerCase()) ||
    item.date?.toLowerCase().includes(milkSearchTerm.toLowerCase())
  );

  const filteredSalesData = salesData.filter(item =>
    item.salesId?.toString().includes(salesSearchTerm) ||
    item.customerName?.toLowerCase().includes(salesSearchTerm.toLowerCase())
  );

  const filteredFinanceData = financeData.filter(item =>
    item.date?.toLowerCase().includes(financeSearchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(financeSearchTerm.toLowerCase())
  );

  const renderEmployeesSection = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <div>
          <Button
            variant={activeEmpTab === 'view' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveEmpTab('view')}
          >
            View Employees
          </Button>
          <Button
            variant={activeEmpTab === 'add' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveEmpTab('add')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {activeEmpTab === 'view' ? (
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Employee ID or Name"
              value={empSearchTerm}
              onChange={(e) => setEmpSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Salary (Rs)</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <tr key={emp._id}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.gender}</td>
                    <td>{emp.contact}</td>
                    <td>{emp.salary}</td>
                    <td>{emp.username}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <Form onSubmit={handleAddEmployee}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={newEmployee.gender}
              onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
              required
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
              placeholder="Enter contact number"
              value={newEmployee.contact}
              onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salary (Rs)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter salary"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username (min 6 chars)"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              minLength={6}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password (min 6 chars)"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              minLength={6}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Add Employee
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setActiveEmpTab('view')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Card>
  );

  const renderMilkProductionSection = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Milk Production</h2>
        <div>
          <Button
            variant={activeMilkTab === 'daily' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveMilkTab('daily')}
          >
            Daily Production
          </Button>
          <Button
            variant={activeMilkTab === 'stats' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveMilkTab('stats')}
          >
            Production Stats
          </Button>
        </div>
      </div>
  
      {activeMilkTab === 'daily' ? (
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Animal ID or Date"
              value={milkSearchTerm}
              onChange={(e) => setMilkSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>
  
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Production Date</th>
                <th>Animal ID</th>
                <th>Quantity (KG)</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {filteredMilkData.length > 0 ? (
                filteredMilkData.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.productionDate).toLocaleDateString()}</td>
                    <td>{record.animalId}</td>
                    <td>{record.quantity}</td>
                    <td>{record.quality}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No milk production records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <>
          {loadingMilkStats ? (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <>
        <h4 className="mb-3">Daily Production Statistics (Last 30 Days)</h4>
        
        {/* Quantity Chart */}
        <div className="mb-4">
          <h5>Daily Milk Production (KG)</h5>
          <div style={{ height: '300px' }}>
            <Bar
              data={{
                labels: milkStats.map(stat => stat._id),
                datasets: [{
                  label: 'Quantity (KG)',
                  data: milkStats.map(stat => stat.totalQuantity),
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Kilograms (KG)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Quality Trend Chart */}
        <div className="mb-4">
          <h5>Quality Trend</h5>
          <div style={{ height: '300px' }}>
            <Line
              data={{
                labels: milkStats.map(stat => stat._id),
                datasets: [{
                  label: 'Quality Score',
                  data: milkStats.map(stat => stat.avgQuality),
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.3,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 4,
                    ticks: {
                      stepSize: 1,
                      callback: function(value) {
                        const ratings = ['', 'Poor', 'Average', 'Good', 'Excellent'];
                        return ratings[value] || '';
                      }
                    },
                    title: {
                      display: true,
                      text: 'Quality Rating'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-4">
          <h5>Summary of Last 30 Days</h5>
          <div className="row">
            <div className="col-md-4">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Production</Card.Title>
                  <Card.Text className="fs-3">
                    {milkStats.reduce((sum, stat) => sum + stat.totalQuantity, 0).toFixed(2)} KG
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Daily</Card.Title>
                  <Card.Text className="fs-3">
                    {(milkStats.reduce((sum, stat) => sum + stat.totalQuantity, 0) / milkStats.length).toFixed(2)} KG
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Quality</Card.Title>
                  <Card.Text>
                    <span className={`badge ${
                      milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 3.5 ? 'bg-success' :
                      milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 2.5 ? 'bg-primary' :
                      milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 1.5 ? 'bg-warning' : 'bg-danger'
                    } fs-6`}>
                      {milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 3.5 ? 'Excellent' :
                        milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 2.5 ? 'Good' :
                        milkStats.reduce((sum, stat) => sum + stat.avgQuality, 0) / milkStats.length >= 1.5 ? 'Average' : 'Poor'
                      }
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-4">
          <h5>Detailed Statistics</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Quantity (KG)</th>
                <th>Records Count</th>
                <th>Average Quality</th>
              </tr>
            </thead>
            <tbody>
              {milkStats.map((stat) => (
                <tr key={stat._id}>
                  <td>{stat._id}</td>
                  <td>{stat.totalQuantity.toFixed(2)}</td>
                  <td>{stat.count}</td>
                  <td>
                    <span className={`badge ${
                      stat.qualityRating === 'Excellent' ? 'bg-success' :
                      stat.qualityRating === 'Good' ? 'bg-primary' :
                      stat.qualityRating === 'Average' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {stat.qualityRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    )}
  </>
      )}
    </Card>
  );

  const renderSalesSection = () => {
    // Filter sales data based on search term
    const filteredSalesData = salesData.filter(item =>
      item.saleId?.toString().includes(salesSearchTerm) ||
      item.customerName?.toLowerCase().includes(salesSearchTerm.toLowerCase())
    );
  
    return (
      <Card className="p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Sales Management</h2>
          <div>
            <Button
              variant={activeSalesTab === 'records' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveSalesTab('records')}
            >
              Sales Records
            </Button>
            <Button
              variant={activeSalesTab === 'stats' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveSalesTab('stats')}
            >
              Sales Statistics
            </Button>
          </div>
        </div>
  
        {activeSalesTab === 'records' ? (
          <>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by Sales ID or Customer Name"
                value={salesSearchTerm}
                onChange={(e) => setSalesSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                Search
              </Button>
            </InputGroup>
  
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sales ID</th>
                  <th>Customer Name</th>
                  <th>Product ID</th>
                  <th>Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesData.length > 0 ? (
                  filteredSalesData.map((sale) => (
                    <tr key={sale._id}>
                      <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                      <td>{sale.saleId}</td>
                      <td>{sale.customerName}</td>
                      <td>{sale.productId}</td>
                      <td>{sale.totalCost.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No sales records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            {loadingSalesStats ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h4 className="mb-3">Daily Sales Statistics (Last 30 Days)</h4>
                
                {/* Revenue Chart */}
                <div className="mb-4">
                  <h5>Daily Sales Revenue</h5>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={{
                        labels: salesStats.map(stat => stat._id),
                        datasets: [{
                          label: 'Revenue (Rs)',
                          data: salesStats.map(stat => stat.totalSales),
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Rupees (Rs)'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
  
                {/* Transactions Chart */}
                <div className="mb-4">
                  <h5>Daily Transactions</h5>
                  <div style={{ height: '300px' }}>
                    <Line
                      data={{
                        labels: salesStats.map(stat => stat._id),
                        datasets: [{
                          label: 'Number of Sales',
                          data: salesStats.map(stat => stat.count),
                          borderColor: 'rgba(153, 102, 255, 1)',
                          backgroundColor: 'rgba(153, 102, 255, 0.2)',
                          tension: 0.3,
                          fill: true
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Number of Sales'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
  
                {/* Summary Cards */}
                <div className="mt-4">
                  <h5>Summary of Last 30 Days</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Total Revenue</Card.Title>
                          <Card.Text className="fs-3">
                            Rs {salesStats.reduce((sum, stat) => sum + stat.totalSales, 0).toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Total Transactions</Card.Title>
                          <Card.Text className="fs-3">
                            {salesStats.reduce((sum, stat) => sum + stat.count, 0)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Avg Daily Revenue</Card.Title>
                          <Card.Text className="fs-3">
                            Rs {(salesStats.reduce((sum, stat) => sum + stat.totalSales, 0) / salesStats.length).toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
  
                {/* Product Distribution */}
                {salesStats.length > 0 && (
                  <div className="mt-4">
                    <h5>Product Distribution</h5>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Days Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(new Set(salesStats.flatMap(stat => stat.productsSold))).map(productId => (
                          <tr key={productId}>
                            <td>{productId}</td>
                            <td>
                              {salesStats.filter(stat => stat.productsSold.includes(productId)).length} days
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
    );
  };

  const renderFinanceSection = () => {
    // Process finance data to separate revenue and expense records
    const processedFinanceData = financeData.flatMap(record => [
      ...(record.totalRevenue > 0 ? [{
        ...record,
        type: 'Revenue',
        amount: record.totalRevenue,
        date: record.date
      }] : []),
      ...(record.totalExpense > 0 ? [{
        ...record,
        type: 'Expense',
        amount: record.totalExpense,
        date: record.date
      }] : [])
    ]);
  
    // Filter finance data based on search term
    const filteredFinanceData = processedFinanceData.filter(item =>
      new Date(item.date).toLocaleDateString().includes(financeSearchTerm) ||
      item.type.toLowerCase().includes(financeSearchTerm.toLowerCase())
    );
  
    return (
      <Card className="p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Finance Records</h2>
          <div>
            <Button
              variant={activeFinanceTab === 'expense' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveFinanceTab('expense')}
            >
              Financial Records
            </Button>
            <Button
              variant={activeFinanceTab === 'stats' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveFinanceTab('stats')}
            >
              Income Stats
            </Button>
          </div>
        </div>
  
        {activeFinanceTab === 'expense' ? (
          <>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by Date or Type (Revenue/Expense)"
                value={financeSearchTerm}
                onChange={(e) => setFinanceSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                Search
              </Button>
            </InputGroup>
  
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount (Rs)</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinanceData.length > 0 ? (
                  filteredFinanceData.map((record) => (
                    <tr key={`${record._id}-${record.type}`}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.type}</td>
                      <td>{record.amount.toFixed(2)}</td>
                      <td>{record.recordedBy?.name || record.recordedBy?.employeeId || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No finance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            {loadingFinanceStats ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h4 className="mb-3">Monthly Financial Statistics</h4>
                
                {/* Revenue vs Expense Chart */}
                <div className="mb-4">
                  <h5>Revenue vs Expenses</h5>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={{
                        labels: financeStats.map(stat => stat._id),
                        datasets: [
                          {
                            label: 'Revenue (Rs)',
                            data: financeStats.map(stat => stat.totalRevenue),
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                          },
                          {
                            label: 'Expenses (Rs)',
                            data: financeStats.map(stat => stat.totalExpense),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Rupees (Rs)'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Month'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
  
                {/* Profit Trend Chart */}
                <div className="mb-4">
                  <h5>Profit Trend</h5>
                  <div style={{ height: '300px' }}>
                    <Line
                      data={{
                        labels: financeStats.map(stat => stat._id),
                        datasets: [{
                          label: 'Profit (Rs)',
                          data: financeStats.map(stat => stat.totalRevenue - stat.totalExpense),
                          borderColor: 'rgba(54, 162, 235, 1)',
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          tension: 0.3,
                          fill: true
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false,
                            title: {
                              display: true,
                              text: 'Profit (Rs)'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Month'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
  
                {/* Summary Cards */}
                <div className="mt-4">
                  <h5>Financial Summary</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Total Revenue</Card.Title>
                          <Card.Text className="fs-3">
                            Rs {financeStats.reduce((sum, stat) => sum + stat.totalRevenue, 0).toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Total Expenses</Card.Title>
                          <Card.Text className="fs-3">
                            Rs {financeStats.reduce((sum, stat) => sum + stat.totalExpense, 0).toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card className="text-center">
                        <Card.Body>
                          <Card.Title>Net Profit</Card.Title>
                          <Card.Text className="fs-3">
                            Rs {(financeStats.reduce((sum, stat) => sum + stat.totalRevenue - stat.totalExpense, 0)).toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
  
                {/* Detailed Table */}
                <div className="mt-4">
                  <h5>Detailed Statistics</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue (Rs)</th>
                        <th>Expenses (Rs)</th>
                        <th>Profit (Rs)</th>
                        <th>Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financeStats.map((stat) => (
                        <tr key={stat._id}>
                          <td>{stat._id}</td>
                          <td>{stat.totalRevenue.toFixed(2)}</td>
                          <td>{stat.totalExpense.toFixed(2)}</td>
                          <td>{(stat.totalRevenue - stat.totalExpense).toFixed(2)}</td>
                          <td>{stat.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </>
        )}
      </Card>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'employees':
        return renderEmployeesSection();
      case 'milk':
        return renderMilkProductionSection();
      case 'sales':
        return renderSalesSection();
      case 'finance':
        return renderFinanceSection();
      default:
        return renderEmployeesSection();
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm Manager</h4>
        <hr className="bg-light" />
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item 
            action 
            active={activeSection === 'employees'}
            className={activeSection === 'employees' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('employees')}
          >
            Manage Employees
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'milk'}
            className={activeSection === 'milk' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('milk')}
          >
            Milk Production
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'sales'}
            className={activeSection === 'sales' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('sales')}
          >
            Sales
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'finance'}
            className={activeSection === 'finance' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('finance')}
          >
            Finance Records
          </ListGroup.Item>
        </ListGroup>
        <div className="mt-auto">
          <Link to="/" className="btn btn-outline-light w-100">Logout</Link>
        </div>
      </div>

      <div className="flex-grow-1 p-4">
        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            dismissible
            className="position-fixed top-0 end-0 m-3"
            style={{ zIndex: 9999 }}
          >
            {alert.message}
          </Alert>
        )}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default ManagerDashboard;