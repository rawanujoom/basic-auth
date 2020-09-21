/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/server');
// const PORT = process.env.PORT
const DATABASE_URL = 'mongodb://localhost:27017/inventory';

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};
mongoose.connect(DATABASE_URL,mongooseOptions);

app.start();