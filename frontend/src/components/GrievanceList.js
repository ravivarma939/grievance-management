import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { grievanceService } from '../services/grievanceService';
import GrievanceForm from './GrievanceForm';
import './GrievanceList.css';

const GrievanceList = () => {
  const { username, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState(null);
  const [filterIssueType, setFilterIssueType] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

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
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (filterIssueType && filterCompany) {
        data = await grievanceService.filter(filterIssueType, filterCompany);
      } else {
        data = await grievanceService.getAll();
      }
      setGrievances(data);
    } catch (err) {
      setError('Failed to load grievances: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, [filterIssueType, filterCompany]);

  const handleCreate = () => {
    setEditingGrievance(null);
    setShowForm(true);
  };

  const handleEdit = (grievance) => {
    setEditingGrievance(grievance);
    setShowForm(true);
  };

  const handleDelete = async (grievanceId) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) {
      return;
    }

    try {
      await grievanceService.delete(grievanceId);
      loadGrievances();
    } catch (err) {
      setError('Failed to delete grievance: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGrievance(null);
  };

  const handleFormSubmit = () => {
    loadGrievances();
    handleFormClose();
  };

  const handleClearFilters = () => {
    setFilterIssueType('');
    setFilterCompany('');
  };

  return (
    <div className="grievance-container">
      <header className="grievance-header">
        <h1>Grievance Management</h1>
        <div className="header-actions">
          <span className="username">Welcome, {username}</span>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="grievance-content">
        <div className="actions-bar">
          <button onClick={handleCreate} className="create-button">
            + Create New Grievance
          </button>
        </div>

        <div className="filters-section">
          <h3>Filter Grievances</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Issue Type:</label>
              <select
                value={filterIssueType}
                onChange={(e) => setFilterIssueType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Issue Types</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Company:</label>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="filter-select"
              >
                <option value="">All Companies</option>
                {bankNames.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
            {(filterIssueType || filterCompany) && (
              <button onClick={handleClearFilters} className="clear-filters-button">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading grievances...</div>
        ) : (
          <div className="grievance-table-container">
            <table className="grievance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Company</th>
                  <th>Issue Type</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grievances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No grievances found
                    </td>
                  </tr>
                ) : (
                  grievances.map((grievance) => (
                    <tr key={grievance.grievanceId}>
                      <td>{grievance.grievanceId}</td>
                      <td>{grievance.username}</td>
                      <td>{grievance.company}</td>
                      <td>{grievance.issueType}</td>
                      <td>{grievance.state}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(grievance)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(grievance.grievanceId)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <GrievanceForm
          grievance={editingGrievance}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default GrievanceList;

