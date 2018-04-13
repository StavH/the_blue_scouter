const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '/settings.json');
var settings = new Promise((resolve, reject) => {
    fs.readFile(settingsPath, (err, data) => {
        if (err) {
            reject(err);
        }
        settings = JSON.parse(data);
        resolve(settings);
    });
});
var setSettings = (sets)=>{
    return new Promise((resolve, reject) => {
    fs.writeFile(settingsPath, JSON.stringify(sets), (err, data) => {
        if (err) {
            reject(err);
        }
        resolve();
    });
})
};
module.exports = {
    settings,
    setSettings
};