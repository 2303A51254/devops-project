import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { roomApi } from '../../api/services';
import SectionHeading from '../../components/common/SectionHeading';

const experienceMap = {
  'infinity-pool': {
    label: 'Infinity pool',
    slugs: ['deluxe-horizon-room', 'executive-marina-suite'],
  },
  'spa-rituals': {
    label: 'Spa rituals',
    slugs: ['executive-marina-suite', 'deluxe-horizon-room'],
  },
  'chef-led-dining': {
    label: 'Chef-led dining',
    slugs: ['garden-family-residence', 'deluxe-horizon-room'],
  },
  'private-transfers': {
    label: 'Private transfers',
    slugs: ['executive-marina-suite'],
  },
};

const defaultFilters = {
  checkIn: '',
  checkOut: '',
  guests: '2',
  minPrice: '',
  maxPrice: '',
  experience: '',
};

const RoomsPage = () => {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    guests: params.get('guests') || '2',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    experience: params.get('experience') || '',
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const loadRooms = async (activeFilters) => {
    setLoading(true);
    const query = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && key !== 'experience') query.set(key, value);
    });

    try {
      const response = await roomApi.list(query.toString());
      const selectedExperience = activeFilters.experience;
      const mappedExperience = experienceMap[selectedExperience];
      const nextRooms = mappedExperience
        ? response.rooms.filter((room) => mappedExperience.slugs.includes(room.slug))
        : response.rooms;

      if (selectedExperience) {
        query.set('experience', selectedExperience);
      }

      setRooms(nextRooms);
      setParams(query);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadRooms(filters);
  };

  return (
    <div className="content-section">
      <div className="container">
        <SectionHeading
          eyebrow="Stay selection"
          title="Browse rooms by dates, guests, and budget"
          text={
            filters.experience && experienceMap[filters.experience]
              ? `Showing curated stays for ${experienceMap[filters.experience].label}.`
              : 'Each room type includes premium details, capacity limits, and live availability filtering.'
          }
        />

        {filters.experience && experienceMap[filters.experience] ? (
          <div className="experience-banner">
            <span className="eyebrow">Selected experience</span>
            <strong>{experienceMap[filters.experience].label}</strong>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                const nextFilters = { ...filters, experience: '' };
                setFilters(nextFilters);
                loadRooms(nextFilters);
              }}
            >
              Clear experience filter
            </button>
          </div>
        ) : null}

        <form className="filter-bar" onSubmit={handleSubmit}>
          <input type="date" value={filters.checkIn} onChange={(event) => setFilters((current) => ({ ...current, checkIn: event.target.value }))} />
          <input type="date" value={filters.checkOut} onChange={(event) => setFilters((current) => ({ ...current, checkOut: event.target.value }))} />
          <input type="number" min="1" value={filters.guests} onChange={(event) => setFilters((current) => ({ ...current, guests: event.target.value }))} placeholder="Guests" />
          <input type="number" min="0" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} placeholder="Min price" />
          <input type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} placeholder="Max price" />
          <button className="primary-button" type="submit">
            Search Rooms
          </button>
        </form>

        <div className="room-grid">
          {loading ? <div className="card muted-card">Searching available stays...</div> : null}
          {!loading && hasSearched ? (
            <div className="search-summary">
              {rooms.length
                ? `${rooms.length} room option${rooms.length > 1 ? 's' : ''} found`
                : 'No rooms matched your search'}
            </div>
          ) : null}
          {!loading &&
            rooms.map((room) => (
              <article className="room-card" key={room._id}>
                <img src={room.images?.[0]} alt={room.name} />
                <div className="room-card__body">
                  <div className="room-card__header">
                    <h3>{room.name}</h3>
                    <span>Rs. {room.nightlyRate || room.basePrice} / night</span>
                  </div>
                  <p>{room.description}</p>
                  <div className="pill-row">
                    <span>{room.capacity} guests</span>
                    <span>{room.totalQuantity} total rooms</span>
                    {room.availability !== undefined ? <span>{room.availability} left</span> : null}
                  </div>
                  <div className="button-row">
                    <Link className="ghost-button" to={`/rooms/${room.slug}`}>
                      Details
                    </Link>
                    <Link className="primary-button" to={`/booking?roomTypeId=${room._id}&checkIn=${filters.checkIn}&checkOut=${filters.checkOut}&guests=${filters.guests}`}>
                      Book This Room
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          {!loading && hasSearched && rooms.length === 0 ? (
            <div className="card muted-card">
              No rooms were found for these filters. Try changing guests, dates, or price range.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
