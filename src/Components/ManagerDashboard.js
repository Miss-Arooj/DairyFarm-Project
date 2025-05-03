import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Form,
  Table,
  ListGroup,
  InputGroup,
  Spinner,
  Tab,
  Tabs,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';
import api from '../api';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('employees');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const navigate = useNavigate();

  // Employees state
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

  // Milk Production state
  const [milkData, setMilkData] = useState([]);
  const [milkStats, setMilkStats] = useState([]);

  // Sales state
  const [salesData, setSalesData] = useState([]);
  const [salesStats, setSalesStats] = useState([]);

  // Finance state
  const [financeData, setFinanceData] = useState([]);
  const [financeStats, setFinanceStats] = useState([]);
  const [newFinanceRecord, setNewFinanceRecord] = useState({
    date: '',
    totalRevenue: '',
    totalExpense: ''
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/stats');
        setDashboardStats(response.data);
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to load dashboard stats', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [activeSection]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        switch (activeSection) {
          case 'employees':
            const empResponse = await api.get('/api/employees');
            setEmployees(empResponse.data);
            break;
          case 'milk':
            const milkResponse = await api.get('/api/milk');
            setMilkData(milkResponse.data);
            
            const milkStatsResponse = await api.get('/api/milk/stats');
            setMilkStats(milkStatsResponse.data);
            break;
          case 'sales':
            const salesResponse = await api.get('/api/orders');
            setSalesData(salesResponse.data);
            
            const salesStatsResponse = await api.get('/api/orders/stats');
            setSalesStats(salesStatsResponse.data);
            break;
          case 'finance':
            const financeResponse = await api.get('/api/finance');
            setFinanceData(financeResponse.data);
            
            const financeStatsResponse = await api.get('/api/finance/stats');
            setFinanceStats(financeStatsResponse.data);
            break;
          default:
            break;
        }
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to load data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/employees', newEmployee);
      
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
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add employee', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFinanceRecord = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/finance', newFinanceRecord);
      
      setFinanceData(prev => [...prev, response.data]);
      setNewFinanceRecord({
        date: '',
        totalRevenue: '',
        totalExpense: ''
      });
      showAlert('Finance record added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add finance record', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.employeeId?.toString().includes(empSearchTerm) ||
    emp.name?.toLowerCase().includes(empSearchTerm.toLowerCase())
  );

  const renderEmployeesSection = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => navigate('/manager/dashboard/employees/add')}
          >
            Add Employee
          </Button>
        </div>
      </div>
  
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
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
              {employees.length > 0 ? (
                employees.map(emp => (
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
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );

  const renderMilkProductionSection = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="daily" className="mb-3">
        <Tab eventKey="daily" title="Daily Production">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Animal ID"
              value={empSearchTerm}
              onChange={(e) => setEmpSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Animal ID</th>
                  <th>Quantity (Liters)</th>
                  <th>Quality</th>
                </tr>
              </thead>
              <tbody>
                {milkData.length > 0 ? (
                  milkData.map(record => (
                    <tr key={record._id}>
                      <td>{new Date(record.productionDate).toLocaleDateString()}</td>
                      <td>{record.animalId}</td>
                      <td>{record.quantity}</td>
                      <td>{record.quality}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No milk production records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
        <Tab eventKey="stats" title="Production Stats">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="mt-4">
              <h4 className="mb-3">Last 30 Days Milk Production</h4>
              <Bar
                data={{
                  labels: milkStats.map(stat => stat._id),
                  datasets: [
                    {
                      label: 'Milk Production (Liters)',
                      data: milkStats.map(stat => stat.totalQuantity),
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    },
                    title: {
                      display: true,
                      text: 'Daily Milk Production'
                    }
                  }
                }}
              />
            </div>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

  const renderSalesSection = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="records" className="mb-3">
        <Tab eventKey="records" title="Sales Records">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Order Date"
              value={empSearchTerm}
              onChange={(e) => setEmpSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total (Rs)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.length > 0 ? (
                  salesData.map(order => (
                    <tr key={order._id}>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.customerInfo.name}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item.name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td>{order.total}</td>
                      <td>
                        <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No sales records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
        <Tab eventKey="stats" title="Sales Statistics">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="mt-4">
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">Last 30 Days Sales</h4>
                  <Line
                    data={{
                      labels: salesStats.map(stat => stat._id),
                      datasets: [
                        {
                          label: 'Daily Revenue (Rs)',
                          data: salesStats.map(stat => stat.totalRevenue),
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Daily Sales Revenue'
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">Sales Distribution</h4>
                  <Pie
                    data={{
                      labels: ['Milk', 'Butter', 'Cheese', 'Yogurt', 'Others'],
                      datasets: [
                        {
                          label: 'Sales by Product',
                          data: [45, 25, 15, 10, 5],
                          backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)'
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Sales by Product Category'
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

  const renderFinanceSection = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="expense" className="mb-3">
        <Tab eventKey="expense" title="Expense/Revenue">
          <Form onSubmit={handleAddFinanceRecord} className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newFinanceRecord.date}
                    onChange={(e) => setNewFinanceRecord({ ...newFinanceRecord, date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Revenue (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newFinanceRecord.totalRevenue}
                    onChange={(e) => setNewFinanceRecord({ ...newFinanceRecord, totalRevenue: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Expense (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newFinanceRecord.totalExpense}
                    onChange={(e) => setNewFinanceRecord({ ...newFinanceRecord, totalExpense: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
              {loading ? 'Adding...' : 'Add Record'}
            </Button>
          </Form>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue (Rs)</th>
                  <th>Expense (Rs)</th>
                  <th>Profit (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {financeData.length > 0 ? (
                  financeData.map(record => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.totalRevenue}</td>
                      <td>{record.totalExpense}</td>
                      <td>{record.totalRevenue - record.totalExpense}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No finance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
        <Tab eventKey="stats" title="Income Stats">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="mt-4">
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">Monthly Revenue vs Expense</h4>
                  <Bar
                    data={{
                      labels: financeStats.map(stat => stat._id),
                      datasets: [
                        {
                          label: 'Revenue',
                          data: financeStats.map(stat => stat.totalRevenue),
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                        },
                        {
                          label: 'Expense',
                          data: financeStats.map(stat => stat.totalExpense),
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Monthly Financials'
                        }
                      }
                    }}
                  />
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">Profit Distribution</h4>
                  <Pie
                    data={{
                      labels: ['Milk Sales', 'Dairy Products', 'Other Income'],
                      datasets: [
                        {
                          label: 'Income Sources',
                          data: [60, 30, 10],
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(153, 102, 255, 0.5)'
                          ],
                          borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(153, 102, 255, 1)'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Income Sources'
                        }
                      }
                    }}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

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
      {/* Navigation Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm Manager</h4>
        <hr className="bg-light" />
        
        <div className="mb-4">
          <Card className="bg-secondary text-white">
            <Card.Body className="p-2">
              <h6 className="mb-1">Quick Stats</h6>
              {dashboardStats ? (
                <>
                  <p className="mb-1 small">Employees: {dashboardStats.totalEmployees}</p>
                  <p className="mb-1 small">Animals: {dashboardStats.totalAnimals}</p>
                  <p className="mb-1 small">Today's Milk: {dashboardStats.todayMilkProduction}L</p>
                  <p className="mb-0 small">Monthly Revenue: Rs.{dashboardStats.monthlyRevenue}</p>
                </>
              ) : (
                <Spinner animation="border" size="sm" />
              )}
            </Card.Body>
          </Card>
        </div>
        
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
          <Button 
            variant="outline-light" 
            className="w-100"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
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