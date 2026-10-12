const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nomeUsuario: { type: String, required: true },
    emailUsuario: { type: String, required: true, unique: true, lowercase: true, trim: true }, //Adicionado o "TRIM" que remove os espaços em branco ( no começo e no final)
    senhaUsuario: { type: String, required: true },
    notificacaoUsuario: { type: Boolean, default: true },
    fotoUsuario: { type: String, default: '' }
});

module.exports = mongoose.model('Usuario', usuarioSchema);