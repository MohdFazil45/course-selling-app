const { Router } = require("express")
const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminRouter = Router()
const { adminModel } = require("../db")
require("dotenv").config()


adminRouter.post("/signup", async (req, res) => {

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

    const userAlreadyExist = await adminModel.findOne({ email })
    if (userAlreadyExist) {
        res.json({
            msg: "User already exist"
        })
        return
    }

    const { email, password, firstName, lastName } = parseDataWithSuccess.data

    const hashedPassword = await bcrypt.hash(password, 5)

    await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        msg: "Account created succesfully"
    })

})

adminRouter.post("/signin",async (req, res) => {

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

    const userCheck = await adminModel.findOne({ email })
    if (!userCheck) {
        res.status(401).json({
            msg:"Invalid password or email"
        })
    }

    const correctPassword = await bcrypt.compare(password,userCheck.password)

    if (correctPassword) {
        const token = jwt.sign({id: user._id },process.env.JWT_ADMIN_PASSWORD)
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

adminRouter.post("/course", (req, res) => {
    res.json({
        msg: "signin point hit"
    })
})

adminRouter.get("/course/bulk", (req, res) => {
    res.json({
        msg: "signin point hit"
    })
})

adminRouter.put("/course", (req, res) => {
    res.json({
        msg: "signin point hit"
    })
})

module.exports = {
    adminRouter: adminRouter
}