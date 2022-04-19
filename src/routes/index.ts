import express from 'express';
import {loginUser, createUser} from '../handlers/users';
import { jwtMiddleware } from '@/middlewares/jwt';


const router = express.Router();


const PREFIX = process.env.PREFIX;

router.post(`/${PREFIX}/login`, loginUser);
router.post(`/${PREFIX}/register`, createUser);

router.use('*', (req, res, next) => {
    return res.status(404).json('Not found!!!!');
});

export default router;