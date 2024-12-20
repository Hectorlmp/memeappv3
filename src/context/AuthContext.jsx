import React, { createContext, useContext, useState, useEffect } from 'react';

// Exportamos AuthContext para poder utilizarlo en otros archivos
export const AuthContext = createContext();

// Custom hook para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Almacenamos el token en localStorage si está disponible
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Función para iniciar sesión
  const iniciarSesion = async (usuario, contrasena) => {
    setLoading(true);
    setError(null);

    try {
      const respuesta = await fetch('https://memes-api.grye.org/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: usuario,
          password: contrasena,
        }).toString(),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setToken(data.access_token);
        return [data, null]; // Éxito: devuelve el token
      } else {
        setError('Credenciales incorrectas');
        return [null, 'Credenciales incorrectas']; // Error: credenciales incorrectas
      }
    } catch (error) {
      setError(error.message || 'Error inesperado');
      return [null, error.message || 'Error inesperado']; // Error: en la solicitud
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setToken(null); // Establecer el token a null
  };

  return (
    <AuthContext.Provider value={{ token, iniciarSesion, cerrarSesion, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
