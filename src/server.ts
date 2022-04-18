import dotenv from 'dotenv';
dotenv.config();
import http from 'http'
import app from './app'
import dbConnector from './config'
import {Server as socketio} from 'socket.io'


const PORT = process.env.PORT;


const server = http.createServer(app)
const io = new socketio(server);


io.on('connection', socket => {
    socket.emit('message', "Welcome to chat");
    
})


dbConnector()
    .then(() => {
        server.listen(PORT, () => {
            console.log('API online with DB connected');
        })
    })
    .catch(error => {
        console.error(error);
    })