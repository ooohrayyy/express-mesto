require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const {
  PORT = 3000,
  DATA_BASE = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

const routes = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const corsWhiteList = ['https://mesto-app.nomoredomains.monster', 'http://mesto-app.nomoredomains.monster'];

const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    }
  },
  credentials: true,
};

//

app.set('trust proxy', 1);

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
