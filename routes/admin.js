const { Router } = require("express")
const adminRouter = Router()
const {adminModel} = require("../db")

adminRouter.post("/signup",(req, res) => {
    res.json({
        msg:"signup point hit"
    })
})

adminRouter.post("/signin",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})

adminRouter.post("/course",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})

adminRouter.get("/course/bulk",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})

adminRouter.put("/course",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})

module.exports = {
    adminRouter:adminRouter
}