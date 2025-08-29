const { Router } = require("express")
const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminRouter = Router()
const { adminMiddleware} = require("../middlewares/admin")
const { adminModel,courseModel } = require("../db")
require("dotenv").config()

//* Admin Signup route
adminRouter.post("/signup", async (req, res) => {
    try {
        //* Validating Input by Zod
        const requiredBody = z.object({
            email: z.string().email(),
            password: z.string().min(7).max(16).regex(/[A-Z]/, "Must constain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter"),
            firstName: z.string(),
            lastName: z.string()
        })

        //* Parsing and validating request body
        const parseDataWithSuccess = requiredBody.safeParse(req.body)
        if (!parseDataWithSuccess.success) {
            res.json({
                msg: "Incorrect format",
                error: parseDataWithSuccess.error
            })
            return
        }

        //* Destructure validated fields
        const { email, password, firstName, lastName } = parseDataWithSuccess.data

        //* Checking if User alreay exist
        const userAlreadyExist = await adminModel.findOne({ email })
        if (userAlreadyExist) {
            res.json({
                msg: "User already exist"
            })
            return
        }

        //* Hashing password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 5)

        //* Saving admin in databases
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })

        res.json({
            msg: "Account created succesfully"
        })
    } catch (error) {
        throw(error)
    }

})

//* Admin Signin route 
adminRouter.post("/signin",async (req, res) => {
    try {
        //* Input validation by Zod
        const requiredBody = z.object({
        email:z.string().email(),
        password: z
            .string()
            .min(7)
            .max(16)
            .regex(/[A-Z]/, "Must constain atleast one uppercase letter")
            .regex(/[a-z]/, "Must contain atleast one lowercase letter")
    })

    //* Parsing and validating request body
    const parseData = requiredBody.safeParse(req.body)
    if (!parseData.success) {
        res.json({
            msg:"Incorrect Format",
            error:parseData.error
        })
    }

    //* Destruct validated value
    const {email,password} = parseData.data

    //*Searching for user
    const userCheck = await adminModel.findOne({ email })
    if (!userCheck) {
        res.status(401).json({
            msg:"Invalid password or email"
        })
    }

    const correctPassword = await bcrypt.compare(password,userCheck.password)

    if (correctPassword) {
        const token = jwt.sign({id: userCheck._id },process.env.JWT_ADMIN_PASSWORD)
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

//* Admin Route for creating course with authenticating middleware
adminRouter.post("/course",adminMiddleware,async (req, res) => {
    try {
        //* Taking course input validation using Zod
        const requiredBody = z.object({
            title:z.string(),
            description:z.string(),
            price:z.number(),
            imageURL:z.string()
        })

        //* Parsing and validating request body
        const parseData = requiredBody.safeParse(req.body)
        if (!parseData.success) {
            return res.status(401).json({
                msg:"Invalid Entry"
            })
        }

        //* Destructe validate fields
        const {title, description, price, imageURL} = parseData.data

        //* Taking adminId from auth middleware by req.userId
        const adminId = req.userId

        //* Saving course details in database   
        const course =await courseModel.create({
            title:title,
            description:description,
            price:price,
            imageURL:imageURL,
            createrId:adminId
        })
        res.json({
            msg:"course created",
            courseId: course._id
        })
    } catch (error) {
        throw(error)
    }
})

//* Admin route for updating courses
adminRouter.put("/course",adminMiddleware,async (req, res) => {
    try {
        //* Validating input for updating course by Zod
        const requiredBody = z.object({
            courseId:z.string(),
            title:z.string(),
            description:z.string(),
            price:z.number(),
            imageURL:z.string()
        })

        //* Parsing and validating inputs
        const parseData = requiredBody.safeParse(req.body)
        if (!parseData.success) {
            res.json({
                msg:"Invalid Entry"
            })
        }

        //* Destructure validated fields
        const {title, description, price, imageURL, courseId} = parseData.data

        //* Taking adminId from admin authMiddleware by req.userId
        const adminId = req.userId

        //* Saving update in database
        const course =await courseModel.updateOne({
            //* By taking both ids we make sure that only course admin can change course not other admin
            _id:courseId,
            createrId:adminId
        },{
            title:title,
            description:description,
            price:price,
            imageURL:imageURL,
        })
        res.json({
            msg:"course updated",
            courseId: course._id
        })
    } catch (error) {
        throw(error)
    }
})

//* Admin route to see all courses
adminRouter.get("/course/bulk",adminMiddleware,async (req, res) => {
    try {
        //* Taking adminId by admin authMiddleware by req.userId
        const adminId = req.userId

        //* Finding admin in database by createrId and showing courses
        const courses = await courseModel.find({
            createrId:adminId
        })
        res.json({
            msg:"course",
            courses
        })
    } catch (error) {
        throw(error)
    }
})

//* Exporting adminRouter
module.exports = {
    adminRouter: adminRouter
}