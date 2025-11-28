import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Ledger.css';

const API_BASE_URL = 'http://127.0.0.1/snt/api';

interface LedgerRecord {
  residenceID: number;
  main_passenger: string;
  nationality: string;
  company_name: string;
  dt: string;
  sale_price: number;
  fine: number;
  cancellation_charges: number;
  tawjeeh_charges: number;
  iloe_charges: number;
  custom_charges: number;
  residencePayment: number;
  finePayment: number;
  tawjeeh_payments: number;
  iloe_payments: number;
  current_status: string;
}

interface Currency {
  currencyID: number;
  currencyName: string;
}

export default function Ledger() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    totalCharges: 0,
    totalPaid: 0,
    outstandingBalance: 0,
  });
  const [currencyName, setCurrencyName] = useState('');

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      console.log('Fetching currencies...');
      const response = await axios.get(`${API_BASE_URL}/residence/get-currencies.php`);
      console.log('Currencies response:', response.data);
      
      if (response.data.success) {
        // The API returns currencies directly merged with success/message, not nested under data
        // Structure: {0: {currencyID: 1, currencyName: "AED"}, 1: {...}, success: true, message: "Success"}
        let currenciesData = [];
        
        // Extract numeric keys (the actual currency objects)
        const keys = Object.keys(response.data).filter(key => !isNaN(Number(key)));
        currenciesData = keys.map(key => response.data[key]);
        
        // Fallback: Check if there's a nested data array
        if (currenciesData.length === 0 && response.data.data) {
          if (Array.isArray(response.data.data.data)) {
            currenciesData = response.data.data.data;
          } else if (Array.isArray(response.data.data)) {
            currenciesData = response.data.data;
          }
        }
        
        console.log('Parsed currencies:', currenciesData);
        setCurrencies(currenciesData);
        
        if (currenciesData.length > 0) {
          setSelectedCurrency(currenciesData[0].currencyID);
          fetchLedger(currenciesData[0].currencyID);
        } else {
          console.warn('No currencies found');
          Swal.fire('Info', 'No currencies available. Please contact administrator.', 'info');
        }
      } else {
        console.error('Currencies API returned success=false');
        Swal.fire('Error', 'Failed to load currencies', 'error');
      }
    } catch (error: any) {
      console.error('Error fetching currencies:', error);
      console.error('Error response:', error.response?.data);
      Swal.fire('Error', 'Failed to load currencies', 'error');
    }
  };

  const fetchLedger = async (currencyID: number) => {
    if (!currencyID) {
      console.warn('No currency ID provided');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching ledger for currency:', currencyID);
      const response = await axios.get(`${API_BASE_URL}/agent/residence-ledger.php`, {
        params: { currencyID, limit: 100 },
      });

      console.log('Ledger response:', response.data);

      if (response.data.success) {
        // JWTHelper merges data directly into response
        // Structure: { success: true, message: "...", data: [...], pagination: {...}, totals: {...}, currency: "..." }
        console.log('Full response data keys:', Object.keys(response.data));
        
        const records = Array.isArray(response.data.data) ? response.data.data : [];
        const totals = response.data.totals || { totalCharges: 0, totalPaid: 0, outstandingBalance: 0 };
        const currency = response.data.currency || '';
        const pagination = response.data.pagination || null;
        
        console.log('Parsed ledger data:', { 
          recordsCount: records.length, 
          totals: totals, 
          currency: currency,
          pagination: pagination
        });
        console.log('Totals breakdown:', {
          totalCharges: totals.totalCharges,
          totalPaid: totals.totalPaid,
          outstandingBalance: totals.outstandingBalance
        });
        
        // Ensure totals are numbers
        const parsedTotals = {
          totalCharges: parseFloat(totals.totalCharges) || 0,
          totalPaid: parseFloat(totals.totalPaid) || 0,
          outstandingBalance: parseFloat(totals.outstandingBalance) || 0,
        };
        
        console.log('Setting totals to:', parsedTotals);
        
        setRecords(records);
        setTotals(parsedTotals);
        setCurrencyName(currency);
        
        if (records.length === 0) {
          console.info('No ledger records found for this currency');
        }
      } else {
        throw new Error(response.data.message || 'Failed to load ledger');
      }
    } catch (error: any) {
      console.error('Error fetching ledger:', error);
      console.error('Error response:', error.response?.data);
      
      // Show a more user-friendly error
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load ledger';
      Swal.fire('Error', errorMsg, 'error');
      
      // Set empty data on error
      setRecords([]);
      setTotals({ totalCharges: 0, totalPaid: 0, outstandingBalance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currencyID: number) => {
    setSelectedCurrency(currencyID);
    fetchLedger(currencyID);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'completed') return 'badge-success';
    if (statusLower.includes('cancelled')) return 'badge-danger';
    if (statusLower === 'on hold') return 'badge-warning';
    return 'badge-info';
  };

  const formatNumber = (num: number | string) => {
    const value = parseFloat(num?.toString() || '0');
    return value.toLocaleString();
  };

  const getDueSince = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const startDate = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 1) return 'today';
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="ledger-page">
      <div className="page-header">
        <div>
          <h1>
            <i className="fas fa-file-invoice-dollar"></i>
            Payment Statement
          </h1>
          <p>View detailed payment information for all residences</p>
        </div>
        
        <div className="currency-selector">
          <label htmlFor="currency">Select Currency:</label>
          <select
            id="currency"
            value={selectedCurrency || ''}
            onChange={(e) => handleCurrencyChange(parseInt(e.target.value))}
            disabled={loading}
          >
            {currencies.map((currency) => (
              <option key={currency.currencyID} value={currency.currencyID}>
                {currency.currencyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="totals-cards">
        <div className="total-card">
          <div className="total-icon" style={{ background: '#667eea' }}>
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="total-info">
            <h3>{formatNumber(totals.totalCharges)}</h3>
            <p>Total Charges ({currencyName})</p>
          </div>
        </div>

        <div className="total-card">
          <div className="total-icon" style={{ background: '#28a745' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="total-info">
            <h3>{formatNumber(totals.totalPaid)}</h3>
            <p>Total Paid ({currencyName})</p>
          </div>
        </div>

        <div className="total-card">
          <div className="total-icon" style={{ background: totals.outstandingBalance > 0 ? '#dc3545' : '#28a745' }}>
            <i className="fas fa-balance-scale"></i>
          </div>
          <div className="total-info">
            <h3 style={{ color: totals.outstandingBalance > 0 ? '#dc3545' : '#28a745' }}>
              {formatNumber(totals.outstandingBalance)}
            </h3>
            <p>Outstanding Balance ({currencyName})</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          <i className="fas fa-list"></i>
          Detailed Statement
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#718096' }}>Loading ledger...</p>
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#cbd5e0' }}></i>
            <p style={{ marginTop: '16px', color: '#718096', fontSize: '16px' }}>
              No records found for this currency
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Establishment</th>
                  <th>Due Since</th>
                  <th>Sale</th>
                  <th>Fine</th>
                  <th>Cancel</th>
                  <th>Tawjeeh</th>
                  <th>ILOE</th>
                  <th>Custom</th>
                  <th>Total Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const totalCharges =
                    parseFloat(record.sale_price?.toString() || '0') +
                    parseFloat(record.fine?.toString() || '0') +
                    parseFloat(record.cancellation_charges?.toString() || '0') +
                    parseFloat(record.tawjeeh_charges?.toString() || '0') +
                    parseFloat(record.iloe_charges?.toString() || '0') +
                    parseFloat(record.custom_charges?.toString() || '0');

                  const totalPaid =
                    parseFloat(record.residencePayment?.toString() || '0') +
                    parseFloat(record.finePayment?.toString() || '0') +
                    parseFloat(record.tawjeeh_payments?.toString() || '0') +
                    parseFloat(record.iloe_payments?.toString() || '0');

                  const balance = totalCharges - totalPaid;

                  return (
                    <tr key={record.residenceID}>
                      <td>
                        <div className="passenger-info">
                          <strong>{record.main_passenger}</strong>
                          <small>{record.nationality}</small>
                        </div>
                      </td>
                      <td>{record.company_name || 'N/A'}</td>
                      <td>{getDueSince(record.dt)}</td>
                      <td>{formatNumber(record.sale_price)}</td>
                      <td>{formatNumber(record.fine)}</td>
                      <td>{formatNumber(record.cancellation_charges)}</td>
                      <td>{formatNumber(record.tawjeeh_charges)}</td>
                      <td>{formatNumber(record.iloe_charges)}</td>
                      <td>{formatNumber(record.custom_charges)}</td>
                      <td className="highlight-paid">{formatNumber(totalPaid)}</td>
                      <td
                        className="highlight-balance"
                        style={{ color: balance > 0 ? '#dc3545' : '#28a745', fontWeight: 700 }}
                      >
                        {formatNumber(balance)}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(record.current_status)}`}>
                          {record.current_status}
                        </span>
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

