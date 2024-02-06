import enrollCollection from "../models/course_enroll_model"

export const getPopularCourses = async () => {
    try{
        const getCourses = await enrollCollection.aggregate([
            {$group: {_id: "$course",count: { $sum: 1 }}},
            {$lookup: {from: 'courses',localField: "_id",foreignField: "_id",as: "course"}},
            {$sort : {count : -1}},
            {$limit : 3},
            {$unwind : "$course"},
            {$lookup : {from : "tutors", localField : "course.tutor", foreignField : "_id", as : "tutorDetails"}},
            {$lookup : {from : "subcategories",localField : "course.subCategory", foreignField : "_id", as :"subcat"}},
            {$project : {"count":1,course : 1,"tutorDetails.name" : 1,"subcat.name" : 1}},
            {$unwind : "$tutorDetails"},
            {$unwind : "$subcat"}
            
          ]);

          return getCourses
    }catch(e){
        console.log(e)
        return false;
    }
}