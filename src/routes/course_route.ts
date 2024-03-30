import express from 'express'
import * as videoCtrl from '../controllers/video_controller.js'
import * as courseCtrl from '../controllers/course_controller.js'
import * as courseMiddle from '../middlewares/course_query_middleware.js'


export const courseRouter = express.Router()


courseRouter.get('/upcoming-courses',courseCtrl.upcomingCourses)
courseRouter.get('/rating/:id',courseCtrl.getRating)

courseRouter.get('/get-course-videos/:id',videoCtrl.getCourseVidoes)
courseRouter.get('/get-sections/:id',videoCtrl.getSections)
courseRouter.get('/get-video/:id',videoCtrl.getVideo)

courseRouter.get('/:id',courseCtrl.getSingleCourse)
courseRouter.get('/',courseMiddle.checkCourse,courseCtrl.getCourses)

