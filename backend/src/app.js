

const bodyParser     = require('body-parser');
const config     = require('./config.js');
const contact = require('./routes/contact.js');
const express     = require('express');
const helmet = require('helmet');
const mongoose   = require('mongoose');
const middlewares = require('./middlewares');
const user = require('./routes/user.js');
const app = express();
/**
 * Connect to the database
 */

mongoose.connect(config.mongoURI,{useNewUrlParser: true});

mongoose.connection
    .once('open',()=> console.log('Connected'))
    .on('error',(error)=> {
        console.log('Your Error', error);

    });
/**
 * Middleware
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(helmet());
app.use(middlewares.allowCrossDomain);

// Basic route
app.get('/', (req, res) => {
    res.json({
        name: 'FindMyCook Backend'
    });
});

// API routes=
app.use('/user', user);
app.use('/contact', contact);

/**
 * Register the routes
 */

module.exports = app;
