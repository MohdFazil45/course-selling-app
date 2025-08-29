const jwt = require("jsonwebtoken")
const JWT_ADMIN_PASSWORD  = process.env.JWT_ADMIN_PASSWORD

//* middleware for verifying admin token for further activities
function adminMiddleware(req, res, next){

    const token = req.headers.token
    //* verifying jwt and saving information in decodeInformation
    const decodedInformation = jwt.verify(token,JWT_ADMIN_PASSWORD)

    if (decodedInformation) {
        //* storing adminId taken from decodedInformation
        req.userID = decodedInformation.id
        next()
    } else {
        res.status(403).json({
            msg: "you are not signed in"
        })
    }
}

//* Exporting adminMiddleware
module.exports = {
    adminMiddleware:adminMiddleware
}