const Hapi = require('hapi');
const Path = require('path');

// Start the server
exports.init = async function(config, mongodb) {
    // Create a server with a host and port
    const server = Hapi.server({
        host: config.lensHostname,
        port: config.lensPort,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    try {
        await server.register(require('inert'));

        require('./routes').setup(server, mongodb);

        await server.start();
    } catch (err) {
        console.log(err);
        process.exit();
    }

    console.log('Server running at:', server.info.uri);
};

exports.profile = require('./profile/profile.service');
