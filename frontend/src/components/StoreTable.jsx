import React from 'react';

const StoreTable = ({ stores, sortBy, order, onSort }) => {
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
            <th>Average Rating</th>
            <th>My Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.averageRating ? Number(store.averageRating).toFixed(1) : 'No ratings'}</td>
              <td>{store.myRating ? store.myRating : 'Not rated'}</td>
            </tr>
          ))}
          {stores.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No stores found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
