import express from 'express'
import 'dotenv/config'


import cors from 'cors'
import dbConnect from './config/db.ts'

import cookieParser from 'cookie-parser'

import  {adminRouter} from './routes/admin_route.ts'
import { errMiddleware } from './middlewares/error_middlware.ts'
import { studentRouter } from './routes/student_route.ts'
import { tutorRouter } from './routes/tutor_route.ts'
import { courseRouter } from './routes/course_route.ts'

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('src/public'))
app.use(cors(
    {
        origin : 'http://localhost:4200',
        methods:'GET,PUT,POST,DELETE',
        credentials:true
    }
))


app.use('/admin', adminRouter)
app.use('/student',studentRouter)
app.use('/tutor', tutorRouter)
app.use('/course', courseRouter)

app.use(errMiddleware)

dbConnect()
app.listen(PORT, () => {
    console.log('server started at port ' + PORT)
})