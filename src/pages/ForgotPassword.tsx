import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';

const API_BASE_URL = 'http://127.0.0.1/snt/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire('Error', 'Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/agent/forgot-password.php`, {
        email,
      });

      if (response.data.success) {
        setSent(true);
        Swal.fire('Success', 'If the email exists, a password reset link has been sent to your email.', 'success');
      } else {
        throw new Error(response.data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || error.message || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <i className="fas fa-key"></i>
            </div>
            <h1>Reset Password</h1>
            <p>Enter your email to receive a reset link</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Reset Link
                  </>
                )}
              </button>

              <div className="form-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login" className="forgot-password-link">
                  <i className="fas fa-arrow-left"></i> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="login-form">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}></i>
                <h3 style={{ color: '#1a202c', marginBottom: '12px' }}>Check Your Email</h3>
                <p style={{ color: '#718096', marginBottom: '24px' }}>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '24px' }}>
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
                <Link to="/login" className="btn-login" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  <i className="fas fa-arrow-left"></i> Back to Login
                </Link>
              </div>
            </div>
          )}

          <div className="login-footer">
            <p>© 2024 Selab Nadiry Travel & Tourism</p>
          </div>
        </div>
      </div>
    </div>
  );
}

