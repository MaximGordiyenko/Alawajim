const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const api = require('./api');
const dotenv = require('dotenv');
const app = express();

const envConfig = dotenv.config();
if (envConfig.error) {
  console.log('.env file does not loaded');
  throw envConfig.error;
}
/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

mongoose.connect(process.env.MONGO_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(result => console.log(`MongoDB connected`))
  .catch(error => console.log(`There is troubles with connecting to MongoDB ${error}`));

app.listen(process.env.PORT, () => console.log("== Server is running on port", process.env.PORT));
