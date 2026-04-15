import { useEffect, useState } from 'react';
import { adminApi, roomApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const AvailabilityPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [form, setForm] = useState({
    roomType: '',
    date: '',
    availableQuantity: '',
    priceOverride: '',
  });

  const loadData = async () => {
    const [roomsResponse, overrideResponse] = await Promise.all([
      roomApi.list(),
      adminApi.availabilityList(token),
    ]);
    setRooms(roomsResponse.rooms);
    setOverrides(overrideResponse.overrides);
  };

  useEffect(() => {
    loadData().catch(() => {});
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await adminApi.upsertAvailability(
      {
        ...form,
        availableQuantity: form.availableQuantity ? Number(form.availableQuantity) : undefined,
        priceOverride: form.priceOverride ? Number(form.priceOverride) : undefined,
      },
      token
    );
    setForm({ roomType: '', date: '', availableQuantity: '', priceOverride: '' });
    loadData().catch(() => {});
  };

  const removeOverride = async (id) => {
    await adminApi.deleteAvailability(id, token);
    loadData().catch(() => {});
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Pricing Control</span>
        <h1>Availability and nightly overrides</h1>
      </div>

      <form className="card form-stack" onSubmit={handleSubmit}>
        <select
          value={form.roomType}
          onChange={(event) => setForm((current) => ({ ...current, roomType: event.target.value }))}
        >
          <option value="">Select room type</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name}
            </option>
          ))}
        </select>
        <div className="grid-3">
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Available quantity"
            value={form.availableQuantity}
            onChange={(event) =>
              setForm((current) => ({ ...current, availableQuantity: event.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Price override"
            value={form.priceOverride}
            onChange={(event) => setForm((current) => ({ ...current, priceOverride: event.target.value }))}
          />
        </div>
        <button className="primary-button" type="submit">
          Save override
        </button>
      </form>

      <div className="data-list">
        {overrides.map((override) => (
          <article className="card booking-item" key={override._id}>
            <div>
              <h3>{override.roomType?.name}</h3>
              <p>{new Date(override.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Available: {override.availableQuantity ?? 'default'}</p>
              <p>Rate: {override.priceOverride ? `Rs. ${override.priceOverride}` : 'default'}</p>
            </div>
            <button className="primary-button" type="button" onClick={() => removeOverride(override._id)}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityPage;
