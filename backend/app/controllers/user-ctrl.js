const User =  require("../models/user")
const { validationResult } = require("express-validator")
const bcryptjs = require("bcryptjs")
const { welcomeEmail } = require("../utils/nodemailer")

const userCtrl = {}

userCtrl.register = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
      return res.status(400).json ({ errors: errors.array() })
   }

   const body = req.body
   try {
      const salt = await bcryptjs.genSalt()
      const hashPassword = await bcryptjs.hash(body.password, salt)
      const user = new User({...body, password: hashPassword })

      await user.save()
      const newUser = await User.findOne({ email: req.body.email })
      if(newUser) {
         welcomeEmail(newUser.email, newUser.firstName)
      } else {
         return res.status(400).json({ error: "User not found"})
      }
      res.status(201).json(user)
      // console.log(err)
   }catch(err) {
      res.status(400).json({ error: "something went wrong" })
      // console.log(err)
   }
   
}

module.exports = userCtrl