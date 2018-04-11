const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const request = require('request');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.get('/settings',(req,res)=>{
    res.sendFile(publicPath + '/settings.html')
});
io.on('connection', (socket) => {
    console.log('New Scouter Connected');
    socket.on('fetchTeams', (eventkey, callback) => {
        request({
            url: 'https://www.thebluealliance.com/api/v3/event/2018iscmp/teams?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8',
            json: true
        }, (error, response, body) => {
            callback(body);
        });
    });
    socket.on('lastMatch', (callback) => {
        request({
            url: 'https://www.thebluealliance.com/api/v3/event/2018nyli/matches?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8',
            json: true
        }, (error, response, body) => {
            var quals = body.filter(match => match.comp_level === "qm");
            console.log(quals[0]);
            var i=0;
            while(i<quals.length && quals[i].actual_time != null){
                i++;
            }
            
            callback(body[i]);
        });

    });
    socket.on('getTeam',(teamKey)=>{
        return 2;
    });
    socket.on('getEvents',(data,callback)=>{
        console.log('hello');
        var {year} = data;
        
        request({
            url: `https://www.thebluealliance.com/api/v3/events/${year}?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8`,
            json: true
        }, (error, response, body) => {            
            callback(body);
        });

    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});