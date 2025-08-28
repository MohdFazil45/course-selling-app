const jwt = require("jsonwebtoken")
const JWT_ADMIN_PASSWORD  = process.env.JWT_ADMIN_PASSWORD

function adminMiddleware(req, res, next){
    const token = req.headers.token
    const decodedInformation = jwt.verify(token,JWT_ADMIN_PASSWORD)

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
    adminMiddleware:adminMiddleware
}