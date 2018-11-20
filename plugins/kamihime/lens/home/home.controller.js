exports.routes = function (server) {
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true,
                index: true
            }
        }
    });
}
