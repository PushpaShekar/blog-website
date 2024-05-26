require('dotenv').config()

//require packages
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { checkSchema } = require('express-validator')

const configureDB = require("./config/connectDB")

//files
//controllers
const userCtrl = require("./app/controllers/user-ctrl")
const postCtrl = require("./app/controllers/post-ctrl")
const commentCtrl = require("./app/controllers/comment-ctrl")

//validations
const { userRegisterValidationSchema } =  require("./app/validations/user-register-validations")
const { userLoginValidationSchema } = require("./app/validations/user-login-validations")
const { postValidationSchema } = require("./app/validations/post-validations")
const { commentValidationSchema } = require("./app/validations/comment-validations")
 
//middlewares
//const { upload } = require('./app/middlewares/multer-cloudinary')
const authenticateUser = require("./app/middlewares/authenticateUser")
const authorizeUser = require("./app/middlewares/authorizeUser")

const app = express()
const port = process.env.PORT
configureDB()

app.use(express.json())
app.use(cors())
app.use(morgan("common"))

//routes
//user
app.post("/api/register", checkSchema(userRegisterValidationSchema), userCtrl.register)
app.post("/api/login", checkSchema(userLoginValidationSchema), userCtrl.login)
app.get("/api/account", authenticateUser, userCtrl.account)

//posts
app.post("/api/posts", authenticateUser, checkSchema(postValidationSchema), postCtrl.create)
app.get("/api/posts", postCtrl.findAll)
app.get("/api/posts/:id", postCtrl.findById)
app.get("/api/posts/:id", authenticateUser, postCtrl.myPosts)
app.put("/api/posts/:id", authenticateUser, checkSchema(postValidationSchema), postCtrl.update)
app.delete("/api/posts/:id", authenticateUser, postCtrl.delete)

//comments
app.post("/api/posts/:postId/comments", authenticateUser, checkSchema(commentValidationSchema), commentCtrl.create)
app.get("/api/posts/:id/comments", commentCtrl.findComment)
app.put("/api/posts/:id/comments/:commentId", authenticateUser, checkSchema(commentValidationSchema),commentCtrl.update)
app.delete("/api/posts/:id/comments/:commentId", authenticateUser, commentCtrl.delete)

app.listen(port, ()=>{
   console.log(`Server is running on port ${port}`)
})

