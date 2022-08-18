const { load } = require('@sub0709/json-config');

/**
 * @param {Any} key
 * @param {Any} value
 */
const updatePlayerSetting = function (key, value) {
    let conf = load('config/player.json');
    conf.set(key, value);
    return conf.save();
}
/**
 * @param {Any} key
 */
const getPlayerSetting = function (key) {
    let conf = load('config/player.json');
    return conf.get(key);
}
/**
 * @param {Any} key
 */
 const getBotSetting = function (key) {
    let conf = load('config/bot.json');
    return conf.get(key);
}
module.exports = {updatePlayerSetting, getPlayerSetting, getBotSetting}