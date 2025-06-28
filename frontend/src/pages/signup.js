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
  const [debugInfo, setDebugInfo] = useState('');
  
  const navigate = (path) => {
    console.log(`Would navigate to: ${path}`);
    setDebugInfo(`Navigation to ${path} triggered`);
  };

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

  const testBackendConnection = async () => {
    setDebugInfo('Testing backend connection...');
    try {
      const response = await fetch('https://medihub-3ni5.onrender.com/api/register/', {
        method: 'OPTIONS'
      });
      setDebugInfo(`Backend connection test: ${response.status} - ${response.statusText}`);
    } catch (err) {
      setDebugInfo(`Backend connection failed: ${err.message}`);
    }
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
    setDebugInfo('Starting registration process...');

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
    console.log('🚀 Attempting registration with data:', submitData);
    setDebugInfo(`Sending request to: https://medihub-3ni5.onrender.com/api/register/`);
    try {
      const response = await fetch('https://medihub-3ni5.onrender.com/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData),
        // Add these for CORS debugging
        mode: 'cors',
        credentials: 'include'
      });
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', [...response.headers.entries()]);
      
      setDebugInfo(`Response received: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success response:', data);
      setSuccess(response.data.message || "Signup successful!");
      setDebugInfo(`Registration successful! Response: ${JSON.stringify(data)}`);
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
      
        } catch (err) {
          console.error('Signup error:', err);
          let errorMessage = 'Registration failed';
          let debugMessage = '';
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error. Unable to connect to server.';
        debugMessage = `Network error: ${err.message}. This usually indicates CORS issues or server unavailability.`;
      } else if (err.message.includes('HTTP')) {
        errorMessage = err.message;
        debugMessage = `Server error: ${err.message}`;
      } else {
        errorMessage = 'An unexpected error occurred';
        debugMessage = `Unexpected error: ${err.message}`;
      }
      
      setError(errorMessage);
      setDebugInfo(debugMessage);
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

  // const errorStyle = {
  //   background: '#ffebee',
  //   color: '#c62828',
  //   padding: '10px',
  //   borderRadius: '6px',
  //   fontSize: '14px',
  //   margin: '10px 0',
  //   border: '1px solid #ef5350'
  // };

  // const successStyle = {
  //   background: '#e8f5e8',
  //   color: '#2e7d32',
  //   padding: '10px',
  //   borderRadius: '6px',
  //   fontSize: '14px',
  //   margin: '10px 0',
  //   border: '1px solid #4caf50'
  // };
  const messageStyle = (type) => ({
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    margin: '10px 0',
    border: `1px solid ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'}`,
    background: type === 'error' ? '#ffe6e6' : type === 'success' ? '#e8f5e8' : '#e3f2fd',
    color: type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#1976d2',
    wordBreak: 'break-word',
    fontSize: '12px',
    fontFamily: 'monospace'
  });
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
            <div style={messageStyle('error')}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={messageStyle('success')}>
              ✅ {success}
            </div>
          )}

          {debugInfo && (
            <div style={messageStyle('debug')}>
              🔍 Debug: {debugInfo}
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