var mongoose = require('mongoose');
var Team = mongoose.model('Team', {
    team_num: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    events: [{
        key: {
            type: String,
            required: true
        },
        matches_keys: [String]
    }]

});
module.exports = {
    Team
};