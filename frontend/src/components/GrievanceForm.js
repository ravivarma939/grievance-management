import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { grievanceService } from '../services/grievanceService';
import './GrievanceForm.css';

const GrievanceForm = ({ grievance, onClose, onSubmit }) => {
  const { username } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    issueType: '',
    state: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const issueTypes = [
    'Banking Issue',
    'Debit Card Issue',
    'Credit Card Issue',
    'Technical Issue'
  ];

  const bankNames = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Indian Bank',
    'Kotak Mahindra Bank'
  ];

  useEffect(() => {
    if (grievance) {
      setFormData({
        company: grievance.company || '',
        issueType: grievance.issueType || '',
        state: grievance.state || ''
      });
    }
  }, [grievance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const dataToSubmit = {
      username: username,
      company: formData.company,
      issueType: formData.issueType,
      state: formData.state
    };

    try {
      if (grievance) {
        await grievanceService.update(grievance.grievanceId, dataToSubmit);
      } else {
        await grievanceService.create(dataToSubmit);
      }
      onSubmit();
    } catch (err) {
      setError('Failed to save grievance: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{grievance ? 'Edit Grievance' : 'Create New Grievance'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="grievance-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              disabled
              className="disabled-input"
            />
            <small className="form-hint">Username is automatically set from your login</small>
          </div>

          <div className="form-group">
            <label htmlFor="company">Company <span className="required">*</span></label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a Bank</option>
              {bankNames.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issueType">Issue Type <span className="required">*</span></label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Issue Type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="state">State <span className="required">*</span></label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Saving...' : grievance ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrievanceForm;

