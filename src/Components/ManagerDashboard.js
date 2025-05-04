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
  const [newMilkRecord, setNewMilkRecord] = useState({
    date: '',
    animalId: '',
    quantity: '',
    quality: 'Good'
  });

  // Sales State
  const [activeSalesTab, setActiveSalesTab] = useState('records');
  const [salesData, setSalesData] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [newSaleRecord, setNewSaleRecord] = useState({
    date: '',
    customerName: '',
    productId: '',
    amount: ''
  });

  // Finance State
  const [activeFinanceTab, setActiveFinanceTab] = useState('expense');
  const [financeData, setFinanceData] = useState([]);
  const [financeSearchTerm, setFinanceSearchTerm] = useState('');
  const [newFinanceRecord, setNewFinanceRecord] = useState({
    date: '',
    type: 'Revenue',
    description: '',
    amount: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (activeSection === 'employees' && activeEmpTab === 'view') {
      fetchEmployees();
    } else if (activeSection === 'milk' && activeMilkTab === 'daily') {
      fetchMilkRecords();
    } else if (activeSection === 'sales' && activeSalesTab === 'records') {
      fetchSalesRecords();
    } else if (activeSection === 'finance' && activeFinanceTab === 'expense') {
      fetchFinanceRecords();
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
                    <td>{record.date}</td>
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
                filteredSalesData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.date}</td>
                    <td>{sale.salesId}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.productId}</td>
                    <td>{sale.amount}</td>
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
              placeholder="Search by Date or Description"
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
                <th>Description</th>
                <th>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinanceData.length > 0 ? (
                filteredFinanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.type}</td>
                    <td>{record.description}</td>
                    <td>{record.amount}</td>
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