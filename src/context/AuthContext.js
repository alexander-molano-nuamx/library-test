import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'auth_user';

// Credenciales de prueba (en producción esto viene del backend)
const TEST_CREDENTIALS = {
  email: 'usertest@gmail.com',
  password: 'q1w2e3R4'
};

// Función para obtener la IP real del usuario
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'No disponible';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Función de login
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // Aquí iría la llamada a tu API real
      // const response = await api.post('/auth/login', { email, password });
      // const userData = response.data;

      // Validación de credenciales
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (email !== TEST_CREDENTIALS.email || password !== TEST_CREDENTIALS.password) {
        throw new Error('Credenciales incorrectas');
      }

      // Obtener IP real del usuario
      const clientIP = await getClientIP();

      // Obtener datos de sesión anterior (si existe)
      const previousSession = localStorage.getItem(AUTH_STORAGE_KEY);
      const previousData = previousSession ? JSON.parse(previousSession) : null;

      const userData = {
        id: '1',
        email,
        name: 'Usuario Test',
        role: 'user',
        ip: clientIP,
        currentLogin: new Date().toISOString(),
        lastLogin: previousData?.currentLogin || null, // Última conexión anterior
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  // Función para actualizar datos del usuario
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Verificar si está autenticado
  const isAuthenticated = !!user;

  // Memoizar el valor del contexto
  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }), [user, isLoading, isAuthenticated, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}