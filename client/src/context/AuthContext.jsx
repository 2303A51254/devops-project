import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);
const STORAGE_KEY = 'aurora-stay-auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setToken(parsed.token);
      setUser(parsed.user);

      authApi
        .me(parsed.token)
        .then((response) => setUser(response.user))
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setToken('');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setLoading(false);
    }
  }, []);

  const persistAuth = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const login = async (form) => {
    const response = await authApi.login(form);
    persistAuth(response);
    return response;
  };

  const signup = async (form) => {
    const response = await authApi.signup(form);
    persistAuth(response);
    return response;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
