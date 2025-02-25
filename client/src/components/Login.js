import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
            localStorage.setItem('token', response.data.token); // Armazenar token
            alert('Login bem-sucedido!');
        } catch (error) {
            alert('Erro ao fazer login: ' + error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="Usuário" onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;