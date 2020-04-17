

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


import routes from './routes/index.js';

const app = express();
const middlewares=require('./middleware');
/**
 * Connect to the database
 */

mongoose.connect("mongodb://localhost:27017/mongo",{useNewUrlParser: true});

mongoose.connection
    .once('open',()=> console.log('Connected'))
    .on('error',(error)=> {
        console.log('Your Error', error);

    });
/**
 * Middleware
 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(middlewares.allowCrossDomain);

// catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

/**
 * Register the routes
 */

routes(app);

export default app;
