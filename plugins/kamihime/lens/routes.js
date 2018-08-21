const gachaCtrl = require('./gacha/gacha.controller');
const profileCtrl = require('./profile/profile.controller');
const homeCtrl = require('./home/home.controller');
exports.setup = function (server, mongodb) {
    gachaCtrl.routes(server, mongodb);
    profileCtrl.routes(server, mongodb);
    homeCtrl.routes(server, mongodb);
}
