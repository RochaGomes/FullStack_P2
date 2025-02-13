require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const cache = new NodeCache({ stdTTL: 300 }); // Cache com TTL de 5 minutos

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());

// Conectar ao MongoDB com pooling de conexões
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Define o tamanho do pool de conexões
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Rota de registro com validação
app.post('/register',
  body('username').isLength({ min: 3 }).withMessage('Usuário deve ter pelo menos 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  }
);

// Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log(`Falha no login para usuário: ${username}`);
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acesso negado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Rota de busca com cache
app.get('/search', authenticate, (req, res) => {
  const cachedData = cache.get('searchData');
  if (cachedData) {
    return res.json({ message: 'Busca realizada com sucesso (cache)', data: cachedData });
  }
  const searchData = { result: 'Dados de busca...' };
  cache.set('searchData', searchData);
  res.json({ message: 'Busca realizada com sucesso', data: searchData });
});

// Rota de inserção protegida
app.post('/insert', authenticate, (req, res) => {
  console.log(`Usuário ${req.user.userId} inseriu dados`);
  res.json({ message: 'Dados inseridos com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
