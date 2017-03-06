var express = require('express');
var app = express();
var port = process.env.PORT || 3001

var path = require('path')
app.use(express.static(path.join(__dirname, 'client/build')))
var expressWs = require('express-ws')(app)

let stocks = []


app.ws('/a', function(ws, req){
        ws.send(JSON.stringify(stocks));
        ws.on('message', function incoming(message) {
            console.log(ws.clients)
            stocks.push(JSON.parse(message))
            expressWs.getWss('/a').clients.forEach(function(client){
                client.send(JSON.stringify(stocks))
            })
        });
})

app.get('/api/removeSymbol/:index', function(req, res){
    stocks.splice(req.params.index, 1)
    res.send('Successfully Removed!')
})
app.get('*', function(req, res){
    res.sendFile('/client/build/index.html')
})
app.listen(port, function(){
    console.log('express server listening on port' + port)
})