import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes'

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(router)

export default app