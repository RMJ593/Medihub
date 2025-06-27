import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

function MyCart() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get cart data and user info from location state
  const cart = location.state?.cart || [];
  const userId = location.state?.userId || sessionStorage.getItem('username') || localStorage.getItem('username') || 'Guest';
  const isAuthenticated = sessionStorage.getItem('username') || localStorage.getItem('authToken');

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      const updatedCart = cart.map(item => 
        item.id === id ? { ...item, quantity: qty } : item
      );
      // Update the cart in location state
      navigate('/mycart', { 
        state: { 
          cart: updatedCart, 
          userId: userId 
        }, 
        replace: true 
      });
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    navigate('/mycart', { 
      state: { 
        cart: updatedCart, 
        userId: userId 
      }, 
      replace: true 
    });
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // Add checkout logic here
    alert(`Proceeding to checkout with total: Rs ${calculateTotal()}`);
  };

  const goBackToShopping = () => {
    navigate('/med', { state: { name: userId, cart: cart } });
  };

  return (
    <>
      <Navbar className="bg-primary justify-content-between p-3">
        <Row className="w-100">
          <Col xs="auto">
            <Button variant="light" onClick={goBackToShopping}>
              ← Continue Shopping
            </Button>
          </Col>
          <Col className="text-center">
            <Navbar.Brand className="text-white">My Cart</Navbar.Brand>
          </Col>
          <Col className="text-end">
            <Navbar.Text className="text-white">
              Signed in as: <span className="text-warning">{userId}</span>
            </Navbar.Text>
            {isAuthenticated ? (
              <Button variant="light" onClick={handleLogout} className="ms-2">Logout</Button>
            ) : (
              <Button variant="light" onClick={() => navigate('/login')} className="ms-2">Login</Button>
            )}
          </Col>
        </Row>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>Cart Items ({getCartCount()} items)</h4>
              </Card.Header>
              <Card.Body>
                {cart.length === 0 ? (
                  <div className="text-center py-5">
                    <h5>Your cart is empty</h5>
                    <p>Add some medicines to get started!</p>
                    <Button variant="primary" onClick={goBackToShopping}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="border-bottom py-3">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        </Col>
                        <Col md={4}>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">{item.dosage}</small>
                          {item.requiresPrescription && (
                            <div>
                              <small className="text-warning">⚠️ Prescription Required</small>
                            </div>
                          )}
                        </Col>
                        <Col md={2}>
                          <strong>Rs {item.price.toFixed(2)}</strong>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex align-items-center">
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-3 fw-bold">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col md={1}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            🗑️
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col className="text-end">
                          <strong>Subtotal: Rs {(item.price * item.quantity).toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h5>Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <span>Items ({getCartCount()}):</span>
                  <span>Rs {calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <span>Rs 50.00</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax:</span>
                  <span>Rs {(parseFloat(calculateTotal()) * 0.1).toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong>Rs {(parseFloat(calculateTotal()) + 50 + parseFloat(calculateTotal()) * 0.1).toFixed(2)}</strong>
                </div>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="w-100 mt-2"
                  onClick={goBackToShopping}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MyCart;