const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const Usuario = require('./models/Usuario');

const app = express();
app.use(express.json());
app.use(cors());

// link de conexão com o mongoDB
const MONGO_URI = process.env.MONGO_URI;
// Configuração DNS alternativa para resolveu o problema de conexão com o banco de dados
const dns = require('dns');
dns.setServers(['8.8.8.8']);


if (!MONGO_URI) {
    console.error('Erro: A variável MONGO_URI não está definida no arquivo .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao monguinho com su su sucesso!! c: '))
    .catch((err) => console.error('Erro ao conectar com o monguinho :c :c', err));

// rota de cadastro de usuário
app.post('/api/usuarios/cadastro', async (req, res) => {
    try {
        const { nomeUsuario, emailUsuario, senhaUsuario, notificacaoUsuario, fotoUsuario } = req.body;

        // verifica se o email já existe ou não (tratando email em minúsculo)
        const emailFormatado = emailUsuario.toLowerCase();
        const usuarioExiste = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        // criptografando a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senhaUsuario, salt);

        const novoUsuario = new Usuario({
            nomeUsuario,
            emailUsuario: emailFormatado,
            senhaUsuario: senhaCriptografada,
            notificacaoUsuario: notificacaoUsuario ?? true,
            fotoUsuario: fotoUsuario || ''
        });

        await novoUsuario.save();
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor ao cadastrar usuário.', detalhes: error.message });
    }
});

// rota de login
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { emailUsuario, senhaUsuario } = req.body;
        const emailFormatado = emailUsuario.toLowerCase();

        // buscando usuário pelo email
        const usuario = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // validando senha, sendo comparada com a criptografia
        const senhaValida = await bcrypt.compare(senhaUsuario, usuario.senhaUsuario);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                nome: usuario.nomeUsuario,
                email: usuario.emailUsuario,
                foto: usuario.fotoUsuario
            }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor ao realizar login.', detalhes: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor rodando neste budega');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PASSAMO FAMÍLIA`);
    console.log(`O servidor está rodando na porta: ${PORT}`);
});