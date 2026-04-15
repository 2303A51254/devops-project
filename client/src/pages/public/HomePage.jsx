import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, roomApi } from '../../api/services';
import SectionHeading from '../../components/common/SectionHeading';

const highlightLinks = {
  'Infinity pool': {
    slug: 'infinity-pool',
    description: 'View stays best paired with poolside relaxation and skyline leisure.',
  },
  'Spa rituals': {
    slug: 'spa-rituals',
    description: 'Explore rooms designed for restorative stays and wellness-led comfort.',
  },
  'Chef-led dining': {
    slug: 'chef-led-dining',
    description: 'Browse rooms that fit culinary getaways and elevated dining experiences.',
  },
  'Private transfers': {
    slug: 'private-transfers',
    description: 'See the most seamless options for premium arrivals and executive stays.',
  },
};

const HomePage = () => {
  const [content, setContent] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    adminApi.publicContent().then((response) => setContent(response.content)).catch(() => {});
    roomApi
      .list('featured=true')
      .then((response) => setRooms(response.rooms.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Luxury city retreat</span>
            <h1>{content?.heroTitle || 'Aurora Stay'}</h1>
            <p>
              {content?.heroSubtitle ||
                'Layered interiors, a calm booking journey, and the comfort of a modern boutique destination.'}
            </p>
            <div className="button-row">
              <Link className="primary-button" to="/booking">
                Reserve Your Stay
              </Link>
              <Link className="ghost-button light" to="/rooms">
                Explore Rooms
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-stat">
              <span>24/7 concierge</span>
              <strong>Personalized arrivals</strong>
            </div>
            <div className="hero-stat">
              <span>Premium suites</span>
              <strong>Curated stays for every mood</strong>
            </div>
            <div className="hero-stat">
              <span>Flexible booking</span>
              <strong>Guest checkout and account booking</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <SectionHeading
            eyebrow="Signature spaces"
            title="Rooms crafted for quiet luxury"
            text="Choose from intimate king rooms, statement suites, and family-ready residences with date-based availability."
          />
          <div className="room-grid">
            {rooms.map((room) => (
              <article className="room-card" key={room._id}>
                <img src={room.images?.[0]} alt={room.name} />
                <div className="room-card__body">
                  <div className="room-card__header">
                    <h3>{room.name}</h3>
                    <span>From Rs. {room.basePrice}</span>
                  </div>
                  <p>{room.shortDescription}</p>
                  <div className="pill-row">
                    <span>{room.capacity} guests</span>
                    <span>{room.totalQuantity} rooms</span>
                    <span>{room.size}</span>
                  </div>
                  <Link className="inline-link" to={`/rooms/${room.slug}`}>
                    View room details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="split-banner">
        <div className="container split-banner__grid">
          <div>
            <SectionHeading
              eyebrow="Moments that feel elevated"
              title="Dining, spa, poolside calm, and thoughtful service"
              text={content?.aboutText}
            />
            <Link className="primary-button" to="/about">
              Discover the hotel
            </Link>
          </div>
          <div className="highlight-stack">
            {(content?.highlights || ['Infinity pool', 'Spa rituals', 'Chef-led dining', 'Private transfers']).map(
              (item) => (
                <Link
                  className="highlight-card highlight-card--interactive"
                  key={item}
                  to={`/rooms?experience=${highlightLinks[item]?.slug || encodeURIComponent(item.toLowerCase())}`}
                >
                  <span>{item}</span>
                  <p>{highlightLinks[item]?.description || 'Open matching stays for this experience.'}</p>
                  <strong>View matching stays</strong>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
