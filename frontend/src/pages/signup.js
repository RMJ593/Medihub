import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (formData.password !== formData.confirmPassword) {
    // setError("Passwords do not match");
    // return;
    if (!validateForm()) {
      return;
    // }
  }
    setLoading(true);
    setError('');
    setSuccess('');

    const submitData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    // if (!validateForm()) {
    //   setLoading(false);
    //   return;
    // }

    // Prepare data for Django backend (excluding confirmPassword)
    // const { confirmPassword, ...submitData } = formData;

    try {
      const response = await axios.post("https://medihub-3ni5.onrender.com/api/register/", submitData);
      setSuccess(response.data.message || "Signup successful!");
      // console.log('Sending request to:', 'http://127.0.0.1:8000/api/register/');
      // console.log('Request data:', submitData);
      // const response = await fetch('http://localhost:8000/api/register/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submitData)
      // });
      // console.log('Response status:', response.status);
      // console.log('Response headers:', response.headers);
      // const data = await response.json();
      // console.log('Response data:', data);
      // if (response.ok) {
      //   setSuccess(data.message);
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      // } else {
      //   if (data.message && typeof data.message === 'object') {
      //     // Handle field-specific errors
      //     const errorMessages = Object.entries(data.message)
      //       .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      //       .join('\n');
      //     setError(errorMessages);
      //   } else {
      //     setError(data.message || 'Registration failed');
      //   }
      // }
  //   } catch (err) {
  //     setError('Network error. Please check your connection.');
  //     console.error('Signup error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
        } catch (err) {
          console.error('Signup error:', err);
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data;
        if (errorData.message && typeof errorData.message === 'object') {
          // Handle field-specific errors
          const errorMessages = Object.entries(errorData.message)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          setError(errorMessages);
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError(errorData.message || 'Registration failed');
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection.');
      } else {
        // Other error
        setError('An unexpected error occurred.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };
  const bodyStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#4070f4',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif"
  };

  const wrapperStyle = {
    position: 'relative',
    maxWidth: '430px',
    width: '100%',
    background: '#fff',
    padding: '34px',
    borderRadius: '6px',
    boxShadow: '0 5px 10px rgba(0,0,0,0.2)'
  };

  const h2Style = {
    position: 'relative',
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '30px'
  };

  const h2BeforeStyle = {
    content: '""',
    position: 'absolute',
    left: '0',
    bottom: '-5px',
    height: '3px',
    width: '28px',
    borderRadius: '12px',
    background: '#4070f4'
  };

  const inputBoxStyle = {
    height: '52px',
    margin: '18px 0'
  };

  const inputStyle = {
    height: '100%',
    width: '100%',
    outline: 'none',
    padding: '0 15px',
    fontSize: '17px',
    fontWeight: '400',
    color: '#333',
    border: '1.5px solid #C7BEBE',
    borderBottomWidth: '2.5px',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  };

  // const inputFocusStyle = {
  //   borderColor: '#4070f4'
  // };

  // const policyStyle = {
  //   display: 'flex',
  //   alignItems: 'center',
  //   margin: '18px 0'
  // };

  // const policyTextStyle = {
  //   color: '#707070',
  //   fontSize: '14px',
  //   fontWeight: '500',
  //   marginLeft: '10px'
  // };

  const buttonStyle = {
    height: '52px',
    margin: '18px 0'
  };

  const buttonInputStyle = {
    height: '100%',
    width: '100%',
    color: '#fff',
    letterSpacing: '1px',
    border: 'none',
    background: '#4070f4',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '400',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  };

  // const buttonHoverStyle = {
  //   background: '#0e4bf1'
  // };

  const textStyle = {
    color: '#333',
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '18px'
  };

  const linkStyle = {
    color: '#4070f4',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const errorStyle = {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    margin: '10px 0',
    border: '1px solid #ef5350'
  };

  const successStyle = {
    background: '#e8f5e8',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    margin: '10px 0',
    border: '1px solid #4caf50'
  };
 return (
    <div style={bodyStyle}>
      <div style={wrapperStyle}>
        <h2 style={h2Style}>
          Registration
          <div style={h2BeforeStyle}></div>
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={inputBoxStyle}>
            <input
              // id='username'
              type="text"
              name="username"
              placeholder="Username"
              required
              style={inputStyle}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#4070f4'}
              onBlur={(e) => e.target.style.borderColor = '#C7BEBE'}
            />
          </div>
          
          <div style={inputBoxStyle}>
            <input
              // id='email'
              type="email"
              name="email"
              placeholder="Email address"
              required
              style={inputStyle}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#4070f4'}
              onBlur={(e) => e.target.style.borderColor = '#C7BEBE'}
            />
          </div>
          
          <div style={inputBoxStyle}>
            <input
              // id='password'
              type="password"
              name="password"
              placeholder="Create password"
              required
              style={inputStyle}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#4070f4'}
              onBlur={(e) => e.target.style.borderColor = '#C7BEBE'}
            />
          </div>
          
          <div style={inputBoxStyle}>
            <input
              id='password'
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              style={inputStyle}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#4070f4'}
              onBlur={(e) => e.target.style.borderColor = '#C7BEBE'}
            />
          </div>
          
          {/* <div style={policyStyle}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <h3 style={policyTextStyle}>I accept all terms & condition</h3>
          </div> */}

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {success && (
            <div style={successStyle}>
              {success}
            </div>
          )}
          
          <div style={buttonStyle}>
            <input
              type="submit"
              value={loading ? "Registering..." : "Register Now"}
              style={buttonInputStyle}
              disabled={loading}
              onMouseEnter={(e) => e.target.style.background = '#0e4bf1'}
              onMouseLeave={(e) => e.target.style.background = '#4070f4'}
            />
          </div>
          
          <div style={textStyle}>
            <h3>
              Already have an account?{' '}
              <span
                style={linkStyle}
                onClick={() => !loading && navigate('/login')}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Login now
              </span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;