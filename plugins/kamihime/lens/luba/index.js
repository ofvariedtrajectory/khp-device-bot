const Bcrypt = require('bcryptjs');

const Luba = function (config) {
    this.config = config;
}

Luba.prototype.validate = function () {
    const self = this;
    return async (request, username, password, h) => {
        console.log('validate ', username, password, request.params);

        const user = self.config.luba[username];
        if (!user) {
            console.log('no such user ', username);
            return { credentials: null, isValid: false };
        }

        let credentialsValid = await Bcrypt.compare(password, user.password);
        let axsValid = false;
        let credentials = null;
        if (credentialsValid !== true) {
            console.log('invalid credentials ', username);
        } else {
            const axs = user.axs[request.params.axs];
            axsValid = axs !== undefined;
            if (axsValid) {
                console.log('axs found', axs);
                credentials = { id: user.id, name: user.name, axs: axs };
            } else {
                console.log('axs not found', request.params.axs);
            }
        }
        const isValid = credentialsValid && axsValid;
        return { isValid, credentials };
    }
};

module.exports = Luba;
