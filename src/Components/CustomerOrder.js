import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Alert,
  Table,
  Form,
  Row,
  Col,
  InputGroup,
  Container,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';

const CustomerOrder = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [cart, setCart] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    contact: '',
    address: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch products from the backend
        setProducts([
          { id: 'prod1', name: 'Fresh Milk', description: 'Pure farm fresh milk', price: 70, unit: 'per liter' },
          { id: 'prod2', name: 'Butter', description: 'Homemade butter', price: 250, unit: 'per kg' },
          { id: 'prod3', name: 'Cheese', description: 'Farmhouse cheese', price: 400, unit: 'per kg' },
          { id: 'prod4', name: 'Yogurt', description: 'Natural yogurt', price: 100, unit: 'per kg' },
          { id: 'prod5', name: 'Paneer', description: 'Fresh cottage cheese', price: 300, unit: 'per kg' },
          { id: 'prod6', name: 'Ghee', description: 'Pure clarified butter', price: 800, unit: 'per kg' }
        ]);
      } catch (err) {
        showAlert('Failed to load products', 'danger');
      }
    };

    fetchProducts();
  }, []);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 3000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showAlert(`${product.name} added to cart`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showAlert('Item removed from cart', 'danger');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: parseInt(newQuantity) }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showAlert('Your cart is empty', 'danger');
      return;
    }
    if (!customerInfo.name || !customerInfo.contact || !customerInfo.address) {
      showAlert('Please fill all customer information', 'danger');
      return;
    }

    try {
      setLoading(true);
      const orderData = { 
        customerInfo, 
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })), 
        total: calculateTotal() 
      };
      
      await axios.post('http://localhost:5000/api/orders', orderData);
      
      setOrderComplete(true);
      setCart([]);
      setCustomerInfo({
        name: '',
        contact: '',
        address: ''
      });
      showAlert('Order completed successfully!', 'success');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Order failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const renderProducts = () => (
    <Row xs={1} md={2} lg={3} className="g-4">
      {products.map(product => (
        <Col key={product.id}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{product.description}</Card.Subtitle>
              <div className="mb-2 fw-bold">
                Rs. {product.price} {product.unit}
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0">
              <Button
                variant="primary"
                onClick={() => addToCart(product)}
                className="w-100"
              >
                Add To Cart
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderCart = () => (
    <div>
      {cart.length === 0 ? (
        <Alert variant="info">
          Your cart is empty. Please add some products.
        </Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>Rs. {item.price}</td>
                  <td>
                    <InputGroup style={{ width: '120px' }}>
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        min="1"
                        className="text-center"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </td>
                  <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total:</td>
                <td colSpan="2" className="fw-bold">Rs. {calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>

          {!orderComplete && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Customer Information</Card.Title>
                <Form onSubmit={handleCompleteOrder}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="contact"
                      value={customerInfo.contact}
                      onChange={handleCustomerInfoChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={customerInfo.address}
                      onChange={handleCustomerInfoChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="success" type="submit" size="lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Processing...</span>
                        </>
                      ) : (
                        'Complete Order'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {orderComplete && (
            <Alert variant="success" className="text-center py-4">
              <Alert.Heading>Order Completed Successfully!</Alert.Heading>
              <p>Thank you for your order. We will contact you shortly for delivery details.</p>
              <Button
                variant="outline-success"
                onClick={() => {
                  setOrderComplete(false);
                  setActiveTab('products');
                }}
              >
                Place Another Order
              </Button>
            </Alert>
          )}
        </>
      )}
    </div>
  );

  return (
    <Container className="py-5">
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

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">PRODUCTS</h1>
            <div>
              <Button
                variant={activeTab === 'products' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setActiveTab('products')}
                disabled={orderComplete}
              >
                View Products
              </Button>
              <Button
                variant={activeTab === 'cart' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('cart')}
                disabled={orderComplete}
              >
                View Cart ({cart.length})
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {activeTab === 'products' ? renderProducts() : renderCart()}

      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-secondary">
          Back to Home
        </Link>
      </div>
    </Container>
  );
};

export default CustomerOrder;