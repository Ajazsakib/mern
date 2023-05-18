const express = require('express');
const mongoose = require('mongoose');

const url = 'mongodb://localhost/AlienDB';

const app = express();

mongoose.connect(url, { useNewUrlParser: true });

const con = mongoose.connection;

con.on('open', () => {
  console.log('Connected...');
});

app.use(express.json());

const alienRouter = require('./routers/aliens');
const todoRouter = require('./routers/todoRouter');
const userRouter = require('./routers/userRouter');
app.use('/aliens', alienRouter);
app.use('/todos', todoRouter);

app.use('/users', userRouter);

app.listen(9000, () => {
  console.log('Server Started');
});
