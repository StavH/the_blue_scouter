const request = require('request');
function fetchTeams(){
    
    var txtEventKey = document.getElementById('txtEventKey').innerText;
    
    request({
        url: 'http://www.thebluealliance.com/api/v3/teams/1?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8',
        json: true
    },
    (error,response,body) => {
        
        window.alert('');    
        // if(error){
        //     window.alert('Error');     
        // }
        // else{
        //     output = document.createElement("p");
        //     body.forEach(team => {
                
        //         window.alert(team.nickname);
        //         output.appendChild(team.nickname);
        //     });    
        // }
        
        
    });
}
