import Message from '../models/Message';
import {io} from '../server'


export const message = (req, res) => { // route would have to include /rooms/:room/message
    // need to emit message
    io.emit("message", req.body.message)
    console.log(req.headers.cookie)
    // store message into db

    return res.status(200).json(req.body)
}