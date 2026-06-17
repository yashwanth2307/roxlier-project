import React, { useState, useEffect } from 'react';
import api from '../helpers/api';
import UserTable from '../components/UserTable';
import AddUserForm from '../components/AddUserForm';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters, sort]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ ...filters, ...sort });
      const response = await api.get(`/users?${params.toString()}`);
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

  const handleAddUser = async (data) => {
    try {
      await api.post('/users', data);
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Users</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add User</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>Filters</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} className="filter-input" />
          <input type="text" name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} className="filter-input" />
          <input type="text" name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} className="filter-input" />
          <select name="role" value={filters.role} onChange={handleFilterChange} className="filter-input">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      <div className="card">
        <UserTable users={users} sortBy={sort.sortBy} order={sort.order} onSort={handleSort} />
      </div>

      {showAddModal && <AddUserForm onSubmit={handleAddUser} onCancel={() => setShowAddModal(false)} />}
    </div>
  );
};

export default AdminUsers;
