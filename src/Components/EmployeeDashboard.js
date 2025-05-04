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

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    // Check if employee is authenticated
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
  const [milkData, setMilkData] = useState([]);
  const [newMilkRecord, setNewMilkRecord] = useState({
    Production_Date: '',
    A_ID: '',
    Quantity: '',
    Quality: 'Good'
  });
  const [milkSearchTerm, setMilkSearchTerm] = useState('');

  // Animal Records states
  const [activeAnimalTab, setActiveAnimalTab] = useState('add');
  const [animalData, setAnimalData] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    A_ID: '',
    Name: '',
    Weight: '',
    Gender: 'Male',
    Type: '',
    Age: ''
  });
  const [animalSearchTerm, setAnimalSearchTerm] = useState('');

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

  // Sales states
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

  // Farm Finance states (single add mode)
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

  // Form handlers (front-end only)
  const handleAddMilkRecord = (e) => {
    e.preventDefault();
    showAlert('Milk record would be saved to database in backend implementation', 'success');
    setNewMilkRecord({
      Production_Date: '',
      A_ID: '',
      Quantity: '',
      Quality: 'Good'
    });
  };

  const handleAddAnimal = (e) => {
    e.preventDefault();
    showAlert('Animal record would be saved to database in backend implementation', 'success');
    setNewAnimal({
      A_ID: '',
      Name: '',
      Weight: '',
      Gender: 'Male',
      Type: '',
      Age: ''
    });
  };

  const handleAddHealthReport = (e) => {
    e.preventDefault();
    showAlert('Health report would be saved to database in backend implementation', 'success');
    setNewHealthReport({
      A_ID: '',
      AnimalName: '',
      Date: '',
      Treatment: '',
      Cost: ''
    });
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    showAlert('Sale record would be saved to database in backend implementation', 'success');
    setNewSale({
      Sales_ID: '',
      Sale_Date: '',
      Customer_Name: '',
      Product_ID: '',
      Total_Cost: ''
    });
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
            <Button variant="primary" type="submit">
              Add Record
            </Button>
          </div>
        </Form>
      ) : (
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
                <th>Date</th>
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
                value={newAnimal.A_ID}
                onChange={(e) => setNewAnimal({...newAnimal, A_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Weight (KG)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1"
                required
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
                value={newAnimal.Type}
                onChange={(e) => setNewAnimal({...newAnimal, Type: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Age</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newAnimal.Age}
                onChange={(e) => setNewAnimal({...newAnimal, Age: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Animal
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by Animal ID"
              value={animalSearchTerm}
              onChange={(e) => setAnimalSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

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
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No animal records found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
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
            View Health Report
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
                value={newHealthReport.A_ID}
                onChange={(e) => setNewHealthReport({...newHealthReport, A_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Animal Name</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newHealthReport.AnimalName}
                onChange={(e) => setNewHealthReport({...newHealthReport, AnimalName: e.target.value})}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              required
              value={newHealthReport.Date}
              onChange={(e) => setNewHealthReport({...newHealthReport, Date: e.target.value})}
            />
          </Form.Group>

          <div className="row mb-3">
            <Form.Group className="col-md-8">
              <Form.Label>Treatment</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={newHealthReport.Treatment}
                onChange={(e) => setNewHealthReport({...newHealthReport, Treatment: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Cost (Rs)</Form.Label>
              <Form.Control 
                type="number" 
                required
                value={newHealthReport.Cost}
                onChange={(e) => setNewHealthReport({...newHealthReport, Cost: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Report
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
            <Button variant="outline-secondary">
              Search
            </Button>
          </InputGroup>

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
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No health reports found (backend will load data here)
                </td>
              </tr>
            </tbody>
          </Table>
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
                value={newSale.Sales_ID}
                onChange={(e) => setNewSale({...newSale, Sales_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Sale Date</Form.Label>
              <Form.Control 
                type="date" 
                required
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
                value={newSale.Product_ID}
                onChange={(e) => setNewSale({...newSale, Product_ID: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Total Cost (Rs)</Form.Label>
              <Form.Control 
                type="number" 
                required
                value={newSale.Total_Cost}
                onChange={(e) => setNewSale({...newSale, Total_Cost: e.target.value})}
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Sale
            </Button>
          </div>
        </Form>
      ) : (
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
                <th>Sales ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Product ID</th>
                <th>Total (Rs)</th>
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
    return <div>Loading...</div>;
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