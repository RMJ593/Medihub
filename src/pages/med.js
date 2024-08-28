import './medi.css'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function Medi() {
    return (
    <>
    <Navbar className="bg-primary justify-content-between">
      
      <Form inline>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
          <Col xs="auto">
            <Link to ='./mycart'>
            <Button type="submit">My cart</Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </Navbar>
    <br/>
    <div className= "container">
        <div className="row">
            <div className="col-4">
            <Card className="text-center"  style={{ width: '18rem'}}>
               <Card.Img variant="top"className='med' src={require('../components/medicines/advil.jpg')} />
               <Card.Body>
        <Card.Title>Advil</Card.Title>
        <Card.Text>
          200mg
        </Card.Text>
        <h5 className="card-title text-danger">Rs:199.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
            <div className="col-4">
            <Card className="text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/medicines/carmicide.jpg')} />
               <Card.Body>
        <Card.Title>Carmicide</Card.Title>
        <Card.Text>
          500 ml
        </Card.Text>
        <h5 className="card-title text-danger">Rs:400.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
            <div className="col-4">
            <Card cclassName="text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/medicines/cetirizine.jpg')} />
               <Card.Body>
        <Card.Title>cetirizine</Card.Title>
        <Card.Text>
          10mg
        </Card.Text>
        <h5 className="card-title text-danger">Rs:199.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
        </div>
        <br/>

        <div className="row">
            <div className="col-4">
            <Card className="text-center"  style={{ width: '18rem'}}>
               <Card.Img variant="top"className='med' src={require('../components/medicines/doo 650.jpg')} />
               <Card.Body>
        <Card.Title>Dolo-650</Card.Title>
        <Card.Text>
          650mg
        </Card.Text>
        <h5 className="card-title text-danger">Rs:100.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
            <div className="col-4">
            <Card className="card text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/medicines/livolin.jpeg')} />
               <Card.Body>
        <Card.Title>livolin</Card.Title>
        <Card.Text>
          200mg
        </Card.Text>
        <h5 className="card-title text-danger">Rs:199.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
            <div className="col-4">
            <Card className="card text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/medicines/steam.jpg')} />
               <Card.Body>
        <Card.Title>Vaporizer</Card.Title>
        <Card.Text>
         1 N
        </Card.Text>
        <h5 className="card-title text-danger">Rs:600.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
        </div>
        <br/>
        <div className="row">
            <div className="col-4">
            <Card className="text-center"  style={{ width: '18rem'}}>
               <Card.Img variant="top"className='med' src={require('../components/medicines/thermo.jpg')} />
               <Card.Body>
        <Card.Title>Thermometer</Card.Title>
        <Card.Text>
          1 N
        </Card.Text>
        <h5 className="card-title text-danger">Rs:700.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
            <div className="col-4">
            <Card className="card text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/medicines/vicks.jpg')} />
               <Card.Body>
        <Card.Title>Vicks</Card.Title>
        <Card.Text>
          200mg
        </Card.Text>
        <h5 className="card-title text-danger">Rs:10.00</h5>
        <Button variant="primary">Add to cart</Button>
      </Card.Body>
    </Card>
            </div>
           
        </div>
    </div>
    </>
    );
}

export default Medi;