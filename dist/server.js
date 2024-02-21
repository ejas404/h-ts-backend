var _a;
import express from 'express';
import 'dotenv/config';
import http from "http";
import cors from 'cors';
import path from 'path';
import dbConnect from './config/db';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import { adminRouter } from './routes/admin_route';
import { errMiddleware } from './middlewares/error_middlware';
import { studentRouter } from './routes/student_route';
import { tutorRouter } from './routes/tutor_route';
import { courseRouter } from './routes/course_route';
import { configSocket } from './config/socket';
import { compilePath } from './config/frontend_compile_path';
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        clientEmail: process.env.FB_CLIENT_EMAIL,
        privateKey: (_a = process.env.FB_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FB_DATABASE_URL
});
const app = express();
const PORT = process.env.PORT || 4440;
const server = http.createServer(app);
configSocket(server);
const __dir = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dir, compilePath)));
app.use(express.static('src/public'));
app.use(cors({ origin: '*', credentials: true }));
// middle for redirecting frontend requests
app.use((req, res, next) => {
    if (!req.url.includes('api')) {
        res.sendFile(path.join(__dir, compilePath, 'index.html'));
        return;
    }
    else {
        next();
    }
});
app.use('/api/admin', adminRouter);
app.use('/api/student', studentRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/course', courseRouter);
app.get('*', (_req, res) => res.sendStatus(404));
app.use(errMiddleware);
dbConnect();
server.listen(PORT, () => {
    console.log('server started at port ' + PORT);
});
