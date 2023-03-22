// Node server to handle socket io connections
const io = require('socket.io')(5000, {  // server PORT
    cors: {
      origin: ["http://127.0.0.1:5500", "https://gupshup-chat-app.onrender.com"],  // client PORT
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  

const users = {}   // for users

// io.on -> to handle multiple instances/connection like multiple users 
io.on('connection', socket => {

    // to handle particular connection, if any new user joins let know the other people
    socket.on('new-user-joined', name => {
        // socket.io provide a unique Id to every connection that is socket.id
        users[socket.id] = name

        // to emit the event to all other participant except who joined
        socket.broadcast.emit('user-joined', name)   // if a new user joined the chat
    })

    // if someone sends a message, broadcast it to other people
    socket.on('send', message => {
        // to receive the message at the reciever side 
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    })

    // to send the message when someone left the chat to others
    // 'disconnect' -> built in
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id] // delete the user from the connection of socket.io
    })
})