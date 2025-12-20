import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../services/auth';
import './Auth.css';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => {
        navigate('/login?error=auth_failed');
      }, 2000);
      return;
    }

    if (token) {
      try {
        setToken(token);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => {
          navigate('/login?error=token_error');
        }, 2000);
      }
    } else {
      setError('No authentication token received. Please try again.');
      setTimeout(() => {
        navigate('/login?error=no_token');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {error ? (
          <>
            <h2>Authentication Error</h2>
            <p className="error-message">{error}</p>
            <p>Redirecting to login...</p>
          </>
        ) : (
          <>
            <h2>Completing Authentication</h2>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              />
              <p style={{ marginTop: '20px', color: '#666' }}>
                Please wait...
              </p>
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

