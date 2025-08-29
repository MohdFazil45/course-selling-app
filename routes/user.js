const { Router } = require("express")
const {z} = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRouter = Router()
const { userMiddleware} = require("../middlewares/user")
const { userModel, purchaseModel, courseModel } = require("../db")
require("dotenv").config()

//* User route for signup
userRouter.post("/signup", async (req, res) => {
    try {
        //* Validating input with Zod
        const requiredBody = z.object({
            email: z.string().email(),
            password: z.string().min(7).max(16).regex(/[A-Z]/, "Must constain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter"),
            firstName: z.string(),
            lastName: z.string()
        })

        //* Parsing and Validating request body
        const parseDataWithSuccess = requiredBody.safeParse(req.body)
        if (!parseDataWithSuccess.success) {
            res.json({
                msg: "Incorrect format",
            error: parseDataWithSuccess.error
            })
            return
        }
        //* Destructure validated inputs
        const { email, password, firstName, lastName } = parseDataWithSuccess.data

        //* Checking user already exist
        const userAlreadyExist = await userModel.findOne({ email })
        if (userAlreadyExist) {
            res.json({
                msg: "User already exist"
            })
            return
        }

        //* Hashing password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 5)

        //* Saving details in database
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

//* User route for signin
userRouter.post("/signin",async (req, res) => {
    try {
        //* Validating input with Zod
        const requiredBody = z.object({
        email:z.string().email(),
        password: z.string().min(7).max(16).regex(/[A-Z]/, "Must constain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter")
        })

        //* Parsing and validating input fields
        const parseData = requiredBody.safeParse(req.body)
        if (!parseData.success) {
            res.json({
                msg:"Incorrect Format",
                error:parseData.error
            })
        }

        //* Destructure input fields
        const {email,password} = parseData.data
        
        //* Checking user in database
        const userCheck = await userModel.findOne({ email })
        if (!userCheck) {
            res.status(401).json({
                msg:"Invalid password or email"
            })
        }

        //* Comparing password with bcrypt
        const correctPassword = await bcrypt.compare(password,userCheck.password)

        //* If password is same generate jwt token by jwt.sign
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

//* User route to see puchased course
userRouter.get("/purchases",userMiddleware,async (req, res) => {
    
    //* Taking userId from userMiddleware by req.userId
    const userId = req.userId

    //* Finding user's purchase with userId
    const purchases = await purchaseModel.find({
        userId
    })
    
    //* Finding course by using map on purchases
    const courseData = await courseModel.find({
        _id: { $in: purchases.map(x => x.courseId)}
    })
    res.json({
        purchases,
        courseData
    })
})

//* Exporting userRouter
module.exports = {
    userRouter: userRouter
}