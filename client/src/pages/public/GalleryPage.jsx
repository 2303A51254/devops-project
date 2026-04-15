import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import SectionHeading from '../../components/common/SectionHeading';

const GalleryPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    adminApi.publicContent().then((response) => setImages(response.content?.gallery || [])).catch(() => {});
  }, []);

  return (
    <div className="content-section">
      <div className="container">
        <SectionHeading
          eyebrow="Visual story"
          title="A look inside the Aurora Stay atmosphere"
          text="A warm palette, statement silhouettes, and spaces designed for quiet indulgence."
        />
        <div className="gallery-grid">
          {images.map((image) => (
            <img key={image} src={image} alt="Aurora Stay gallery" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
