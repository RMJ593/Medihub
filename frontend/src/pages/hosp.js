import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function Hosp() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.name || sessionStorage.getItem('username') || 'Guest';
    const isAuthenticated = sessionStorage.getItem('username') || sessionStorage.getItem('authToken');

    // Core state
    const [facilities, setFacilities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'info' });
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    // Enhanced filters
    const [searchRadius, setSearchRadius] = useState(5000);
    const [facilityType, setFacilityType] = useState('all');
    const [activeTab, setActiveTab] = useState('hospitals');
    const [countryFilter, setCountryFilter] = useState('IN');
    const [emergencyOnly, setEmergencyOnly] = useState(false);
    const [openNowOnly, setOpenNowOnly] = useState(false);

    // Google Places API configuration
    const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Enhanced facility types for Google Places
    const facilityTypes = {
        hospitals: ['hospital', 'emergency_room', 'medical_center'],
        pharmacies: ['pharmacy', 'drugstore'],
        clinics: ['doctor', 'clinic', 'health'],
        laboratories: ['medical_lab', 'diagnostic_center'],
        dental: ['dentist', 'dental_clinic'],
        veterinary: ['veterinary_care', 'animal_hospital']
    };

    useEffect(() => {
        if (isAuthenticated) {
            getCurrentLocation();
            loadGoogleMapsScript();
        }
    }, [isAuthenticated]);

    // Load Google Maps JavaScript API
    const loadGoogleMapsScript = () => {
        if (!window.google && GOOGLE_MAPS_API_KEY) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    };

    const getCurrentLocation = () => {
        setLocationLoading(true);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentLocation(location);
                    setLocationLoading(false);
                    findNearbyFacilities(location, activeTab);
                    getLocationDetails(location); // Get country/region info
                    setShowAlert({
                        show: true,
                        message: "Location found! Loading nearby healthcare facilities...",
                        variant: 'success'
                    });
                },
                (error) => {
                    setLocationLoading(false);
                    handleLocationError(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 300000
                }
            );
        }
    };

    const handleLocationError = (error) => {
        let fallbackLocation = { lat: 10.0261, lng: 76.3125 }; // Default to Kerala, India
        let message = "Using default location. ";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message += "Location access denied. Please enable location services.";
                break;
            case error.POSITION_UNAVAILABLE:
                message += "Location information unavailable.";
                break;
            case error.TIMEOUT:
                message += "Location request timed out.";
                break;
            default:
                message += "Unknown location error.";
                break;
        }
        
        setCurrentLocation(fallbackLocation);
        findNearbyFacilities(fallbackLocation, activeTab);
        setShowAlert({
            show: true,
            message: message,
            variant: 'warning'
        });
    };

    // Get location details using Google Geocoding API
    const getLocationDetails = async (location) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const countryComponent = data.results[0].address_components.find(
                    component => component.types.includes('country')
                );
                if (countryComponent) {
                    setCountryFilter(countryComponent.short_name);
                }
            }
        } catch (error) {
            console.error('Error getting location details:', error);
        }
    };

    // Enhanced function to find facilities using Google Places API
    const findNearbyFacilities = async (location, type) => {
        setLoading(true);
        
        try {
            if (window.google && window.google.maps) {
                const service = new window.google.maps.places.PlacesService(
                    document.createElement('div')
                );
                
                const types = facilityTypes[type] || facilityTypes.hospitals;
                const allFacilities = [];
                
                // Search for each facility type
                for (const facilityType of types) {
                    const request = {
                        location: new window.google.maps.LatLng(location.lat, location.lng),
                        radius: searchRadius,
                        type: facilityType,
                        keyword: type === 'pharmacies' ? 'medical store pharmacy' : undefined
                    };
                    
                    await new Promise((resolve) => {
                        service.nearbySearch(request, (results, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                const processedResults = results.map(place => ({
                                    id: place.place_id,
                                    name: place.name,
                                    address: place.vicinity || place.formatted_address,
                                    type: getFacilityTypeFromPlace(place, type),
                                    rating: place.rating || 0,
                                    distance: calculateDistance(location, {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng()
                                    }),
                                    phone: place.formatted_phone_number,
                                    openNow: place.opening_hours?.open_now || false,
                                    image: place.photos?.[0] ? 
                                        place.photos[0].getUrl({ maxWidth: 400 }) : 
                                        getDefaultImage(type),
                                    coordinates: {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng()
                                    },
                                    priceLevel: place.price_level,
                                    placeId: place.place_id,
                                    website: place.website,
                                    reviews: place.user_ratings_total || 0,
                                    specialties: getSpecialtiesFromTypes(place.types, type),
                                    isEmergency: place.types.includes('emergency_room') || 
                                               place.name.toLowerCase().includes('emergency')
                                }));
                                allFacilities.push(...processedResults);
                            }
                            resolve();
                        });
                    });
                }
                
                // Remove duplicates and sort by distance
                const uniqueFacilities = allFacilities.filter((facility, index, self) =>
                    index === self.findIndex(f => f.placeId === facility.placeId)
                );
                
                setFacilities(uniqueFacilities.sort((a, b) => a.distance - b.distance));
                
            } else {
                // Fallback to mock data if Google API not available
                setFacilities(getMockData(type, location));
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
            setFacilities(getMockData(type, location));
            setShowAlert({
                show: true,
                message: "Using sample data. Please check your API configuration.",
                variant: 'warning'
            });
        }
        
        setLoading(false);
    };

    const getFacilityTypeFromPlace = (place, searchType) => {
        if (place.types.includes('hospital') || place.types.includes('emergency_room')) {
            return 'hospital';
        } else if (place.types.includes('pharmacy') || place.types.includes('drugstore')) {
            return 'pharmacy';
        } else if (place.types.includes('doctor') || place.types.includes('clinic')) {
            return 'clinic';
        } else if (place.types.includes('dentist')) {
            return 'dental';
        } else if (place.types.includes('veterinary_care')) {
            return 'veterinary';
        }
        return searchType.slice(0, -1); // Remove 's' from plural
    };

    const getSpecialtiesFromTypes = (types, category) => {
        const specialtyMap = {
            hospitals: ['Emergency Care', 'General Medicine', 'Surgery', 'ICU'],
            pharmacies: ['Prescription Drugs', 'OTC Medicines', 'Medical Supplies'],
            clinics: ['General Practice', 'Consultations', 'Basic Treatments'],
            dental: ['General Dentistry', 'Oral Surgery', 'Orthodontics'],
            laboratories: ['Blood Tests', 'Diagnostics', 'Pathology'],
            veterinary: ['Pet Care', 'Animal Surgery', 'Vaccinations']
        };
        return specialtyMap[category] || ['General Services'];
    };

    const getDefaultImage = (type) => {
        const imageMap = {
            hospitals: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
            pharmacies: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
            clinics: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
            dental: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
            laboratories: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
            veterinary: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400"
        };
        return imageMap[type] || imageMap.hospitals;
    };

    const getMockData = (type, location) => {
        // Enhanced mock data for different facility types
        const mockData = {
            hospitals: [
                {
                    id: 'hosp-1',
                    name: "Global Medical Center",
                    address: "123 Healthcare Ave, City Center",
                    type: "hospital",
                    rating: 4.5,
                    distance: 1.2,
                    phone: "+1-555-123-4567",
                    specialties: ["Emergency", "Cardiology", "Neurology", "Pediatrics"],
                    openNow: true,
                    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
                    coordinates: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
                    reviews: 245,
                    website: "https://globalmedical.com",
                    isEmergency: true
                }
            ],
            pharmacies: [
                {
                    id: 'pharm-1',
                    name: "24/7 MedStore",
                    address: "456 Pharmacy St, Medical District",
                    type: "pharmacy",
                    rating: 4.3,
                    distance: 0.8,
                    phone: "+1-555-234-5678",
                    specialties: ["Prescription Drugs", "OTC Medicines", "Medical Supplies", "Health Consultations"],
                    openNow: true,
                    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
                    coordinates: { lat: location.lat + 0.005, lng: location.lng + 0.005 },
                    reviews: 189,
                    website: "https://24-7medstore.com",
                    isEmergency: false
                }
            ]
        };
        
        return mockData[type] || mockData.hospitals;
    };
    

    const handleNavigate = (facility) => {
        if (currentLocation) {
            // Option 1: Google Maps Web URL
            const googleMapsUrl = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${facility.coordinates.lat},${facility.coordinates.lng}`;
            window.open(googleMapsUrl, '_blank');
        } else if (facility.address) {
            // Option 2: Search by address if no current location
            const googleMapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(facility.address)}`;
            window.open(googleMapsSearchUrl, '_blank');
        } else {
            setShowAlert({
                show: true,
                message: "Location not available. Please enable location services for navigation.",
                variant: 'warning'
            });
        }
    };

    const handleNavigateWithApp = (facility) => {
        // Try to open with native apps first, fallback to web
        const destination = `${facility.coordinates.lat},${facility.coordinates.lng}`;
        const facilityName = encodeURIComponent(facility.name);
        
        // For mobile devices - try native apps
        if (/Android/i.test(navigator.userAgent)) {
            // Android - try Google Maps app first
            const androidIntent = `intent://maps.google.com/maps?daddr=${destination}&directionsmode=driving#Intent;scheme=https;package=com.google.android.apps.maps;end`;
            window.location.href = androidIntent;
            
            // Fallback to web after a short delay
            setTimeout(() => {
                handleNavigate(facility);
            }, 2000);
            
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // iOS - try Apple Maps first, then Google Maps
            const appleMapsUrl = `http://maps.apple.com/?daddr=${destination}&dirflg=d`;
            const googleMapsApp = `comgooglemaps://?daddr=${destination}&directionsmode=driving`;
            
            // Try Apple Maps first
            window.location.href = appleMapsUrl;
            
            // Fallback options
            setTimeout(() => {
                window.location.href = googleMapsApp;
                setTimeout(() => {
                    handleNavigate(facility);
                }, 1000);
            }, 1000);
            
        } else {
            // Desktop - direct to web
            handleNavigate(facility);
        }
    };

    const handleShareLocation = async (facility) => {
        const shareData = {
            title: facility.name,
            text: `${facility.name} - ${facility.address}`,
            url: `https://www.google.com/maps/search/?api=1&query=${facility.coordinates.lat},${facility.coordinates.lng}`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback - copy to clipboard
                await navigator.clipboard.writeText(
                    `${facility.name}\n${facility.address}\nhttps://www.google.com/maps/search/?api=1&query=${facility.coordinates.lat},${facility.coordinates.lng}`
                );
                setShowAlert({
                    show: true,
                    message: "Location details copied to clipboard!",
                    variant: 'success'
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
            setShowAlert({
                show: true,
                message: "Unable to share location details.",
                variant: 'warning'
            });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('authToken');
        navigate('/login');
    };
    const calculateDistance = (pos1, pos2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (currentLocation) {
            findNearbyFacilities(currentLocation, tab);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        
        setLoading(true);
        
        try {
            if (window.google && currentLocation) {
                const service = new window.google.maps.places.PlacesService(
                    document.createElement('div')
                );
                
                const request = {
                    location: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
                    radius: searchRadius,
                    query: searchTerm + ' ' + activeTab
                };
                
                service.textSearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const processedResults = results.map(place => ({
                            id: place.place_id,
                            name: place.name,
                            address: place.formatted_address,
                            type: getFacilityTypeFromPlace(place, activeTab),
                            rating: place.rating || 0,
                            distance: calculateDistance(currentLocation, {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            }),
                            phone: place.formatted_phone_number,
                            openNow: place.opening_hours?.open_now || false,
                            image: place.photos?.[0] ? 
                                place.photos[0].getUrl({ maxWidth: 400 }) : 
                                getDefaultImage(activeTab),
                            coordinates: {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            },
                            placeId: place.place_id,
                            website: place.website,
                            reviews: place.user_ratings_total || 0,
                            specialties: getSpecialtiesFromTypes(place.types, activeTab)
                        }));
                        
                        setFacilities(processedResults.sort((a, b) => a.distance - b.distance));
                        setShowAlert({
                            show: true,
                            message: `Found ${processedResults.length} results for "${searchTerm}"`,
                            variant: 'info'
                        });
                    }
                    setLoading(false);
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            setLoading(false);
        }
    };

    const filteredFacilities = facilities.filter(facility => {
        const matchesSearch = !searchTerm || 
                            facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            facility.specialties.some(specialty => 
                                specialty.toLowerCase().includes(searchTerm.toLowerCase())
                            );
        
        const matchesRadius = facility.distance <= (searchRadius / 1000);
        const matchesEmergency = !emergencyOnly || facility.isEmergency;
        const matchesOpenNow = !openNowOnly || facility.openNow;
        
        return matchesSearch && matchesRadius && matchesEmergency && matchesOpenNow;
    });

    const handleViewDetails = async (facility) => {
        if (window.google && facility.placeId) {
            const service = new window.google.maps.places.PlacesService(
                document.createElement('div')
            );
            
            service.getDetails({
                placeId: facility.placeId,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 
                        'opening_hours', 'photos', 'reviews', 'types']
            }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setSelectedFacility({
                        ...facility,
                        ...place,
                        fullDetails: true
                    });
                } else {
                    setSelectedFacility(facility);
                }
                setShowDetailsModal(true);
            });
        } else {
            setSelectedFacility(facility);
            setShowDetailsModal(true);
        }
    };

    const getTypeIcon = (type) => {
        const iconMap = {
            hospital: '🏥',
            pharmacy: '💊',
            clinic: '🏪',
            dental: '🦷',
            laboratory: '🔬',
            veterinary: '🐕'
        };
        return iconMap[type] || '🏥';
    };

    const getTypeColor = (type) => {
        const colorMap = {
            hospital: 'danger',
            pharmacy: 'success',
            clinic: 'primary',
            dental: 'info',
            laboratory: 'warning',
            veterinary: 'secondary'
        };
        return colorMap[type] || 'primary';
    };

    return (
        <>
            {/* Alert */}
            {showAlert.show && (
                <Alert 
                    variant={showAlert.variant} 
                    onClose={() => setShowAlert({ show: false, message: '', variant: 'info' })} 
                    dismissible
                    className="position-fixed"
                    style={{ top: '10px', right: '10px', zIndex: 9999, minWidth: '300px' }}
                >
                    {showAlert.message}
                </Alert>
            )}

            {/* Enhanced Navbar */}
            <Navbar className="bg-gradient-primary text-white p-3 shadow">
                <Row className="w-100 align-items-center">
                    <Col xs={12} md={8}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup>
                                <Form.Control 
                                    type="text" 
                                    placeholder={`Search ${activeTab}, specialties, or services globally...`}
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="light" type="submit" disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : '🔍'} Search
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col xs={12} md={4} className="text-end mt-2 mt-md-0">
                        <Button 
                            variant="outline-light" 
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className="me-2"
                            size="sm"
                        >
                            {locationLoading ? (
                                <>
                                    <Spinner size="sm" className="me-1" />
                                    Finding...
                                </>
                            ) : (
                                '📍 Locate'
                            )}
                        </Button>
                        <span className="text-white me-3 small">
                            Welcome, <strong>{userId}</strong>
                        </span>
                    </Col>
                </Row>
            </Navbar>

            <div className="container-fluid mt-4">
                {/* Enhanced Tabs */}
                <Tabs 
                    activeKey={activeTab} 
                    onSelect={handleTabChange}
                    className="mb-4"
                    variant="pills"
                >
                    <Tab eventKey="hospitals" title="🏥 Hospitals">
                        <div className="text-muted small mb-3">
                            Find hospitals, emergency rooms, and medical centers worldwide
                        </div>
                    </Tab>
                    <Tab eventKey="pharmacies" title="💊 Pharmacies">
                        <div className="text-muted small mb-3">
                            Locate pharmacies, medical stores, and drug stores globally
                        </div>
                    </Tab>
                    <Tab eventKey="clinics" title="🏪 Clinics">
                        <div className="text-muted small mb-3">
                            Find medical clinics, doctor offices, and healthcare centers
                        </div>
                    </Tab>
                    <Tab eventKey="dental" title="🦷 Dental">
                        <div className="text-muted small mb-3">
                            Locate dental clinics, orthodontists, and oral surgeons
                        </div>
                    </Tab>
                    <Tab eventKey="laboratories" title="🔬 Labs">
                        <div className="text-muted small mb-3">
                            Find diagnostic labs, pathology centers, and testing facilities
                        </div>
                    </Tab>
                    <Tab eventKey="veterinary" title="🐕 Veterinary">
                        <div className="text-muted small mb-3">
                            Locate veterinary clinics, animal hospitals, and pet care centers
                        </div>
                    </Tab>
                </Tabs>

                {/* Enhanced Filters */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label><strong>Search Radius:</strong></Form.Label>
                            <Form.Select
                                value={searchRadius}
                                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                            >
                                <option value={1000}>📍 Within 1 km</option>
                                <option value={5000}>📍 Within 5 km</option>
                                <option value={10000}>📍 Within 10 km</option>
                                <option value={25000}>📍 Within 25 km</option>
                                <option value={50000}>📍 Within 50 km</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label><strong>Quick Filters:</strong></Form.Label>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    label="🚨 Emergency Only"
                                    checked={emergencyOnly}
                                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                                    className="mb-1"
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="🟢 Open Now"
                                    checked={openNowOnly}
                                    onChange={(e) => setOpenNowOnly(e.target.checked)}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label><strong>Country/Region:</strong></Form.Label>
                            <Form.Select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                            >
                                <option value="IN">🇮🇳 India</option>
                                <option value="US">🇺🇸 United States</option>
                                <option value="GB">🇬🇧 United Kingdom</option>
                                <option value="AU">🇦🇺 Australia</option>
                                <option value="CA">🇨🇦 Canada</option>
                                <option value="DE">🇩🇪 Germany</option>
                                <option value="FR">🇫🇷 France</option>
                                <option value="JP">🇯🇵 Japan</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                        <div className="text-muted small">
                            📍 Location: {currentLocation ? 'Detected' : 'Not Available'}<br/>
                            {getTypeIcon(activeTab.slice(0, -1))} Found: {filteredFacilities.length} facilities
                        </div>
                    </Col>
                </Row>

                {/* Loading State */}
                {loading && (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <h4 className="text-muted">
                            Searching for {activeTab} worldwide...
                        </h4>
                    </div>
                )}

                {/* Facilities Grid */}
                {!loading && (
                    <Row className="g-4">
                        {filteredFacilities.map((facility) => (
                            <Col lg={6} xl={4} key={facility.id}>
                                <Card className="h-100 shadow-sm border-0 hover-card">
                                    <Card.Img 
                                        variant="top" 
                                        src={facility.image} 
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className="text-primary mb-0">
                                                {getTypeIcon(facility.type)} {facility.name}
                                            </Card.Title>
                                            <div>
                                                <Badge bg={getTypeColor(facility.type)} className="me-1">
                                                    {facility.type.toUpperCase()}
                                                </Badge>
                                                {facility.isEmergency && (
                                                    <Badge bg="danger">🚨 Emergency</Badge>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Card.Text className="text-muted mb-2 small">
                                            📍 {facility.address}
                                        </Card.Text>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-1 small">
                                                <span>⭐ {facility.rating}/5 ({facility.reviews} reviews)</span>
                                                <span>📏 {facility.distance.toFixed(1)} km</span>
                                            </div>
                                            <Badge bg={facility.openNow ? 'success' : 'danger'} className="me-1">
                                                {facility.openNow ? '🟢 Open' : '🔴 Closed'}
                                            </Badge>
                                        </div>

                                        <div className="mb-3">
                                            <small className="text-muted d-block mb-1">
                                                {getTypeIcon(facility.type)} Services:
                                            </small>
                                            <div className="d-flex flex-wrap gap-1">
                                                {facility.specialties.slice(0, 2).map((specialty, index) => (
                                                    <Badge key={index} bg="light" text="dark" className="small">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                                {facility.specialties.length > 2 && (
                                                    <Badge bg="light" text="dark" className="small">
                                                        +{facility.specialties.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <Row className="g-2">
                                                <Col xs={6}>
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm" 
                                                        className="w-100"
                                                        onClick={() => handleViewDetails(facility)}
                                                    >
                                                        ℹ️ Details
                                                    </Button>
                                                </Col>
                                                <Col xs={6}>
                                                    {facility.phone && (
                                                        <Button 
                                                            variant="success" 
                                                            size="sm" 
                                                            className="w-100"
                                                            onClick={() => window.location.href = `tel:${facility.phone}`}
                                                        >
                                                            📞 Call
                                                        </Button>
                                                    )}
                                                </Col>
                                                <Col xs={12}>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        className="w-100"
                                                        onClick={() => handleNavigate(facility)}
                                                    >
                                                        📍 Navigate
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </>
    );
}
export default Hosp;