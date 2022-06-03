const express = require('express');
const cors = require('cors');
const path = require('path')
const { dbConnection } = require('./db/config');
require('dotenv').config();

//Crear el servidor /aplicación express

const app = express();

//DB Connect
dbConnection();

//Public
app.use(express.static('public'))

//CORS
app.use(cors());

//Parseo Body
app.use(express.json());

//Route using middlewares
app.use('/api/auth', require('./routes/auth'));

//Routes Angular
app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, 'public/index.html'));
})


app.listen(process.env.PORT, () => {
    console.log(`Server listen port ${process.env.PORT}`)
})