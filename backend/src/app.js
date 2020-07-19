const bodyParser = require('body-parser');
const config = require('./config.js');
const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/api-definitions/api.yaml');
const mongoose = require('mongoose');
const middleWares = require('./middleWares');
const contact = require('./routes/contactRoute');
const customer = require('./routes/customerRoute');
const transaction = require('./routes/transactionRoute');
const tutor = require('./routes/tutorRoute');
const user = require('./routes/userRoute');

const app = express();

/**
 * Connect to the database
 */

mongoose.connect(config.mongoURI, { useNewUrlParser: true });

mongoose.connection
    .once('open', () => console.log('Connected'))
    .on('error', (error) => {
        console.log('Your Error', error);

    });
/**
 * Middleware
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use('/transaction', transaction);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

/**
 * Register the routes
 */

module.exports = app;
