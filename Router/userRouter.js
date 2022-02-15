const { getSingleUserByProfileId, updateSingeUserStatusById, isUserExist } = require("../Controller/UserAuthController")
const { isAuthenticated } = require("../Middleware/isAuthenticated")

const userRouter = require("express").Router()

userRouter.get("/get-user-by-profileId/:profileId", isAuthenticated,getSingleUserByProfileId)
userRouter.post("/update-single-user-status/:userId/",isAuthenticated,updateSingeUserStatusById)
userRouter.get("/get-user/",isUserExist)



module.exports = userRouter