import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookmarkService } from '../services/bookmarkService';
import Navigation from './Navigation';
import './BookmarksList.css';

const BookmarksList = () => {
  const { username } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    loadBookmarks();
  }, [username]);

  const loadBookmarks = async () => {
    setLoading(true);
    setError('');
    setInfo('');

    if (!username) {
      setError('Please login to view bookmarks.');
      setLoading(false);
      return;
    }

    try {
      const data = await bookmarkService.getBookmarks(username);
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load bookmarks: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }

    try {
      await bookmarkService.deleteBookmark(id);
      loadBookmarks();
      setInfo('Bookmark removed');
    } catch (err) {
      setError('Failed to delete bookmark: ' + (err.response?.data?.error || err.message));
      setInfo('');
    }
  };

  return (
    <div className="bookmarks-container">
      <Navigation />
      <div className="bookmarks-content">
        
        {error && <div className="error-message">{error}</div>}
        {info && <div className="success-message">{info}</div>}

        {loading ? (
          <div className="loading">Loading bookmarks...</div>
        ) : (
          <>
            {bookmarks.length === 0 ? (
              <div className="no-bookmarks">
                <p>You haven't bookmarked any grievances yet.</p>
                <p>Bookmark grievances from the main grievances list to see them here.</p>
              </div>
            ) : (
              <div className="bookmarks-table-container">
                <table className="bookmarks-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Company</th>
                      <th>Product</th>
                      <th>State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookmarks.map((bookmark) => (
                      <tr key={bookmark.id}>
                        <td>{bookmark.grievanceId}</td>
                        <td>{bookmark.company || '-'}</td>
                        <td>{bookmark.product || '-'}</td>
                        <td>{bookmark.state || '-'}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="delete-button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookmarksList;

