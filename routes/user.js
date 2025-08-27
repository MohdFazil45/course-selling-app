const { Router } = require("express")
const userRouter = Router()

userRouter.post("/signup",(req, res) => {
    res.json({
        msg:"signup point hit"
    })
})
userRouter.post("/signin",(req, res) => {
    res.json({
        msg:"signin point hit"
    })
})
userRouter.get("/purchase",(req, res) => {
    res.json({
        msg:"user/purchase point hit"
    })
})

module.exports = {
    userRouter:userRouter
}