exports.commands = [
  'attack',
  'nextgem',
  'gemquest',
  'gemquestoff',
  'devdebug',
  'gemu',
]

//var AuthDetails = require("../../auth.json");


// Notes for discord embed:

// const embed = require('embed-creator');
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
const lens = require('./lens');
const gemquestService = require('./kamihime-gemquest.service');
const profileService = lens.profile;
let mongodb;



const initialize = function() {
  const discordBot = require('../../discord_bot');
  const bot = discordBot.getBot();
  const mongodbClient = require('../../lib/mongo');

  const gemquestChannel = bot.channels.find('name', 'gemquest');
  if (gemquestChannel) {
    console.log('initializing gemquest');
    gemquestService.activateGemquest(gemquestChannel, true);
  }

  const config = discordBot.getConfig();

  mongodbClient.connect({
    user: config.mongoUser,
    pass: config.mongoPass,
    db: config.mongoDb
  }).then(function(db) {
    mongodb = db.db('device');

    lens.init(config, mongodb);
  }).catch(function(e) {
    console.log(e);
  });

}
initialize();



exports.devdebug = {
  usage: 'devdebug',
  description: function() {
    return 'Kamihime Developer Debug';
  },
  process: function(bot,msg,suffix) {
    const channel = msg.channel;
    console.log(msg.author.username);

    profileService.getProfileOrCreate(msg.author.id , msg.author.username, mongodb).then(function(profile) {
      console.log(profile);
      channel.send(msg.author.id);
    }).catch(function(e) {
      console.log(e);
    });

  }
}

// https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
const isValidInteger = function(input) {
  const n = Math.floor(Number(input));
  return n !== Infinity && String(n) === input && n >= 0;
}

exports.attack = {
  usage: 'attack <displayAtk> <assaultAtk%> <charMainEido%> <charSupportEido%> <eleMainEido%> <eleSupportEido%>',
  description: function() {
    return 'Kamihime Attack Calculator';
  },
  process: function(bot,msg,suffix) {
    const channel = msg.channel;
// formula Damage = 
// 　Display Attack Power 
// 　　× (1 + Assault bonus + Character ATK UP Summon effect + Attack UP buffs + Assist bonus) 
// 　　× (Weakness correction(0.75/1/1.45[+ 0.03, if L/D]) + Element ATK UP Summon/Hero Weapon + Element ATK UP buffs) 
// 　　× (1 + *Other buffs) (e.g. Berserk, Stun punisher, etc.)
// 　　÷ {Enemy Defense × (1 - Defense DWN debuffs)}

// = display ATK
// × (1 + Weapon assault + Eido chrUP + ATK buff + assist)
// × (1 + elemAdv + Eido ElemUP + ElemUP buff) 
// × (1 + Guardian Effect)
// × (1 + Other ability Effect)
// × (1 - Allies ATK down debuff)
// ÷ {enemy DEF × (1 - DEF debuff)}

    const args = (suffix || '').split(' ');

    console.log(args.length, args);

    if (args.length !== 6) {
      channel.send('Correct usage: ' + this.usage);
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
      channel.send('error: ', e);
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
    channel.send('damage: ' + Math.round(damage));
  }
}

exports.nextgem = {
  usage: 'nextgem',
  description: function() {
    return 'Tells how long until next Kamihime Gemquest';
  },
  process: function(bot,msg,suffix) {
    gemquestService.nextGem(msg.channel);
  }
}

exports.gemquest = {
  usage: 'gemquest',
  description: function() {
    return 'Kamihime Gemquest Notifier Activation';
  },
  process: function(bot,msg,suffix) {
    gemquestService.activateGemquest(msg.channel);
  }
}

exports.gemquestoff = {
  usage: 'gemquestoff',
  description: function() {
    return 'Kamihime Gemquest Notifier Deactivation';
  },
  process: function(bot,msg,suffix) {
    gemquestService.deactivateGemquest(msg.channel);
  }
}

exports.gemu = {
  usage: 'gemu',
  description: function() {
    return 'Toggle gemu role for gemquest notifications';
  },
  process: function(bot,msg,suffix) {
    gemquestService.gemuRoleToggle(msg);
  }
}
