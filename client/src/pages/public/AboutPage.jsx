import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import SectionHeading from '../../components/common/SectionHeading';

const AboutPage = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    adminApi.publicContent().then((response) => setContent(response.content)).catch(() => {});
  }, []);

  return (
    <div className="content-section">
      <div className="container narrow-layout">
        <SectionHeading
          eyebrow="About Aurora Stay"
          title="A premium hotel story built around atmosphere and ease"
          text={content?.aboutText}
        />
        <div className="card prose-card">
          <p>
            Aurora Stay is imagined as a modern luxury property where every part of the guest journey feels calm,
            polished, and welcoming. The rooms are spacious, the service is intuitive, and the booking experience is
            designed to feel just as smooth as the stay itself.
          </p>
          <p>
            From elevated dining and spa rituals to family-friendly residences and executive suites, the hotel balances
            warmth and sophistication for business trips, celebrations, and restorative getaways.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
