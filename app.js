require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routes = require('./routes/index.js');
const errorHandler = require('./middlewares/errorHandler.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors({
  origin: 'https://mesto-app.nomoredomains.monster',
  credentials: true,
}));
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
