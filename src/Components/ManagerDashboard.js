import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Alert, Button, Form, Table, ListGroup, Card, 
  InputGroup, Row, Col, Spinner 
} from 'react-bootstrap';
import axios from 'axios';
import api from '../api';

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [milkProduction, setMilkProduction] = useState([]);
  const [financeRecords, setFinanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    gender: 'Male',
    contact: '',
    salary: '',
    username: '',
    password: ''
  });

  // Fetch data based on active section
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        switch (activeSection) {
          case 'employees':
            const empRes = await api.get('/api/employees');
            setEmployees(empRes.data.data);
            break;
          case 'orders':
            const orderRes = await api.get('/api/orders');
            setOrders(orderRes.data);
            break;
          case 'milk':
            const milkRes = await api.get('/api/milk');
            setMilkProduction(milkRes.data);
            break;
          case 'finance':
            const financeRes = await api.get('/api/finance');
            setFinanceRecords(financeRes.data);
            break;
          case 'dashboard':
            const statsRes = await api.get('/api/dashboard/stats');
            setStats(statsRes.data);
            break;
          default:
            break;
        }
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to fetch data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/employees', newEmployee);
      setEmployees([...employees, res.data.data]);
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
    }
  };

  // Add the missing render functions
  const renderOrders = () => (
    <Card className="p-4">
      <Card.Body>
        <h2>Customer Orders</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Total (Rs)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.substring(18)}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerContact}</td>
                    <td>{order.totalAmount}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderMilkProduction = () => (
    <Card className="p-4">
      <Card.Body>
        <h2>Milk Production Records</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Animal ID</th>
                <th>Quantity (L)</th>
                <th>Quality</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {milkProduction.length > 0 ? (
                milkProduction.map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.productionDate).toLocaleDateString()}</td>
                    <td>{record.animalId}</td>
                    <td>{record.quantity}</td>
                    <td>{record.quality}</td>
                    <td>{record.recordedBy?.name || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No milk production records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderFinance = () => (
    <Card className="p-4">
      <Card.Body>
        <h2>Finance Records</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue (Rs)</th>
                <th>Expense (Rs)</th>
                <th>Profit (Rs)</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {financeRecords.length > 0 ? (
                financeRecords.map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.totalRevenue}</td>
                    <td>{record.totalExpense}</td>
                    <td>{record.totalRevenue - record.totalExpense}</td>
                    <td>{record.recordedBy?.username || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No finance records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderDashboard = () => (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      {stats ? (
        <Row>
          <Col md={6} lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Total Animals</Card.Title>
                <Card.Text className="display-4">{stats.totalAnimals}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Total Employees</Card.Title>
                <Card.Text className="display-4">{stats.totalEmployees}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Today's Milk (L)</Card.Title>
                <Card.Text className="display-4">{stats.todayMilkProduction}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Net Profit</Card.Title>
                <Card.Text className="display-4">
                  Rs. {stats.totalRevenue - stats.totalExpense}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Spinner animation="border" />
      )}
    </div>
  );

  const renderEmployees = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <Button 
          variant="primary" 
          onClick={() => setActiveSection('addEmployee')}
        >
          Add Employee
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Salary (Rs)</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.gender}</td>
                <td>{emp.contact}</td>
                <td>{emp.salary}</td>
                <td>{emp.username}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  const renderAddEmployee = () => (
    <Card className="p-4">
      <Card.Body>
        <Card.Title>Add New Employee</Card.Title>
        <Form onSubmit={handleAddEmployee}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={newEmployee.gender}
              onChange={(e) => setNewEmployee({...newEmployee, gender: e.target.value})}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={newEmployee.contact}
              onChange={(e) => setNewEmployee({...newEmployee, contact: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salary (Rs)</Form.Label>
            <Form.Control
              type="number"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              onClick={() => setActiveSection('employees')}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Employee
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'employees':
        return renderEmployees();
      case 'addEmployee':
        return renderAddEmployee();
      case 'orders':
        return renderOrders();
      case 'milk':
        return renderMilkProduction();
      case 'finance':
        return renderFinance();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm Manager</h4>
        <hr className="bg-light" />
        
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item 
            action 
            active={activeSection === 'dashboard'}
            className={activeSection === 'dashboard' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'employees' || activeSection === 'addEmployee'}
            className={activeSection === 'employees' || activeSection === 'addEmployee' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('employees')}
          >
            Employees
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'orders'}
            className={activeSection === 'orders' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('orders')}
          >
            Orders
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
            active={activeSection === 'finance'}
            className={activeSection === 'finance' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('finance')}
          >
            Finance
          </ListGroup.Item>
        </ListGroup>
        
        <div className="mt-auto">
          <Link to="/" className="btn btn-outline-light w-100">Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {alert.show && (
          <Alert 
            variant={alert.variant}
            onClose={() => setAlert({...alert, show: false})}
            dismissible
            className="position-fixed top-0 end-0 m-3"
            style={{ zIndex: 9999 }}
          >
            {alert.message}
          </Alert>
        )}

        {loading && activeSection !== 'dashboard' ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          renderActiveSection()
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;