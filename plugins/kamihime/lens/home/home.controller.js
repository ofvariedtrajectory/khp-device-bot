
exports.routes = function(server, mongodb) {
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    });
}
