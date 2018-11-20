const map = {
    elements: {
        fire: 'fire',
        water: 'water',
        wind: 'wind',
        thunder: 'thunder',
        dark: 'dark',
        light: 'light'
    },
    rarity: {
        r: 'r_rarity',
        sr: 'sr_rarity',
        ssr: 'ssr_rarity'
    }
}

exports.getMap = function () {
    return map;
}

exports.generateEmoji = function (channel, emoji) {
    return channel.guild.emojis.find(val => val.name === emoji);
}
