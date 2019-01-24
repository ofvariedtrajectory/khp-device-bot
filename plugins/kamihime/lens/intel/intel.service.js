const intelPermissionsService = require('./intel-permissions.service');

const intelService = {};

const internals = {};

internals.getIntelCollection = function (db) {
  return db.collection('intel');
}

intelService.checkAllPermissions = function (msg) {
    const channelIsRagnarok = intelPermissionsService.channelIsRagnarok(msg);
    const canTeachRagnarokIntel = intelPermissionsService.canTeachRagnarokIntel(msg);
    const canCreateRagnarokIntelTopics = intelPermissionsService.canCreateRagnarokIntelTopics(msg);
    const canRequestRagnarokIntel = intelPermissionsService.canRequestRagnarokIntel(msg);

    console.log('channelIsRagnarok', channelIsRagnarok);
    console.log('canTeachRagnarokIntel', canTeachRagnarokIntel);
    console.log('canCreateRagnarokIntelTopics', canCreateRagnarokIntelTopics);
    console.log('canRequestRagnarokIntel', canRequestRagnarokIntel);
    return {
        channelIsRagnarok: channelIsRagnarok,
        canTeachRagnarokIntel: canTeachRagnarokIntel,
        canCreateRagnarokIntelTopics: canCreateRagnarokIntelTopics,
        canRequestRagnarokIntel: canRequestRagnarokIntel
    };
}

intelService.requestIntel = async function (msg, topic, entity, profile, db) {
    const permissions = intelService.checkAllPermissions(msg);
    if (permissions.channelIsRagnarok && permissions.canRequestRagnarokIntel) {
        const collection = internals.getIntelCollection(db);
        const query = { topic: topic, entity: entity };
        const options = {};

        return await collection.findOne(
            query,
            options
        );
    } else {
        return null;
    }
}

intelService.teach = async function (msg, topic, entity, contents, profile, db) {
    const permissions = intelService.checkAllPermissions(msg);
    if (permissions.channelIsRagnarok && permissions.canTeachRagnarokIntel) {
        const collection = internals.getIntelCollection(db);
        const query = { topic: topic, entity: entity };
        const sort = [['_id','asc']];
        const intel = {
            topic: topic,
            entity: entity,
            contents: contents,
            by_id: profile._id,
            lastUpdated: new Date()
        };
        const options = {
            upsert: true,
            new: true
        };

        return await collection.findAndModify(
            query,
            sort,
            intel,
            options
        );
    } else {
        return null;
    }
}


module.exports = intelService;
