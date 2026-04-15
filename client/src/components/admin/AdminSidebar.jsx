import { NavLink } from 'react-router-dom';

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <div className="admin-sidebar__brand">
      <span>Admin</span>
      <h2>Aurora Stay</h2>
    </div>
    <nav>
      <NavLink end to="/admin">
        Dashboard
      </NavLink>
      <NavLink to="/admin/rooms">Rooms</NavLink>
      <NavLink to="/admin/availability">Availability</NavLink>
      <NavLink to="/admin/bookings">Bookings</NavLink>
      <NavLink to="/admin/customers">Customers</NavLink>
      <NavLink to="/admin/content">Content</NavLink>
    </nav>
  </aside>
);

export default AdminSidebar;
