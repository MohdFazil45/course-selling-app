const { Router} = require("express")
const courseRouter = Router()
const { purchaseModel, courseModel } = require("../db")
const {userMiddleware} = require("../middlewares/user")

//* Course route to purchase course 
courseRouter.post("/purchase",userMiddleware,async (req, res) => {

    //* Taking userId from user authmiddleware by req.userId and courseId from body
    const userId = req.userId
    const courseId = req.body.courseId

    //* Saving course in database which user bought with userId and courseId
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        msg:"You have successfully bought the course"   
    })
})

//* Course route to see all the course
courseRouter.get("/preview",async (req, res) => {
    //* Finding all courses and showing
    const courses = await courseModel.find({})
    res.json({
        courses
    })
})

//* Exporting courseRouter
module.exports ={
    courseRouter:courseRouter
}