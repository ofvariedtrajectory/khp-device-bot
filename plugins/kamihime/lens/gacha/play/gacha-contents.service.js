const emoji = require('./chat-emoji-reference');

const contentsMap = {
  r: [],
  sr: [],
  ssr: [],
};

exports.createR = function (name, element, type) {
    return {
        name: name,
        type: type,
        rarity: 'r',
        element: element
    };
}

exports.createSR = function (name, element, type) {
    return {
        name: name,
        type: type,
        rarity: 'sr',
        element: element
    };
}

exports.createSSR = function (name, element, type) {
    return {
        name: name,
        type: type,
        rarity: 'ssr',
        element: element
    };
}
