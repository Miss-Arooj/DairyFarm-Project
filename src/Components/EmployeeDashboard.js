import React, { useState, useEffect } from 'react';
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

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState('milk');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const navigate = useNavigate();

  // Milk Production states
  const [milkData, setMilkData] = useState([]);
  const [newMilkRecord, setNewMilkRecord] = useState({
    productionDate: '',
    animalId: '',
    quantity: '',
    quality: 'Good'
  });

  // Animal Records states
  const [animalData, setAnimalData] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    animalId: '',
    name: '',
    weight: '',
    gender: 'Male',
    type: '',
    age: ''
  });

  // Animal Health states
  const [healthData, setHealthData] = useState([]);
  const [newHealthReport, setNewHealthReport] = useState({
    animalId: '',
    animalName: '',
    date: '',
    treatment: '',
    cost: ''
  });

  // Sales states
  const [salesData, setSalesData] = useState([]);
  const [newSale, setNewSale] = useState({
    customerName: '',
    items: [],
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        switch (activeSection) {
          case 'milk':
            const milkResponse = await api.get('/api/milk');
            setMilkData(milkResponse.data);
            break;
          case 'animals':
            const animalResponse = await api.get('/api/animals');
            setAnimalData(animalResponse.data);
            break;
          case 'health':
            const healthResponse = await api.get('/api/health');
            setHealthData(healthResponse.data);
            break;
          case 'sales':
            const salesResponse = await api.get('/api/orders');
            setSalesData(salesResponse.data);
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

  const handleAddMilkRecord = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/milk', newMilkRecord);
      
      setMilkData(prev => [...prev, response.data]);
      setNewMilkRecord({
        productionDate: '',
        animalId: '',
        quantity: '',
        quality: 'Good'
      });
      showAlert('Milk record added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add milk record', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/animals', newAnimal);
      
      setAnimalData(prev => [...prev, response.data]);
      setNewAnimal({
        animalId: '',
        name: '',
        weight: '',
        gender: 'Male',
        type: '',
        age: ''
      });
      showAlert('Animal added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add animal', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHealthReport = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/health', newHealthReport);
      
      setHealthData(prev => [...prev, response.data]);
      setNewHealthReport({
        animalId: '',
        animalName: '',
        date: '',
        treatment: '',
        cost: ''
      });
      showAlert('Health report added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add health report', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/api/orders', newSale);
      
      setSalesData(prev => [...prev, response.data]);
      setNewSale({
        customerName: '',
        items: [],
        total: 0
      });
      showAlert('Sale recorded successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to record sale', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const renderMilkProduction = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="add" className="mb-3">
        <Tab eventKey="add" title="Add Milk Record">
          <Form onSubmit={handleAddMilkRecord}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Production Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    required
                    value={newMilkRecord.productionDate}
                    onChange={(e) => setNewMilkRecord({...newMilkRecord, productionDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    placeholder="e.g. DA001"
                    value={newMilkRecord.animalId}
                    onChange={(e) => setNewMilkRecord({...newMilkRecord, animalId: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity (Liters)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    required
                    value={newMilkRecord.quantity}
                    onChange={(e) => setNewMilkRecord({...newMilkRecord, quantity: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quality</Form.Label>
                  <Form.Select
                    value={newMilkRecord.quality}
                    onChange={(e) => setNewMilkRecord({...newMilkRecord, quality: e.target.value})}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Record'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="view" title="View Records">
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
                  <th>Quantity (L)</th>
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
      </Tabs>
    </Card>
  );

  const renderAnimalRecords = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="add" className="mb-3">
        <Tab eventKey="add" title="Add Animal">
          <Form onSubmit={handleAddAnimal}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newAnimal.animalId}
                    onChange={(e) => setNewAnimal({...newAnimal, animalId: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight (KG)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1"
                    required
                    value={newAnimal.weight}
                    onChange={(e) => setNewAnimal({...newAnimal, weight: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newAnimal.name}
                    onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={newAnimal.gender}
                    onChange={(e) => setNewAnimal({...newAnimal, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newAnimal.type}
                    onChange={(e) => setNewAnimal({...newAnimal, type: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newAnimal.age}
                    onChange={(e) => setNewAnimal({...newAnimal, age: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Animal'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="view" title="View Animals">
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
                  <th>Animal ID</th>
                  <th>Name</th>
                  <th>Weight (KG)</th>
                  <th>Gender</th>
                  <th>Type</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {animalData.length > 0 ? (
                  animalData.map(animal => (
                    <tr key={animal._id}>
                      <td>{animal.animalId}</td>
                      <td>{animal.name}</td>
                      <td>{animal.weight}</td>
                      <td>{animal.gender}</td>
                      <td>{animal.type}</td>
                      <td>{animal.age}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No animal records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

  const renderAnimalHealth = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="add" className="mb-3">
        <Tab eventKey="add" title="Add Health Report">
          <Form onSubmit={handleAddHealthReport}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newHealthReport.animalId}
                    onChange={(e) => setNewHealthReport({...newHealthReport, animalId: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newHealthReport.animalName}
                    onChange={(e) => setNewHealthReport({...newHealthReport, animalName: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                required
                value={newHealthReport.date}
                onChange={(e) => setNewHealthReport({...newHealthReport, date: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={newHealthReport.treatment}
                    onChange={(e) => setNewHealthReport({...newHealthReport, treatment: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost (Rs)</Form.Label>
                  <Form.Control 
                    type="number" 
                    required
                    value={newHealthReport.cost}
                    onChange={(e) => setNewHealthReport({...newHealthReport, cost: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Report'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="view" title="View Reports">
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
                  <th>Animal ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Treatment</th>
                  <th>Cost (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {healthData.length > 0 ? (
                  healthData.map(report => (
                    <tr key={report._id}>
                      <td>{report.animalId}</td>
                      <td>{report.animalName}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{report.treatment}</td>
                      <td>{report.cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No health reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

  const renderSales = () => (
    <Card className="p-4 mb-4">
      <Tabs defaultActiveKey="add" className="mb-3">
        <Tab eventKey="add" title="Add Sale">
          <Form onSubmit={handleAddSale}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newSale.customerName}
                onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Items (JSON format)</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={JSON.stringify(newSale.items, null, 2)}
                onChange={(e) => {
                  try {
                    setNewSale({...newSale, items: JSON.parse(e.target.value)});
                  } catch (err) {
                    // Invalid JSON
                  }
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total (Rs)</Form.Label>
              <Form.Control 
                type="number" 
                required
                value={newSale.total}
                onChange={(e) => setNewSale({...newSale, total: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Sale'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="view" title="View Sales">
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
                </tr>
              </thead>
              <tbody>
                {salesData.length > 0 ? (
                  salesData.map(sale => (
                    <tr key={sale._id}>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>{sale.customerInfo.name}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {sale.items.map((item, idx) => (
                            <li key={idx}>{item.name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td>{sale.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No sales records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Card>
  );

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'milk':
        return renderMilkProduction();
      case 'animals':
        return renderAnimalRecords();
      case 'health':
        return renderAnimalHealth();
      case 'sales':
        return renderSales();
      default:
        return renderMilkProduction();
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Navigation Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm Employee</h4>
        <hr className="bg-light" />
        
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item 
            action 
            active={activeSection === 'milk'}
            className={activeSection === 'milk' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('milk')}
          >
            Milk Record
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'animals'}
            className={activeSection === 'animals' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('animals')}
          >
            Animals Record
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'health'}
            className={activeSection === 'health' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('health')}
          >
            Animals Health
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'sales'}
            className={activeSection === 'sales' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('sales')}
          >
            Sales
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
            onClose={() => setAlert({...alert, show: false})}
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

export default EmployeeDashboard;