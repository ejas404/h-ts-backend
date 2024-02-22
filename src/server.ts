import express, { Request, Response } from 'express'
import 'dotenv/config'
import http from "http";
import cors from 'cors'
import path from 'path';
import dbConnect from './config/db.js'
import cookieParser from 'cookie-parser'
import admin from 'firebase-admin';


import  {adminRouter} from './routes/admin_route.js'
import { errMiddleware } from './middlewares/error_middlware.js'
import { studentRouter } from './routes/student_route.js'
import { tutorRouter } from './routes/tutor_route.js'
import { courseRouter } from './routes/course_route.js'
import { configSocket } from './config/socket.js';
import { compilePath } from './config/frontend_compile_path.js';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID as string,
        clientEmail: process.env.FB_CLIENT_EMAIL as string,
        privateKey: (process.env.FB_PRIVATE_KEY as string)?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FB_DATABASE_URL as string
});

const app = express()
const PORT = process.env.PORT || 4440;

const server = http.createServer(app);
configSocket(server)

const __dir= path.resolve();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dir,compilePath)))
app.use(express.static('src/public'))
app.use(cors({origin : '*', credentials : true}))

// middle for redirecting frontend requests
app.use((req,res,next) => {
    if(!req.url.includes('api')){
        res.sendFile(path.join(__dir, compilePath, 'index.html'));
        return;
    }else{
        next()
    }
})

app.use('/api/admin', adminRouter)
app.use('/api/student',studentRouter)
app.use('/api/tutor', tutorRouter)
app.use('/api/course', courseRouter)

app.get('*', (_req: Request, res: Response) => res.sendStatus(404));

app.use(errMiddleware)

dbConnect()
 server.listen(PORT, () => {
    console.log('server started at port ' + PORT)
})




