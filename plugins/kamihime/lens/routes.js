const gachaCtrl = require('./gacha/gacha.controller');
const profileCtrl = require('./profile/profile.controller');
const homeCtrl = require('./home/home.controller');
const lubaCtrl = require('./luba/luba.controller');

exports.setup = function (server, mongodb) {
    gachaCtrl.routes(server, mongodb);
    profileCtrl.routes(server, mongodb);

    // Not everything needs mongodb
    homeCtrl.routes(server);
    lubaCtrl.routes(server);
}
