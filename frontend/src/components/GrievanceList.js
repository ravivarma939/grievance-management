import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { grievanceService } from '../services/grievanceService';
import { bookmarkService } from '../services/bookmarkService';
import Navigation from './Navigation';
import GrievanceForm from './GrievanceForm';
import './GrievanceList.css';

const GrievanceList = () => {
  const { username, isGuest } = useAuth();
  const [allGrievances, setAllGrievances] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [filterCompany, setFilterCompany] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterState, setFilterState] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const products = [
    'All Products',
    ...Array.from(
      new Set(
        allGrievances.map(g => (g.product || g.issueType || '').trim()).filter(Boolean)
      )
    )
  ];

  const companies = [
    'All Companies',
    ...Array.from(
      new Set(
        allGrievances.map(g => (g.company || '').trim()).filter(Boolean)
      )
    )
  ];

  useEffect(() => {
    loadGrievances();
    if (!isGuest) {
      loadStatistics();
      loadBookmarks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyClientFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCompany, filterProduct, filterState, allGrievances]);

  const applyClientFilters = () => {
    const company = filterCompany.toLowerCase();
    const product = filterProduct.toLowerCase();
    const state = filterState.toLowerCase();

    const filtered = allGrievances.filter(g => {
      const gCompany = (g.company || '').toLowerCase();
      const gProduct = (g.product || g.issueType || '').toLowerCase();
      const gState = (g.state || '').toLowerCase();

      const companyMatch = company ? gCompany.includes(company) : true;
      const productMatch = product ? gProduct.includes(product) : true;
      const stateMatch = state ? gState.includes(state) : true;

      return companyMatch && productMatch && stateMatch;
    });

    setGrievances(filtered);
  };

  const loadGrievances = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await grievanceService.getAll();
      const arr = Array.isArray(data) ? data : [];
      setAllGrievances(arr);
      setGrievances(arr);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      if (err.response?.status === 401) {
        if (isGuest) {
          setError('Guest access denied. The API Gateway may need to be restarted to allow guest GET requests.');
        } else {
          setError('Access denied. Please login or continue as guest.');
        }
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Cannot connect to server. Please ensure: 1) API Gateway is running (port 8080), 2) Grievance Service is running (port 8083), 3) External grievance API is running at http://localhost:3232');
      } else if (err.response?.status === 500) {
        setError('Server error. The external grievance API at http://localhost:3232 might not be running. Start it with: docker run -p3232:3232 --name consumercontainer stackroutenew/grievanceapi');
      } else {
        setError('Failed to load grievances: ' + errorMessage);
      }
      console.error('Error loading grievances:', err);
      setGrievances([]);
      setAllGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await grievanceService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const loadBookmarks = async () => {
    if (isGuest) return;
    try {
      const bookmarks = await bookmarkService.getBookmarks(username);
      const ids = new Set(bookmarks.map(b => b.grievanceId));
      setBookmarkedIds(ids);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleBookmark = async (grievance) => {
    if (isGuest) {
      setError('Login to bookmark grievances.');
      setInfo('');
      return;
    }
    try {
      const grievanceId = grievance.id || grievance.grievanceId || String(grievance.grievanceId);
      const saved = await bookmarkService.addBookmark({
        username: username,
        grievanceId: grievanceId,
        company: grievance.company || '',
        product: grievance.product || grievance.issueType || '',
        state: grievance.state || ''
      });
      await loadBookmarks();
      setError('');
      setInfo(`Bookmarked grievance ${grievanceId}`);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError('Failed to bookmark: ' + msg);
      setInfo('');
    }
  };

  const handleUnbookmark = async (grievanceId) => {
    if (isGuest) {
      setError('Login to manage bookmarks.');
      return;
    }
    try {
      const bookmarks = await bookmarkService.getBookmarks(username);
      const bookmark = bookmarks.find(b => 
        String(b.grievanceId) === String(grievanceId)
      );
      if (bookmark) {
        await bookmarkService.deleteBookmark(bookmark.id);
        await loadBookmarks();
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError('Failed to remove bookmark: ' + msg);
      setInfo('');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    loadGrievances();
    if (!isGuest) {
      loadStatistics();
    }
    handleFormClose();
  };

  const handleClearFilters = () => {
    setFilterCompany('');
    setFilterProduct('');
    setFilterState('');
  };

  const isBookmarked = (grievance) => {
    const id = grievance.id || grievance.grievanceId || String(grievance.grievanceId);
    return bookmarkedIds.has(String(id));
  };

  return (
    <div className="grievance-container">
      <Navigation />

      <div className="grievance-content">
        {statistics && (
          <div className="statistics-section">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Grievances</div>
                <div className="stat-value">{statistics.totalGrievances || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Timely Responded</div>
                <div className="stat-value">{statistics.timelyResponded || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Not Timely Responded</div>
                <div className="stat-value">{statistics.notTimelyResponded || 0}</div>
              </div>
            </div>
          </div>
        )}

        {!isGuest && (
          <div className="actions-bar">
            <button onClick={handleCreate} className="create-button">
              + Create New Grievance
            </button>
          </div>
        )}

        <div className="filters-section">
          <h3>Filter Grievances</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Product:</label>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="filter-select"
              >
                {products.map((product) => (
                  <option key={product} value={product === 'All Products' ? '' : product}>
                    {product}
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
                {companies.map((company) => (
                  <option key={company} value={company === 'All Companies' ? '' : company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>State:</label>
              <input
                type="text"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                placeholder="Enter state"
                className="filter-input"
              />
            </div>
            {(filterCompany || filterProduct || filterState) && (
              <button onClick={handleClearFilters} className="clear-filters-button">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {info && <div className="info-message">{info}</div>}

        {loading ? (
          <div className="loading">Loading grievances...</div>
        ) : (
          <div className="grievance-table-container">
            <table className="grievance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company</th>
                  <th>Product</th>
                  <th>State</th>
                  <th>Timely Response</th>
                  {!isGuest && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {grievances.length === 0 ? (
                  <tr>
                    <td colSpan={isGuest ? "5" : "6"} className="no-data">
                      No grievances found
                    </td>
                  </tr>
                ) : (
                  grievances.map((grievance, index) => {
                    const id = grievance.id || grievance.grievanceId || index;
                    const isBooked = isBookmarked(grievance);
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{grievance.company || '-'}</td>
                        <td>{grievance.product || grievance.issueType || '-'}</td>
                        <td>{grievance.state || '-'}</td>
                        <td>{grievance.timely_response || '-'}</td>
                        {!isGuest && (
                          <td>
                            {isBooked ? (
                              <button
                                onClick={() => handleUnbookmark(id)}
                                className="unbookmark-button"
                                title="Remove bookmark"
                              >
                                ★ Unbookmark
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBookmark(grievance)}
                                className="bookmark-button"
                                title="Bookmark this grievance"
                              >
                                ☆ Bookmark
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <GrievanceForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default GrievanceList;
