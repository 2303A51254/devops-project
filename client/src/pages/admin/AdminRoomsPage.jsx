import { useEffect, useState } from 'react';
import { roomApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const emptyRoom = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  images: '',
  amenities: '',
  basePrice: '',
  capacity: '',
  totalQuantity: '',
  size: '',
};

const AdminRoomsPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');

  const loadRooms = () => roomApi.list().then((response) => setRooms(response.rooms));

  useEffect(() => {
    loadRooms().catch(() => {});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
      amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      basePrice: Number(form.basePrice),
      capacity: Number(form.capacity),
      totalQuantity: Number(form.totalQuantity),
    };

    if (editingId) {
      await roomApi.update(editingId, payload, token);
      setMessage('Room updated');
    } else {
      await roomApi.create(payload, token);
      setMessage('Room created');
    }

    setForm(emptyRoom);
    setEditingId('');
    loadRooms();
  };

  const startEdit = (room) => {
    setEditingId(room._id);
    setForm({
      ...room,
      images: room.images.join(', '),
      amenities: room.amenities.join(', '),
    });
  };

  const removeRoom = async (id) => {
    await roomApi.remove(id, token);
    setMessage('Room removed');
    loadRooms();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Inventory</span>
        <h1>Manage room types</h1>
      </div>

      {message ? <div className="alert success">{message}</div> : null}

      <form className="card form-stack" onSubmit={handleSubmit}>
        <div className="grid-2">
          <input type="text" placeholder="Room name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input type="text" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
        </div>
        <input type="text" placeholder="Short description" value={form.shortDescription} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} />
        <textarea rows="4" placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        <div className="grid-3">
          <input type="number" placeholder="Base price" value={form.basePrice} onChange={(event) => setForm((current) => ({ ...current, basePrice: event.target.value }))} />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))} />
          <input type="number" placeholder="Total quantity" value={form.totalQuantity} onChange={(event) => setForm((current) => ({ ...current, totalQuantity: event.target.value }))} />
        </div>
        <div className="grid-2">
          <input type="text" placeholder="Room size" value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
          <input type="text" placeholder="Image URLs (comma separated)" value={form.images} onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))} />
        </div>
        <input type="text" placeholder="Amenities (comma separated)" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
        <button className="primary-button" type="submit">
          {editingId ? 'Update room' : 'Create room'}
        </button>
      </form>

      <div className="data-list">
        {rooms.map((room) => (
          <article className="card booking-item" key={room._id}>
            <div>
              <h3>{room.name}</h3>
              <p>{room.shortDescription}</p>
            </div>
            <div>
              <p>Rs. {room.basePrice}</p>
              <p>{room.totalQuantity} rooms</p>
            </div>
            <div className="button-row">
              <button className="ghost-button" type="button" onClick={() => startEdit(room)}>
                Edit
              </button>
              <button className="primary-button" type="button" onClick={() => removeRoom(room._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminRoomsPage;
