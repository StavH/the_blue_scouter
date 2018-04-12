var socket = io();
var updateEventSelector = () => {
    jQuery('#eventSelector').append($('<option>', {
        text: 'Loading...'
        
    }));
    var yearSelected = jQuery('#yearSelector').val();
    console.log(yearSelected);
    jQuery('#eventSelector').find('option').remove();
    jQuery('#eventSelector').append($('<option>', {
        text: 'Choose Event -->',
        value: '999'
    }));
    socket.emit('getEvents', {
        year: yearSelected
    }, function (events) {
        events.forEach(event => {
            jQuery('#eventSelector').find({}).remove();
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
function eventChanged(){
    socket.emit('teams/event',{
        key: jQuery('#eventSelector').val(),
    },(err,teams)=>{
        if(err){
            window.alert(err);
        }
        else{
            $('#teams-table').tabulator({
                columns:[
                    {title:"#", field:"team_num", width:200}
                    ,{title:"Name", field:"name",width:200}
                ]
            });
            $('#teams-table').tabulator("setData",teams);
            
            
        }
        
    });
};