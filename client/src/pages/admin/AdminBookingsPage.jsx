import { useEffect, useState } from 'react';
import { bookingApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const bookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'pay_at_hotel', 'mock_paid'];

const AdminBookingsPage = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => bookingApi.list(token).then((response) => setBookings(response.bookings));

  useEffect(() => {
    loadBookings().catch(() => {});
  }, [token]);

  const updateBooking = async (booking, updates) => {
    await bookingApi.update(booking._id, updates, token);
    loadBookings().catch(() => {});
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Reservations</span>
        <h1>Manage bookings</h1>
      </div>

      <div className="card table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Booking status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingReference}</td>
                  <td>
                    {booking.guestName}
                    <br />
                    {booking.guestEmail}
                  </td>
                  <td>{booking.roomType?.name}</td>
                  <td>
                    {new Date(booking.checkIn).toLocaleDateString()}
                    <br />
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      value={booking.bookingStatus}
                      onChange={(event) =>
                        updateBooking(booking, {
                          bookingStatus: event.target.value,
                          paymentStatus: booking.paymentStatus,
                        })
                      }
                    >
                      {bookingStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={booking.paymentStatus}
                      onChange={(event) =>
                        updateBooking(booking, {
                          bookingStatus: booking.bookingStatus,
                          paymentStatus: event.target.value,
                        })
                      }
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
