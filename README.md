# Technologic — Mobile2 Atividade 1

Aplicativo mobile de catálogo de conteúdos (cards de séries, filmes e afins), com API REST, banco MongoDB e autenticação de usuários.

Visitantes podem ver o catálogo. Usuários logados criam cards, gerenciam o próprio perfil e só editam ou excluem o que eles mesmos cadastraram.

## Autores

- **Ana Laura Martins Souto**
- **João Victor Quaresma de Arruda**

## Tecnologias

| Camada | Stack |
| --- | --- |
| App | Expo, React Native, React Native Paper, React Navigation (Drawer + Stack) |
| API | Node.js, Express, Mongoose |
| Banco | MongoDB |
| HTTP | Axios |
| Segurança | bcrypt nas senhas, CORS |

## Estrutura do repositório

```
Mobile2_Atividade_1/
├── frontend/          # App Expo (Telas, tema, contexto de login, Axios)
│   ├── App.js         # Navegação (Drawer + Stack)
│   ├── services/api.js
│   ├── contexts/AuthContext.js
│   └── theme/         # Cores e tema do Paper
└── server/            # API Express
    ├── server.js      # Rotas
    └── models/        # Usuario e Conteudo
```

## Funcionalidades

### Visitante

- Splash inicial
- Listar todos os cards na Home (aba **Todos**)
- Abrir um card pelo botão **Ver**
- Login e cadastro
- Pesquisa (tela existente)

### Usuário logado

- Menu lateral com identificação (nome, e-mail, foto)
- **Criar card** (item do menu, só aparece autenticado)
- Aba **Meus conteúdos** com os cards do próprio usuário
- **Ver** em todos os cards
- **Editar** e **Excluir** somente nos cards próprios
- Perfil (nome, foto, telefone, CPF, senha)
- Configurações (senha, notificações, excluir conta, sair)
- Notificações (lista local + preferência salva no servidor)

### Regras de negócio dos cards

Cada conteúdo é vinculado ao autor no momento do cadastro:

- `emailUsuarioConteudo` — e-mail do usuário logado
- `idUsuarioConteudo` — id do usuário no MongoDB

A API recusa cadastro sem usuário válido. Atualização e exclusão só passam se o e-mail enviado for o do dono do card. A aba **Meus conteúdos** consulta `GET /api/conteudo/meus`.

Cards antigos, criados antes desse vínculo, não entram em **Meus conteúdos** e ninguém consegue editá-los.

## Como executar

É preciso **dois processos**: a API e o app Expo.

### 1. API (`server`)

1. Copie `server/.env-exemplo` para `server/.env` e preencha:

```
MONGODB_USERNAME=seu_usuario
MONGODB_PASSWORD=sua_senha
MONGO_URI=sua_string_de_conexao
PORT=3000
```

2. Instale e inicie:

```bash
cd server
npm install
npm start
```

Para recarregar automaticamente: `npm run dev`.

A API sobe em `http://localhost:3000`. Sem `MONGO_URI` o servidor não inicia.

### 2. App (`frontend`)

1. Copie `frontend/.env_exemplo` para `frontend/.env` (opcional). Se não definir a URL, o app usa o IP do Expo e a porta `3000`.

```
EXPO_PUBLIC_API_URL=http://SEU_IPV4:3000/api
```

No celular físico, use o IPv4 do computador na mesma rede Wi-Fi. No emulador Android o fallback é `10.0.2.2`.

2. Instale e inicie:

```bash
cd frontend
npm install
npm start
```

Depois abra no Expo Go, emulador Android/iOS ou `npm run web`.

**Importante:** reinicie a API depois de mudar models ou rotas. Depois de atualizar o login, entre de novo na conta para o app guardar o `id` do usuário.

## Telas principais

| Tela | Arquivo | Função |
| --- | --- | --- |
| Splash | `SplashScreen.js` | Abertura |
| Home | `AppBar.js` | Catálogo, abas Todos / Meus conteúdos |
| Card (lista) | `Cards.js` | Capa, textos, Ver / Editar / Excluir |
| Detalhe | `VerCard.jsx` | Abre o card completo |
| Criar card | `CriarCard.jsx` | Cadastro de conteúdo (logado) |
| Editar | `EditarConteudo.jsx` | Alteração (somente dono) |
| Acesso / Login / Cadastro | `Acesso.js`, `Login.jsx`, `Cadastro.jsx` | Autenticação |
| Menu lateral | `CabecaMenu.js` | Perfil, criar card, notificações, configurações, sair |
| Perfil | `Perfil.js` | Dados da conta |
| Configurações | `Configuracoes.js` | Senha, notificações, excluir conta |
| Notificações | `Notificacoes.js` | Avisos e preferência de push na conta |

Navegação: Drawer (**Início**, **Séries**) envolvendo um Stack com as demais telas. O Drawer customizado usa `CabecaMenu`.

## Modelos

### Usuário (`server/models/Usuario.js`)

- `nomeUsuario`
- `emailUsuario` (único, minúsculo)
- `senhaUsuario` (hash bcrypt)
- `notificacaoUsuario`
- `fotoUsuario`


Senha no cadastro e na troca: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.

### Conteúdo (`server/models/Conteudo.js`)

- `tituloConteudo`, `subtituloConteudo`, `urlImagemConteudo` (obrigatórios)
- `descricaoConteudo`, `categoriaConteudo`
- `emailUsuarioConteudo`, `idUsuarioConteudo` (autor)
- `dataCriacaoConteudo`

## API (`/api`)

Base: `http://HOST:3000/api`

### Usuários

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/usuarios/cadastro` | Cria conta |
| POST | `/usuarios/login` | Login (devolve nome, e-mail, id, foto, etc.) |
| GET | `/usuarios/:email` | Busca dados públicos da conta |
| PUT | `/usuarios/perfil` | Atualiza perfil |
| PUT | `/usuarios/alterar-senha` | Troca senha (exige senha atual) |
| PUT | `/usuarios/notificacao` | Liga/desliga notificações |
| DELETE | `/usuarios/excluir/:email` | Exclui a conta |

### Conteúdos

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/conteudo/cadastrar` | Cria card (exige `emailUsuario` de um usuário existente) |
| GET | `/conteudo/listar` | Lista todos |
| GET | `/conteudo/meus?emailUsuario=&idUsuario=` | Lista só os do autor |
| GET | `/conteudo/buscar?termo=&categoria=` | Busca por texto/categoria |
| GET | `/conteudo/:id` | Detalhe |
| PUT | `/conteudo/:id` | Edita (somente dono) |
| DELETE | `/conteudo/:id` | Exclui (somente dono; envie `emailUsuario` no body) |

O app guarda o usuário logado em memória (`AuthContext`). Não há JWT: as rotas de dono conferem o e-mail enviado na requisição.

## Fluxo típico

1. Abrir o app → splash → Home com todos os cards.
2. Cadastrar / entrar.
3. Menu lateral → **Criar card** → preencher título, subtítulo, URL da capa, categoria e descrição.
4. O card aparece em **Todos** e em **Meus conteúdos**.
5. Qualquer pessoa vê o card com **Ver**. Só o autor vê **Editar** e **Excluir**.

## Observações

- O Axios monta a URL com `EXPO_PUBLIC_API_URL` ou com o host do Expo (`frontend/services/api.js`).
- Tema e cores ficam em `frontend/theme/Colors.js`.
- Este repositório é a atividade 1 da disciplina de Desenvolvimento Mobile 2.
