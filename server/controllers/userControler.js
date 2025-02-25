const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
exports.registerUser  = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Função para login
exports.loginUser  = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }



};