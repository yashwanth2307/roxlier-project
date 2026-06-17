import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <span className="navbar-brand">StoreRater</span>
      <div className="navbar-links">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
            <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
            <Link to="/admin/stores" className={isActive('/admin/stores')}>Stores</Link>
          </>
        )}
        {user?.role === 'user' && (
          <Link to="/stores" className={isActive('/stores')}>Stores</Link>
        )}
        {user?.role === 'owner' && (
          <Link to="/owner" className={isActive('/owner')}>Dashboard</Link>
        )}
        <Link to="/password" className={isActive('/password')}>Change Password</Link>
      </div>
      <div className="navbar-user">
        <div className="navbar-user-info">
          <strong>{user?.name}</strong>
          <span> ({user?.role})</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
