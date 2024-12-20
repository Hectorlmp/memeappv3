import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Container, Modal, Text, Tooltip } from '@mantine/core'; 
import axios from 'axios';
import { MdOutlineGroupAdd } from 'react-icons/md'; 

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '', 
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const [showForm, setShowForm] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor, repítelas correctamente.');
      setSuccessMessage(null); 
      return;
    }

    try {
      const response = await axios.post('https://memes-api.grye.org/register', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });
      console.log('User registered successfully:', response.data);
      setSuccessMessage('¡Registro exitoso!'); 
      setError(null);
      setFormData({ username: '', password: '', confirmPassword: '' }); 
    } catch (error) {
      console.error('There was an error registering the user:', error.response.data);
      setError('Error al registrar usuario');
      setSuccessMessage(null);
    }
  };

  return (
    <Container size={420} my={40}>
      {}
      <Tooltip label="Registrar Usuario" position="left" withArrow>
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{
            position: 'fixed',
            bottom: 100, 
            top: 350,
            right: 20,
            zIndex: 10,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            padding: 0,
            backgroundColor: '#1E88E5',
          }}
        >
          <MdOutlineGroupAdd size={30} style={{ color: 'white' }} /> {}
        </Button>
      </Tooltip>

      {}
      <Modal
        opened={showForm}
        onClose={() => setShowForm(false)}
        title="Regístrate"
        centered
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nombre de usuario"
            placeholder="Tu nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            mt="md"
          />
          <PasswordInput
            label="Confirmar Contraseña"
            placeholder="Confirma tu contraseña"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            mt="md"
          />
          {error && <Text color="red" size="sm">{error}</Text>}
          {successMessage && <Text color="green" size="sm" mt="md">{successMessage}</Text>} {/* Mensaje de éxito */}
          <Button fullWidth mt="xl" type="submit">
            Registrarse
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default RegisterUser;
