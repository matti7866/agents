import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const steps = [
  { id: '1', name: 'Offer Letter', icon: 'fa-envelope' },
  { id: '1a', name: 'Offer Letter (Submitted)', icon: 'fa-envelope-open' },
  { id: '2', name: 'Insurance', icon: 'fa-shield' },
  { id: '3', name: 'Labour Card', icon: 'fa-credit-card' },
  { id: '4', name: 'E-Visa', icon: 'fa-ticket' },
  { id: '4a', name: 'E-Visa (Submitted)', icon: 'fa-file-check' },
  { id: '5', name: 'Change Status', icon: 'fa-exchange' },
  { id: '6', name: 'Medical', icon: 'fa-medkit' },
  { id: '7', name: 'Emirates ID', icon: 'fa-id-card' },
  { id: '8', name: 'Visa Stamping', icon: 'fa-stamp' },
  { id: '9', name: 'Contract Submission', icon: 'fa-file-signature' },
  { id: '10', name: 'Completed', icon: 'fa-check-circle' },
];

export default function Layout() {
  const { agent, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-user-shield"></i>
            <span>Agent Portal</span>
          </div>
        </div>

        <div className="agent-info">
          <div className="agent-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="agent-details">
            <h3>{agent?.company}</h3>
            <p>{agent?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/ledger" 
            className={`nav-item ${location.pathname === '/ledger' ? 'active' : ''}`}
          >
            <i className="fas fa-file-invoice-dollar"></i>
            <span>Payment Statement</span>
          </Link>

          <div className="nav-section">
            <div className="nav-section-title">
              <i className="fas fa-tasks"></i>
              <span>Residence Processing Steps</span>
            </div>
            {steps.map((step) => (
              <Link
                key={step.id}
                to={`/?step=${step.id}`}
                className={`nav-item nav-step ${location.search === `?step=${step.id}` ? 'active' : ''}`}
              >
                <i className={`fas ${step.icon}`}></i>
                <span>
                  Step {step.id}: {step.name}
                </span>
              </Link>
            ))}
          </div>

          <Link 
            to="/change-password" 
            className={`nav-item ${location.pathname === '/change-password' ? 'active' : ''}`}
          >
            <i className="fas fa-key"></i>
            <span>Change Password</span>
          </Link>

          <button onClick={logout} className="nav-item logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1>Welcome, {agent?.company}</h1>
            <p>Track your customers' residence processing progress</p>
          </div>
          <div className="header-right">
            <div className="header-date">
              <i className="far fa-calendar"></i>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

