const jwt = require("jsonwebtoken")
const  JWT_USER_PASSWORD  = process.env.JWT_USER_PASSWORD

//* middleware for verifying user token for further activities
function userMiddleware(req, res, next){
    const token = req.headers.token
    //* verifying jwt and saving information in decodeInformation
    const decodedInformation = jwt.verify(token,JWT_USER_PASSWORD)

    if (decodedInformation) {
        //* storing userId taken from decodedInformation
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