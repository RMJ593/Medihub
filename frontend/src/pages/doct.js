import React, { useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { useLocation, useNavigate } from 'react-router-dom';

function Doct() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.name || sessionStorage.getItem('username') || localStorage.getItem('username') || 'Guest';
    const isAuthenticated = sessionStorage.getItem('username') || localStorage.getItem('authToken');
    
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        type: 'offline',
        date: '',
        timeSlot: '',
        symptoms: '',
        urgency: 'normal'
    });
    const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });
    
    const doctors = [
        {
            id: 1, 
            name: 'Dr. Emily Carter', 
            specialization: 'Cardiologist', 
            image: require('../components/cartooDoct.jpg'),
            experience: '15 years',
            rating: 4.8,
            fees: { offline: 500, online: 300 }
        },
        {
            id: 2, 
            name: 'Dr. Michael Johnson', 
            specialization: 'Neurologist', 
            image: require('../components/cartooDoct.jpg'),
            experience: '12 years',
            rating: 4.7,
            fees: { offline: 600, online: 400 }
        },
        {
            id: 3, 
            name: 'Dr. Sarah Lee', 
            specialization: 'Orthopedic Surgeon', 
            image: require('../components/cartooDoct.jpg'),
            experience: '20 years',
            rating: 4.9,
            fees: { offline: 800, online: 500 }
        },
        {
            id: 4, 
            name: 'Dr. William Davis', 
            specialization: 'General Physician', 
            image: require('../components/cartooDoct.jpg'),
            experience: '10 years',
            rating: 4.6,
            fees: { offline: 400, online: 250 }
        }
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
        '05:00 PM', '05:30 PM', '06:00 PM'
    ];

    const filteredDoctors = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleViewBookings = () => {
        navigate('/bookings', { 
            state: { 
                bookings: bookings, 
                userId: userId 
            } 
        });
    };

    const handleBookAppointment = (doctor) => {
        if (!isAuthenticated) {
            setShowAlert({
                show: true,
                message: 'Please login to book an appointment',
                variant: 'warning'
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
        // Reset appointment details
        setAppointmentDetails({
            type: 'offline',
            date: '',
            timeSlot: '',
            symptoms: '',
            urgency: 'normal'
        });
    };

    const handleAppointmentSubmit = () => {
        // Validate required fields
        if (!appointmentDetails.date || !appointmentDetails.timeSlot) {
            setShowAlert({
                show: true,
                message: 'Please select date and time slot',
                variant: 'danger'
            });
            return;
        }

        // Create appointment object
        const newAppointment = {
            id: Date.now(), // Simple ID generation
            doctor: selectedDoctor,
            ...appointmentDetails,
            bookingDate: new Date().toLocaleDateString(),
            status: 'confirmed',
            patientId: userId
        };

        // Add to bookings
        setBookings(prevBookings => {
            const existingIndex = prevBookings.findIndex(
                booking => booking.doctor.id === selectedDoctor.id && 
                          booking.date === appointmentDetails.date &&
                          booking.timeSlot === appointmentDetails.timeSlot
            );
            
            if (existingIndex >= 0) {
                // Update existing booking
                const updated = [...prevBookings];
                updated[existingIndex] = { ...updated[existingIndex], ...newAppointment };
                return updated;
            } else {
                // Add new booking
                return [...prevBookings, newAppointment];
            }
        });

        setShowAlert({
            show: true,
            message: `Appointment booked successfully with ${selectedDoctor.name}`,
            variant: 'success'
        });

        setShowBookingModal(false);
        setSelectedDoctor(null);
    };

    const getBookingsCount = () => bookings.length;

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <>
            {/* Alert */}
            {showAlert.show && (
                <Alert 
                    variant={showAlert.variant} 
                    onClose={() => setShowAlert({ show: false, message: '', variant: 'success' })} 
                    dismissible
                    className="position-fixed"
                    style={{ top: '10px', right: '10px', zIndex: 9999, minWidth: '300px' }}
                >
                    {showAlert.message}
                </Alert>
            )}

            {/* Navbar */}
            <Navbar className="bg-primary text-white p-3 shadow">
                <Row className="w-100 align-items-center">
                    <Col xs={12} md={4}>
                        <Form.Control 
                            type="text" 
                            placeholder="Search doctors or specializations..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shadow-sm"
                        />
                    </Col>
                    <Col xs={12} md={4} className="text-center mt-2 mt-md-0">
                        <Button 
                            variant="light" 
                            onClick={handleViewBookings}
                            className="position-relative shadow-sm"
                            size="lg"
                        >
                            📅 My Appointments 
                            {getBookingsCount() > 0 && (
                                <Badge 
                                    bg="danger" 
                                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                                >
                                    {getBookingsCount()}
                                </Badge>
                            )}
                        </Button>
                    </Col>
                    <Col xs={12} md={4} className="text-end mt-2 mt-md-0">
                        <Navbar.Text className="text-white me-3">
                            Welcome, <strong>{userId}</strong>
                        </Navbar.Text>
                        {isAuthenticated ? (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <Button variant="light" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        )}
                    </Col>
                </Row>
            </Navbar>

            {/* Doctors Grid */}
            <div className="container mt-4">
                <div className="row g-4">
                    {filteredDoctors.map((doctor) => (
                        <div className="col-12 col-md-6 col-lg-4" key={doctor.id}>
                            <Card className="h-100 shadow-sm border-0 hover-card">
                                <Card.Img 
                                    variant="top" 
                                    src={doctor.image} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-primary">
                                        {doctor.name}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {doctor.specialization}
                                    </Card.Subtitle>
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            Experience: {doctor.experience}<br/>
                                            Rating: ⭐ {doctor.rating}/5<br/>
                                            Fees: ₹{doctor.fees.offline} (Offline) / ₹{doctor.fees.online} (Online)
                                        </small>
                                    </div>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleBookAppointment(doctor)}
                                        className="mt-auto shadow-sm"
                                        size="lg"
                                    >
                                        📅 Book Appointment
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center mt-5">
                        <h4 className="text-muted">No doctors found matching your search</h4>
                        <p className="text-muted">Try searching with different keywords</p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        📅 Book Appointment with {selectedDoctor?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDoctor && (
                        <div>
                            <div className="mb-4 p-3 bg-light rounded">
                                <h6><strong>{selectedDoctor.name}</strong></h6>
                                <p className="mb-1">{selectedDoctor.specialization}</p>
                                <p className="mb-0 text-muted">
                                    Experience: {selectedDoctor.experience} | Rating: ⭐ {selectedDoctor.rating}/5
                                </p>
                            </div>

                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>Appointment Type</strong></Form.Label>
                                            <Form.Select
                                                value={appointmentDetails.type}
                                                onChange={(e) => setAppointmentDetails({
                                                    ...appointmentDetails, 
                                                    type: e.target.value
                                                })}
                                            >
                                                <option value="offline">🏥 In-Person Visit (₹{selectedDoctor.fees.offline})</option>
                                                <option value="online">💻 Video Consultation (₹{selectedDoctor.fees.online})</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>Urgency Level</strong></Form.Label>
                                            <Form.Select
                                                value={appointmentDetails.urgency}
                                                onChange={(e) => setAppointmentDetails({
                                                    ...appointmentDetails, 
                                                    urgency: e.target.value
                                                })}
                                            >
                                                <option value="normal">📅 Normal</option>
                                                <option value="urgent">⚡ Urgent</option>
                                                <option value="emergency">🚨 Emergency</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>Preferred Date</strong></Form.Label>
                                            <Form.Control
                                                type="date"
                                                min={getTomorrowDate()}
                                                value={appointmentDetails.date}
                                                onChange={(e) => setAppointmentDetails({
                                                    ...appointmentDetails, 
                                                    date: e.target.value
                                                })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>Time Slot</strong></Form.Label>
                                            <Form.Select
                                                value={appointmentDetails.timeSlot}
                                                onChange={(e) => setAppointmentDetails({
                                                    ...appointmentDetails, 
                                                    timeSlot: e.target.value
                                                })}
                                                required
                                            >
                                                <option value="">Select time slot</option>
                                                {timeSlots.map(slot => (
                                                    <option key={slot} value={slot}>{slot}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label><strong>Symptoms / Reason for Visit</strong></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Please describe your symptoms or reason for the appointment..."
                                        value={appointmentDetails.symptoms}
                                        onChange={(e) => setAppointmentDetails({
                                            ...appointmentDetails, 
                                            symptoms: e.target.value
                                        })}
                                    />
                                </Form.Group>

                                <div className="bg-info bg-opacity-10 p-3 rounded">
                                    <h6>📋 Appointment Summary:</h6>
                                    <p className="mb-1"><strong>Doctor:</strong> {selectedDoctor.name}</p>
                                    <p className="mb-1"><strong>Type:</strong> {appointmentDetails.type === 'online' ? '💻 Video Consultation' : '🏥 In-Person Visit'}</p>
                                    <p className="mb-1"><strong>Fee:</strong> ₹{selectedDoctor.fees[appointmentDetails.type]}</p>
                                    <p className="mb-0"><strong>Date & Time:</strong> {appointmentDetails.date} at {appointmentDetails.timeSlot}</p>
                                </div>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAppointmentSubmit}>
                        📅 Confirm Appointment
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .hover-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                }
            `}</style>
        </>
    );
}

export default Doct;