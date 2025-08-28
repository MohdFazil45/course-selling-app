const { Router} = require("express")
const courseRouter = Router()
const { purchaseModel, courseModel } = require("../db")

courseRouter.get("/preview",async (req, res) => {
    const userId = req.userId
    const courseId = req.body.courseId

    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        msg:"You have successfully bought the course"
    })
})

courseRouter.get("/purchase",async (req, res) => {
    const courses = await courseModel.find({})

    res.json({
        courses
    })
})

module.exports ={
    courseRouter:courseRouter
}