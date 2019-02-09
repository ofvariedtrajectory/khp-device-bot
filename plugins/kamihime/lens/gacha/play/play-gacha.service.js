const gachaContentsService = require('./gacha-contents.service');
const emoji = require('./chat-emoji-reference');

const internals = {
  rates: {
    r: 82,
    sr: 15,
    ssr: 3,
  }
};

// TODO move to gacha-contents.service
const contentsMap = {
  r: [],
  sr: [],
  ssr: [],
};

// init data
internals.rates.baseDenominator = internals.rates.r + internals.rates.sr + internals.rates.ssr;
contentsMap.r.push(gachaContentsService.createR('Apsara', 'water', 'kamihime weapon'));
contentsMap.sr.push(gachaContentsService.createSR('Anzu', 'thunder', 'eidolon'));
contentsMap.ssr.push(gachaContentsService.createSSR('Belial', 'fire', 'eidolon'));

exports.rollGacha = internals.rollGacha = function (channel) {
  const tenPull = [];
  for (let i = 0; i < 10; i++) {
    tenPull.push(internals._rollSingleGacha());
  }
  
  internals.displayResults(channel, tenPull)
}

exports.rollYoloGacha = internals.rollYoloGacha = function (channel) {
  internals.displayResults(channel, [internals._rollSingleGacha()]);
}

internals._rollSingleGacha = function () {
  const roll = Math.floor(Math.random() * internals.rates.baseDenominator) + 1;
  if (roll > internals.rates.r) {
    if (roll > internals.rates.r + internals.rates.sr) {
      // is ssr
      const ssrRoll = Math.floor(Math.random() * contentsMap.ssr.length);
      return contentsMap.ssr[ssrRoll];
    } else {
      // is sr
      const srRoll = Math.floor(Math.random() * contentsMap.sr.length);
      return contentsMap.sr[srRoll];
    }
  } else {
    // is r
    const rRoll = Math.floor(Math.random() * contentsMap.r.length);
    return contentsMap.r[rRoll];
  }
}

internals.displayResults = function (channel, results) {
  let resultsDisplay = '';
  for (let i = 0; i < results.length; i++) {
    resultsDisplay += internals.resultTemplate(channel, results[i]) + '\n';
  }
  channel.send('You rolled:\n' + resultsDisplay);
};

internals.resultTemplate = function (channel, result) {
  let template = emoji.generateEmoji(channel, emoji.getMap().rarity[result.rarity])
    + emoji.generateEmoji(channel, emoji.getMap().elements[result.element])
    + ' [' + result.type + '] '
    + result.name;
  
  return template;
}
