const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://Fazilop:Bi4wPWjiyk54g2Uq@cluster0.yw9inxs.mongodb.net/coursera-app')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
    email:{ type:String, unique:true },
    password:String,
    firstName:String,
    lastName:String
})

const adminSchema = new Schema({
    email:{ type:String, unique:true },
    password:String,
    firstName:String,
    lastName:String
})

const courseSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    imageURL:String,
    createrId:ObjectId
})

const purchaseSchema = new Schema({
    userId:ObjectId,
    createrId:ObjectId
})

const userModel = mongoose.model("user",userSchema)
const adminModel = mongoose.model("admin",adminSchema)
const courseModel = mongoose.model("course",courseSchema)
const purchaseModel = mongoose.model("purchase",purchaseSchema)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}