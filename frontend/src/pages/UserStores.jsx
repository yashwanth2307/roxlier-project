import React, { useState, useEffect } from 'react';
import api from '../helpers/api';
import RatingStars from '../components/RatingStars';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/stores?${params.toString()}`);
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRatingSubmit = async (storeId, value) => {
    try {
      await api.post('/ratings', { storeId, value });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleRatingUpdate = async (ratingId, value) => {
    try {
      await api.put(`/ratings/${ratingId}`, { value });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update rating');
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '20px' }}>Stores</h1>
      
      <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>Search Stores</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input type="text" name="name" placeholder="Search by Name" value={filters.name} onChange={handleFilterChange} className="filter-input" />
          <input type="text" name="address" placeholder="Search by Address" value={filters.address} onChange={handleFilterChange} className="filter-input" />
        </div>
      </div>

      <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {stores.map(store => (
          <div key={store.id} className="card store-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{store.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '15px', flex: 1 }}>{store.address}</p>
            
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>Overall Rating:</span>
                <span>{store.averageRating ? Number(store.averageRating).toFixed(1) : 'No ratings'}</span>
              </div>
            </div>

            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {store.myRating ? 'Your Rating' : 'Rate this store'}
              </p>
              <RatingStars 
                value={store.myRating || 0} 
                onChange={(val) => {
                  if (store.myRatingId) {
                    handleRatingUpdate(store.myRatingId, val);
                  } else {
                    handleRatingSubmit(store.id, val);
                  }
                }} 
              />
            </div>
          </div>
        ))}
        {stores.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No stores found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStores;
