const restify = require('restify');

const RBAC = require('./rbac');

/**
 * Create restify server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version
});


/**
 * Handle internal server errors in resity
 */
server.on('uncaughtException', (req, res, err) => {
    res.send(err);
});

/**
 * Set up authorization middleware
 */

// Routes that can only be accessed by admins. 
const admin = {
    '/users': ['GET']
};

// Routes that does not need any authentication
const excludes = ['/login', '/register', '/auth/verify?code=:code'];

const rbac = new RBAC(admin, excludes);
server.use(rbac.checkAuthorization);

/**
 * Run server.
 */
server.listen(config.webserver.port, () => {
    console.log(`${server.name} listening at ${server.url}`);
});

/**
 * Doing this for test
 */
module.exports = server;
