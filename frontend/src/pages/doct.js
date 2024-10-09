import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Doct() {
    return(
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
        </Row>
      </Form>
    </Navbar>
    <br/>
    <div class= "container">
        <div class="row">
            <div class="col-4">
            <Card class="card text-center"  style={{ width: '18rem'}}>
               <Card.Img variant="top"className='med' src={require('../components/cartooDoct.jpg')} />
               <Card.Body>
        <Card.Title>Dr. Emily Carter</Card.Title>
        <Card.Text>
        Cardiologist
        </Card.Text>
        <Button variant="primary">Book Appointment</Button>
      </Card.Body>
    </Card>
            </div>
            <div class="col-4">
            <Card class="card text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/cartooDoct.jpg')} />
               <Card.Body>
        <Card.Title>Dr. Michael Johnson</Card.Title>
        <Card.Text>
        Neurologist
        </Card.Text>
        <Button variant="primary">Book Appointment</Button>
      </Card.Body>
    </Card>
            </div>
            <div class="col-4">
            <Card class="card text-center" style={{ width: '18rem' }}>
               <Card.Img variant="top"className="med" src={require('../components/cartooDoct.jpg')} />
               <Card.Body>
        <Card.Title>Dr. Sarah Lee</Card.Title>
        <Card.Text>
        Orthopedic Surgeon
        </Card.Text>
        <Button variant="primary">Book Appointment</Button>
      </Card.Body>
    </Card>
            </div>
        </div>
        <br/>

        <div class="row">
            <div class="col-4">
            <Card class="card text-center"  style={{ width: '18rem'}}>
               <Card.Img variant="top"className='med' src={require('../components/cartooDoct.jpg')} />
               <Card.Body>
        <Card.Title>Dr. William Davis</Card.Title>
        <Card.Text>
        General Practitioner
        </Card.Text>
        <Button variant="primary">Book Appointment</Button>
      </Card.Body>
    </Card>
            </div>
            </div>
            </div>
       </>
    );
}
export default Doct;