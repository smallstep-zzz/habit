import { Outlet, NavLink } from 'react-router-dom';
import { CheckCircle, ListChecks, User } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-container">
      <div className="content-area">
        <Outlet />
      </div>
      <nav className="bottom-nav glass">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <CheckCircle size={24} />
          <span>오늘</span>
        </NavLink>
        <NavLink to="/management" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ListChecks size={24} />
          <span>습관관리</span>
        </NavLink>
        <NavLink to="/account" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>계정</span>
        </NavLink>
      </nav>
    </div>
  );
}
