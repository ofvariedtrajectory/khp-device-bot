const MongoClient = require('mongodb').MongoClient;
const f = require('util').format;

let db = null;

exports.connect = function(config) {
  if (db === null) {
    const user = encodeURIComponent(config.user);
    const password = encodeURIComponent(config.pass);
    const authMechanism = 'DEFAULT';
    const database = config.db;

    const url = f('mongodb://%s:%s@localhost:27017/?authMechanism=%s&authSource=%s', user, password, authMechanism, database);

    return MongoClient.connect(url).then(function(db) {
      console.log('Connected correctly to server!');
      // db.close();
      return db;
    });
  } else {
    return Promise.resolve(db);
  }
}

exports.getTimestampFromId = function(id) {
  const timestamp = id.toString().substring(0, 8);
  return new Date(parseInt(timestamp, 16) * 1000);
}
