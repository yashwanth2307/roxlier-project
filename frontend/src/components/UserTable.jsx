import React from 'react';

const UserTable = ({ users, sortBy, order, onSort }) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <span className="sort-icon">↕️</span>;
    return order === 'ASC' ? <span className="sort-icon active">↑</span> : <span className="sort-icon active">↓</span>;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort('name')}>Name {getSortIcon('name')}</th>
            <th onClick={() => onSort('email')}>Email {getSortIcon('email')}</th>
            <th onClick={() => onSort('address')}>Address {getSortIcon('address')}</th>
            <th onClick={() => onSort('role')}>Role {getSortIcon('role')}</th>
            <th>Store Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>{user.storeRating || 'N/A'}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
