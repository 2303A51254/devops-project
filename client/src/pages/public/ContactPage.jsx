import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import SectionHeading from '../../components/common/SectionHeading';

const ContactPage = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    adminApi.publicContent().then((response) => setContent(response.content)).catch(() => {});
  }, []);

  return (
    <div className="content-section">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Plan your arrival, stay, or celebration"
            text="Our team can help with room selection, special requests, airport pickup, and event-ready stays."
          />
          <div className="card contact-card">
            <p>Email: {content?.contactEmail || 'hello@aurorastay.com'}</p>
            <p>Phone: {content?.contactPhone || '+91 98765 43210'}</p>
            <p>Address: {content?.address || '18 Skyline Avenue, Bengaluru, India'}</p>
          </div>
        </div>
        <form className="card form-stack">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Email address" />
          <input type="tel" placeholder="Phone number" />
          <textarea rows="5" placeholder="Tell us how we can help" />
          <button className="primary-button" type="button">
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
