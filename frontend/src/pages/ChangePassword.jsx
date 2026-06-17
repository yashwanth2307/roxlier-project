import React, { useState } from 'react';
import api from '../helpers/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}/.test(formData.newPassword)) {
      setError('New password must be 8-16 characters, include an uppercase letter and a special character');
      return;
    }

    try {
      await api.put('/auth/change-password', formData);
      setSuccess('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '500px', margin: '40px auto', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Change Password</h2>
        {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
        {success && <div style={{ color: '#16a34a', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              value={formData.currentPassword} 
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={formData.newPassword} 
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
