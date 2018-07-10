
exports.routes = function(server, mongodb) {
    server.route({
        method: 'GET',
        path: '/profile/{kh_id}',
        handler: function(request, h) {
            return {
                'id': encodeURIComponent(request.params.kh_id)
            };
        }
    });
    server.route({
        method: 'POST',
        path: '/profile',
        handler: function(request, h) {
            return 'profile';
        }
    });
}
