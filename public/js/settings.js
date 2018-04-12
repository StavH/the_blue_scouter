var socket = io();
var updateEventSelector = () => {
    var yearSelected = jQuery('#yearSelector').val();
    console.log(yearSelected);
    jQuery('#eventSelector').find('option').remove();
    socket.emit('getEvents', {
        year: yearSelected
    }, function (events) {
        events.forEach(event => {
            jQuery('#eventSelector').append($('<option>', {
                text: event.name,
                value: event.year + event.event_code
            }));
        });

    });
};
updateEventSelector();

function yearChanged() {
    updateEventSelector();
};
jQuery('#registerTeams').click(() => {
    socket.emit('fetchTeams', {
        key: jQuery('#eventSelector').val(),
        register: true
    }, (teams) => {

    });
});
jQuery('#save').click(() => {

});