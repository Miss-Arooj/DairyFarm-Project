import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    const storedEmployeeData = localStorage.getItem('employeeData');
    
    if (!token || !storedEmployeeData) {
      navigate('/employee/login');
    } else {
      setEmployeeData(JSON.parse(storedEmployeeData));
    }
  }, [navigate]);

  // Main navigation state
  const [activeSection, setActiveSection] = useState('milk');
  
  // Milk Production states
  const [activeMilkTab, setActiveMilkTab] = useState('add');
  const [milkRecords, setMilkRecords] = useState([]);
  const [newMilkRecord, setNewMilkRecord] = useState({
    Production_Date: '',
    A_ID: '',
    Quantity: '',
    Quality: 'Good'
  });
  const [milkSearchTerm, setMilkSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [milkError, setMilkError] = useState(null);

  // Add these state variables to the existing ones:
  const [animalData, setAnimalData] = useState([]);
  const [animalError, setAnimalError] = useState(null);
  const [animalLoading, setAnimalLoading] = useState(false);
  const [activeAnimalTab, setActiveAnimalTab] = useState('add');
  const [newAnimal, setNewAnimal] = useState({
    A_ID: '',
    Name: '',
    Weight: '',
    Gender: 'Male',
    Type: '',
    Age: ''
  });
  const [animalSearchTerm, setAnimalSearchTerm] = useState('');
  // Add this useEffect hook for fetching animals
  useEffect(() => {
    if (activeSection === 'animals' && activeAnimalTab === 'view') {
      fetchAnimals();
    }
  }, [activeSection, activeAnimalTab, animalSearchTerm]);

  // Animal Health states
const [activeHealthTab, setActiveHealthTab] = useState('add');
const [healthData, setHealthData] = useState([]);
const [newHealthReport, setNewHealthReport] = useState({
  A_ID: '',
  AnimalName: '',
  Date: '',
  Treatment: '',
  Cost: ''
});
const [healthSearchTerm, setHealthSearchTerm] = useState('');
const [healthError, setHealthError] = useState(null);
const [healthLoading, setHealthLoading] = useState(false);

// Add this useEffect hook for fetching health reports
useEffect(() => {
  if (activeSection === 'health' && activeHealthTab === 'view') {
    fetchHealthReports();
  }
}, [activeSection, activeHealthTab, healthSearchTerm]);

  // Sales states
  const [salesError, setSalesError] = useState(null);
  const [salesLoading, setSalesLoading] = useState(false);
  const [activeSalesTab, setActiveSalesTab] = useState('add');
  const [salesData, setSalesData] = useState([]);
  const [newSale, setNewSale] = useState({
    Sales_ID: '',
    Sale_Date: '',
    Customer_Name: '',
    Product_ID: '',
    Total_Cost: ''
  });
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  
  // Add this useEffect hook for fetching sales
  useEffect(() => {
    if (activeSection === 'sales' && activeSalesTab === 'view') {
      fetchSales();
    }
  }, [activeSection, activeSalesTab, salesSearchTerm]);

  // Products states
  const [activeProductsTab, setActiveProductsTab] = useState('add');
  const [productsData, setProductsData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Product_ID: '',
    Product_Name: '',
    Price_Per_Unit: '',
    Availability: '',
    Production_Date: '',
    Expiration_Date: ''
  });
  const [productsSearchTerm, setProductsSearchTerm] = useState('');

  // Farm Finance states
  const [financeData, setFinanceData] = useState([]);
  const [newFinanceRecord, setNewFinanceRecord] = useState({
    Date: '',
    Total_Revenue: '',
    Total_Expense: ''
  });

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const showAlert = (message, variant) => {
    setAlert({
      show: true,
      message,
      variant
    });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    navigate('/employee/login');
  };

  // Milk Production Functions
  useEffect(() => {
    if (activeSection === 'milk' && activeMilkTab === 'view') {
      fetchMilkRecords();
    }
  }, [activeSection, activeMilkTab]);

  const fetchMilkRecords = async () => {
    try {
      setLoading(true);
      setMilkError(null);
      const token = localStorage.getItem('employeeToken');
      
      let url = '/api/milk';
      const params = new URLSearchParams();
      
      if (milkSearchTerm) {
        params.append('animalId', milkSearchTerm);
      }
      if (dateFilter) {
        params.append('date', dateFilter);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMilkRecords(response.data);
    } catch (err) {
      setMilkError(err.response?.data?.message || 'Failed to fetch milk records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilkRecord = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newMilkRecord.Production_Date || !newMilkRecord.A_ID || !newMilkRecord.Quantity) {
        throw new Error('Please fill all required fields');
      }
  
      // Validate quantity is a positive number
      if (isNaN(newMilkRecord.Quantity)) {
        throw new Error('Quantity must be a number');
      }
      if (parseFloat(newMilkRecord.Quantity) <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
  
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }
  
      console.log('Sending request with data:', { // Add this for debugging
        productionDate: newMilkRecord.Production_Date,
        animalId: newMilkRecord.A_ID,
        quantity: parseFloat(newMilkRecord.Quantity),
        quality: newMilkRecord.Quality
      });
  
      const response = await axios.post('/api/milk', {
        productionDate: newMilkRecord.Production_Date,
        animalId: newMilkRecord.A_ID,
        quantity: parseFloat(newMilkRecord.Quantity),
        quality: newMilkRecord.Quality
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.error('Full error details:', error);
        console.error('Request config:', error.config);
        throw error;
      });
  
      console.log('Response:', response); // Add this for debugging
  
      if (response.status !== 201) {
        throw new Error('Failed to add milk record');
      }
  
      // Reset form and show success
      setNewMilkRecord({
        Production_Date: '',
        A_ID: '',
        Quantity: '',
        Quality: 'Good'
      });
      
      showAlert('Milk record added successfully!', 'success');
      setActiveMilkTab('view');
      fetchMilkRecords();
    } catch (err) {
      console.error('Full error:', err); // Log full error
      console.error('Error response:', err.response); // Log response if exists
      
      let errorMessage = 'Failed to add milk record';
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      err.response.statusText;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      setAnimalLoading(true);
      setAnimalError(null);
      const token = localStorage.getItem('employeeToken');
      
      let url = '/api/animals';
      if (animalSearchTerm) {
        url = `/api/animals/search?term=${animalSearchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAnimalData(response.data);
    } catch (err) {
      setAnimalError(err.response?.data?.message || 'Failed to fetch animal records');
    } finally {
      setAnimalLoading(false);
    }
  };

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newAnimal.A_ID || !newAnimal.Name || !newAnimal.Weight || !newAnimal.Type || !newAnimal.Age) {
        throw new Error('Please fill all required fields');
      }
  
      // Validate weight is a positive number
      if (isNaN(newAnimal.Weight)) {
        throw new Error('Weight must be a number');
      }
      if (parseFloat(newAnimal.Weight) <= 0) {
        throw new Error('Weight must be greater than 0');
      }
  
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }
  
      const response = await axios.post('/api/animals', {
        animalId: newAnimal.A_ID,
        name: newAnimal.Name,
        weight: parseFloat(newAnimal.Weight),
        gender: newAnimal.Gender,
        type: newAnimal.Type,
        age: newAnimal.Age
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 201) {
        throw new Error('Failed to add animal');
      }
  
      // Reset form and show success
      setNewAnimal({
        A_ID: '',
        Name: '',
        Weight: '',
        Gender: 'Male',
        Type: '',
        Age: ''
      });
      
      showAlert('Animal added successfully!', 'success');
      setActiveAnimalTab('view');
      fetchAnimals();
    } catch (err) {
      let errorMessage = 'Failed to add animal';
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      err.response.statusText;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function to fetch health reports
  const fetchHealthReports = async () => {
    try {
      setHealthLoading(true);
      setHealthError(null);
      const token = localStorage.getItem('employeeToken');
      
      let url = '/api/health';
      if (healthSearchTerm) {
        url = `/api/health?animalId=${healthSearchTerm}`;
      }
    
      const response = await axios.get(url, {
        headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
      setHealthData(response.data);
      } catch (err) {
      setHealthError(err.response?.data?.message || 'Failed to fetch health reports');
      } finally {
      setHealthLoading(false);
      }
  };

  const handleAddHealthReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newHealthReport.A_ID || !newHealthReport.AnimalName || !newHealthReport.Date || !newHealthReport.Treatment || !newHealthReport.Cost) {
        throw new Error('Please fill all required fields');
      }
  
      // Validate cost is a positive number
      if (isNaN(newHealthReport.Cost)) {
        throw new Error('Cost must be a number');
      }
      if (parseFloat(newHealthReport.Cost) <= 0) {
        throw new Error('Cost must be greater than 0');
      }
  
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }
  
      const response = await axios.post('/api/health', {
        animalId: newHealthReport.A_ID,
        animalName: newHealthReport.AnimalName,
        date: newHealthReport.Date,
        treatment: newHealthReport.Treatment,
        cost: parseFloat(newHealthReport.Cost)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 201) {
        throw new Error('Failed to add health report');
      }
  
      // Reset form and show success
      setNewHealthReport({
        A_ID: '',
        AnimalName: '',
        Date: '',
        Treatment: '',
        Cost: ''
      });
      
      showAlert('Health report added successfully!', 'success');
      setActiveHealthTab('view');
      fetchHealthReports();
    } catch (err) {
      let errorMessage = 'Failed to add health report';
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      err.response.statusText;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      setSalesLoading(true);
      setSalesError(null);
      const token = localStorage.getItem('employeeToken');
      
      let url = '/api/sales';
      if (salesSearchTerm) {
        url = `/api/sales?saleId=${salesSearchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSalesData(response.data);
    } catch (err) {
      setSalesError(err.response?.data?.message || 'Failed to fetch sales records');
    } finally {
      setSalesLoading(false);
    }
  };

  const handleAddSale = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Validate required fields
    if (!newSale.Sales_ID || !newSale.Sale_Date || !newSale.Customer_Name || !newSale.Product_ID || !newSale.Total_Cost) {
      throw new Error('Please fill all required fields');
    }

    // Validate total cost is a positive number
    if (isNaN(newSale.Total_Cost)) {
      throw new Error('Total cost must be a number');
    }
    if (parseFloat(newSale.Total_Cost) <= 0) {
      throw new Error('Total cost must be greater than 0');
    }

    const token = localStorage.getItem('employeeToken');
    if (!token) {
      throw new Error('Authentication token missing');
    }

    const response = await axios.post('/api/sales', {
      saleId: newSale.Sales_ID,
      saleDate: newSale.Sale_Date,
      customerName: newSale.Customer_Name,
      productId: newSale.Product_ID,
      totalCost: parseFloat(newSale.Total_Cost)
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 201) {
      throw new Error('Failed to add sale');
    }

    // Reset form and show success
    setNewSale({
      Sales_ID: '',
      Sale_Date: '',
      Customer_Name: '',
      Product_ID: '',
      Total_Cost: ''
    });
    
    showAlert('Sale added successfully!', 'success');
    setActiveSalesTab('view');
    fetchSales();
  } catch (err) {
    let errorMessage = 'Failed to add sale';
    if (err.response) {
      errorMessage = err.response.data?.message || 
                    err.response.data?.error || 
                    err.response.statusText;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    showAlert(errorMessage, 'danger');
  } finally {
    setLoading(false);
  }
};

  const handleAddProduct = (e) => {
    e.preventDefault();
    showAlert('Product record would be saved to database in backend implementation', 'success');
    setNewProduct({
      Product_ID: '',
      Product_Name: '',
      Price_Per_Unit: '',
      Availability: '',
      Production_Date: '',
      Expiration_Date: ''
    });
  };

  const handleAddFinanceRecord = (e) => {
    e.preventDefault();
    showAlert('Finance record would be saved to database in backend implementation', 'success');
    setNewFinanceRecord({
      Date: '',
      Total_Revenue: '',
      Total_Expense: ''
    });
  };

  // Render sections
  const renderMilkProduction = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Milk Production</h2>
        <div>
          <Button 
            variant={activeMilkTab === 'add' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveMilkTab('add')}
          >
            Add Milk Record
          </Button>
          <Button 
            variant={activeMilkTab === 'view' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveMilkTab('view')}
          >
            Daily Production
          </Button>
        </div>
      </div>

      {activeMilkTab === 'add' ? (
        <Form onSubmit={handleAddMilkRecord}>
          <Form.Group className="mb-3">
            <Form.Label>Production Date</Form.Label>
            <Form.Control 
              type="date" 
              required
              value={newMilkRecord.Production_Date}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, Production_Date: e.target.value})}
              max={new Date().toISOString().split('T')[0]}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Animal ID</Form.Label>
            <Form.Control 
              type="text" 
              required
              placeholder="e.g. DA001"
              value={newMilkRecord.A_ID}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, A_ID: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity (KG)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1"
              min="0.1"
              max="50"
              required
              value={newMilkRecord.Quantity}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, Quantity: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quality</Form.Label>
            <Form.Select
              value={newMilkRecord.Quality}
              onChange={(e) => setNewMilkRecord({...newMilkRecord, Quality: e.target.value})}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Adding...</span>
                </>
              ) : 'Add Record'}
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-md-6">
              <InputGroup>
                <Form.Control
                  placeholder="Search by Animal ID"
                  value={milkSearchTerm}
                  onChange={(e) => setMilkSearchTerm(e.target.value)}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={fetchMilkRecords}
                  disabled={loading}
                >
                  Search
                </Button>
              </InputGroup>
            </div>
            <div className="col-md-6">
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                onBlur={fetchMilkRecords}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : milkError ? (
            <Alert variant="danger">{milkError}</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Animal ID</th>
                  <th>Quantity (KG)</th>
                  <th>Quality</th>
                  <th>Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {milkRecords.length > 0 ? (
                  milkRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.productionDate).toLocaleDateString()}</td>
                      <td>{record.animalId}</td>
                      <td>{record.quantity}</td>
                      <td>{record.quality}</td>
                      <td>{new Date(record.date).toLocaleString()}</td>
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
        </>
      )}
    </Card>
  );

  const renderAnimalRecords = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Animal Records</h2>
        <div>
          <Button 
            variant={activeAnimalTab === 'add' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveAnimalTab('add')}
          >
            Add New Animal
          </Button>
          <Button 
            variant={activeAnimalTab === 'view' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveAnimalTab('view')}
          >
            View Animals
          </Button>
        </div>
      </div>
  
      {activeAnimalTab === 'add' ? (
        <Form onSubmit={handleAddAnimal}>
          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Animal ID</Form.Label>
              <Form.Control 
                type="text" 
                required
                placeholder="e.g. DA001"
                value={newAnimal.A_ID}
                onChange={(e) => setNewAnimal({...newAnimal, A_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Weight (KG)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1"
                min="0.1"
                required
                placeholder="e.g. 150.5"
                value={newAnimal.Weight}
                onChange={(e) => setNewAnimal({...newAnimal, Weight: e.target.value})}
              />
            </Form.Group>
          </div>
  
          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Animal Name</Form.Label>
              <Form.Control 
                type="text" 
                required
                placeholder="e.g. Daisy"
                value={newAnimal.Name}
                onChange={(e) => setNewAnimal({...newAnimal, Name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={newAnimal.Gender}
                onChange={(e) => setNewAnimal({...newAnimal, Gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
          </div>
  
          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Type</Form.Label>
              <Form.Control 
                type="text" 
                required
                placeholder="e.g. Dairy Cow"
                value={newAnimal.Type}
                onChange={(e) => setNewAnimal({...newAnimal, Type: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Age</Form.Label>
              <Form.Control 
                type="text" 
                required
                placeholder="e.g. 2 years"
                value={newAnimal.Age}
                onChange={(e) => setNewAnimal({...newAnimal, Age: e.target.value})}
              />
            </Form.Group>
          </div>
  
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Adding...</span>
                </>
              ) : 'Add Animal'}
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Animal ID, Name or Type"
              value={animalSearchTerm}
              onChange={(e) => setAnimalSearchTerm(e.target.value)}
            />
            <Button 
              variant="outline-secondary" 
              onClick={fetchAnimals}
              disabled={animalLoading}
            >
              Search
            </Button>
          </InputGroup>
  
          {animalLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : animalError ? (
            <Alert variant="danger">{animalError}</Alert>
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
                  <th>Added On</th>
                </tr>
              </thead>
              <tbody>
                {animalData.length > 0 ? (
                  animalData.map((animal) => (
                    <tr key={animal._id}>
                      <td>{animal.animalId}</td>
                      <td>{animal.name}</td>
                      <td>{animal.weight}</td>
                      <td>{animal.gender}</td>
                      <td>{animal.type}</td>
                      <td>{animal.age}</td>
                      <td>{new Date(animal.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No animal records found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Card>
  );

  const renderAnimalHealth = () => (
  <Card className="p-4 mb-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Animal Health</h2>
      <div>
        <Button 
          variant={activeHealthTab === 'add' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setActiveHealthTab('add')}
        >
          Add Health Report
        </Button>
        <Button 
          variant={activeHealthTab === 'view' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveHealthTab('view')}
        >
          View Health Reports
        </Button>
      </div>
    </div>

    {activeHealthTab === 'add' ? (
      <Form onSubmit={handleAddHealthReport}>
        <div className="row mb-3">
          <Form.Group className="col-md-6">
            <Form.Label>Animal ID</Form.Label>
            <Form.Control 
              type="text" 
              required
              placeholder="e.g. DA001"
              value={newHealthReport.A_ID}
              onChange={(e) => setNewHealthReport({...newHealthReport, A_ID: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Animal Name</Form.Label>
            <Form.Control 
              type="text" 
              required
              placeholder="e.g. Daisy"
              value={newHealthReport.AnimalName}
              onChange={(e) => setNewHealthReport({...newHealthReport, AnimalName: e.target.value})}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Treatment Date</Form.Label>
          <Form.Control 
            type="date" 
            required
            max={new Date().toISOString().split('T')[0]}
            value={newHealthReport.Date}
            onChange={(e) => setNewHealthReport({...newHealthReport, Date: e.target.value})}
          />
        </Form.Group>

        <div className="row mb-3">
          <Form.Group className="col-md-8">
            <Form.Label>Treatment</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              required
              placeholder="Describe the treatment given"
              value={newHealthReport.Treatment}
              onChange={(e) => setNewHealthReport({...newHealthReport, Treatment: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label>Cost (Rs)</Form.Label>
            <Form.Control 
              type="number" 
              min="0"
              step="0.01"
              required
              placeholder="e.g. 500.50"
              value={newHealthReport.Cost}
              onChange={(e) => setNewHealthReport({...newHealthReport, Cost: e.target.value})}
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Adding...</span>
              </>
            ) : 'Add Report'}
          </Button>
        </div>
      </Form>
    ) : (
      <>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by Animal ID"
            value={healthSearchTerm}
            onChange={(e) => setHealthSearchTerm(e.target.value)}
          />
          <Button 
            variant="outline-secondary" 
            onClick={fetchHealthReports}
            disabled={healthLoading}
          >
            Search
          </Button>
        </InputGroup>

        {healthLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : healthError ? (
          <Alert variant="danger">{healthError}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Animal ID</th>
                <th>Name</th>
                <th>Treatment Date</th>
                <th>Treatment</th>
                <th>Cost (Rs)</th>
                <th>Treated By</th>
                <th>Recorded On</th>
              </tr>
            </thead>
            <tbody>
              {healthData.length > 0 ? (
                healthData.map((report) => (
                  <tr key={report._id}>
                    <td>{report.animalId}</td>
                    <td>{report.animalName}</td>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td>{report.treatment}</td>
                    <td>{report.cost.toFixed(2)}</td>
                    <td>{report.treatedBy?.name || 'Unknown'}</td>
                    <td>{new Date(report.dateRecorded).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No health reports found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </>
    )}
  </Card>
);

const renderSales = () => (
  <Card className="p-4 mb-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Sales Management</h2>
      <div>
        <Button 
          variant={activeSalesTab === 'add' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setActiveSalesTab('add')}
        >
          Add New Sale
        </Button>
        <Button 
          variant={activeSalesTab === 'view' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveSalesTab('view')}
        >
          View Sales
        </Button>
      </div>
    </div>

    {activeSalesTab === 'add' ? (
      <Form onSubmit={handleAddSale}>
        <div className="row mb-3">
          <Form.Group className="col-md-6">
            <Form.Label>Sales ID</Form.Label>
            <Form.Control 
              type="text" 
              required
              placeholder="e.g. SALE001"
              value={newSale.Sales_ID}
              onChange={(e) => setNewSale({...newSale, Sales_ID: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Sale Date</Form.Label>
            <Form.Control 
              type="date" 
              required
              max={new Date().toISOString().split('T')[0]}
              value={newSale.Sale_Date}
              onChange={(e) => setNewSale({...newSale, Sale_Date: e.target.value})}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control 
            type="text" 
            required
            placeholder="e.g. John Doe"
            value={newSale.Customer_Name}
            onChange={(e) => setNewSale({...newSale, Customer_Name: e.target.value})}
          />
        </Form.Group>

        <div className="row mb-3">
          <Form.Group className="col-md-6">
            <Form.Label>Product ID</Form.Label>
            <Form.Control 
              type="text" 
              required
              placeholder="e.g. PROD001"
              value={newSale.Product_ID}
              onChange={(e) => setNewSale({...newSale, Product_ID: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Total Cost (Rs)</Form.Label>
            <Form.Control 
              type="number" 
              min="0"
              step="0.01"
              required
              placeholder="e.g. 1500.50"
              value={newSale.Total_Cost}
              onChange={(e) => setNewSale({...newSale, Total_Cost: e.target.value})}
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Adding...</span>
              </>
            ) : 'Add Sale'}
          </Button>
        </div>
      </Form>
    ) : (
      <>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by Sale ID"
            value={salesSearchTerm}
            onChange={(e) => setSalesSearchTerm(e.target.value)}
          />
          <Button 
            variant="outline-secondary" 
            onClick={fetchSales}
            disabled={salesLoading}
          >
            Search
          </Button>
        </InputGroup>

        {salesLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : salesError ? (
          <Alert variant="danger">{salesError}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Product ID</th>
                <th>Total (Rs)</th>
                <th>Recorded By</th>
                <th>Recorded On</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? (
                salesData.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.saleId}</td>
                    <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.productId}</td>
                    <td>{sale.totalCost.toFixed(2)}</td>
                    <td>{sale.recordedBy?.name || 'Unknown'}</td>
                    <td>{new Date(sale.dateRecorded).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No sales records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </>
    )}
  </Card>
);

  const renderProducts = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>
        <div>
          <Button 
            variant={activeProductsTab === 'add' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setActiveProductsTab('add')}
          >
            Add New Product
          </Button>
          <Button 
            variant={activeProductsTab === 'view' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveProductsTab('view')}
          >
            View Products
          </Button>
        </div>
      </div>

      {activeProductsTab === 'add' ? (
        <Form onSubmit={handleAddProduct}>
          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Product ID</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newProduct.Product_ID}
                onChange={(e) => setNewProduct({...newProduct, Product_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Product Name</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newProduct.Product_Name}
                onChange={(e) => setNewProduct({...newProduct, Product_Name: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Price Per Unit (Rs)</Form.Label>
              <Form.Control 
                type="number" 
                required
                value={newProduct.Price_Per_Unit}
                onChange={(e) => setNewProduct({...newProduct, Price_Per_Unit: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Availability</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newProduct.Availability}
                onChange={(e) => setNewProduct({...newProduct, Availability: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="row mb-3">
            <Form.Group className="col-md-6">
              <Form.Label>Production Date</Form.Label>
              <Form.Control 
                type="date" 
                required
                value={newProduct.Production_Date}
                onChange={(e) => setNewProduct({...newProduct, Production_Date: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control 
                type="date" 
                required
                value={newProduct.Expiration_Date}
                onChange={(e) => setNewProduct({...newProduct, Expiration_Date: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Product ID"
              value={productsSearchTerm}
              onChange={(e) => setProductsSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price (Rs)</th>
                <th>Availability</th>
                <th>Production Date</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No product records found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );

  const renderFarmFinance = () => (
    <Card className="p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Farm Finance</h2>
        <div>
          <Button 
            variant="primary"
            onClick={() => {}} // Single button mode as requested
          >
            Add Finance
          </Button>
        </div>
      </div>

      <Form onSubmit={handleAddFinanceRecord}>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control 
            type="date" 
            required
            value={newFinanceRecord.Date}
            onChange={(e) => setNewFinanceRecord({...newFinanceRecord, Date: e.target.value})}
          />
        </Form.Group>

        <div className="row mb-3">
          <Form.Group className="col-md-6">
            <Form.Label>Total Revenue (Rs)</Form.Label>
            <Form.Control 
              type="number" 
              required
              value={newFinanceRecord.Total_Revenue}
              onChange={(e) => setNewFinanceRecord({...newFinanceRecord, Total_Revenue: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>Total Expense (Rs)</Form.Label>
            <Form.Control 
              type="number" 
              required
              value={newFinanceRecord.Total_Expense}
              onChange={(e) => setNewFinanceRecord({...newFinanceRecord, Total_Expense: e.target.value})}
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Add Record
          </Button>
        </div>
      </Form>
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
      case 'products':
        return renderProducts();
      case 'finance':
        return renderFarmFinance();
      default:
        return renderMilkProduction();
    }
  };

  if (!employeeData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Navigation Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="text-center mb-4">Dairy Farm</h4>
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
          <ListGroup.Item 
            action 
            active={activeSection === 'products'}
            className={activeSection === 'products' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('products')}
          >
            Products
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            active={activeSection === 'finance'}
            className={activeSection === 'finance' ? 'bg-primary border-0' : 'bg-dark text-white border-0'}
            onClick={() => setActiveSection('finance')}
          >
            Farm Finance
          </ListGroup.Item>
        </ListGroup>
        
        <div className="mt-auto">
          <Button variant="outline-light" className="w-100" onClick={handleLogout}>
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