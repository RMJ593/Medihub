import React, { useState } from "react";
// import axios from 'axios';
import {  Link } from 'react-router-dom';
import validation from "./loginValidation";
function Login() {
    const [values, setValues]= useState({
        email:'',
        password: ''
    })
    const [errors, setErrors]=useState({})
    const handleInput =(event)=>{
        setValues(prev => ({...prev,[event.target.name]: [event.target.value]}))
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        setErrors(validation(values));
    }
    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className="bg-white p-3 rounded w-25">
                <h2>Sign-in</h2>
            <form action ='' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder="Enter email" name="email"
                    onChange={handleInput} className="form-control rounded-0"/>
                    {errors.email && <span className="text-danger"> {errors.email}</span> }
                </div>
                <div className="mb-3">
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder="Enter email" name="password"
                    onChange={handleInput} className="form-control rounded-0"/>
                    {errors.password && <span className="text-danger"> {errors.password}</span> }
                </div>
                <button type="Submit" className="btn btn-success w-100 rounded-0">Log-In</button>
                <p>You are to our terms and conditions</p>
                <Link to='/signup' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Sign-up</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
