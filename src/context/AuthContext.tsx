import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser, healthCheck, AuthResponse, User } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'govai_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  // Warm up backend on mount (handles Render cold starts)
  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        await healthCheck();
        setBackendReady(true);
      } catch (error) {
        console.log('Backend warming up...');
        // Retry after a delay
        setTimeout(async () => {
          try {
            await healthCheck();
            setBackendReady(true);
          } catch {
            setBackendReady(true); // Continue anyway
          }
        }, 5000);
      }
    };
    warmUpBackend();
  }, []);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const userData = await getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      // Token invalid, clear it
      console.error('Failed to fetch user:', error);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await loginUser(email, password);

    // Store token
    localStorage.setItem(TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response: AuthResponse = await registerUser(email, password, name);

    // Store token
    localStorage.setItem(TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    backendReady,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
