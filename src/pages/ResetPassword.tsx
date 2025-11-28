import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';

const API_BASE_URL = 'http://127.0.0.1/snt/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      Swal.fire('Error', 'Invalid reset link. Please request a new one.', 'error');
      navigate('/forgot-password');
    } else {
      setValidToken(true);
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      Swal.fire('Error', 'Please enter both password fields', 'error');
      return;
    }

    if (password.length < 6) {
      Swal.fire('Error', 'Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/agent/reset-password.php`, {
        token,
        email,
        password,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been reset. You can now login with your new password.',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          navigate('/login');
        });
      } else {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || error.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <i className="fas fa-lock"></i>
            </div>
            <h1>Set New Password</h1>
            <p>Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Reset Password
                </>
              )}
            </button>

            <div className="form-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" className="forgot-password-link">
                <i className="fas fa-arrow-left"></i> Back to Login
              </Link>
            </div>
          </form>

          <div className="login-footer">
            <p>© 2024 Selab Nadiry Travel & Tourism</p>
          </div>
        </div>
      </div>
    </div>
  );
}

