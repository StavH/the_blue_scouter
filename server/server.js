const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const request = require('request');

const logs = require('./configs/logs');
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
const port = process.env.PORT || 3000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);
var settings;
app.use(express.static(publicPath));
app.use((req,res,next)=>{
    const settings_config = require('./configs/settings-configs');
    settings_config.settings.then((set)=>{
        logs.log('Settings were found!');
        settings= set;
        next();
    },(err)=>{
        logs.log('Error on reading settings');
        next();
    });    
});

app.get('/settings', (req, res) => {
    res.sendFile(publicPath + '/settings.html')
});
app.get('/insights', (req, res) => {
    res.sendFile(publicPath + '/insights.html')
});
io.on('connection', (socket) => {
    logs.log('New Scouter Connected');
    logs.log(settings);    
    socket.on('fetchTeams', (options, callback) => {
        var event = {
            key: options.key
        }
        logs.log('Fetching teams for ', options.key);
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
                                logs.log(team.team_number + ' Added');
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
                                        logs.log(team.team_number + ' registered for a new event');
                                    } else {
                                        logs.log('No changes were made');
                                    }

                                } else {
                                    logs.log(error);
                                }
                            });
                        }
                    }).catch((err) => {
                        logs.log(err);
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
            logs.log(err);
        });
    });
    socket.on('commitMatch', (m, callback) => {
        logs.log(settings.eventKey);
        logs.log(m.match_key);
        logs.log(m.team_num);
        Match.findOne({
            event_key: settings.eventKey,
            match_key: m.match_key,
            team_num: parseInt(m.team_num)
        }).then((match) => {
            logs.log(match);
            if (!match) {
                var newMatch = new Match(m);
                return newMatch.save().then((doc) => {
                    callback('Match Saved!');
                }).catch(()=>{
                    callback('Match commit was unsuccesful');
                });
            }
            logs.log('match exist');
            match.update({
                $set: m
            }).then(() => {
                logs.log(`Match ${m.match_key} was saved for ${m.team_num} at ${settings.event_key}`)
                callback('Match Saved!');
            }).catch(() => {
                logs.log(`Match ${m.match_key}  for ${m.team_num} at ${settings.event_key} didnt commit`)
                callback('Match commit was unsuccesful');
            });
        });
    })
    socket.on('lastMatch', (callback) => {
        request({
            url: `https://www.thebluealliance.com/api/v3/event/${settings.eventKey}/matches?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8`,
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
    socket.on('match',(key,callback)=>{
        request({
            url: `https://www.thebluealliance.com/api/v3/match/${key}?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8`,
            json: true
        }, (error, response, body) => {
            callback(body);
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
        callback(settings);
    });
    socket.on('POST settings',(sets,callback) => {
        const settings_config = require('./configs/settings-configs');
        settings_config.setSettings(sets).then(()=>{
            logs.log('Settings saved');
            callback();
        },(err)=>{
            
            logs.log('Problam saving settings: ',err);
            callback(err);
        });
    });
});



server.listen(port, () => {
    logs.log(`Server is listening on port ${port}`);
});