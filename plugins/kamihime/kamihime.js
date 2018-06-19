exports.commands = [
  "attack",
  "gemquestoff",
  "gemdebug"
]

//var AuthDetails = require("../../auth.json");


// Notes for discord embed:

// msg.channel.send(embed(
//   "#FEAFEA", {"name": "Fire", 
//   "icon_url": msg.author.avatarURL, 
//   "url": "https://www.google.com"}, "Title", "Description",
//   [{"name": "Field 1", "value": "Value 1"}, 
//    {"name": "Field 2", "value": "Value 2"}],
//   {
//     "text": "This is footer text!", 
//     "icon_url": msg.guild.iconURL
//   }, 
//   {
//     "thumbnail": msg.guild.iconURL, 
//     "image": msg.author.avatarURL
//   }, 
//   false
// ));

const schedule = require('node-schedule');
const embed = require('embed-creator');

const state = {
  gemquest: {
    active: false,
    jobs: [],
    mention: 'servants of alyssa (gemu)',
    mention_id: '457438306179874820'
  }
}

const createScheduledJob = function(dayOfWeek, minute, hour, job) {
  state.gemquest.jobs.push(schedule.scheduleJob('0 ' + minute + ' ' + hour + ' * * ' + dayOfWeek, job));
}

const clearAllScheduledJobs = function() {
  if (state.gemquest.jobs.length) {
    for (let i = 0; i < state.gemquest.jobs.length; i++) {
      state.gemquest.jobs[i].cancel();
    }
    state.gemquest.jobs = [];
  }
}

const gemQuestMessage = function(msg) {
  return function (scheduledTime) {
    console.log('Gem Quest began at ', scheduledTime);
    msg.channel.send('<@&' + state.gemquest.mention_id + '> : Gem quest has begun! It will be active for the next 30 minutes.');
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
const createGemquestJobs = function(msg) {
  const jobFunction = gemQuestMessage(msg);

  createScheduledJob(1, 0, 2, jobFunction);
  createScheduledJob(1, 0, 15, jobFunction);
  createScheduledJob(1, 0, 22, jobFunction);

  createScheduledJob(2, 30, 15, jobFunction);
  createScheduledJob(2, 30, 22, jobFunction);

  createScheduledJob(3, 0, 21, jobFunction);

  createScheduledJob(4, 30, 1, jobFunction);
  createScheduledJob(4, 0, 22, jobFunction);

  createScheduledJob(5, 0, 2, jobFunction);
  createScheduledJob(5, 30, 22, jobFunction);

  createScheduledJob(6, 30, 2, jobFunction);
  createScheduledJob(6, 0, 15, jobFunction);
  createScheduledJob(6, 0, 21, jobFunction);

  createScheduledJob(0, 0, 1, jobFunction);
  createScheduledJob(0, 30, 15, jobFunction);
  createScheduledJob(0, 0, 22, jobFunction);
}

// https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
const isValidInteger = function(input) {
  const n = Math.floor(Number(input));
  return n !== Infinity && String(n) === input && n >= 0;
}

exports.attack = {
  usage: 'attack <displayAtk> <assaultAtk%> <charMainEido%> <charSupportEido%> <eleMainEido%> <eleSupportEido%>',
  description: function() {
    const str = "Kamihime Attack Calculator";
    return str;
  },
  process: function(bot,msg,suffix) {
// formula Damage = 
// 　Display Attack Power 
// 　　× (1 + Assault bonus + Character ATK UP Summon effect + Attack UP buffs + Assist bonus) 
// 　　× (Weakness correction(0.75/1/1.45[+ 0.03, if L/D]) + Element ATK UP Summon/Hero Weapon + Element ATK UP buffs) 
// 　　× (1 + *Other buffs) (e.g. Berserk, Stun punisher, etc.)
// 　　÷ {Enemy Defense × (1 - Defense DWN debuffs)}

    const args = (suffix || '').split(' ');

    console.log(args.length, args);

    if (args.length !== 6) {
      msg.channel.send('Correct usage: ' + this.usage);
      return;
    }


    let displayAtk;
    let assaultAtkPercent;
    let charAtkUpMainEidoPercent;
    let charAtkUpSupportEidoPercent;
    let elementAtkUpMainEidoPercent;
    let elementAtkUpSupportEidoPercent;
    try {
      if (isValidInteger(args[0])) {
        displayAtk = Number(args[0]);
      }
      if (isValidInteger(args[1])) {
        assaultAtkPercent = Number(args[1]);
      }
      if (isValidInteger(args[2])) {
        charAtkUpMainEidoPercent = Number(args[2]);
      }
      if (isValidInteger(args[3])) {
        charAtkUpSupportEidoPercent = Number(args[3]);
      }
      if (isValidInteger(args[4])) {
        elementAtkUpMainEidoPercent = Number(args[4]);
      }
      if (isValidInteger(args[5])) {
        elementAtkUpSupportEidoPercent = Number(args[5]);
      }
    } catch (e) {
      console.log(e);
      msg.channel.send("error: ", e);
    }

    // const displayAtk = 47137;
    // const assaultAtkPercent = 123;
    // const charAtkUpMainEidoPercent = 0;
    // const charAtkUpSupportEidoPercent = 0;
    const charAtkUpTotalEidoPercent = charAtkUpMainEidoPercent + charAtkUpSupportEidoPercent;
    const weaknessCorrection = 1;

    // const elementAtkUpMainEidoPercent = 105;
    // const elementAtkUpSupportEidoPercent = 100;
    const elementAtkUpTotalEidoPercent = elementAtkUpMainEidoPercent + elementAtkUpSupportEidoPercent;

    const damage =  displayAtk 
                      * (1 + (assaultAtkPercent / 100.0) + (charAtkUpTotalEidoPercent / 100.0))
                      * (weaknessCorrection + (elementAtkUpTotalEidoPercent / 100))
                    ;

    console.log(damage);
    console.log(suffix);
    msg.channel.send("damage:" + damage);
  }
}


exports.gemquest = {
  usage: 'gemquest',
  description: function() {
    var str = "Kamihime Gemquest Notifier Activation";
    return str;
  },
  process: function(bot,msg,suffix) {
    if (state.gemquest.active) {
      msg.channel.send("Kamihime Gemquest Notifier is already running.");
    } else {
      msg.channel.send("Activating Kamihime Gemquest Notifier");
      state.gemquest.active = true;

      createGemquestJobs(msg);
    }
  }
}

exports.gemquestoff = {
  usage: 'gemquestoff',
  description: function() {
    var str = "Kamihime Gemquest Notifier Deactivation"
    return str;
  },
  process: function(bot,msg,suffix) {
    if (state.gemquest.active) {
      msg.channel.send("Deactivating Kamihime Gemquest Notifier");
      state.gemquest.active = false;
      clearAllScheduledJobs();
    } else {
      msg.channel.send("Kamihime Gemquest Notifier is not currently running.");
    }
  }
}
