import React, { useState } from 'react';
import './medi.css';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Medi() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.name || sessionStorage.getItem('username') || localStorage.getItem('username') || 'Guest';
  const isAuthenticated = sessionStorage.getItem('username') || localStorage.getItem('authToken');

  const [cart, setCart] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [hasPrescription, setHasPrescription] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const medicines = [
    { id: 1, name: 'Advil', dosage: '200mg', price: 199.00, image: require('../components/medicines/advil.jpg'), requiresPrescription: false },
    { id: 2, name: 'Carmicide', dosage: '500ml', price: 400.00, image: require('../components/medicines/carmicide.jpg'), requiresPrescription: true },
    { id: 3, name: 'Cetirizine', dosage: '10mg', price: 199.00, image: require('../components/medicines/cetirizine.jpg'), requiresPrescription: true },
    { id: 4, name: 'Dolo-650', dosage: '650mg', price: 100.00, image: require('../components/medicines/doo 650.jpg'), requiresPrescription: false },
    { id: 5, name: 'Livolin', dosage: '200mg', price: 199.00, image: require('../components/medicines/livolin.jpeg'), requiresPrescription: true },
    { id: 6, name: 'Vaporizer', dosage: '1 N', price: 600.00, image: require('../components/medicines/steam.jpg'), requiresPrescription: false },
    { id: 7, name: 'Thermometer', dosage: '1 N', price: 700.00, image: require('../components/medicines/thermo.jpg'), requiresPrescription: false },
    { id: 8, name: 'Vicks', dosage: '200mg', price: 10.00, image: require('../components/medicines/vicks.jpg'), requiresPrescription: false }
  ];

  const filteredMedicines = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleViewCart = () => {
    navigate('/mycart', { 
      state: { 
        cart: cart, 
        userId: userId 
      } 
    });
  };
  const handleAddToCart = (medicine) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (medicine.requiresPrescription) {
      setSelectedMedicine(medicine);
      setShowPrescriptionModal(true);
    } else {
      addToCartDirectly(medicine);
    }
  };

  const addToCartDirectly = (medicine) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === medicine.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  const handlePrescriptionConsent = () => {
    if (hasPrescription && selectedMedicine) {
      addToCartDirectly(selectedMedicine);
      setShowPrescriptionModal(false);
      setSelectedMedicine(null);
      setHasPrescription(false);
    } else alert("Prescription required for this medicine.");
  };

  return (
    <>
      <Navbar className="bg-primary justify-content-between p-3">
        <Row className="w-100">
          <Col xs="auto">
            <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Col>
          <Col xs="auto">
            <Button 
              variant="light" 
              onClick={handleViewCart}
              className="position-relative"
            >
              🛒 My Cart 
              {getCartCount() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getCartCount()}
                </span>
              )}
            </Button>
          </Col>
           <Col className="text-end">
            <Navbar.Text>
              Signed in as: <a href="#profile">{userId}</a>
            </Navbar.Text>
            {isAuthenticated ? (
              <Button variant="light" onClick={handleLogout} className="ms-2">Logout</Button>
            ) : (
              <Button variant="light" onClick={() => navigate('/login')} className="ms-2">Login</Button>
            )}
          </Col>
        </Row>
      </Navbar>

      <div className="container mt-4">
        <div className="row">
          {filteredMedicines.map((medicine) => (
            <div className="col-4 mb-4" key={medicine.id}>
              <Card className="text-center" style={{ width: '18rem' }}>
                <Card.Img variant="top" className="med" src={medicine.image} />
                <Card.Body>
                  <Card.Title>{medicine.name}</Card.Title>
                  <Card.Text>{medicine.dosage}</Card.Text>
                  <h5 className="text-danger">Rs: {medicine.price.toFixed(2)}</h5>
                  {medicine.requiresPrescription && <p className="text-warning">⚠️ Prescription Required</p>}
                  <Button variant="primary" onClick={() => handleAddToCart(medicine)}>Add to Cart</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {showPrescriptionModal && selectedMedicine && (
        <div 
    className="modal-backdrop show d-flex justify-content-center align-items-center" 
    
  >
          <div className="modal-dialog">
            <div className="modal-content p-4" >
              <h5 className="modal-title mb-3" style={{ color: '#333', textAlign: 'center' }}>Prescription Required</h5>
              <p style={{ color: '#666', textAlign: 'center', marginBottom: '20px' }}>Do you have a valid prescription for <strong >{selectedMedicine.name}</strong >?</p>
              <Form.Check type="checkbox" label="Yes, I have a prescription" checked={hasPrescription} onChange={(e) => setHasPrescription(e.target.checked)} />
              <div className="mt-3 d-flex justify-content-between">
                <Button variant="primary" onClick={handlePrescriptionConsent} disabled={!hasPrescription} 
            >Add to Cart</Button>
                <Button variant="secondary" onClick={() => {
                  setShowPrescriptionModal(false);
                  setSelectedMedicine(null);
                  setHasPrescription(false);
                }} >Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Medi;