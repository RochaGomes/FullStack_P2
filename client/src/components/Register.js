import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/register', { username, password });
            alert('Usuário registrado com sucesso!');
        } catch (error) {
            alert('Erro ao registrar: ' + error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="Usuário" onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default Register;