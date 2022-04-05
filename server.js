const express = require('express') //for server
const app = express()

const http = require('http').createServer(app)

const port = process.env.port || 3000 //localhost runs at this port

http.listen(port,()=>{
    console.log(`Listening on port ${port}`) // if working properly it consoles listening at port
})

app.use(express.static(__dirname + '/frontend'))

app.get('/',(req,res)=>{
    //res.send('Hello World!') //prints hello world
    //but we have send our index file here
     res.sendFile(__dirname + '/index.html')
})

const sock = require('socket.io')(http)
var users={};
sock.on('connection',(socket)=>{
    //users
    socket.on("new-user",(username)=>{
        users[socket.id]=username;
        socket.broadcast.emit('new_user',username)
    })
    //user left
    socket.on("disconnect",()=>{
        socket.broadcast.emit('user_left',user=users[socket.id])
        delete users[socket.id]
    })
   //msg recieved from user
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })
})