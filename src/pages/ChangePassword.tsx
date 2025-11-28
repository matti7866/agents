import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL from '../config/api';
import './ChangePassword.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire('Error', 'New password must be at least 6 characters long', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      Swal.fire('Error', 'New password must be different from current password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/agent/change-password.php`, {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been changed successfully.',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/');
        });
      } else {
        throw new Error(response.data.message || 'Failed to change password');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || error.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="card">
        <div className="card-header">
          <h2>
            <i className="fas fa-key"></i>
            Change Password
          </h2>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">
              <i className="fas fa-lock"></i>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              <i className="fas fa-lock"></i>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Changing...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

