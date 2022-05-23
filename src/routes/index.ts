import express from 'express';
import { loginUser, createUser} from '../handlers/users';
import { createRoom, getRooms, joinRoom } from '../handlers/rooms';
import { getMessages } from '../handlers/messages';

const router = express.Router();

const PREFIX = process.env.PREFIX;

// Login/Register
router.post(`/${PREFIX}/login`, loginUser);
router.post(`/${PREFIX}/register`, createUser);

// Rooms
router.get(`/${PREFIX}/createRoom`, createRoom);
router.get(`/${PREFIX}/rooms`, getRooms);
router.get(`/${PREFIX}/rooms/:room_id/join`, joinRoom);

// Messages
router.get(`/${PREFIX}/rooms/:room_id/messages`, getMessages);

router.use('*', (req, res, next) => {
    return res.status(404).json('Not found!!!!');
});

export default router;