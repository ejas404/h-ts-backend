
import express from 'express'
import 'dotenv/config'


import http from "http";
import cors from 'cors'
import dbConnect from './config/db.ts'

import cookieParser from 'cookie-parser'

import  {adminRouter} from './routes/admin_route.ts'
import { errMiddleware } from './middlewares/error_middlware.ts'
import { studentRouter } from './routes/student_route.ts'
import { tutorRouter } from './routes/tutor_route.ts'
import { courseRouter } from './routes/course_route.ts'
import {Server} from 'socket.io'
import { BASE_URL } from './utility/constants.ts'


const app = express()
const PORT = process.env.PORT

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: BASE_URL
  },
});

io.on('connection', (socket) => {
    console.log('a user connected');
})  

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('src/public'))
app.use(cors({origin : '*', credentials : true}))


app.use('/admin', adminRouter)
app.use('/student',studentRouter)
app.use('/tutor', tutorRouter)
app.use('/course', courseRouter)

app.use(errMiddleware)

dbConnect()
 server.listen(PORT, () => {
    console.log('server started at port ' + PORT)
})




