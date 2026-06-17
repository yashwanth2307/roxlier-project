import React, { useState, useEffect } from 'react';
import api from '../helpers/api';

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const storeRes = await api.get('/auth/owner/store');
      setStore(storeRes.data);
      setRatings(storeRes.data.ratings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store data');
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626' }}>{error}</h2>
          <p style={{ marginTop: '10px' }}>You might not have a store assigned to your account yet.</p>
        </div>
      </div>
    );
  }

  if (!store) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '20px' }}>My Store Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '30px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '10px' }}>{store.name}</h2>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>{store.address}</p>
            <p style={{ color: '#6b7280' }}>{store.email}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px 30px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 'bold', marginBottom: '5px' }}>Average Rating</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>
              {store.averageRating ? Number(store.averageRating).toFixed(1) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <h2>User Ratings</h2>
      <div className="card" style={{ marginTop: '15px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Rating Given</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.user.name}</td>
                  <td>{rating.user.email}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                      {'★'.repeat(rating.value)}{'☆'.repeat(5 - rating.value)}
                    </span>
                    <span style={{ marginLeft: '10px' }}>({rating.value})</span>
                  </td>
                  <td>{new Date(rating.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {ratings.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No ratings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
