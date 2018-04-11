var socket = io();
socket.emit('fetchTeams','2018iscmp',function(teams){
    teams.forEach(team => {
        var li = jQuery('<li></li>');
        li.text(`${team.nickname} #${team.team_number}`);
        jQuery('#fetchTeamsTest').append(li);
    });
});
socket.emit('lastMatch',function (match){
    var redTeams = match.alliances.red.team_keys;
    var blueTeams = match.alliances.blue.team_keys;
    jQuery('#matchNumber').text(match.match_number);
    jQuery('#red1').text(redTeams[0].replace('frc',''));
    jQuery('#red2').text(redTeams[1].replace('frc',''));
    jQuery('#red3').text(redTeams[2].replace('frc',''));
    jQuery('#blue1').text(blueTeams[0].replace('frc',''));
    jQuery('#blue2').text(blueTeams[1].replace('frc',''));
    jQuery('#blue3').text(blueTeams[2].replace('frc',''));
});