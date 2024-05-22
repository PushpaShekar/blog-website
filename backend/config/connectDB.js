const mongoose = require("mongoose")
const configureDB = async () => {
   try{
      const dbConnect = await mongoose.connect("mongodb://127.0.0.1:27017/blog-2024")
      console.log("Connected to DB")
   } catch(err) {
      console.log(err)
   }
}   

module.exports = configureDB