import jwt from 'jsonwebtoken';

export const createToken = (username) => {
    const newToken = jwt.sign({username}, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME
    })

    return newToken;
}

export const decodeToken = (token) => {
    return jwt.decode(token);
}

export const jwtMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if(!authorization) {
        return res.status(401).json({
            message: 'Missing valid header'
        })
    }

    const [, token] = authorization.split(' ');

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        return next();
    } catch (error) {
        return res.status(401).json(error);
    }
}