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
jQuery('#btnScaleAdd').click(function(){
    var lastVal = jQuery('#scaleVal').text();
    jQuery('#scaleVal').text(++lastVal);
});
jQuery('#btnScaleSub').click(function(){
    var lastVal = jQuery('#scaleVal').text();
    if(lastVal != 0){
        jQuery('#scaleVal').text(--lastVal);
    }
    
});
jQuery('#btnNSwitchAdd').click(function(){
    var lastVal = jQuery('#NSwitchVal').text();
    jQuery('#NSwitchVal').text(++lastVal);
});
jQuery('#btnNSwitchSub').click(function(){
    var lastVal = jQuery('#NSwitchVal').text();
    if(lastVal != 0){
        jQuery('#NSwitchVal').text(--lastVal);
    }
    
});
jQuery('#btnFSwitchAdd').click(function(){
    var lastVal = jQuery('#FSwitchVal').text();
    jQuery('#FSwitchVal').text(++lastVal);
});
jQuery('#btnFSwitchSub').click(function(){
    var lastVal = jQuery('#FSwitchVal').text();
    if(lastVal != 0){
        jQuery('#FSwitchVal').text(--lastVal);
    }
    
});