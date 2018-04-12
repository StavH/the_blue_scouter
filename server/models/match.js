var mongoose = require('mongoose');
var Match = mongoose.model('Match', {
    event_key: {
        type: String,
        required: true
    },
    match_key: {
        type: String,
        required: true
    },
    team_num:{
        type: Number,
        required:true
    },
    scale:{
        type: Number,
        default: 0
    },
    near_switch:{
        type:Number,
        default:0
    },
    far_switch:{
        type:Number,
        default:0
    },
    exchange:{
        type:Number,
        default:0
    },
    end_game:{
        type:String
    },
    assist:{
        type:Number,
        default:0
    },
    notes:{
        type:String
    }
    

});
module.exports = {
    Match
};