import dotenv from 'dotenv';
import http from 'http'
import app from './app'
import dbConnector from './config'

dotenv.config();
const PORT = process.env.PORT;
const server = http.createServer(app)

dbConnector()
    .then(() => {
        server.listen(PORT, () => {
            console.log('API online with DB connected');
        })
    })
    .catch(error => {
        console.error(error);
    })