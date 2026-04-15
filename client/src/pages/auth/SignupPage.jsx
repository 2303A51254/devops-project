import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(form);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="card auth-card form-stack" onSubmit={handleSubmit}>
        <span className="eyebrow">Create an account</span>
        <h1>Join Aurora Stay</h1>
        {error ? <div className="alert error">{error}</div> : null}
        <input type="text" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <input type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <input type="tel" placeholder="Phone number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
