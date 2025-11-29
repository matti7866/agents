import { useState } from 'react';
import './TestSMS.css';

export default function TestSMS() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: any;
  } | null>(null);

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !message) {
      setResult({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://rest.sntrips.com/api/send_sms.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: phoneNumber,
          message: message
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          type: 'success',
          message: 'SMS sent successfully!',
          details: data.response
        });
        // Clear form on success
        setPhoneNumber('');
        setMessage('');
      } else {
        setResult({
          type: 'error',
          message: data.error || 'Failed to send SMS',
          details: data.response
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-sms-page">
      <div className="test-sms-header">
        <h2>
          <i className="fas fa-sms"></i>
          Test SMS Service
        </h2>
        <p>Send test SMS messages to verify the SMS API integration</p>
      </div>

      <div className="test-sms-container">
        <div className="test-sms-card">
          <div className="card-icon">
            <i className="fas fa-mobile-alt"></i>
          </div>
          
          <form onSubmit={handleSendSMS} className="sms-form">
            <div className="form-group">
              <label htmlFor="phoneNumber">
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 971501234567"
                disabled={loading}
                className="form-input"
              />
              <small className="form-hint">
                Enter number with country code (e.g., 971 for UAE)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                <i className="fas fa-comment"></i>
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your test message here..."
                rows={5}
                disabled={loading}
                className="form-textarea"
                maxLength={500}
              />
              <small className="form-hint">
                {message.length}/500 characters
              </small>
            </div>

            <button 
              type="submit" 
              className="send-btn"
              disabled={loading || !phoneNumber || !message}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Test SMS
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`result-message ${result.type}`}>
              <div className="result-icon">
                {result.type === 'success' ? (
                  <i className="fas fa-check-circle"></i>
                ) : (
                  <i className="fas fa-exclamation-circle"></i>
                )}
              </div>
              <div className="result-content">
                <h4>{result.message}</h4>
                {result.details && (
                  <pre className="result-details">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>
            <i className="fas fa-info-circle"></i>
            SMS API Information
          </h3>
          <div className="info-content">
            <div className="info-item">
              <strong>API Endpoint:</strong>
              <span>https://nexus.eandenterprise.com/api/v1/sms/send</span>
            </div>
            <div className="info-item">
              <strong>Sender ID:</strong>
              <span>SNTRAVEL</span>
            </div>
            <div className="info-item">
              <strong>Category:</strong>
              <span>TXN (Transactional)</span>
            </div>
          </div>

          <div className="tips">
            <h4>
              <i className="fas fa-lightbulb"></i>
              Tips:
            </h4>
            <ul>
              <li>Always include country code in phone numbers</li>
              <li>Remove spaces and special characters from numbers</li>
              <li>Keep messages under 160 characters for single SMS</li>
              <li>Use this page to test before implementing on other pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

