const { Router} = require("express")
const courseRouter = Router()

courseRouter.get("/course/preview",(req, res) => {
    res.json({
        msg:"course point hit"
    })
})

courseRouter.get("/course/purchase",(req, res) => {
    res.json({
        msg:"course/purchase point hit"
    })
})

module.exports ={
    courseRouter:courseRouter
}