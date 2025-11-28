import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL from '../config/api';
import './ResidenceDetails.css';

interface ResidenceDetail {
  residenceID: number;
  passenger_name: string;
  passportNumber: string;
  nationality_name: string;
  countryCode: string;
  company_name: string;
  company_number: string;
  position_name: string;
  sale_price: number;
  total_paid: number;
  total_fine: number;
  completedStep: number;
  datetime: string;
  offerLetterDate: string;
  insuranceDate: string;
  laborCardDate: string;
  eVisaDate: string;
  changeStatusDate: string;
  medicalDate: string;
  emiratesIDDate: string;
  visaStampingDate: string;
  remarks: string;
  uid: string;
  EmiratesIDNumber: string;
  LabourCardNumber: string;
}

const stepDetails = [
  { id: 1, name: 'Offer Letter', icon: 'fa-envelope', dateField: 'offerLetterDate' },
  { id: 2, name: 'Insurance', icon: 'fa-shield', dateField: 'insuranceDate' },
  { id: 3, name: 'Labour Card', icon: 'fa-credit-card', dateField: 'laborCardDate' },
  { id: 4, name: 'E-Visa', icon: 'fa-ticket', dateField: 'eVisaDate' },
  { id: 5, name: 'Change Status', icon: 'fa-exchange', dateField: 'changeStatusDate' },
  { id: 6, name: 'Medical', icon: 'fa-medkit', dateField: 'medicalDate' },
  { id: 7, name: 'Emirates ID', icon: 'fa-id-card', dateField: 'emiratesIDDate' },
  { id: 8, name: 'Visa Stamping', icon: 'fa-stamp', dateField: 'visaStampingDate' },
  { id: 9, name: 'Contract Submission', icon: 'fa-file-signature', dateField: null },
  { id: 10, name: 'Completed', icon: 'fa-check-circle', dateField: null },
];

export default function ResidenceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [residence, setResidence] = useState<ResidenceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchResidenceDetails();
    }
  }, [id]);

  const fetchResidenceDetails = async () => {
    setLoading(true);
    try {
      console.log('Fetching residence details for ID:', id);
      const response = await axios.get(`${API_BASE_URL}/agent/residence-details.php?id=${id}`);
      
      console.log('Residence details response:', response.data);
      
      if (response.data.success) {
        // Response might be nested or direct
        const residenceData = response.data.data || response.data;
        console.log('Parsed residence data:', residenceData);
        setResidence(residenceData);
      } else {
        throw new Error(response.data.message || 'Failed to load residence details');
      }
    } catch (error: any) {
      console.error('Error fetching residence details:', error);
      console.error('Error response:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'Failed to load residence details', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#718096' }}>Loading residence details...</p>
      </div>
    );
  }

  if (!residence) {
    return null;
  }

  const balance = parseFloat(residence.sale_price?.toString() || '0') - parseFloat(residence.total_paid?.toString() || '0');

  return (
    <div className="residence-details">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <h1>Residence Details</h1>
      </div>

      <div className="details-grid">
        {/* Basic Information Card */}
        <div className="card">
          <h2 className="card-title">
            <i className="fas fa-user"></i>
            Basic Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Residence ID</label>
              <div className="info-value">
                <strong>#{residence.residenceID}</strong>
              </div>
            </div>
            <div className="info-item">
              <label>Passenger Name</label>
              <div className="info-value">
                {residence.countryCode && (
                  <img
                    src={`https://flagpedia.net/data/flags/h24/${residence.countryCode.toLowerCase()}.png`}
                    alt={residence.nationality_name}
                    height="16"
                    style={{ marginRight: '8px', borderRadius: '2px' }}
                  />
                )}
                <strong>{residence.passenger_name}</strong>
              </div>
            </div>
            <div className="info-item">
              <label>Passport Number</label>
              <div className="info-value">{residence.passportNumber}</div>
            </div>
            <div className="info-item">
              <label>Nationality</label>
              <div className="info-value">{residence.nationality_name}</div>
            </div>
            <div className="info-item">
              <label>Position</label>
              <div className="info-value">{residence.position_name || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label>Application Date</label>
              <div className="info-value">
                {new Date(residence.datetime).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="card">
          <h2 className="card-title">
            <i className="fas fa-building"></i>
            Establishment Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Company Name</label>
              <div className="info-value">{residence.company_name || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label>Company Number</label>
              <div className="info-value">{residence.company_number || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label>Labour Card Number</label>
              <div className="info-value">{residence.LabourCardNumber || 'Not issued yet'}</div>
            </div>
            <div className="info-item">
              <label>Emirates ID Number</label>
              <div className="info-value">{residence.EmiratesIDNumber || 'Not issued yet'}</div>
            </div>
            {residence.uid && (
              <div className="info-item">
                <label>UID</label>
                <div className="info-value">{residence.uid}</div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information Card */}
        <div className="card">
          <h2 className="card-title">
            <i className="fas fa-dollar-sign"></i>
            Financial Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Sale Price</label>
              <div className="info-value financial-amount">
                {residence.sale_price.toLocaleString()} AED
              </div>
            </div>
            <div className="info-item">
              <label>Total Paid</label>
              <div className="info-value financial-amount" style={{ color: '#28a745' }}>
                {residence.total_paid.toLocaleString()} AED
              </div>
            </div>
            <div className="info-item">
              <label>Outstanding Balance</label>
              <div className="info-value financial-amount" style={{ color: balance > 0 ? '#dc3545' : '#28a745' }}>
                {balance.toLocaleString()} AED
              </div>
            </div>
            <div className="info-item">
              <label>Total Fines</label>
              <div className="info-value financial-amount" style={{ color: '#ffc107' }}>
                {residence.total_fine.toLocaleString()} AED
              </div>
            </div>
            <div className="info-item">
              <label>Payment Progress</label>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${Math.min(100, (residence.total_paid / residence.sale_price) * 100)}%`,
                    background: balance > 0 ? '#ffc107' : '#28a745'
                  }}
                ></div>
                <span className="progress-text">
                  {Math.round((residence.total_paid / residence.sale_price) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Steps Card */}
      <div className="card">
        <h2 className="card-title">
          <i className="fas fa-tasks"></i>
          Processing Steps Progress
        </h2>
        <div className="steps-timeline">
          {stepDetails.map((step) => {
            const isCompleted = residence.completedStep >= step.id;
            const isCurrent = residence.completedStep === step.id - 1;
            const dateValue = step.dateField ? (residence as any)[step.dateField] : null;

            return (
              <div 
                key={step.id} 
                className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-marker">
                  <div className="step-icon">
                    {isCompleted ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <i className={`fas ${step.icon}`}></i>
                    )}
                  </div>
                  <div className="step-line"></div>
                </div>
                <div className="step-content">
                  <div className="step-header">
                    <h3>Step {step.id}: {step.name}</h3>
                    {isCompleted && (
                      <span className="badge badge-success">
                        <i className="fas fa-check-circle"></i>
                        Completed
                      </span>
                    )}
                    {isCurrent && (
                      <span className="badge badge-warning">
                        <i className="fas fa-clock"></i>
                        In Progress
                      </span>
                    )}
                  </div>
                  {dateValue && (
                    <p className="step-date">
                      <i className="far fa-calendar"></i>
                      Completed on: {new Date(dateValue).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remarks Card */}
      {residence.remarks && (
        <div className="card">
          <h2 className="card-title">
            <i className="fas fa-comment-alt"></i>
            Remarks
          </h2>
          <div className="remarks-content">
            {residence.remarks}
          </div>
        </div>
      )}
    </div>
  );
}

