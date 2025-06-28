import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://medihub-3ni5.onrender.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Store the token in localStorage
        // localStorage.setItem('authToken', data.token);
        // localStorage.setItem('username', formData.username);
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        localStorage.setItem('username', formData.username);
        
        // Clear form data for security
        setFormData({
          username: '',
          password: ''
        });
        // Redirect to dashboard or home page after successful login
        setTimeout(() => {
          // window.location.href = '/home'; // Change this to your desired route
          navigate('/home');

        }, 1000);
      } else {
        if (data.message && typeof data.message === 'object') {
          // Handle field-specific errors
          const errorMessages = Object.values(data.message).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Login failed');
        }
      }
    } catch (err) {
      // setError('Network error. Please check your connection.');
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
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
          Login
          <div style={h2BeforeStyle}></div>
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={inputBoxStyle}>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              autoComplete="username"
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
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={inputStyle}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#4070f4'}
              onBlur={(e) => e.target.style.borderColor = '#C7BEBE'}
            />
          </div>

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
              value={loading ? "Signing in..." : "Login Now"}
              style={buttonInputStyle}
              disabled={loading || !formData.username.trim() || !formData.password.trim()}
              onMouseEnter={(e) => e.target.style.background = '#0e4bf1'}
              onMouseLeave={(e) => e.target.style.background = '#4070f4'}
            />
          </div>
          
          <div style={textStyle}>
            <h3>
              Don't have an account?{' '}
              <span
                style={linkStyle}
                onClick={() => navigate('/signup')}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Sign up now
              </span>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;