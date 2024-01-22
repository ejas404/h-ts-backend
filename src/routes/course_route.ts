import express from 'express'
import * as videoCtrl from '../controllers/video_controller.ts'
import * as courseCtrl from '../controllers/course_controller.ts'

export const courseRouter = express.Router()

courseRouter.get('/get-sections/:id',videoCtrl.getSections)
courseRouter.get('/:id',courseCtrl.getSingleCourse)
courseRouter.get('/',courseCtrl.getCourses)