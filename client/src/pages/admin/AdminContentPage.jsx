import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const emptyState = {
  heroTitle: '',
  heroSubtitle: '',
  aboutText: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  highlights: '',
  gallery: '',
};

const AdminContentPage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyState);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi
      .content(token)
      .then((response) => {
        const content = response.content;
        if (!content) return;
        setForm({
          heroTitle: content.heroTitle || '',
          heroSubtitle: content.heroSubtitle || '',
          aboutText: content.aboutText || '',
          contactEmail: content.contactEmail || '',
          contactPhone: content.contactPhone || '',
          address: content.address || '',
          highlights: (content.highlights || []).join(', '),
          gallery: (content.gallery || []).join(', '),
        });
      })
      .catch(() => {});
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await adminApi.updateContent(
      {
        ...form,
        highlights: form.highlights
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        gallery: form.gallery
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      },
      token
    );
    setMessage('Content updated successfully');
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Brand Story</span>
        <h1>Website content</h1>
      </div>

      {message ? <div className="alert success">{message}</div> : null}

      <form className="card form-stack" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hero title"
          value={form.heroTitle}
          onChange={(event) => setForm((current) => ({ ...current, heroTitle: event.target.value }))}
        />
        <input
          type="text"
          placeholder="Hero subtitle"
          value={form.heroSubtitle}
          onChange={(event) =>
            setForm((current) => ({ ...current, heroSubtitle: event.target.value }))
          }
        />
        <textarea
          rows="4"
          placeholder="About text"
          value={form.aboutText}
          onChange={(event) => setForm((current) => ({ ...current, aboutText: event.target.value }))}
        />
        <div className="grid-2">
          <input
            type="email"
            placeholder="Contact email"
            value={form.contactEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, contactEmail: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Contact phone"
            value={form.contactPhone}
            onChange={(event) =>
              setForm((current) => ({ ...current, contactPhone: event.target.value }))
            }
          />
        </div>
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
        />
        <input
          type="text"
          placeholder="Highlights (comma separated)"
          value={form.highlights}
          onChange={(event) =>
            setForm((current) => ({ ...current, highlights: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Gallery image URLs (comma separated)"
          value={form.gallery}
          onChange={(event) => setForm((current) => ({ ...current, gallery: event.target.value }))}
        />
        <button className="primary-button" type="submit">
          Save content
        </button>
      </form>
    </div>
  );
};

export default AdminContentPage;
