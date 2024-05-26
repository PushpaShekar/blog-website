const Comment = require("../models/comment")
const { validationResult } = require("express-validator")

commentCtrl = {}

commentCtrl.create = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }
   try {
      const body = req.body
      const comment = new Comment(body)
      comment.author = req.user.id
      comment.post = req.params.postId
      await comment.save()
      res.status(200).json(comment)
   } catch(err) {
      return res.status(500).json({ errors: "Not able to write a comment"})
   }
}

commentCtrl.update = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }
   try {
      const body = req.body
      const commentId = req.params.commentId
      const comment = await Comment.findById(commentId)
      if (parseInt(comment.author) === parseInt(req.user.id)) {
         const commentUpdate = await Comment.findByIdAndUpdate(commentId, body, { new:true })
         res.status(200).json(commentUpdate)
      } else {
         res.status(400).json({errors:"You're not authorized to update comment"})
      }
   }catch(err){
      return res.status(500).json({ errors: "Oops...! Something went wrong"})
   }
}

commentCtrl.findComment = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }
   try {
      const post = req.params.postId
      const comment = await Comment.find({ post: post }).populate("author").populate("post","title")
      res.status(200).json(comment)
   }catch(err){
      return res.status(400).json({ errors: "Something went wrong"})
   }
}

commentCtrl.delete = async(req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }
   try{
      const commentId = req.params.commentId
      const comment = await Comment.findById(commentId)
      if(parseInt(comment.author) === parseInt(req.user.id)){
         const commentDelete = await Comment.findByIdAndDelete(commentId)
         res.status(200).json(commentDelete)
      } else {
         res.status(400).json({ errors: "You're not authorized to delete the comemnt"})
      }
   }catch(err){
      return res.status(500).json({ errors: "Something went Wrong"})
   }

}

module.exports = commentCtrl
