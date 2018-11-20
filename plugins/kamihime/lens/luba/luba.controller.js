exports.routes = function (server) {
    server.route({
        method: 'GET',
        path: '/luba/{axs}',
        options: {
            auth: 'luba'
        },
        handler: function (request, h) {
            console.log('axs', request.auth.credentials);
            return h.file('luba/' + request.auth.credentials.axs.filename);
        }
    });
}
