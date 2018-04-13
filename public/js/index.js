var socket = io();
var position;
socket.emit('settings', function (obj) {
    settings = obj;
    console.log(settings.eventKey);

});
function setMatch (match){
    var redTeams = match.alliances.red.team_keys;
    var blueTeams = match.alliances.blue.team_keys;
    jQuery('#matchNumber').text(match.match_number);
    jQuery('#red1').text(redTeams[0].replace('frc', ''));
    jQuery('#red2').text(redTeams[1].replace('frc', ''));
    jQuery('#red3').text(redTeams[2].replace('frc', ''));
    jQuery('#blue1').text(blueTeams[0].replace('frc', ''));
    jQuery('#blue2').text(blueTeams[1].replace('frc', ''));
    jQuery('#blue3').text(blueTeams[2].replace('frc', ''));
}
const event_key = '2018micmp1';
socket.emit('lastMatch',function (match) {
 setMatch(match);   
});
$('#red1').click(function () {
    $('#red1').addClass("chosen");
    $('#red2 , #red3 , #blue1 , #blue2 , #blue3').removeClass("chosen");
    position = 'red1';
});
$('#blue1').click(function () {
    $('#blue1').addClass("chosen");
    $('#red1 , #red2 , #red3 , #blue2 , #blue3').removeClass("chosen");
    position = 'blue1';
});
$('#red2').click(function () {
    $('#red2').addClass("chosen");
    $('#red1 , #red3 , #blue1 , #blue2 , #blue3').removeClass("chosen");
    position = 'red2';
});
$('#red3').click(function () {
    $('#red3').addClass("chosen");
    $('#red1 , #red2 , #blue1 , #blue2 , #blue3').removeClass("chosen");
    position = 'red3';
});
$('#blue2').click(function () {
    $('#blue2').addClass("chosen");
    $('#red2 , #red3 , #blue1 , #red1 , #blue3').removeClass("chosen");
    position = 'blue2';
});
$('#blue3').click(function () {
    $('#blue3').addClass("chosen");
    $('#red1 , #red2 , #red3 , #blue2 , #blue1').removeClass("chosen");
    position = 'blue3';
});
jQuery('#btnExAdd').click(function () {
    var lastVal = jQuery('#exVal').text();
    jQuery('#exVal').text(++lastVal);
});
jQuery('#btnExSub').click(function () {
    var lastVal = jQuery('#exVal').text();
    if (lastVal != 0) {
        jQuery('#exVal').text(--lastVal);
    }

});

jQuery('#btnScaleAdd').click(function () {
    var lastVal = jQuery('#scaleVal').text();
    jQuery('#scaleVal').text(++lastVal);
});
jQuery('#btnScaleSub').click(function () {
    var lastVal = jQuery('#scaleVal').text();
    if (lastVal != 0) {
        jQuery('#scaleVal').text(--lastVal);
    }

});
jQuery('#btnNSwitchAdd').click(function () {
    var lastVal = jQuery('#NSwitchVal').text();
    jQuery('#NSwitchVal').text(++lastVal);
});
jQuery('#btnNSwitchSub').click(function () {
    var lastVal = jQuery('#NSwitchVal').text();
    if (lastVal != 0) {
        jQuery('#NSwitchVal').text(--lastVal);
    }

});
jQuery('#btnFSwitchAdd').click(function () {
    var lastVal = jQuery('#FSwitchVal').text();
    jQuery('#FSwitchVal').text(++lastVal);
});
jQuery('#btnFSwitchSub').click(function () {
    var lastVal = jQuery('#FSwitchVal').text();
    if (lastVal != 0) {
        jQuery('#FSwitchVal').text(--lastVal);
    }

});
$('#btnCommit').click(function () {
    if (!position) {
        var danger = $('<div></div>');
        danger.addClass('alert alert-danger alert-dismissible');
        danger.html('You must select a position!');
        return $('#commit').prepend(danger);
    }
    if (!$('#matchNumber').text()) {
        var danger = $('<div></div>');
        danger.addClass('alert alert-danger alert-dismissible');
        danger.html('Wait for match to load!');
        return $('#commit').prepend(danger);
    }
    if ($('#' + position).text() == '----') {
        var danger = $('<div></div>');
        danger.addClass('alert alert-danger alert-dismissible');
        danger.html('Wait for match to load!');
        return $('#commit').prepend(danger);
    }
    const match_key = 'qm' + $('#matchNumber').text();
    var match = {
        event_key: '2018iscmp',
        match_key,
        team_num: $('#' + position).text(),
        scale: $('#scaleVal').text(),
        near_switch: $('#NSwitchVal').text(),
        far_switch: $('#FSwitchVal').text(),
        exchange: $('#exVal').text(),
        end_game: $('[name="endgame"]:checked').val(),
        assist: $('[name="assist"]:checked').val(),
        notes: $('#notes').val()
    }
    socket.emit('commitMatch', match, function (msg) {
        window.alert(msg);
    });

});
$('#btnPrev').click(function () {

    var match_key = event_key + '_qm' + ($('#matchNumber').text() - 1);
    socket.emit('match', match_key, function (match) {
        setMatch(match);
    });
});
$('#btnNext').click(function () {
    var  matchNumber = parseInt($('#matchNumber').text()) + 1;
    var match_key = event_key + '_qm' + matchNumber;
    
    socket.emit('match', match_key, function (match) {
        setMatch(match);
    });
});