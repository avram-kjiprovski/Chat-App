import {io} from '../server'
import {decodeToken, jwtMiddleware} from '../middlewares/jwt'
// this code is not being used because we are using socket.io
// but in another file lmao

io.use(async (socket, next) => {
    console.log('Socket middleware');
    const decoded: Object | any = await decodeToken(socket.handshake.headers.cookie.split('=')[1]);

    if(decoded){
        next();
    } else {
        next(new Error('Authentication error'));
    }


})

io.on('connection', (socket) => {   

    console.log('Socket middleware');
    socket.emit('message', 'Welcome to the chat');

})