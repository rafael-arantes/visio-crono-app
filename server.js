const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://rafael:CKTQ069F8QrGjD0b@cluster0.ffkjh3l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const etapaSchema = new mongoose.Schema({
  id: Number,
  status: String
});
const Etapa = mongoose.model('Etapa', etapaSchema);

const etapasIniciais = [
  { id: 1, status: 'pendente' },
  { id: 2, status: 'pendente' },
  { id: 3, status: 'pendente' },
  { id: 4, status: 'pendente' },
  { id: 5, status: 'pendente' },
  { id: 6, status: 'pendente' },
  { id: 7, status: 'pendente' },
  { id: 8, status: 'pendente' }
];

// Buscar todas as etapas
app.get('/api/etapas', async (req, res) => {
  let etapas = await Etapa.find();
  if (etapas.length === 0) {
    await Etapa.insertMany(etapasIniciais);
    etapas = await Etapa.find();
  }
  res.json(etapas);
});

// Atualizar status de uma etapa
app.put('/api/etapas/:id', async (req, res) => {
  const { status } = req.body;
  await Etapa.findOneAndUpdate({ id: req.params.id }, { status });
  res.json({ success: true });
});

// Servir index.html para qualquer rota não-API
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));