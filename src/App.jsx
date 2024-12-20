import React from "react";
import RegisterUser from "./componentes/RegisterUser";
import VerMemes from "./componentes/VerMemes";
import SubirMeme from "./componentes/SubirMeme";
import LoginUser from "./componentes/LoginUser";
import { AuthProvider } from "./context/AuthContext"; // Asegúrate de importar correctamente AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <div style={{ textAlign: "center" }}>
        <h1>Bienvenidos a memes Ula 🎉</h1>

        <RegisterUser />
        <VerMemes />
        <SubirMeme />
        <LoginUser />
      </div>
    </AuthProvider>
  );
};

export default App;
