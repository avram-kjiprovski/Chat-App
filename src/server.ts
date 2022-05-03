import dotenv from 'dotenv';
dotenv.config();
import http from 'http'
import app from './app'
import dbConnector from './config'
import {Server as socketio} from 'socket.io'

// privremeno
import {createRoom} from './handlers/rooms'

const PORT = process.env.PORT;

const server = http.createServer(app)

export const io = new socketio(server, {
    cors: {
        origin: '*',
    }
});


dbConnector()
    .then(() => {

        io.on('connection', socket => {
            // console.log("Connected");

            // socket.on("disconnect", () => {
            //     console.log("Client disconnected");
            // });

            // socket.on("message", msg => {
            //     console.log("Message: " + msg);
            //     io.emit("message", msg);
            // });

            // socket.on('createRoom', room => {
            //     createRoom(room).then(
            //         room => {
            //             socket.emit('roomCreated', room);
            //         }
            //     )
            // })

            
        })


        server.listen(PORT, () => {
            console.log('API online with DB connected');
        })
    })
    .catch(error => {
        console.error(error);
    })