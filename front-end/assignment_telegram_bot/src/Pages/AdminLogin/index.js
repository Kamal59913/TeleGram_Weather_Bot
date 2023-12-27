import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import AdminPanel from '../AdminPanel/adminPanel';
import React, { useState, useEffect, useRef } from 'react';

function AdminLogin() {
  const [isTokenExists, setIsTokenExists] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const localStorageToken = localStorage.getItem('token');

    if (token && token === localStorageToken) {
      setAuthenticated(true);
    } else {
      console.log('Token mismatch or does not exist.');
    }
  }, []);

  console.log(authenticated);

  const handleGoogleLogin = () => {
    try {
      // Open a popup window for Google authentication
      const popup = window.open(
        'http://localhost:5000/google',
        'Google Auth',
        'width=600,height=600'
      );
      popupRef.current = popup;
      retrieveToken();
    } catch (error) {
      setIsTokenExists(false);
      console.error('Error logging in with Google:', error);
    }
  };

  const retrieveToken = () => {
    const token = Cookies.get('token');
    if (token) {
      // Store the token in localStorage for future use
      setIsTokenExists(true);
      localStorage.setItem('token', token);
      setAuthenticated(true);
      window.location.href = '/adminlogin'; // Replace '/admin-panel' with your desired URL
      // Close the popup window after successful authentication
      if (popupRef.current) {
        popupRef.current.close();
      }

      // Redirect to the admin panel
      window.location.href = '/adminlogin'; // Replace '/admin-panel' with your desired URL
    } else {
      setIsTokenExists(false);
      console.log('Token cookie does not exist or is not accessible.');
    }
  };

  return (
    <div>
      {authenticated ? (
        <AdminPanel />
      ) : (
        <div>
          <h1>Welcome Sign In | Admin Panel |</h1>
          <img
            src="google-signin-button.png"
            className="google-sign-in"
            onClick={handleGoogleLogin}
            alt="Google Sign In"
          />
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
