const { Router } = require("express")
const {z} = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRouter = Router()
const { userMiddleware} = require("../middlewares/user")
const { userModel, purchaseModel, courseModel } = require("../db")
require("dotenv").config()

userRouter.post("/signup", async (req, res) => {
    try {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(7).max(16).regex(/[A-Z]/, "Must constain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter"),
        firstName: z.string(),
        lastName: z.string()
    })

    const parseDataWithSuccess = requiredBody.safeParse(req.body)
    if (!parseDataWithSuccess.success) {
        res.json({
            msg: "Incorrect format",
            error: parseDataWithSuccess.error
        })
        return
    }
        const { email, password, firstName, lastName } = parseDataWithSuccess.data
    
        const userAlreadyExist = await userModel.findOne({ email })
        if (userAlreadyExist) {
            res.json({
                msg: "User already exist"
            })
            return
        }


        const hashedPassword = await bcrypt.hash(password, 5)

        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        res.status(201).json({
            msg: "Account created succesfully"
        })

    } catch (error) {
        throw (error)
    }

})
userRouter.post("/signin",async (req, res) => {
    try {
        const requiredBody = z.object({
        email:z.string().email(),
        password: z.string().min(7).max(16).regex(/[A-Z]/, "Must constain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter")
        })

        const parseData = requiredBody.safeParse(req.body)
        if (!parseData.success) {
            res.json({
                msg:"Incorrect Format",
                error:parseData.error
            })
        }

        const {email,password} = parseData.data

        const userCheck = await userModel.findOne({ email })
        if (!userCheck) {
            res.status(401).json({
                msg:"Invalid password or email"
            })
        }

        const correctPassword = await bcrypt.compare(password,userCheck.password)
        if (correctPassword) {
            const token = jwt.sign({id: userCheck._id },process.env.JWT_USER_PASSWORD)
            res.json({
                token:token
            })
        }
        else {
            res.status(401).json({
                msg:"Invalid Credential"
            })
        }
    } catch (error) {
        throw(error)
    }
})
userRouter.get("/purchases",userMiddleware,async (req, res) => {
    const userId = req.userId
    const purchases = await purchaseModel.find({
        userId
    })
    // console.log(purchases)
    const courseData = await courseModel.find({
        _id: { $in: purchases.map(x => x.courseId)}
    })
    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}