import React, { useState } from 'react';
import axios from 'axios';

const Insert = () => {
    const [name, setName] = useState('');

    const handleInsert = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Obter o token do localStorage

        try {
            await axios.post('http://localhost:5000/api/users/insert', { name }, {
                headers: { Authorization: token }
            });
            alert('Item inserido com sucesso!');
            setName(''); // Limpar o campo
        } catch (error) {
            alert('Erro ao inserir: ' + error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleInsert}>
            <input
                type="text"
                placeholder="Nome do item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <button type="submit">Inserir</button>
        </form>
    );
};

export default Insert;