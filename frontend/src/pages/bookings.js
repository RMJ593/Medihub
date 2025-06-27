import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

function Bookings() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookings = [], userId = 'Guest' } = location.state || {};
    
    const [appointments, setAppointments] = useState(bookings);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });
    const [filterStatus, setFilterStatus] = useState('all');

    const isAuthenticated = sessionStorage.getItem('username') || localStorage.getItem('authToken');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'completed': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return '✅';
            case 'pending': return '⏳';
            case 'cancelled': return '❌';
            case 'completed': return '✔️';
            default: return '📋';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'emergency': return 'danger';
            case 'urgent': return 'warning';
            case 'normal': return 'primary';
            default: return 'secondary';
        }
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
    };

    const confirmCancelAppointment = () => {
        setAppointments(prevAppointments =>
            prevAppointments.map(appointment =>
                appointment.id === selectedAppointment.id
                    ? { ...appointment, status: 'cancelled' }
                    : appointment
            )
        );

        setShowAlert({
            show: true,
            message: `Appointment with ${selectedAppointment.doctor.name} has been cancelled`,
            variant: 'warning'
        });

        setShowCancelModal(false);
        setSelectedAppointment(null);
    };

    const handleReschedule = (appointment) => {
        // Navigate back to doctor booking with pre-filled data
        navigate('/doct', {
            state: {
                rescheduleAppointment: appointment,
                name: userId
            }
        });
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filterStatus === 'all') return true;
        return appointment.status === filterStatus;
    });

    const getAppointmentStats = () => {
        const total = appointments.length;
        const confirmed = appointments.filter(a => a.status === 'confirmed').length;
        const pending = appointments.filter(a => a.status === 'pending').length;
        const cancelled = appointments.filter(a => a.status === 'cancelled').length;
        const completed = appointments.filter(a => a.status === 'completed').length;

        return { total, confirmed, pending, cancelled, completed };
    };

    const stats = getAppointmentStats();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                    <Col xs={12} md={6}>
                        <Navbar.Brand className="text-white">
                            📅 My Appointments
                        </Navbar.Brand>
                    </Col>
                    <Col xs={12} md={6} className="text-end">
                        <Button 
                            variant="outline-light" 
                            onClick={() => navigate('/doct', { state: { name: userId } })}
                            className="me-2"
                        >
                            ← Back to Doctors
                        </Button>
                        <Navbar.Text className="text-white me-3">
                            Welcome, <strong>{userId}</strong>
                        </Navbar.Text>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Col>
                </Row>
            </Navbar>

            <div className="container mt-4">
                {/* Statistics Cards */}
                <Row className="mb-4">
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-primary">
                            <Card.Body>
                                <h3 className="text-primary">{stats.total}</h3>
                                <p className="mb-0">📊 Total Appointments</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-success">
                            <Card.Body>
                                <h3 className="text-success">{stats.confirmed}</h3>
                                <p className="mb-0">✅ Confirmed</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-warning">
                            <Card.Body>
                                <h3 className="text-warning">{stats.pending}</h3>
                                <p className="mb-0">⏳ Pending</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-danger">
                            <Card.Body>
                                <h3 className="text-danger">{stats.cancelled}</h3>
                                <p className="mb-0">❌ Cancelled</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Filter */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label><strong>Filter by Status:</strong></Form.Label>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">📋 All Appointments</option>
                                <option value="confirmed">✅ Confirmed</option>
                                <option value="pending">⏳ Pending</option>
                                <option value="cancelled">❌ Cancelled</option>
                                <option value="completed">✔️ Completed</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Appointments List */}
                {filteredAppointments.length === 0 ? (
                    <div className="text-center mt-5">
                        <div className="mb-4">
                            <h2 className="text-muted">📅</h2>
                            <h4 className="text-muted">No appointments found</h4>
                            <p className="text-muted">
                                {filterStatus === 'all' 
                                    ? "You haven't booked any appointments yet." 
                                    : `No ${filterStatus} appointments found.`}
                            </p>
                        </div>
                        <Button 
                            variant="primary" 
                            onClick={() => navigate('/doct', { state: { name: userId } })}
                        >
                            📅 Book Your First Appointment
                        </Button>
                    </div>
                ) : (
                    <Row>
                        {filteredAppointments.map((appointment) => (
                            <Col lg={6} className="mb-4" key={appointment.id}>
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{appointment.doctor.name}</strong>
                                            <br />
                                            <small className="text-muted">{appointment.doctor.specialization}</small>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg={getStatusColor(appointment.status)} className="mb-1">
                                                {getStatusIcon(appointment.status)} {appointment.status.toUpperCase()}
                                            </Badge>
                                            <br />
                                            <Badge bg={getUrgencyColor(appointment.urgency)} size="sm">
                                                {appointment.urgency.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="appointment-details">
                                            <Row className="mb-2">
                                                <Col xs={6}>
                                                    <small className="text-muted">📅 Date:</small>
                                                    <br />
                                                    <strong>{formatDate(appointment.date)}</strong>
                                                </Col>
                                                <Col xs={6}>
                                                    <small className="text-muted">⏰ Time:</small>
                                                    <br />
                                                    <strong>{appointment.timeSlot}</strong>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col xs={6}>
                                                    <small className="text-muted">📱 Type:</small>
                                                    <br />
                                                    <Badge variant="outline-primary">
                                                        {appointment.type === 'online' ? '💻 Online' : '🏥 In-Person'}
                                                    </Badge>
                                                </Col>
                                                <Col xs={6}>
                                                    <small className="text-muted">💰 Fee:</small>
                                                    <br />
                                                    <strong>₹{appointment.doctor.fees[appointment.type]}</strong>
                                                </Col>
                                            </Row>
                                            {appointment.symptoms && (
                                                <div className="mb-2">
                                                    <small className="text-muted">📋 Symptoms/Reason:</small>
                                                    <br />
                                                    <small>{appointment.symptoms}</small>
                                                </div>
                                            )}
                                            <div className="mb-2">
                                                <small className="text-muted">📅 Booked on:</small>
                                                <br />
                                                <small>{appointment.bookingDate}</small>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="bg-white border-top-0">
                                        <div className="d-flex gap-2 flex-wrap">
                                            {appointment.status === 'confirmed' && (
                                                <>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleReschedule(appointment)}
                                                    >
                                                        🔄 Reschedule
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleCancelAppointment(appointment)}
                                                    >
                                                        ❌ Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {appointment.type === 'online' && appointment.status === 'confirmed' && (
                                                <Button variant="success" size="sm">
                                                    💻 Join Video Call
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
                        {/* Cancel Confirmation Modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel your appointment with{' '}
                    <strong>{selectedAppointment?.doctor?.name}</strong> on{' '}
                    <strong>{formatDate(selectedAppointment?.date)}</strong> at{' '}
                    <strong>{selectedAppointment?.timeSlot}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        No, Go Back
                    </Button>
                    <Button variant="danger" onClick={confirmCancelAppointment}>
                        Yes, Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Bookings;
