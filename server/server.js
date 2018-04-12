const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const request = require('request');

const {
    mongoose
} = require('./db/mongoose');
const {
    Team
} = require('./models/team');
const {
    Match
} = require('./models/match');
const eventKey = '2018iscmp';
const publicPath = path.join(__dirname, '../public');
const settingsPath = path.join(__dirname, '/configs/settings.json');
var settings;
const port = process.env.PORT || 3000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);
fs.readFile(settingsPath, (err, data) => {
    if (!err) {
        settings = JSON.parse(data);
    }
});


app.use(express.static(publicPath));
app.get('/settings', (req, res) => {
    res.sendFile(publicPath + '/settings.html')
});
app.get('/insights', (req, res) => {
    res.sendFile(publicPath + '/insights.html')
});
io.on('connection', (socket) => {
    console.log('New Scouter Connected');
    socket.on('fetchTeams', (options, callback) => {
        var event = {
            key: options.key
        }
        console.log('Fetching teams for ', options.key);
        request({
            url: `https://www.thebluealliance.com/api/v3/event/${options.key}/teams?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8`,
            json: true
        }, (error, response, body) => {
            if (options.register) {
                body.forEach(team => {
                    Team.find({
                        team_num: team.team_number
                    }).then((exTeam) => {
                        if (exTeam.length == 0) {
                            var newTeam = Team({
                                team_num: team.team_number,
                                name: team.nickname
                            });
                            newTeam.events.push(event);
                            newTeam.save().then(() => {
                                console.log(team.team_number + ' Added');
                            }).catch((e) => {

                            });
                        } else {
                            Team.update({
                                team_num: team.team_number
                            }, {
                                $push: {
                                    events: event
                                }
                            }, (err, doc) => {
                                if (!err) {
                                    if (doc.nModified > 0) {
                                        console.log(team.team_number + ' registered for a new event');
                                    } else {
                                        console.log('No changes were made');
                                    }

                                } else {
                                    console.log(error);
                                }
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                    });

                });
            }
            callback(body);

        });

    });
    socket.on('teams/event', (data, callback) => {
        var {
            key
        } = data;

        Team.find({}).then((teams) => {
            var eTeams = [];
            teams.forEach(team => {
                var events = team.events;
                if (events.filter(event => event.key == key).length > 0) {

                    eTeams.push(team);
                }
            });

            callback(undefined, eTeams);
        }).catch((err) => {
            console.log(err);
        });
    });
    socket.on('commitMatch', (m, callback) => {
        console.log(m.event_key);
        console.log(m.match_key);
        console.log(m.team_num);
        Match.findOne({
            event_key: m.event_key,
            match_key: m.match_key,
            team_num: parseInt(m.team_num)
        }).then((match) => {
            console.log(match);
            if (!match) {
                var newMatch = new Match(m);
                return newMatch.save().then((doc) => {
                    callback('Match Saved!');
                }).catch(()=>{
                    callback('Match commit was unsuccesful');
                });
            }
            console.log('match exist');
            match.update({
                $set: m
            }).then(() => {
                callback('Match Saved!');
            }).catch(() => {
                callback('Match commit was unsuccesful');
            });
        });
    })
    socket.on('lastMatch', (callback) => {
        request({
            url: 'https://www.thebluealliance.com/api/v3/event/2018nyli/matches?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8',
            json: true
        }, (error, response, body) => {
            var quals = body.filter(match => match.comp_level === "qm");
            var i = 0;
            while (i < quals.length && quals[i].actual_time != null) {
                i++;
            }

            callback(body[i]);
        });

    });
    socket.on('getTeam', (teamKey) => {
        return 2;
    });
    socket.on('getEvents', (data, callback) => {
        var {
            year
        } = data;

        request({
            url: `https://www.thebluealliance.com/api/v3/events/${year}?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8`,
            json: true
        }, (error, response, body) => {
            callback(body);
        });

    });
    socket.on('settings', (callback) => {
        fs.readFile(settingsPath, (err, data) => {
            if (!err) {
                settings = JSON.parse(data);
                callback(settings);
            }
        });
    });
});



server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});