import multer from 'multer'

const studentStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'./src/public/uploads/student-profile')
    },
    filename : (req, file, cb) =>{
        cb(null , `${Date.now()}-${file.originalname}`)
    }
})


const tutorStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'./src/public/uploads/tutor-profile')
    },
    filename : (req, file, cb) =>{
        cb(null , `${Date.now()}-${file.originalname}`)
    }
})

const courseCoverStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'./src/public/uploads/course-cover')
    },
    filename : (req, file, cb) =>{
        cb(null , `${Date.now()}-${file.originalname}`)
    }
})

const chatStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null,'./src/public/uploads/chat-images')
    },
    filename : (req, file, cb) =>{
        cb(null , `${Date.now()}-${file.originalname}`)
    }
})



const studentUpload = multer({storage : studentStorage})
const tutorUpload = multer({ storage : tutorStorage})
const coverUpload = multer({ storage : courseCoverStorage})
const chatUpload = multer({storage : chatStorage})

export {studentUpload , tutorUpload , coverUpload , chatUpload}