const User =  require("../models/user")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken')
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

userCtrl.login = async (req, res) => {
   const errors = validationResult(req) 
   if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array()})
   }
   const body = req.body 
   try { 
       const user = await User.findOne({ email: body.email }) 
       if(user) {
           const isAuth = await bcryptjs.compare(body.password, user.password)
           if(isAuth) {
               const tokenData = {
                   id: user._id,
                   // profileId: recruiterId
                   role: user.role 
               }
               const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d'})
               return res.json({ token: token })
           }
           return res.status(404).json({ errors: 'invalid email / password '})
       }
       res.status(404).json({ errors: 'invalid email / password'})
   } catch(err) {
      //console.log(err)
      res.status(500).json({ errors: 'something went wrong'})
   }   
}

userCtrl.account = async (req, res) => {
   try {
       const user = await User.findById(req.user.id)
       res.json(user)
   } catch(err) {
       res.status(500).json({ error: 'something went wrong'})
   }
}

module.exports = userCtrl