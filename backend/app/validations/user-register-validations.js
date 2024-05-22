const User = require("../models/user")
const userRegisterValidationSchema = {
   firstName: {
      in: ["body"],
      exists: {
         errorMessage: "firstName is required"
      },
      notEmpty: {
         errorMessage: "firstName cannot be empty"
      },
      trim: true
   },
   lastName: {
      in: ["body"],
      exists: {
         errorMessage: "lastName is required"
      },
      notEmpty: {
         errorMessage: "lastName cannot be empty"
      },
      trim: true
   },
   email: {
      in: ["body"],
      exists: {
         errorMessage: "email is required"
      },
      notEmpty: {
         errorMessage: "email cannot be empty"
      },
      isEmail: {
         errorMessage: "Email should be a valid format"
      },
      custom: {
         options: async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
               throw new Error("This email exists")
            } else {
               return true
            }
         }
      },
      trim: true,
      normalizeEmail: true
   },
   password: {
      in: ["body"],
      exists: {
         errorMessage: "password is required"
      },
      notEmpty: {
         errorMessage: "password cannot be empty"
      },
      isLength: {
         errorMessage: "Password should be between 8 - 128 characters"
      },
      trim: true
   }
}

module.exports = {userRegisterValidationSchema}