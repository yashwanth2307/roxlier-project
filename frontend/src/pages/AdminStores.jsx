import React, { useState, useEffect } from 'react';
import api from '../helpers/api';
import StoreTable from '../components/StoreTable';
import AddStoreForm from '../components/AddStoreForm';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [filters, sort]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({ ...filters, ...sort });
      const response = await api.get(`/stores?${params.toString()}`);
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?role=owner');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (field) => {
    setSort(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handleAddStore = async (data) => {
    try {
      await api.post('/stores', data);
      setShowAddModal(false);
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Stores</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add Store</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>Filters</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} className="filter-input" />
          <input type="text" name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} className="filter-input" />
        </div>
      </div>

      <div className="card">
        <StoreTable stores={stores} sortBy={sort.sortBy} order={sort.order} onSort={handleSort} />
      </div>

      {showAddModal && <AddStoreForm users={users} onSubmit={handleAddStore} onCancel={() => setShowAddModal(false)} />}
    </div>
  );
};

export default AdminStores;
