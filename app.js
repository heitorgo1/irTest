// app code goes here
// matrix.init()....
//
// have fun

const remotes = require('./remotes_only_tv.json');

Array.prototype.last = function () {
    return this[this.length-1];
}

const major_manufacturers = Object.keys(remotes).reduce((acc, key) => {
    if (remotes[key].length > 3) acc[key] = remotes[key];
    return acc;
}, {});

const irCommand = function(cmd) {
    return (brand, model) => matrix.ir(brand, model).send(cmd);
}

const sendPowerOn = irCommand('KEY_POWER');
const sendPowerOff = irCommand('KEY_POWER');
const sendVolumeUp = irCommand('KEY_VOLUMEUP');
const sendVolumeDown = irCommand('KEY_VOLUMEDOWN');
const sendChannelUp = irCommand('KEY_CHANNELUP');
const sendChannelDown = irCommand('KEY_CHANNELDOWN');

let currentModel = 'one_for_all';

matrix.store.get('currentModel', (val) => {
    if (val !== null) currentModel = val;
});

Object.keys(major_manufacturers).forEach(key => {
    matrix.on(key, () => {
        currentModel = key;
        matrix.store.set('currentModel', key);
    });
});

matrix.on('channel_up', function(payload) {
    sendChannelUp(currentModel, major_manufacturers[currentModel].last());
});
matrix.on('channel_down', function(payload) {
    sendChannelDown(currentModel, major_manufacturers[currentModel].last());
});
matrix.on('volume_up', function(payload) {
    sendVolumeUp(currentModel, major_manufacturers[currentModel].last());
});
matrix.on('volume_down', function(payload) {
    sendVolumeDown(currentModel, major_manufacturers[currentModel].last());
});
matrix.on('power_on', function(payload) {
    sendPowerOn(currentModel, major_manufacturers[currentModel].last());
});
matrix.on('power_off', function(payload) {
    sendPowerOff(currentModel, major_manufacturers[currentModel].last());
});
