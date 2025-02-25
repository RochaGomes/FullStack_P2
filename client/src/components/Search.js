import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Obter o token do localStorage

        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
                headers: { Authorization: token }
            });
            setResults(response.data);
        } catch (error) {
            alert('Erro ao buscar: ' + error.response.data.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <button type="submit">Buscar</button>
            </form>
            <ul>
                {results.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;