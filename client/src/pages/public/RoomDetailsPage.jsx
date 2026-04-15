import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { roomApi } from '../../api/services';

const RoomDetailsPage = () => {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    roomApi.details(slug).then((response) => setRoom(response.room)).catch(() => {});
  }, [slug]);

  if (!room) {
    return <div className="screen-state">Loading room details...</div>;
  }

  return (
    <div className="content-section">
      <div className="container detail-layout">
        <div className="detail-gallery">
          {room.images?.map((image) => (
            <img key={image} src={image} alt={room.name} />
          ))}
        </div>
        <div className="detail-panel card">
          <span className="eyebrow">Signature room</span>
          <h1>{room.name}</h1>
          <p>{room.description}</p>
          <div className="pill-row">
            <span>{room.capacity} guests</span>
            <span>{room.size}</span>
            <span>Rs. {room.basePrice} / night</span>
          </div>
          <div className="amenity-list">
            {room.amenities?.map((amenity) => (
              <span key={amenity}>{amenity}</span>
            ))}
          </div>
          <Link className="primary-button" to={`/booking?roomTypeId=${room._id}`}>
            Reserve this room
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
