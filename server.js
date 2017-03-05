const WebSocket = require('ws');
const ws = new WebSocket.Server({ port: 3005 });
let stocks = []

ws.on('connection', function connection(ws) {
    ws.send(JSON.stringify(stocks));
    ws.on('message', function incoming(message) {
        stocks.push(JSON.parse(message))
        ws.send(JSON.stringify(stocks))
    });
});


var express = require('express');
var app = express();
var port = process.env.PORT || 3001

app.get('/api/removeSymbol/:index', function(req, res){
    stocks.splice(req.params.index, 1)
    res.send('Successfully Removed!')
})

app.listen(3001, function(){
    console.log('express server listening on port' + port)
})