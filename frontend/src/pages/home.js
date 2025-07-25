import './home.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import {  Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate} from 'react-router-dom';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.name || sessionStorage.getItem('username') || localStorage.getItem('username') ||'Guest';
    const isAuthenticated = sessionStorage.getItem('username') || localStorage.getItem('authToken');
    
    const handleLogout = () => {
        // Clear all stored authentication data
        sessionStorage.removeItem('username');
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        
        // Redirect to login page
        navigate('/login');
    };
    return (
      <>
       <Navbar className="bg-primary">
      <Container>
        <Navbar.Brand href="#home">MediHub</Navbar.Brand>
        <Navbar.Toggle />
        <Col xs="auto">
          {!isAuthenticated ? (
            <Link to='/login'>
              <Button type="submit">Login</Button>
            </Link>
          ) : (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Col>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          Signed in as: <a href="#login">{userId}</a> 
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>

        
  
    
  
        
        <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            class="slide d-block w-100"
            src={require('../components/carousal/carousel1.jpg')}
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            class="slide d-block w-100"
            src={require('../components/carousal/carousal4.jpg')}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            class="slide d-block w-100"
            src={require('../components/carousal/carousal5.jpg')}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <br/>
      <br/>
        <Container>
        <Row>
          <Col xs={6} md={4}>
            <Link to= "/doct">
            <Image className= "servc" src={require('../components/service/doctor.jpg')} roundedCircle />
            </Link>
          </Col>
          <Col xs={6} md={4}>
            <Link to="/hosp">
            <Image className="servc" src={require('../components/service/hospital.jpg')} roundedCircle />
            </Link>
          </Col>
         
          <Col xs={6} md={4}>
            <Link to="/med">
            <Image className="servc"src={require('../components/service/medicine.jpg')} roundedCircle />
            </Link>
          </Col>
          {/* <Col xs={6} md={4}>
            <Link to="/dah">
            <Image className="servc"src={require('../components/service/home.jpg')} roundedCircle />
            </Link>
          </Col> */}
        </Row>
      </Container>
      <br/>
      <div class="container-fluid bg-primary">
        <div class="row">
          <div class="col-6">
          <p className="footer-text">
                Reach us at <a href="mailto:healthsupport@gmail.com">healthsupport@gmail.com</a>
          </p>
          </div>
        </div>
      </div>
      
      </>
      
       
    );
  }
  export default Home;