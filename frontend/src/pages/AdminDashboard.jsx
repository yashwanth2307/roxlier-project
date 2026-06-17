import React, { useState, useEffect } from 'react';
import api from '../helpers/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <div className="stats-container" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="card stat-card" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>{stats.users}</p>
        </div>
        <div className="card stat-card" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h3>Total Stores</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>{stats.stores}</p>
        </div>
        <div className="card stat-card" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h3>Total Ratings</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>{stats.ratings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
