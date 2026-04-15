import { useEffect, useState } from 'react';
import { bookingApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import SectionHeading from '../../components/common/SectionHeading';

const MyBookingsPage = () => {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingApi.mine(token).then((response) => setBookings(response.bookings)).catch(() => {});
  }, [token]);

  return (
    <div className="content-section">
      <div className="container">
        <SectionHeading
          eyebrow="Guest account"
          title={`Welcome back, ${user?.name || 'Guest'}`}
          text="Track upcoming reservations, stay details, and payment status from one place."
        />
        <div className="data-list">
          {bookings.map((booking) => (
            <article className="card booking-item" key={booking._id}>
              <div>
                <h3>{booking.roomType?.name}</h3>
                <p>Reference: {booking.bookingReference}</p>
              </div>
              <div>
                <p>{new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p>Status: {booking.bookingStatus}</p>
              </div>
              <div>
                <p>Total: Rs. {booking.total}</p>
                <p>Payment: {booking.paymentStatus}</p>
              </div>
            </article>
          ))}
          {!bookings.length ? <div className="card muted-card">No bookings yet. Your future stays will appear here.</div> : null}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
