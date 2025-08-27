const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())


app.post("/user/signup",(req, res) => {
    
})

app.post("/user/signin",(req, res) => {
    
})

app.get("/course",(req, res) => {
    
})

app.get("/user/purchase",(req, res) => {
    
})

app.get("/course/purchase",(req, res) => {
    
})

app.listen(3000)