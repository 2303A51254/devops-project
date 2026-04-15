import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingApi, roomApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const steps = ['Stay details', 'Guest details', 'Payment', 'Confirmation'];

const BookingPage = () => {
  const [params] = useSearchParams();
  const { token, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    roomTypeId: params.get('roomTypeId') || '',
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    roomsReserved: '1',
    guestCount: params.get('guests') || '2',
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || '',
    specialRequests: '',
    paymentChoice: 'pay_at_hotel',
  });

  useEffect(() => {
    roomApi.list().then((response) => setRooms(response.rooms)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        guestName: current.guestName || user.name,
        guestEmail: current.guestEmail || user.email,
        guestPhone: current.guestPhone || user.phone || '',
      }));
    }
  }, [user]);

  const selectedRoom = useMemo(() => rooms.find((room) => room._id === form.roomTypeId), [form.roomTypeId, rooms]);

  const checkAvailability = async () => {
    if (!form.roomTypeId || !form.checkIn || !form.checkOut) {
      setError('Please choose a room and travel dates first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const query = new URLSearchParams({
        roomTypeId: form.roomTypeId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
      });
      const response = await roomApi.availability(query.toString());
      setAvailability(response);
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = () => {
    if (!form.guestName || !form.guestEmail || !form.guestPhone) {
      setError('Please complete guest contact details.');
      return;
    }

    setError('');
    setStep(2);
  };

  const placeBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bookingApi.create(
        {
          ...form,
          roomsReserved: Number(form.roomsReserved),
          guestCount: Number(form.guestCount),
        },
        token || undefined
      );
      setSuccess(response.booking);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <div className="container booking-layout">
        <div className="booking-sidebar card">
          <span className="eyebrow">Reservation flow</span>
          <h1>Book your Aurora Stay</h1>
          <div className="step-list">
            {steps.map((label, index) => (
              <div className={`step-item ${index === step ? 'active' : ''}`} key={label}>
                <strong>0{index + 1}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          {selectedRoom ? (
            <div className="summary-card">
              <h3>{selectedRoom.name}</h3>
              <p>Rs. {selectedRoom.basePrice} / night</p>
              <p>{selectedRoom.capacity} guests per room</p>
            </div>
          ) : null}
        </div>

        <div className="booking-panel card">
          {error ? <div className="alert error">{error}</div> : null}
          {step === 0 ? (
            <div className="form-stack">
              <h2>Select your stay</h2>
              <select value={form.roomTypeId} onChange={(event) => setForm((current) => ({ ...current, roomTypeId: event.target.value }))}>
                <option value="">Select room type</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <div className="grid-2">
                <input type="date" value={form.checkIn} onChange={(event) => setForm((current) => ({ ...current, checkIn: event.target.value }))} />
                <input type="date" value={form.checkOut} onChange={(event) => setForm((current) => ({ ...current, checkOut: event.target.value }))} />
              </div>
              <div className="grid-2">
                <input type="number" min="1" value={form.roomsReserved} onChange={(event) => setForm((current) => ({ ...current, roomsReserved: event.target.value }))} placeholder="Rooms" />
                <input type="number" min="1" value={form.guestCount} onChange={(event) => setForm((current) => ({ ...current, guestCount: event.target.value }))} placeholder="Guests" />
              </div>
              <button className="primary-button" type="button" onClick={checkAvailability} disabled={loading}>
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="form-stack">
              <h2>Guest details</h2>
              {availability ? <div className="alert success">Availability confirmed. Minimum remaining rooms for your dates: {availability.minRemaining}</div> : null}
              <input type="text" value={form.guestName} onChange={(event) => setForm((current) => ({ ...current, guestName: event.target.value }))} placeholder="Full name" />
              <div className="grid-2">
                <input type="email" value={form.guestEmail} onChange={(event) => setForm((current) => ({ ...current, guestEmail: event.target.value }))} placeholder="Email address" />
                <input type="tel" value={form.guestPhone} onChange={(event) => setForm((current) => ({ ...current, guestPhone: event.target.value }))} placeholder="Phone number" />
              </div>
              <textarea rows="4" value={form.specialRequests} onChange={(event) => setForm((current) => ({ ...current, specialRequests: event.target.value }))} placeholder="Special requests" />
              <div className="button-row">
                <button className="ghost-button" type="button" onClick={() => setStep(0)}>
                  Back
                </button>
                <button className="primary-button" type="button" onClick={goToPayment}>
                  Continue to payment
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="form-stack">
              <h2>Payment choice</h2>
              <label className="choice-card">
                <input type="radio" checked={form.paymentChoice === 'pay_at_hotel'} onChange={() => setForm((current) => ({ ...current, paymentChoice: 'pay_at_hotel' }))} />
                <div>
                  <strong>Pay at Hotel</strong>
                  <p>Reserve now and complete payment during check-in.</p>
                </div>
              </label>
              <label className="choice-card">
                <input type="radio" checked={form.paymentChoice === 'online'} onChange={() => setForm((current) => ({ ...current, paymentChoice: 'online' }))} />
                <div>
                  <strong>Online Payment</strong>
                  <p>Use the polished placeholder gateway flow for instant confirmation in this version.</p>
                </div>
              </label>
              <div className="button-row">
                <button className="ghost-button" type="button" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="primary-button" type="button" onClick={placeBooking} disabled={loading}>
                  {loading ? 'Placing booking...' : 'Confirm reservation'}
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 && success ? (
            <div className="form-stack">
              <div className="alert success">
                Booking confirmed. Reference: <strong>{success.bookingReference}</strong>
              </div>
              <h2>Your stay is reserved</h2>
              <p>
                {success.guestName}, your booking for {success.roomType?.name} is recorded from {new Date(success.checkIn).toLocaleDateString()} to {new Date(success.checkOut).toLocaleDateString()}.
              </p>
              <div className="summary-grid">
                <div>
                  <span>Total</span>
                  <strong>Rs. {success.total}</strong>
                </div>
                <div>
                  <span>Payment status</span>
                  <strong>{success.paymentStatus}</strong>
                </div>
                <div>
                  <span>Booking status</span>
                  <strong>{success.bookingStatus}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
