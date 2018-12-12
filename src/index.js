const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost/c9');

routes(app);

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000!'));