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

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('employees');

  // Employee Management State
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

  // Sales State
  const [activeSalesTab, setActiveSalesTab] = useState('records');
  const [salesData, setSalesData] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  // Finance State
  const [activeFinanceTab, setActiveFinanceTab] = useState('expense');
  const [financeData, setFinanceData] = useState([]);
  const [financeSearchTerm, setFinanceSearchTerm] = useState('');

  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmployees(response.data);
      } catch (err) {
        showAlert('Failed to load employees', 'danger');
      }
    };
    
    if (activeSection === 'employees') {
      fetchEmployees();
    }
  }, [activeSection]);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.username || !newEmployee.password) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/employees', newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setEmployees([...employees, response.data]);
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
      console.error('Error adding employee:', err);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.id?.toString().includes(empSearchTerm)
  );

  const filteredMilkData = milkData.filter(item =>
    item.A_ID?.toLowerCase().includes(milkSearchTerm.toLowerCase())
  );

  const filteredSalesData = salesData.filter(item =>
    item.Sales_ID?.toLowerCase().includes(salesSearchTerm.toLowerCase())
  );

  const filteredFinanceData = financeData.filter(item =>
    item.Date?.toLowerCase().includes(financeSearchTerm.toLowerCase())
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
              placeholder="Search by Employee ID"
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
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Salary (PKR)</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
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
            <Form.Label>Salary (PKR)</Form.Label>
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
              placeholder="Enter username"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
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
              placeholder="Search by Animal ID"
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
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No milk production records found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <div className="alert alert-info text-center py-4">
          Milk production statistics will be implemented in the next phase.
        </div>
      )}
    </Card>
  );

  const renderSalesSection = () => (
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
              placeholder="Search by Sales ID"
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
                <th>Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No sales records found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <div className="alert alert-info text-center py-4">
          Sales statistics will be implemented in the next phase.
        </div>
      )}
    </Card>
  );

  const renderFinanceSection = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Finance Records</h2>
        <div>
          <Button
            variant={activeFinanceTab === 'expense' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveFinanceTab('expense')}
          >
            Expense/Revenue
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
              placeholder="Search by Date"
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
                <th>Revenue (PKR)</th>
                <th>Expense (PKR)</th>
                <th>Profit (PKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No finance records found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <div className="alert alert-info text-center py-4">
          Income statistics will be implemented in the next phase.
        </div>
      )}
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
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm Manager</h4>
        <hr className="bg-light" />
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item action active={activeSection === 'employees'}
            className={activeSection === 'employees' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('employees')}>
            Manage Employees
          </ListGroup.Item>
          <ListGroup.Item action active={activeSection === 'milk'}
            className={activeSection === 'milk' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('milk')}>
            Milk Production
          </ListGroup.Item>
          <ListGroup.Item action active={activeSection === 'sales'}
            className={activeSection === 'sales' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('sales')}>
            Sales
          </ListGroup.Item>
          <ListGroup.Item action active={activeSection === 'finance'}
            className={activeSection === 'finance' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('finance')}>
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
            onClose={() => setAlert({ ...alert, show: false })}
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
