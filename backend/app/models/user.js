const mongoose = require("mongoose")
const { Schema, model } = mongoose
const userSchema = new Schema ({
   firstName: String,
   lastName: String,
   email: String,
   password: String,
   profilePicture: String,
}, 
{timeStamps: true}
)

const User = model("User", userSchema)

module.exports = User