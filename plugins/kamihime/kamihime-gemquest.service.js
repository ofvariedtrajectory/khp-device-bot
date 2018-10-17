const schedule = require('node-schedule');


const internals = {};

const config = require('../../discord_bot').getConfig();

// Default state. Override mention_id in config.json
const state = {
  gemquest: {
    active: false,
    jobs: [],
    mention_id: config.gemquest_mention_id || '457438306179874820', // 'servants of alyssa (gemu)'
    times: {
      0: [
        {
          hour: 1,
          minute: 0
        }, {
          hour: 15,
          minute: 30
        }, {
          hour: 22,
          minute: 0
        },
      ],
      1: [
        {
          hour: 2,
          minute: 0
        }, {
          hour: 15,
          minute: 0
        }, {
          hour: 22,
          minute: 0
        },
      ],
      2: [
        {
          hour: 15,
          minute: 30
        }, {
          hour: 22,
          minute: 30
        },
      ],
      3: [
        {
          hour: 21,
          minute: 0
        },
      ],
      4: [
        {
          hour: 1,
          minute: 30
        }, {
          hour: 22,
          minute: 0
        },
      ],
      5: [
        {
          hour: 2,
          minute: 0
        }, {
          hour: 22,
          minute: 30
        },
      ],
      6: [
        {
          hour: 2,
          minute: 30
        }, {
          hour: 15,
          minute: 0
        }, {
          hour: 21,
          minute: 0
        },
      ],
    }
  }
}

const constructTimeString = function (hr, min) {
  return hr * 100 + min;
}

const getRemainingLengthOfDay = function (hr, min) {
  const remainingLength = {};
  if (min === 0) {
    remainingLength.hour = 24 - hr;
    remainingLength.minute = 0;
  } else {
    remainingLength.hour = 23 - hr;
    remainingLength.minute = 60 - min;
  }
  return remainingLength;
}

exports.nextGem = function(channel) {
  const now = new Date();
  let dayOfWeek = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const times = state.gemquest.times[dayOfWeek];
  const nowTimeString = constructTimeString(hour, minute);

  let msg = null;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const timeTimeString = constructTimeString(time.hour, time.minute);
    if (timeTimeString >= nowTimeString) {
      let hrCalc = time.hour - now.getHours();
      let minCalc = time.minute - now.getMinutes();
      if (minCalc < 0) {
        hrCalc--;
        minCalc += 60;
      }
      
      msg = 'The next gemquest is in ' + hrCalc + ' hours and ' + minCalc + ' minutes.';
    }
  }

  if (msg == null) {
    let nextDay = dayOfWeek + 1;
    if (nextDay == 7) {
      nextDay = 0;
    }
    const timeToUse = state.gemquest.times[nextDay][0];
    const remainingLengthTilGem = getRemainingLengthOfDay(hour, minute);
    remainingLengthTilGem.hour += timeToUse.hour;
    remainingLengthTilGem.minute += timeToUse.minute;
    if (remainingLengthTilGem.minute >= 60) {
      remainingLengthTilGem.hour++;
      remainingLengthTilGem.minute -= 60;
    }
    
    msg = 'The next gemquest is in ' + remainingLengthTilGem.hour + ' hours and ' + remainingLengthTilGem.minute + ' minutes.';
  }

  channel.send(msg);
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
