const bodyParser     = require('body-parser');
const config     = require('./config.js');
const contact = require('./routes/contact.js');
const express     = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/api-definitions/api.yaml');
const mongoose   = require('mongoose');
const middleWares = require('./middleWares');
const user = require('./routes/user.js');
const tutor = require('./routes/tutor.js');
const customer = require('./routes/customer');
const transaction=require('./routes/transaction');
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
app.use(middleWares.allowCrossDomain);

// Basic route
app.get('/', (req, res) => {
    res.json({
        name: 'FindMyTutor Backend'
    });
});

// API routes=
app.use('/user', user);
app.use('/contact', contact);
app.use('/tutor', tutor);
app.use('/customer', customer);
app.use('/transaction',transaction);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

/**
 * Register the routes
 */

module.exports = app;
