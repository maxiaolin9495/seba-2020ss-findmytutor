const app = require('./app');
const config = require('./config');
const io = require('./socket')

const server = app.listen(config.port);
io.listen(server);


console.log(`Listening on port ${config.port}`);