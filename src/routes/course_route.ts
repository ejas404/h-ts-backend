import express from 'express'
import * as videoCtrl from '../controllers/video_controller.ts'

export const courseRouter = express.Router()

courseRouter.get('/get-sections/:id',videoCtrl.getSections)