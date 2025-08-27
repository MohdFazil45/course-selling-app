const { Router } = require("express")
const userRouter = Router()

userRouter.post("/user/signup",(req, res) => {
    res.json({
        msg:"signup point hit"
    })
})
userRouter.post("/user/signin",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})
userRouter.get("/user/purchase",(req, res) => {
    res.json({
        msg:"user/purchase point hit"
    })
})

module.exports = {
    userRouter:userRouter
}