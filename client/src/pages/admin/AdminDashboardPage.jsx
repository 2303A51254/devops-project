import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    adminApi.dashboard(token).then(setDashboard).catch(() => {});
  }, [token]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Operations overview</span>
        <h1>Hotel dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span>Total bookings</span>
          <strong>{dashboard?.metrics.totalBookings || 0}</strong>
        </div>
        <div className="card stat-card">
          <span>Pending bookings</span>
          <strong>{dashboard?.metrics.pendingBookings || 0}</strong>
        </div>
        <div className="card stat-card">
          <span>Customers</span>
          <strong>{dashboard?.metrics.totalCustomers || 0}</strong>
        </div>
        <div className="card stat-card">
          <span>Revenue</span>
          <strong>Rs. {dashboard?.metrics.revenue || 0}</strong>
        </div>
      </div>

      <div className="card table-card">
        <h2>Recent bookings</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentBookings?.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.guestName}</td>
                  <td>{booking.roomType?.name}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>Rs. {booking.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
