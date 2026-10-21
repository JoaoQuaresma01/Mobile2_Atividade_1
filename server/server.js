const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Conteudo = require('./models/Conteudo.js');

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
        const emailFormatado = emailUsuario.trim().toLowerCase(); // Adicionei o TRIM para remover os espaços em branco (no começo e no final)
        const usuarioExiste = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        //REGEX para validar a senha (obriga ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial)
        const regexsenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!regexsenha.test(senhaUsuario)) {
            return res.status(400).json({
                erro: 'Senha inválida. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
            });
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
        const emailFormatado = emailUsuario.trim().toLowerCase();

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
                id: String(usuario._id),
                nome: usuario.nomeUsuario,
                email: usuario.emailUsuario,
                foto: usuario.fotoUsuario,
                telefone: usuario.telefone || '',
                cpf: usuario.cpf || '',
                notificacao: usuario.notificacaoUsuario ?? true
            }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor ao realizar login.', detalhes: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor rodando nesta budega');
});

// 
// Rotas para cadastar e listar o conteúdo
//

app.post('/api/conteudo/cadastrar', async (req, res) => {
    try {
        const { tituloConteudo, subtituloConteudo, urlImagemConteudo, descricaoConteudo, categoriaConteudo, emailUsuario, emailUsuarioConteudo, email } = req.body;
        const emailFormatado = (emailUsuario || emailUsuarioConteudo || email || '').trim().toLowerCase();

        if (!emailFormatado) {
            return res.status(401).json({ erro: 'É necessário estar logado para cadastrar conteúdo.' });
        }

        const autor = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (!autor) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        const novoConteudo = new Conteudo({
            tituloConteudo,
            subtituloConteudo,
            urlImagemConteudo,
            descricaoConteudo,
            categoriaConteudo,
            emailUsuarioConteudo: autor.emailUsuario,
            idUsuarioConteudo: String(autor._id),
            dataCriacaoConteudo: Date.now()
        });

        await novoConteudo.save();
        res.status(201).json({ mensagem: 'Conteúdo foi cadastrado com su su sucesso', conteudo: novoConteudo })
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao cadastrar conteúdo', detalhe: error.message })
    }
});

app.put('/api/conteudo/:id', async (req, res) => {
    try {
        const { tituloConteudo, subtituloConteudo, urlImagemConteudo, descricaoConteudo, categoriaConteudo, emailUsuario } = req.body;
        const emailFormatado = (emailUsuario || '').trim().toLowerCase();

        if (!emailFormatado) {
            return res.status(401).json({ erro: 'É necessário estar logado para editar conteúdo.' });
        }

        const conteudo = await Conteudo.findById(req.params.id);
        if (!conteudo) {
            return res.status(404).json({ erro: 'Conteúdo não encontrado' })
        }

        if (conteudo.emailUsuarioConteudo !== emailFormatado) {
            return res.status(403).json({ erro: 'Você só pode editar os próprios cards.' });
        }

        conteudo.tituloConteudo = tituloConteudo;
        conteudo.subtituloConteudo = subtituloConteudo;
        conteudo.urlImagemConteudo = urlImagemConteudo;
        conteudo.descricaoConteudo = descricaoConteudo;
        conteudo.categoriaConteudo = categoriaConteudo;
        await conteudo.save();
        res.status(200).json({ mensagem: 'Conteúdo foi atualizado com su su sucesso' })
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar o conteúdo', detalhe: error.message })
    }
})

app.get('/api/conteudo/listar', async (req, res) => {
    try {
        const listaConteudo = await Conteudo.find().sort({ dataCriacaoConteudo: -1 });
        res.status(200).json(listaConteudo);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar o conteúdo', detalhe: error.message })
    }
})

app.get('/api/conteudo/meus', async (req, res) => {
    try {
        const emailFormatado = (req.query.emailUsuario || '').trim().toLowerCase();
        const idUsuario = String(req.query.idUsuario || '').trim();

        if (!emailFormatado && !idUsuario) {
            return res.status(401).json({ erro: 'É necessário estar logado para ver seus conteúdos.' });
        }

        const filtro = { $or: [] };
        if (emailFormatado) filtro.$or.push({ emailUsuarioConteudo: emailFormatado });
        if (idUsuario) filtro.$or.push({ idUsuarioConteudo: idUsuario });

        const listaConteudo = await Conteudo.find(filtro).sort({ dataCriacaoConteudo: -1 });
        res.status(200).json(listaConteudo);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar seus conteúdos', detalhe: error.message });
    }
});

//
// Rota para buscas (Barra de pesquisa e filtro)
//
app.get('/api/conteudo/buscar', async (req, res) => {
    try {
        const { termo, categoria } = req.query;
        const filtro = {};
        if (termo) {
            filtro.$or = [{ tituloConteudo: { $regex: termo, $options: 'i' } }, { descricaoConteudo: { $regex: termo, $options: 'i' } }];
        }
        if (categoria) {
            filtro.categoriaConteudo = { $regex: categoria, $options: 'i' };
        }
        const resultados = await Conteudo.find(filtro);
        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro na busca de conteúdo', detalhe: error.message });
    }
});


app.get('/api/conteudo/:id', async (req, res) => {
    try {
        const conteudoId = req.params.id;
        const conteudo = await Conteudo.findById(conteudoId);
        if (!conteudo) {
            return res.status(404).json({ erro: 'Conteúdo não encontrado' })
        }
        res.status(200).json(conteudo)
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar conteúdo', detalhe: error.message })
    }
})

app.delete('/api/conteudo/:id', async (req, res) => {
    try {
        const emailFormatado = (req.body?.emailUsuario || req.query?.emailUsuario || '').trim().toLowerCase();

        if (!emailFormatado) {
            return res.status(401).json({ erro: 'É necessário estar logado para excluir conteúdo.' });
        }

        const conteudo = await Conteudo.findById(req.params.id);
        if (!conteudo) {
            return res.status(404).json({ erro: "Conteúdo não encontrado." })
        }

        if (conteudo.emailUsuarioConteudo !== emailFormatado) {
            return res.status(403).json({ erro: 'Você só pode excluir os próprios cards.' });
        }

        await Conteudo.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensagem: "Conteúdo deletado com su su sucesso!" });

    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar conteúdo", detalhe: error.message })
    }
})

//
// Novas Rotas para a tela de configurações 
//

// ROTA: Excluir Conta do Usuário
app.delete('/api/usuarios/excluir/:email', async (req, res) => {
    try {
        const emailFormatado = req.params.email.toLowerCase().trim();
        const usuarioDeletado = await Usuario.findOneAndDelete({ emailUsuario: emailFormatado });

        if (!usuarioDeletado) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.status(200).json({ mensagem: 'Conta excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir conta.', detalhe: error.message });
    }
});
// ROTA: Alterar Senha do Usuário
app.put('/api/usuarios/alterar-senha', async (req, res) => {
    try {
        const { emailUsuario, senhaAtual, novaSenha } = req.body;
        const emailFormatado = emailUsuario.toLowerCase().trim();
        const usuario = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        // Valida se a senha atual está correta
        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senhaUsuario);
        if (!senhaCorreta) {
            return res.status(400).json({ erro: 'A senha atual está incorreta.' });
        }
        // Valida o formato da nova senha (8 caracteres, maiúscula, número, especial)
        const regexsenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regexsenha.test(novaSenha)) {
            return res.status(400).json({
                erro: 'Nova senha fraca. Deve conter 8 caracteres, maiúscula, minúscula, número e caractere especial.'
            });
        }
        // Criptografa a nova senha e salva
        const salt = await bcrypt.genSalt(10);
        usuario.senhaUsuario = await bcrypt.hash(novaSenha, salt);
        await usuario.save();
        res.status(200).json({ mensagem: 'Senha alterada com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao alterar senha.', detalhe: error.message });
    }
});

app.put('/api/usuarios/perfil', async (req, res) => {
    try {
        const { emailUsuario, nomeUsuario, fotoUsuario, novaSenha, telefone, cpf, notificacaoUsuario } = req.body;
        const emailFormatado = emailUsuario.toLowerCase().trim();

        const camposAtualizar = {};
        if (typeof nomeUsuario !== 'undefined') camposAtualizar.nomeUsuario = nomeUsuario;
        if (typeof fotoUsuario !== 'undefined') camposAtualizar.fotoUsuario = fotoUsuario;
        if (typeof telefone !== 'undefined') camposAtualizar.telefone = telefone;
        if (typeof cpf !== 'undefined') camposAtualizar.cpf = cpf;
        if (typeof notificacaoUsuario !== 'undefined') camposAtualizar.notificacaoUsuario = Boolean(notificacaoUsuario);

        if (novaSenha && novaSenha.trim()) {
            const regexsenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regexsenha.test(novaSenha)) {
                return res.status(400).json({
                    erro: 'Nova senha fraca. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
                });
            }
            const salt = await bcrypt.genSalt(10);
            camposAtualizar.senhaUsuario = await bcrypt.hash(novaSenha, salt);
        }

        // Procura pelo e-mail e atualiza os dados
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { emailUsuario: emailFormatado },
            camposAtualizar,
            { new: true } // Retorna os dados já atualizados
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        res.status(200).json({
            mensagem: 'Perfil atualizado com sucesso!',
            usuario: {
                id: String(usuarioAtualizado._id),
                nome: usuarioAtualizado.nomeUsuario,
                email: usuarioAtualizado.emailUsuario,
                foto: usuarioAtualizado.fotoUsuario,
                telefone: usuarioAtualizado.telefone || '',
                cpf: usuarioAtualizado.cpf || '',
                notificacao: usuarioAtualizado.notificacaoUsuario ?? true
            }
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar perfil.', detalhe: error.message });
    }
});

// ROTA: Atualizar apenas Notificações
app.put('/api/usuarios/notificacao', async (req, res) => {
    try {
        const { emailUsuario, notificacaoUsuario } = req.body;
        const emailFormatado = emailUsuario.toLowerCase().trim();
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { emailUsuario: emailFormatado },
            { notificacaoUsuario: Boolean(notificacaoUsuario) },
            { new: true }
        );
        if (!usuarioAtualizado) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.status(200).json({
            mensagem: 'Preferência de notificação atualizada!',
            notificacao: usuarioAtualizado.notificacaoUsuario
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar notificação.', detalhe: error.message });
    }
});

// ROTA: Buscar dados do usuário pelo email
app.get('/api/usuarios/:email', async (req, res) => {
    try {
        const emailFormatado = req.params.email.toLowerCase().trim();
        const usuario = await Usuario.findOne({ emailUsuario: emailFormatado });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.status(200).json({
            nome: usuario.nomeUsuario,
            email: usuario.emailUsuario,
            foto: usuario.fotoUsuario,
            telefone: usuario.telefone || '',
            cpf: usuario.cpf || '',
            notificacao: usuario.notificacaoUsuario ?? true
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar dados do usuário.', detalhe: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PASSAMO FAMÍLIA`);
    console.log(`O servidor está rodando na porta: ${PORT}`);
});