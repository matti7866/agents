import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire('Error', 'Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Swal.fire('Success', 'Login successful!', 'success');
      navigate('/');
    } catch (error: any) {
      Swal.fire('Login Failed', error || 'Invalid credentials', 'error');
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
              <i className="fas fa-user-shield"></i>
            </div>
            <h1>Agent Portal</h1>
            <p>Sign in with your email and OTP</p>
          </div>

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

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2024 Selab Nadiry Travel & Tourism</p>
          </div>
        </div>
      </div>
    </div>
  );
}

