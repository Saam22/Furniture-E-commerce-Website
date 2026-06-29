import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { loginApi, registerApi, getProfileApi, setToken, getToken, getStoredUser, setStoredUser } from '../utils/authApi';

const AuthContext = createContext(null);

const _onLoginRef = { current: null };
const _onLogoutRef = { current: null };

export function setAuthListeners(onLogin, onLogout) {
  _onLoginRef.current = onLogin;
  _onLogoutRef.current = onLogout;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const prevUserRef = useRef(user);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getProfileApi()
      .then(res => {
        setUser(res.data.user);
        setStoredUser(res.data.user);
      })
      .catch(() => {
        setToken(null);
        setStoredUser(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const prev = prevUserRef.current;
    prevUserRef.current = user;
    if (user && !prev) {
      _onLoginRef.current?.();
    } else if (!user && prev) {
      _onLogoutRef.current?.();
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const res = await loginApi(email, password);
    setToken(res.data.token);
    setStoredUser(res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const res = await registerApi(name, email, password, phone);
    setToken(res.data.token);
    setStoredUser(res.data.user);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
