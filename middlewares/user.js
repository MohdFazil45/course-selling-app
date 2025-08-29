const jwt = require("jsonwebtoken")
const  JWT_USER_PASSWORD  = process.env.JWT_USER_PASSWORD

function userMiddleware(req, res, next){
    const token = req.headers.token
    const decodedInformation = jwt.verify(token,JWT_USER_PASSWORD)

    if (decodedInformation) {
        req.userID = decodedInformation.id
        next()
    } else {
        res.status(403).json({
            msg: "you are not signed in"
        })
    }
}

module.exports = {
    userMiddleware:userMiddleware
}