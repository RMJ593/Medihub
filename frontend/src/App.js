import './App.css';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Carousel from 'react-bootstrap/Carousel';
// import Col from 'react-bootstrap/Col';
// import Image from 'react-bootstrap/Image';
// import Row from 'react-bootstrap/Row';
// import {  Link } from 'react-router-dom';
import { BrowserRouter as  Router,Route, Routes } from 'react-router-dom';
import Medi from './pages/med';
import Doct from './pages/doct';
import Hosp from './pages/hosp';
import Dah from './pages/dah';
import MycartPage from './pages/mycart';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

function App(){
  // const express = require("express")
  // const collection = require("./mongo")
  // const cors= require("cors")
  // const app =express()
  // app.use(express.json())
  // app.use(express.urlencoded({extended: true}))
  // app.use(cors())
  return(
    <div className='App'>
    <Router>
      {/* <Home/> */}
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/med" element={<Medi />} />
        <Route path="/doct" element={<Doct />} />
        <Route path="/hosp" element={<Hosp />} />
        <Route path="/dah" element={<Dah />} />
        <Route path="/mycart" element={<MycartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </Router>
      </div>
  );
}
export default App;
