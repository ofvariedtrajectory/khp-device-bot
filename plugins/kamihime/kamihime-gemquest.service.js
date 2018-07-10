const schedule = require('node-schedule');


const internals = {};

const config = require('../../discord_bot').getConfig();

// Default state. Override mention_id in config.json
const state = {
  gemquest: {
    active: false,
    jobs: [],
    mention_id: config.gemquest_mention_id || '457438306179874820' // 'servants of alyssa (gemu)'
  }
}

exports.gemuRoleToggle = function(msg) {
  const channel = msg.channel;
  const rolecheck = msg.member.roles.has(state.gemquest.mention_id);
  const gemuRole = msg.guild.roles.find('id', state.gemquest.mention_id);

  try {
    if (rolecheck) {
      msg.member.removeRole(gemuRole).catch(console.error);
      channel.send('Removed gemu role from ' + msg.member);
    } else {
      msg.member.addRole(gemuRole).catch(console.error);
      channel.send('Applied gemu role to ' + msg.member);
    }
  } catch (e) {
    console.log('error during gemuRoleToggle', e)
  }
}

exports.activateGemquest = internals.activateGemquest = function(channel, silent) {
  if (state.gemquest.active) {
    channel.send('Kamihime Gemquest Notifier is already running.');
  } else {
    !silent && channel.send('Activating Kamihime Gemquest Notifier');
    state.gemquest.active = true;

    internals.createGemquestJobs(channel);
  }
}

exports.deactivateGemquest = internals.deactivateGemquest = function(channel) {
  if (state.gemquest.active) {
    channel.send('Deactivating Kamihime Gemquest Notifier');
    state.gemquest.active = false;
    internals.clearAllScheduledJobs();
  } else {
    channel.send('Kamihime Gemquest Notifier is not currently running.');
  }
}

internals.createScheduledJob = function(dayOfWeek, minute, hour, job) {
  state.gemquest.jobs.push(schedule.scheduleJob('0 ' + minute + ' ' + hour + ' * * ' + dayOfWeek, job));
}

internals.clearAllScheduledJobs = function() {
  if (state.gemquest.jobs.length) {
    for (let i = 0; i < state.gemquest.jobs.length; i++) {
      state.gemquest.jobs[i].cancel();
    }
    state.gemquest.jobs = [];
  }
}

internals.gemQuestMessage = function(channel) {
  return function (scheduledTime) {
    console.log('Gem Quest began at ', scheduledTime);
    try {
      channel.send('<@&' + state.gemquest.mention_id + '> : Gem quest has begun! It will be active for the next 30 minutes.');
    } catch (e) {
      console.log('error during gemQuestMessage', e)
    }
  };
}



/**
  Currently assumes EST (UTC-5) timezone
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

1: 0200-0230, 1500-1530, 2200-2230
  0 0  2 * * 1
  0 0 15 * * 1
  0 0 22 * * 1
2: 1530-1600, 2230-2300
  0 30 15 * * 2
  0 30 22 * * 2
3: 2100-2130, [2530-2600]
  0 0 21 * * 3
4: 0130-0200, 2200-2230, [2600-2630]
  0 30 1 * * 4
  0 0 22 * * 4
5: 0200-0230, 2230-2300, [2630-2700]
  0  0  2 * * 5
  0 30 22 * * 5
6: 0230-0300, 1500-1530, 2100-2130, [2500-2530]
  0 30 2 * * 6
  0 0 15 * * 6
  0 0 21 * * 6
0: 0100-0130, 1530-1600, 2200-2230, [2600-2630]
  0  0  1 * * 0
  0 30 15 * * 0
  0  0 22 * * 0
  **/
internals.createGemquestJobs = function(channel) {
  const jobFunction = internals.gemQuestMessage(channel);

  internals.createScheduledJob(1, 0, 2, jobFunction);
  internals.createScheduledJob(1, 0, 15, jobFunction);
  internals.createScheduledJob(1, 0, 22, jobFunction);

  internals.createScheduledJob(2, 30, 15, jobFunction);
  internals.createScheduledJob(2, 30, 22, jobFunction);

  internals.createScheduledJob(3, 0, 21, jobFunction);

  internals.createScheduledJob(4, 30, 1, jobFunction);
  internals.createScheduledJob(4, 0, 22, jobFunction);

  internals.createScheduledJob(5, 0, 2, jobFunction);
  internals.createScheduledJob(5, 30, 22, jobFunction);

  internals.createScheduledJob(6, 30, 2, jobFunction);
  internals.createScheduledJob(6, 0, 15, jobFunction);
  internals.createScheduledJob(6, 0, 21, jobFunction);

  internals.createScheduledJob(0, 0, 1, jobFunction);
  internals.createScheduledJob(0, 30, 15, jobFunction);
  internals.createScheduledJob(0, 0, 22, jobFunction);
}
