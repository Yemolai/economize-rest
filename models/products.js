var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/economize');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var productSchema = {
  "description": String, // Descrição (ex.: feijão preto, alface crespa, pão de milho, etc. )
  "category": String, // Categoria (ex.: carnes, hortifruti, cereais, limpeza, etc.)
  "format": String, // Família (ex.: sachet, refill, lata, caixa, pacote, granel, etc.)
  "type": String, // Tipo (ex.: feijão, alface, pão, suco, etc.)
  "size": String, // Medida (ex.: 100 g, unidade, quilograma)
  "brand": String // Marca (Nestlé, Bauducco, Piracanjuba, Friboi, etc.)
};
// create model if not exists.
module.exports = mongoose.model('products', productSchema);
