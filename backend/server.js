require('dotenv').config()

//require packages
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")


//files
const configureDB = require("./config/connectDB")
const { checkSchema } = require('express-validator')

//controllers
const userCtrl = require('./app/controllers/user-ctrl')

//validations
const { userRegisterValidationSchema } =  require("./app/validations/user-register-validations")

//middlewares
const upload = require('./app/middlewares/multer')

const app = express()
const port = 4141
configureDB()

app.use(express.json())
app.use(cors())
app.use(morgan("common"))

//routes
app.post("/api/register",  upload.single("profilePicture"), checkSchema(userRegisterValidationSchema), userCtrl.register)

app.listen(port, ()=>{
   console.log("Server successfully running on port", port)
})

