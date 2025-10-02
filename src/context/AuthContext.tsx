import { clearTokens, getRefreshToken, getUser, setAccessToken, setIdToken, setRefreshToken } from "../services/tokenService";
import { createContext, useCallback, useEffect, useState } from "react";
import type { User } from "../utils/types/users";
import { navigateTo } from "../services/navigateService";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isRestoring: boolean;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string, idToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isRestoring, setIsRestoring] = useState(true);

  const logout = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
  }, []);

  const login = (user: User, accessToken: string, refreshToken: string, idToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIdToken(idToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const restoreSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    const storedUser = getUser();
    console.log('Restoring session...');
    if (!storedUser) {
      setIsRestoring(false);
      return logout();
    }
    try {
      const parsedUser = JSON.parse(storedUser) as User;
      
      if (refreshToken) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        return logout();
      }
    } catch (error) {
      console.error('Session restore failed:', error);
      return logout();
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const checkAuth = useCallback(() => {
    const refreshToken = getRefreshToken();
    const storedUser = getUser();

    if(!refreshToken || !storedUser) return logout();
    restoreSession();
    navigateTo('/');
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isRestoring, setUser, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
