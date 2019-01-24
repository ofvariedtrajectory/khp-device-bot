const intelPermissions = {
    channelIndicators: ['debug', 'device-ragnarok'],
    ragnarokIntelCreateTopicRoles: ['leader'],
    ragnarokIntelTeachRoles: ['leader', 'subleader', 'officer'],
    ragnarokIntelRequestRoles: ['leader', 'subleader', 'officer', 'member']
};

intelPermissions.channelIsRagnarok = function (msg) {
    console.log(msg.channel.name);

    return intelPermissions.channelIndicators.filter(function (c) {
        return msg.channel.name.indexOf(c) > -1;
    }).length > 0;
}

intelPermissions.canTeachRagnarokIntel = function (msg) {
   return msg.member.roles.some(r => intelPermissions.ragnarokIntelTeachRoles.includes(r.name))
}

intelPermissions.canCreateRagnarokIntelTopics = function (msg) {
   return msg.member.roles.some(r => intelPermissions.ragnarokIntelCreateTopicRoles.includes(r.name))
}

intelPermissions.canRequestRagnarokIntel = function (msg) {
   return msg.member.roles.some(r => intelPermissions.ragnarokIntelRequestRoles.includes(r.name))
}

module.exports = intelPermissions;
