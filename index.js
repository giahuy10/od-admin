var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3300);
var cors = require('cors')
var bodyParser = require('body-parser')


var eventsRoute = require('./routes/events')
var photosRoute = require('./routes/photos')
var contactsRoute = require('./routes/contacts')
var newslettersRoute = require('./routes/newsletters')
var configsRoute = require('./routes/configs')
var usersRoute = require('./routes/users')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
// app.use(express.static('public'))

app.use('/api/events/', eventsRoute)
app.use('/api/photos/', photosRoute)
app.use('/api/contacts/', contactsRoute)
app.use('/api/newsletters/', newslettersRoute)
app.use('/api/configs/', configsRoute)
app.use('/api/users/', usersRoute)
// app.listen(3300, () => console.log(`Example app listening on port 3300!`))

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world ok' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });