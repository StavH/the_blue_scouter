const express = require('express');
const request = require('request');
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static('/public'))
app.get('/',(req,res) =>{
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/teams',(req,res)=>{
    request({
        url: 'https://www.thebluealliance.com/api/v3/teams/1?X-TBA-Auth-Key=lPiwFdvYHdFRwpB5nCcau29kgnGKw7CKUKsUhntbFZK3nQ8Mngfk4xaXpkz6vMu8',
        json:true
    }
    ,(error,response,body)=>{
        res.send(body);
    });
});
app.listen(port,()=>{`Server is listening on port ${port}`});