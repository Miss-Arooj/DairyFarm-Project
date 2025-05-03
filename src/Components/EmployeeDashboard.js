import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Alert, Button, Form, Table, ListGroup, Card, 
  InputGroup, Row, Col, Spinner 
} from 'react-bootstrap';
import axios from 'axios';
import api from '../api';

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState('milk');
  const [milkRecords, setMilkRecords] = useState([]);
  const [animalRecords, setAnimalRecords] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // Form states
  const [newMilkRecord, setNewMilkRecord] = useState({
    productionDate: '',
    animalId: '',
    quantity: '',
    quality: 'Good'
  });

  const [newAnimal, setNewAnimal] = useState({
    animalId: '',
    name: '',
    weight: '',
    gender: 'Male',
    type: '',
    age: ''
  });

  const [newHealthRecord, setNewHealthRecord] = useState({
    animalId: '',
    animalName: '',
    date: '',
    treatment: '',
    cost: ''
  });

  // Fetch data based on active section
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        switch (activeSection) {
          case 'milk':
            const milkRes = await api.get('/api/milk');
            setMilkRecords(milkRes.data);
            break;
          case 'animals':
            const animalRes = await api.get('/api/animals');
            setAnimalRecords(animalRes.data);
            break;
          case 'health':
            const healthRes = await api.get('/api/health');
            setHealthRecords(healthRes.data);
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

  const handleAddMilkRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/milk', newMilkRecord);
      setMilkRecords([...milkRecords, res.data]);
      setNewMilkRecord({
        productionDate: '',
        animalId: '',
        quantity: '',
        quality: 'Good'
      });
      showAlert('Milk record added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add milk record', 'danger');
    }
  };

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/animals', newAnimal);
      setAnimalRecords([...animalRecords, res.data]);
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
    }
  };

  const handleAddHealthRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/health', newHealthRecord);
      setHealthRecords([...healthRecords, res.data]);
      setNewHealthRecord({
        animalId: '',
        animalName: '',
        date: '',
        treatment: '',
        cost: ''
      });
      showAlert('Health record added successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to add health record', 'danger');
    }
  };

  const renderMilkProduction = () => (
    <Card className="p-4">
      <Card.Body>
        <Card.Title>Add Milk Production Record</Card.Title>
        <Form onSubmit={handleAddMilkRecord}>
          <Form.Group className="mb-3">
            <Form.Label>Production Date</Form.Label>
            <Form.Control
              type="date"
              value={newMilkRecord.productionDate}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, productionDate: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Animal ID</Form.Label>
            <Form.Control
              type="text"
              value={newMilkRecord.animalId}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, animalId: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity (Liters)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={newMilkRecord.quantity}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, quantity: e.target.value})}
              required
            />
          </Form.Group>

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

          <Button variant="primary" type="submit">
            Add Record
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );

  const renderAnimalRecords = () => (
    <Card className="p-4">
      <Card.Body>
        <Card.Title>Add Animal Record</Card.Title>
        <Form onSubmit={handleAddAnimal}>
          <Form.Group className="mb-3">
            <Form.Label>Animal ID</Form.Label>
            <Form.Control
              type="text"
              value={newAnimal.animalId}
              onChange={(e) => setNewAnimal({...newAnimal, animalId: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newAnimal.name}
              onChange={(e) => setNewAnimal({...newAnimal, name: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={newAnimal.weight}
              onChange={(e) => setNewAnimal({...newAnimal, weight: e.target.value})}
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              value={newAnimal.type}
              onChange={(e) => setNewAnimal({...newAnimal, type: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="text"
              value={newAnimal.age}
              onChange={(e) => setNewAnimal({...newAnimal, age: e.target.value})}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Animal
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );

  const renderHealthRecords = () => (
    <Card className="p-4">
      <Card.Body>
        <Card.Title>Add Health Record</Card.Title>
        <Form onSubmit={handleAddHealthRecord}>
          <Form.Group className="mb-3">
            <Form.Label>Animal ID</Form.Label>
            <Form.Control
              type="text"
              value={newHealthRecord.animalId}
              onChange={(e) => setNewHealthRecord({...newHealthRecord, animalId: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Animal Name</Form.Label>
            <Form.Control
              type="text"
              value={newHealthRecord.animalName}
              onChange={(e) => setNewHealthRecord({...newHealthRecord, animalName: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={newHealthRecord.date}
              onChange={(e) => setNewHealthRecord({...newHealthRecord, date: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Treatment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newHealthRecord.treatment}
              onChange={(e) => setNewHealthRecord({...newHealthRecord, treatment: e.target.value})}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cost (Rs)</Form.Label>
            <Form.Control
              type="number"
              value={newHealthRecord.cost}
              onChange={(e) => setNewHealthRecord({...newHealthRecord, cost: e.target.value})}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Record
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'milk':
        return renderMilkProduction();
      case 'animals':
        return renderAnimalRecords();
      case 'health':
        return renderHealthRecords();
      default:
        return renderMilkProduction();
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
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
            Milk Production
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'animals'}
            className={activeSection === 'animals' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('animals')}
          >
            Animal Records
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'health'}
            className={activeSection === 'health' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('health')}
          >
            Health Records
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

        {loading ? (
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

export default EmployeeDashboard;