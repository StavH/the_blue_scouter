const fs = require('fs');
var settings;
fs.readFile('/../configs/settings.json', (err, data) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log('Read');
        console.log(data);
    }
    
});

module.exports = {settings};