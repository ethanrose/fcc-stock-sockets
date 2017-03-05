var express = require('express');
var app = express();
var port = process.env.PORT || 3001
var wsPort = process.env.PORT || 3005

var path = require('path')
app.use(express.static(path.join(__dirname, 'client/build')))

let stocks = []





app.get('/api/removeSymbol/:index', function(req, res){
    stocks.splice(req.params.index, 1)
    res.send('Successfully Removed!')
})
app.get('*', function(req, res){
    res.sendFile('/client/build/index.html')
})
app.listen(3001, function(){
    console.log('express server listening on port' + port)
})



const WebSocket = require('ws');
const ws = new WebSocket.Server({port: wsPort});

ws.on('connection', function connection(ws) {
    ws.send(JSON.stringify(stocks));
    ws.on('message', function incoming(message) {
        stocks.push(JSON.parse(message))
        ws.send(JSON.stringify(stocks))
    });
});