import React, { useState, useContext, useEffect } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import { Button, TextInput, Textarea, FileInput, Notification, Modal, Tooltip } from "@mantine/core";

const subirMeme = async (token, titulo, descripcion, imagen) => {
  console.log("Intentando subir meme...");

  try {
    const urlBase = "https://memes-api.grye.org";
    const url = `${urlBase}/memes/?title=${encodeURIComponent(titulo)}&description=${encodeURIComponent(descripcion)}`;

    const dataFormulario = new FormData();
    dataFormulario.append("file", imagen);

    const headers = { Authorization: `Bearer ${token}` };

    const respuesta = await fetch(url, {
      method: "POST",
      headers: headers,
      body: dataFormulario,
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      console.error("Error al subir meme:", errorData);
      return [null, errorData.message || "Error al subir meme"];
    }

    const newMeme = await respuesta.json();
    return [newMeme, null];
  } catch (error) {
    console.error("Error en la función de subida:", error);
    return [null, error.message || "Error al subir meme"];
  }
};

const SubirMeme = ({ onMemesUpdated }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setMensaje({ text: "Debes iniciar sesión para subir un meme.", color: "red" });
    }
  }, [token]);

  const handleUpload = async () => {
    if (!token) {
      setMensaje({ text: "Debes iniciar sesión para subir un meme.", color: "red" });
      return;
    }

    if (!titulo || !descripcion || !imagen) {
      setMensaje({ text: "Todos los campos son requeridos.", color: "red" });
      return;
    }

    setCargando(true);

    const [response, error] = await subirMeme(token, titulo, descripcion, imagen);

    if (error) {
      setMensaje({ text: error, color: "red" });
    } else {
      setMensaje({ text: "Meme subido correctamente.", color: "green" });
      if (onMemesUpdated) {
        onMemesUpdated(response);
      }
    }

    setCargando(false);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", position: "relative" }}>
      {!token && (
        <Notification color="red" style={{ marginBottom: "10px" }}>
          Debes iniciar sesión para poder subir un meme.
        </Notification>
      )}

      <Modal
        opened={formVisible && !!token}
        onClose={() => setFormVisible(false)}
        title="Subir Meme"
        centered
        size="lg"
      >
        <TextInput
          label="Título"
          placeholder="Ingrese el título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <Textarea
          label="Descripción"
          placeholder="Ingrese la descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <FileInput
          label="Selecciona una imagen"
          value={imagen}
          onChange={setImagen}
          accept="image/*"
          required
        />
        <Button
          onClick={handleUpload}
          style={{ marginTop: "20px" }}
          loading={cargando}
          disabled={cargando || !token}
        >
          Subir Meme
        </Button>
      </Modal>

      {token && (
        <Tooltip label="Subir un meme" position="left" withArrow>
          <Button
            onClick={() => setFormVisible(true)}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
            variant="outline"
          >
            <FaFileArrowUp size={30} />
          </Button>
        </Tooltip>
      )}

      {mensaje && (
        <Notification color={mensaje.color} style={{ marginTop: "20px" }}>
          {mensaje.text}
        </Notification>
      )}
    </div>
  );
};

export default SubirMeme;
