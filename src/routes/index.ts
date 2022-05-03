import express from 'express';
import {loginUser, createUser} from '../handlers/users';
import {createRoom } from '../handlers/rooms';
import {message} from '../handlers/messages';
import { jwtMiddleware } from '@/middlewares/jwt';

const router = express.Router();

const PREFIX = process.env.PREFIX;

// Login/Register
router.post(`/${PREFIX}/login`, loginUser);
router.post(`/${PREFIX}/register`, createUser);

// Rooms
router.post(`/${PREFIX}/createRoom`, createRoom);

// Messages
router.post(`/${PREFIX}/message`, message);

router.use('*', (req, res, next) => {
    return res.status(404).json('Not found!!!!');
});

export default router;