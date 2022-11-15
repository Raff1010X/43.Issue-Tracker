'use strict';
//+ Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//+ Error handling
const globalErrorHandler = require('./controllers/errorController'); // custom error handler

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

//+ Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//+ Connect to MongoDB
const mongoose = require('mongoose');

let DB = process.env.DATABASE;
DB = DB.replace('<PASSWORD>', process.env.PASSWORD);
DB = DB.replace('<USERNAME>', process.env.USER_NAME);

const DB_OPTIONS = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
};
mongoose
    .connect(DB, DB_OPTIONS)
    .then(() => console.log('DB connection successful'))
    .catch(() => console.log('Problem with database connection'));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API  
app.use('/api/issues', apiRoutes);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//+ Error handling middleware
app.use(globalErrorHandler); // this is the last middleware

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

//+ Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
      process.exit(1);
  });
});

module.exports = app; //for testing
