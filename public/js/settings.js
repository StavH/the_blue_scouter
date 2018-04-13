var socket = io();
socket.emit('settings', function (set) {
    console.log(settings);
    var settings = set;
    $('#year').val(settings.year);
    updateEventSelector('#year', '#event', function () {
        $('#event').val(settings.eventKey);
    });

})
var updateEventSelector = function (inputYear, inputEvent, callback) {
    var yearSelected = $(inputYear).val();
    $(inputEvent).find('option').remove();
    socket.emit('getEvents', {
        year: yearSelected
    }, function (events) {
        events.forEach(event => {
            $(inputEvent).append($('<option>', {
                text: event.name,
                value: event.year + event.event_code
            }));
        });
        callback();
    });
};
updateEventSelector('#yearSelector', '#eventSelector');

function selYearChanged() {
    updateEventSelector('#year', '#event');
};

function yearChanged() {
    updateEventSelector('#yearSelector', '#eventSelector');
};
$('#registerTeams').click(() => {
    socket.emit('fetchTeams', {
        key: $('#eventSelector').val(),
        register: true
    }, (teams) => {

    });
});
$('#save').click(() => {
    var newSettings = {
        year: $('#year').val(),
        eventKey: $('#event').val()
    };
    socket.emit('POST settings', newSettings, function (err) {
        if (err) {
            return window.alert('Couldnt save settings');
        }
        window.alert('Settings Saved!');
    });
});