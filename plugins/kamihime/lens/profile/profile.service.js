const mongodb = require('../../../../lib/mongo');

const internals = {};

/*
  Components of a Profile
    id - discord numerical id
    name - discord name 
    kh_id - khp in-game id
    kh_name - khp in-game name
*/

internals.getProfileCollection = function(db) {
  return db.collection('profiles');
}

// Device (Discord) profile

exports.getProfileOrCreate = function(id, name, db) {
  return internals.getProfileById(id, db).then(function(profile) {
    if (profile === null) {
      return internals.createProfile(id, name, db);
    } else {
      return profile;
    }
  });
}

exports.getProfileById = internals.getProfileById = function(id, db) {
  const collection = internals.getProfileCollection(db);
  return collection.findOne({ id: id }).then(function(profile) {
    return profile;
  });
}

exports.createProfile = internals.createProfile = function(id, name, db) {
  const collection = internals.getProfileCollection(db);
  return collection.insertOne({ id: id, name: name }).then(function(response) {
    return response.ops[0];
  });
}

// KHP profile

exports.getProfileOrCreateByKhId = function(khId, khName, db) {
  return internals.getProfileByKhId(khId, db).then(function(profile) {
    if (profile === null) {
      return internals.createKhProfile(khId, khName, db);
    } else {
      return profile;
    }
  });
}

exports.getProfileByKhId = internals.getProfileByKhId = function(khId, db) {
  const collection = internals.getProfileCollection(db);
  return collection.findOne({ kh_id: khId }).then(function(profile) {
    return profile;
  });
}

exports.createKhProfile = internals.createKhProfile = function(khId, khName, db) {
  const collection = internals.getProfileCollection(db);
  return collection.insertOne({ kh_id: khId, kh_name: khName }).then(function(response) {
    return response.ops[0];
  });
}

