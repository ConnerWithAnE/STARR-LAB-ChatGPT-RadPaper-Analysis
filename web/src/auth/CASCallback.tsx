import React, { useEffect } from 'react';

const BACKEND_URL = 'https://localhost:3000'; // Replace with your backend URL

const CASCallback: React.FC = () => {
    useEffect(() => {
        // Extract CAS ticket from URL
        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get('ticket');

        if (ticket) {
            // Call backend to validate ticket
            fetch(`${BACKEND_URL}/admin-router/auth/cas-validate?ticket=${ticket}&service=${encodeURIComponent(window.location.origin + '/cas-callback')}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        // Store JWT in localStorage or cookies
                        localStorage.setItem('jwt', data.token);
                        // Redirect to a protected page or home
                        window.location.href = '/';
                    } else {
                        console.error('CAS validation failed:', data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error during CAS validation:', error);
                });
        } else {
            console.error('No ticket found in URL');
        }
    }, []);

    return (
      <div>
        Authenticating with CAS...
      </div>)
};

export default CASCallback;
