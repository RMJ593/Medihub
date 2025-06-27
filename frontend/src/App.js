import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy } from "react";
import Medi from './pages/med';
import Doct from './pages/doct';
import Hosp from './pages/hosp';
import Dah from './pages/dah';
import MycartPage from './pages/mycart';
import Bookings from './pages/bookings';
import Home from './pages/home';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './contexts/AuthContext';  // Correct ✔

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));

function App() {
  return (
    <div className="App">
      {/* <AuthProvider>  */}
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/med" element={<Medi />} />
              <Route path="/doct" element={<Doct />} />
              <Route path="/hosp" element={<Hosp />} />
              <Route path="/dah" element={<Dah />} />
              <Route path="/mycart" element={<MycartPage />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
        </Router>
        <ToastContainer 
          position="top-center" 
          autoClose={1000} 
          hideProgressBar 
          closeOnClick 
          theme="colored" 
        />
      {/* </AuthProvider> */}
    </div>
  );
}

export default App;

