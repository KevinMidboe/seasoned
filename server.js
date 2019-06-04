var express = require('express');
var path = require('path');
const compression = require('compression')
var history = require('connect-history-api-fallback');

app = express();

app.use(compression())
app.use('/dist', express.static(path.join(__dirname + "/dist")));
app.use('/dist', express.static(path.join(__dirname + "/dist/")));
app.use('/favicons', express.static(path.join(__dirname + "/favicons")));
app.use(history({
    index: '/'
}));

var port = process.env.PORT || 5000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(port);
