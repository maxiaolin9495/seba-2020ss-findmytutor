const port      = process.env.PORT        || '8080';
const backendUri = process.env.BACKEND_URI || 'http://localhost:3000';

module.exports = {
    port,
    backendUri
};
