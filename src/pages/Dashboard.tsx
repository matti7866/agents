import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Dashboard.css';

const API_BASE_URL = 'http://127.0.0.1/snt/api';

interface Residence {
  residenceID: number;
  passenger_name: string;
  passportNumber: string;
  nationality_name: string;
  countryCode: string;
  company_name: string;
  company_number: string;
  mb_number: string;
  uid: string;
  sale_price: number;
  total_paid: number;
  completedStep: number;
  status_name: string;
  datetime: string;
  cancelled: number;
  hold: number;
}

const stepNames: Record<string, string> = {
  '1': 'Offer Letter',
  '1a': 'Offer Letter (Submitted)',
  '2': 'Insurance',
  '3': 'Labour Card',
  '4': 'E-Visa',
  '4a': 'E-Visa (Submitted)',
  '5': 'Change Status',
  '6': 'Medical',
  '7': 'Emirates ID',
  '8': 'Visa Stamping',
  '9': 'Contract Submission',
  '10': 'Completed',
};

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stepFromUrl = searchParams.get('step');
  
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStep, setFilterStep] = useState<string | null>(stepFromUrl || null);
  const [stepFilter, setStepFilter] = useState<string>(''); // For dropdown which uses completedStep
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    totalPaid: 0,
    totalSale: 0,
  });

  // Update filterStep when URL changes
  useEffect(() => {
    const stepParam = searchParams.get('step');
    setFilterStep(stepParam || null);
  }, [searchParams]);

  useEffect(() => {
    fetchResidences();
  }, [filterStep]);

  const fetchResidences = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      
      // Use stepFilter from dropdown if set, otherwise use filterStep from URL
      const activeStepFilter = stepFilter || filterStep;
      
      if (activeStepFilter) {
        // For steps 1a and 4a, we need to filter by completedStep 2 and 5 respectively
        // But also filter by offerLetterStatus or eVisaStatus
        const stepMapping: Record<string, number> = {
          '1': 1, '1a': 2, '2': 3, '3': 4, '4': 5, 
          '4a': 5, '5': 6, '6': 7, '7': 8, '8': 9, 
          '9': 10, '10': 10
        };
        params.completedStep = stepMapping[activeStepFilter] || parseInt(activeStepFilter);
      }

      console.log('Fetching residences with params:', params);
      const response = await axios.get(`${API_BASE_URL}/agent/residences.php`, { params });
      
      console.log('Residences response:', response.data);
      
      if (response.data.success) {
        // Response structure: { success: true, data: { data: [...], total: X, page: Y } }
        const responseData = response.data.data;
        const data = Array.isArray(responseData?.data) ? responseData.data : 
                     Array.isArray(responseData) ? responseData : [];
        
        console.log('Parsed residences data:', data);
        setResidences(data);
        
        // Calculate stats
        const completed = data.filter((r: Residence) => r.completedStep === 10).length;
        const inProgress = data.filter((r: Residence) => r.completedStep < 10 && r.cancelled === 0).length;
        const totalSale = data.reduce((sum: number, r: Residence) => sum + parseFloat(r.sale_price?.toString() || '0'), 0);
        const totalPaid = data.reduce((sum: number, r: Residence) => sum + parseFloat(r.total_paid?.toString() || '0'), 0);

        setStats({
          total: data.length,
          completed,
          inProgress,
          totalPaid,
          totalSale,
        });
      } else {
        console.error('API returned success=false:', response.data);
        throw new Error(response.data.message || 'Failed to load residences');
      }
    } catch (error: any) {
      console.error('Error fetching residences:', error);
      console.error('Error response:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'Failed to load residences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredResidences = residences.filter((residence) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      residence.passenger_name.toLowerCase().includes(searchLower) ||
      residence.passportNumber.toLowerCase().includes(searchLower) ||
      residence.company_name?.toLowerCase().includes(searchLower)
    );
  });

  const getStepBadgeColor = (step: number) => {
    if (step === 10) return 'badge-success';
    if (step >= 7) return 'badge-info';
    if (step >= 4) return 'badge-warning';
    return 'badge-primary';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#667eea' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Residences</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#28a745' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ffc107' }}>
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#17a2b8' }}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalPaid.toLocaleString()}</h3>
            <p>Total Paid</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>
            <i className="fas fa-list"></i>
            Your Customers' Residences
            {filterStep && (
              <span className="badge badge-info" style={{ marginLeft: '12px', fontSize: '12px' }}>
                Filtering: Step {filterStep} - {stepNames[filterStep]}
              </span>
            )}
          </h2>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or passport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={stepFilter || filterStep || ''}
              onChange={(e) => {
                const step = e.target.value || null;
                setStepFilter(step || '');
                setFilterStep(step);
                if (step) {
                  setSearchParams({ step });
                } else {
                  setSearchParams({});
                }
              }}
            >
              <option value="">All Steps</option>
              {Object.entries(stepNames).map(([step, name]) => (
                <option key={step} value={step}>
                  Step {step}: {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#718096' }}>Loading residences...</p>
          </div>
        ) : filteredResidences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#cbd5e0' }}></i>
            <p style={{ marginTop: '16px', color: '#718096', fontSize: '16px' }}>
              No residences found
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Passenger Name</th>
                  <th>Passport</th>
                  <th>Establishment</th>
                  <th>MOHRE Status</th>
                  <th>Sale Price</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Current Step</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidences.map((residence) => {
                  const balance = parseFloat(residence.sale_price?.toString() || '0') - parseFloat(residence.total_paid?.toString() || '0');
                  
                  return (
                    <tr key={residence.residenceID}>
                      <td>{residence.residenceID}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {residence.countryCode && (
                            <img
                              src={`https://flagpedia.net/data/flags/h24/${residence.countryCode.toLowerCase()}.png`}
                              alt={residence.nationality_name}
                              height="16"
                              style={{ borderRadius: '2px' }}
                            />
                          )}
                          <strong>{residence.passenger_name}</strong>
                        </div>
                      </td>
                      <td>{residence.passportNumber}</td>
                      <td>
                        {residence.company_name || 'N/A'}
                        {residence.company_number && (
                          <>
                            <br />
                            <small style={{ color: '#718096' }}>#{residence.company_number}</small>
                          </>
                        )}
                        {residence.mb_number && (
                          <>
                            <br />
                            <small style={{ color: '#718096' }}>MB: {residence.mb_number}</small>
                          </>
                        )}
                      </td>
                      <td>
                        {residence.mb_number ? (
                          <div>
                            <span style={{ color: '#28a745', fontWeight: '600', fontSize: '13px' }}>
                              {residence.mb_number}
                            </span>
                            {residence.uid && (
                              <>
                                <br />
                                <small style={{ color: '#718096' }}>UID: {residence.uid}</small>
                              </>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#dc3545', fontSize: '12px' }}>
                            No MB Number
                          </span>
                        )}
                      </td>
                      <td>{residence.sale_price.toLocaleString()}</td>
                      <td>{residence.total_paid.toLocaleString()}</td>
                      <td>
                        <span style={{ color: balance > 0 ? '#dc3545' : '#28a745', fontWeight: 600 }}>
                          {balance.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStepBadgeColor(residence.completedStep)}`}>
                          {residence.status_name}
                        </span>
                      </td>
                      <td>
                        {new Date(residence.datetime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <Link
                          to={`/residence/${residence.residenceID}`}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          <i className="fas fa-eye"></i>
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

