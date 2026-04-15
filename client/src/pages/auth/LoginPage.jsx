import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form);
      navigate(response.user.role === 'admin' ? '/admin' : '/my-bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="card auth-card form-stack" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login to your account</h1>
        {error ? <div className="alert error">{error}</div> : null}
        <input type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p>
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
