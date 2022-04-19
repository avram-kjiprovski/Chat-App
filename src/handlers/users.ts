import bcrypt from 'bcrypt';
import User from '../models/User';
import { createToken } from '../middlewares/jwt';

export const loginUser = async (req, res, next) => {
    const userInfo = req.body;

    if(!userInfo.username || !userInfo.password) {
        return res.status(400).json({
            message: 'Missing username or password'
        });
    }

    try {
        const userInDB = await User.findOne({
            username: userInfo.username,
        });

        if(!userInDB) return res.status(400).json('User not found');

        const passwordComparison = await bcrypt.compare(
            userInfo.password,
            userInDB.password
        )

        if(passwordComparison){
            const newToken = createToken(userInfo.username);
            return res.status(200).json(newToken);
        } else {
            return res.status(401).json('Wrong password');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const createUser = async (req, res, next) => {
    const userInfo = req.body;

    if(!userInfo.username || userInfo.username.length < 6){
        return res.status(400).json({
            message: 'Username must be at least 6 characters long'
        });
    }

    if(!userInfo.password || userInfo.password.length < 6){
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }

    try {
        const existingUser = await User.findOne({
            username: userInfo.username,
        })

        if(existingUser) return res.status(400).json('Username already exists');

        const encryptedPassword = await bcrypt.hash(
            userInfo.password,
            parseInt(process.env.SALT_ROUNDS)
        );

        const newUser = {
            username: userInfo.username,
            password: encryptedPassword
        };

        await User.create(newUser)
        return res.status(201).json('User created');
    } catch (error) {
        return res.status(500).json(`Error: ${error}`);
    }
}