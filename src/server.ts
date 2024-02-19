import express from 'express'
import 'dotenv/config'
import http from "http";
import cors from 'cors'
import path from 'path';
import dbConnect from './config/db.ts'
import cookieParser from 'cookie-parser'


import  {adminRouter} from './routes/admin_route.ts'
import { errMiddleware } from './middlewares/error_middlware.ts'
import { studentRouter } from './routes/student_route.ts'
import { tutorRouter } from './routes/tutor_route.ts'
import { courseRouter } from './routes/course_route.ts'
import { configSocket } from './config/socket.ts';


const app = express()
const PORT = process.env.PORT

const server = http.createServer(app);
configSocket(server)

let __dir= path.resolve();

// console.log('directory',path.resolve(__dir,'../'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dir,'../frontendAng/dist/frontend-ang/browser')))
app.use(express.static('src/public'))
app.use(cors({origin : '*', credentials : true}))

// middle for redirecting frontend requests
app.use((req,res,next) => {
    if(!req.url.includes('api')){
        res.sendFile(path.join(__dir, '../frontendAng/dist/frontend-ang/browser', 'index.html'));
        return;
    }else{
        next()
    }
})

app.use('/api/admin', adminRouter)
app.use('/api/student',studentRouter)
app.use('/api/tutor', tutorRouter)
app.use('/api/course', courseRouter)

app.use(errMiddleware)

dbConnect()
 server.listen(PORT, () => {
    console.log('server started at port ' + PORT)
})




