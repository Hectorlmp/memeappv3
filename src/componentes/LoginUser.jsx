import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Notification, Modal, Tooltip } from "@mantine/core"; // Importar Tooltip
import { CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext"; 
const LoginUser = () => {
  const { iniciarSesion, user } = useAuth(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const [_, error] = await iniciarSesion(username, password);
    if (error) {
      setErrorMessage("Error al intentar iniciar sesión: " + error);
    } else {
      setErrorMessage("Sesión iniciada correctamente");
      setShowLogin(false); 
    }
  };

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(""); 
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div>
      {}
      {errorMessage && (
        <Notification
          color={errorMessage.includes("Sesión iniciada") ? "green" : "red"}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: "80%",
            maxWidth: "400px",
          }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Notification>
      )}

      {}
      {user && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            padding: "10px 15px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            border: "1px solid #ddd",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "green",
              marginRight: "10px",
            }}
          ></div>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            {user.username}
          </span>
        </div>
      )}

      {/* Botón circular para abrir el formulario de Login o mostrar el usuario */}
      <Tooltip label={user ? "Usuario conectado" : "Iniciar sesión"} position="left" withArrow>
        <Button
          onClick={() => setShowLogin(!showLogin)}
          style={{
            position: "fixed",
            top: 270,
            right: 20,
            zIndex: 10,
            width: 60,
            height: 60,
            borderRadius: "50%",
            padding: 0,
            backgroundColor: user ? "#4CAF50" : "#1E88E5", // Cambia el color si está logueado
          }}
        >
          <CiUser size={30} color="#fff" />
        </Button>
      </Tooltip>

      {/* Botón de logout si el usuario está autenticado */}
      {user ? (
        <Tooltip label="Cerrar sesión" position="left" withArrow>
          <Button
            onClick={() => alert("Cerrar sesión")} // Implementa la función para cerrar sesión
            style={{
              position: "fixed",
              top: 350,
              right: 20,
              zIndex: 10,
              width: 160,
              height: 50,
              backgroundColor: "#f44336", // Rojo para logout
            }}
          >
            Cerrar sesión
          </Button>
        </Tooltip>
      ) : (
        // Modal para iniciar sesión si no está autenticado
        <Modal
          opened={showLogin}
          onClose={() => setShowLogin(false)}
          title="Iniciar sesión"
          centered
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              mt="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="md"
            />
            <Button type="submit" fullWidth mt="xl">
              Login
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LoginUser;
