const { Router} = require("express")
const courseRouter = Router()

courseRouter.get("/preview",(req, res) => {
    res.json({
        msg:"course point hit"
    })
})

courseRouter.get("/purchase",(req, res) => {
    res.json({
        msg:"course/purchase point hit"
    })
})

module.exports ={
    courseRouter:courseRouter
}