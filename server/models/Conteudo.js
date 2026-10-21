const mongoose = require('mongoose') 

const conteudoSchema = new mongoose.Schema ({
    tituloConteudo: { type :String, required: true},
    subtituloConteudo: {type: String, required: true},
    urlImagemConteudo: {type: String, required: true},
    descricaoConteudo: {type: String},
    categoriaConteudo: {type: String},
    emailUsuarioConteudo: { type: String, required: true, lowercase: true, trim: true },
    idUsuarioConteudo: { type: String, default: '' },
    dataCriacaoConteudo: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Conteudo', conteudoSchema);