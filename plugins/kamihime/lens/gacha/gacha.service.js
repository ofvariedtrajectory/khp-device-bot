const profileService = require('../profile/profile.service');

const internals = {
  gacha: {
    jewel1: {
      name: 'jewel1',
      gacha_id: 6,
      gacha_length: 1
    },
    jewel10: {
      name: 'jewel10',
      gacha_id: 7,
      gacha_length: 10
    },
    gem1: {
      name: 'gem1',
      gacha_id: 8,
      gacha_length: 1
    },
    gem10: {
      name: 'gem10',
      gacha_id: 9,
      gacha_length: 10
    },
    premiumticket1: {
      name: 'premiumticket1',
      gacha_id: 11,
      gacha_length: 1
    }
  },
  messages: {
    validation_failure: 'Validation of submission failed.'
  }
};

internals.getGachaCollection = function(db) {
  return db.collection('gacha');
}


internals.validateGacha = function(khId, data, type) {
  const gachaId = data.gacha_id;
  const obtainedInfo = data.obtained_info;

  const gachaTypeCheck = gachaId === internals.gacha[type].gacha_id;
  const gachaResultLengthCheck = obtainedInfo 
    && obtainedInfo.length > 0 
    && obtainedInfo.length <= internals.gacha[type].gacha_length;
  const payloadHasKhName = data.kh_name && data.kh_name.length;
  const payloadHasHeaderDate = data.header_date

  return gachaTypeCheck && gachaResultLengthCheck && payloadHasKhName && payloadHasHeaderDate;
}

internals.wrapGachaPull = async function(khId, data, type, db) {
  if (internals.validateGacha(khId, data, type)) {
    const obtainedInfo = data.obtained_info;
    const headerDate = data.header_date;

    const response = await internals.recordGachaPull(khId, data.kh_name, headerDate, obtainedInfo, type, db);
    return response;
  } else {
    return {
      error: true,
      message: internals.messages.validation_failure
    };
  }
}

internals.recordGachaPull = async function(khId, khName, headerDate, obtainedInfo, type, db) {
  const response = {};

  // 1.) Get Profile
  //     If not exists, create
  // 2.) Add gacha data to a "gacha" collection
  const profile = await profileService.getProfileOrCreateByKhId(khId, khName, db);
  response.profile = profile;

  let headerDateMs = 0;
  try {
    const dateObj = new Date(headerDate);
    headerDateMs = dateObj.getTime();
  } catch (e) {
    console.log('issue converting headerDate to Ms', e);
  }

  const collection = internals.getGachaCollection(db);
  let insertion = await collection.insertOne({
    kh_id: profile.kh_id, 
    kh_name: khName,
    header_date: headerDate,
    header_date_ms: headerDateMs,
    obtained_info: obtainedInfo, 
    type: type
  });
  response.insertion = insertion;
  return response;
}

exports.gem1Gacha = async function(khId, data, db) {
  const response = await internals.wrapGachaPull(khId, data, internals.gacha.gem1.name, db);
  return response;
}

exports.gem10Gacha = async function(khId, data, db) {
  const response = await internals.wrapGachaPull(khId, data, internals.gacha.gem10.name, db);
  return response;
}

exports.jewel1Gacha = async function(khId, data, db) {
  const response = await internals.wrapGachaPull(khId, data, internals.gacha.jewel1.name, db);
  return response;
}

exports.jewel10Gacha = async function(khId, data, db) {
  const response = await internals.wrapGachaPull(khId, data, internals.gacha.jewel10.name, db);
  return response;
}

exports.premiumticket1Gacha = async function(khId, data, db) {
  const response = await internals.wrapGachaPull(khId, data, internals.gacha.premiumticket1.name, db);
  return response;
}
