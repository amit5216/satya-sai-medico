import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * ============================================================
 * AUTH CONTEXT — Global Authentication State
 * ============================================================
 *
 * 🎓 WHAT IS REACT CONTEXT?
 * Context is React's built-in state management for data that
 * needs to be accessible by MANY components at different nesting levels.
 * Without Context, you'd have to pass `isLoggedIn`, `user`, `logout`
 * as props through every component (prop drilling nightmare).
 *
 * 🎓 HOW IT WORKS:
 * 1. AuthProvider wraps the entire app (in main.jsx)
 * 2. Any component can call useAuth() to access auth state
 * 3. When login/logout happens, ALL components re-render with new state
 *
 * 🎓 INTERVIEW: "How do you manage authentication state in React?"
 * → "I use React Context with a custom useAuth hook. The AuthProvider
 *    stores the JWT token and user info in state + localStorage.
 *    On app load, it checks localStorage for an existing token and
 *    validates it with the backend. Any component can access auth
 *    state via the useAuth() hook."
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /**
   * On app load: check if we have a stored token and validate it.
   * If valid → set user state (stay logged in across page refreshes)
   * If invalid/expired → clean up (force re-login)
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Validate token by calling /api/auth/me
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid or expired → clean up
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login: Call backend, store token, set user state.
   */
  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token: newToken, username: uname, role } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser({ username: uname, role });

    return response.data;
  };

  /**
   * Logout: Clear token and user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Check if user is authenticated.
   */
  const isAuthenticated = !!token && !!user;

  /**
   * Check if user has admin role.
   */
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context.
 * Usage: const { user, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
