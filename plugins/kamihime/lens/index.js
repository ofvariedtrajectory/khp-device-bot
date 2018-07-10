const Hapi = require('hapi');

// Start the server
exports.init = async function(config, mongodb) {
    // Create a server with a host and port
    const server = Hapi.server({
        host: config.lensHostname,
        port: config.lensPort
    });
    const routes = require('./routes');
    routes.setup(server, mongodb);

    try {
        await server.start();
    } catch (err) {
        console.log(err);
    }

    console.log('Server running at:', server.info.uri);
};

exports.profile = require('./profile/profile.service');
