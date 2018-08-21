const gachaService = require('./gacha.service');

exports.routes = function(server, mongodb) {
    /**
    curl -vX POST http://localhost:8888/v1/123456789/gacha/gem1 -d @gem1.example.json --header "Content-Type: application/json"
    curl -vX POST http://localhost:8888/v1/123456789/gacha/gem1 -d @gem1free.example.json --header "Content-Type: application/json"
    */
    server.route({
        method: 'POST',
        path: '/v1/{kh_id}/gacha/gem1',
        handler: async function(request, h) {
            const data = request.payload;
            const khId = encodeURIComponent(request.params.kh_id);
            console.log('gem1', khId, data);

            const response = await gachaService.gem1Gacha(khId, data, mongodb);
            return response;
        }
    });

    /**
    curl -vX POST http://localhost:8888/v1/123456789/gacha/gem10 -d @gem10.example.json --header "Content-Type: application/json"
    */
    server.route({
        method: 'POST',
        path: '/v1/{kh_id}/gacha/gem10',
        handler: async function(request, h) {
            const data = request.payload;
            const khId = encodeURIComponent(request.params.kh_id);
            console.log('gem10', khId, data);

            const response = await gachaService.gem10Gacha(khId, data, mongodb);
            return response;
        }
    });

    /**
    curl -vX POST http://localhost:8888/v1/123456789/gacha/jewel1 -d @jewel1.example.json --header "Content-Type: application/json"
    */
    server.route({
        method: 'POST',
        path: '/v1/{kh_id}/gacha/jewel1',
        handler: async function(request, h) {
            const data = request.payload;
            const khId = encodeURIComponent(request.params.kh_id);
            console.log('jewel1', khId, data);

            const response = await gachaService.jewel1Gacha(khId, data, mongodb);
            return response;
        }
    });

    /**
    curl -vX POST http://localhost:8888/v1/123456789/gacha/jewel10 -d @jewel10.example.json --header "Content-Type: application/json"
    */
    server.route({
        method: 'POST',
        path: '/v1/{kh_id}/gacha/jewel10',
        handler: async function(request, h) {
            const data = request.payload;
            const khId = encodeURIComponent(request.params.kh_id);
            console.log('jewel10', khId, data);

            const response = await gachaService.jewel10Gacha(khId, data, mongodb);
            return response;
        }
    });

    /**
    curl -vX POST http://localhost:8888/v1/123456789/gacha/premiumticket1 -d @premiumticket1.example.json --header "Content-Type: application/json"
    */
    server.route({
        method: 'POST',
        path: '/v1/{kh_id}/gacha/premiumticket1',
        handler: async function(request, h) {
            const data = request.payload;
            const khId = encodeURIComponent(request.params.kh_id);
            console.log('premiumticket1', khId, data);

            const response = await gachaService.premiumticket1Gacha(khId, data, mongodb);
            return response;
        }
    });

    server.route({
        method: 'GET',
        path: '/v1/allgacha',
        handler: async function(request, h) {
            const response = await gachaService.getAllGacha(mongodb);
            return response;
        }
    });
}
