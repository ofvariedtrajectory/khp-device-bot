const Bcrypt = require('bcryptjs');

const getHash = async function (str) {
    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(str, salt);
    console.log(hash);
}

if (process.argv[2]) {
    getHash(process.argv[2]);
} else {
    throw new Error('Must provide a value argument. ex: node bcrypt_hash.js secret');
}
