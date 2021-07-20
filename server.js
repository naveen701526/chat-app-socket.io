const express = require('express');
const http = require('http');
const path = require('path');
const formatMessage = require('./utils/messages');
const app = express();

const server = http.createServer(app);
const socketio = require('socket.io');

const io = socketio(server);
// set static folder

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// run when client connects
io.on('connection', (socket) => {
  //   welcome the current user
  socket.emit('message', formatMessage(botName, 'Welcome To ChatCord!'));
  //   broadcast when a user connects
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat')
  );
  //   runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'));
  });

  //   listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`));
