const Post = require("../models/post")
const { validationResult } = require("express-validator")
const _ = require('lodash')
const postCtrl = {}

postCtrl.create = async (req, res ) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   } 
   try {
      const body = req.body
      const post = new Post(body)
      post.author = req.user.id
      await post.save()
      res.status(200).json(post)
   } catch(err) {
      res.status(500).json({ errors: "Error in creating post"})
   }
}

postCtrl.findAll = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }

   try { 
      const post = await Post.find().populate("author", "firstName lastName email")
      res.status(201).json(post)
   } catch(err) {
      console.log(err)
      res.status(500).json({ errors: "Oops....Error in finding posts!!!"})
   }
}

postCtrl.findById = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() })
   }

   try {
       const postId = req.params.id
       const post = await Post.findById(postId).populate('author', 'firstName lastName email')
       res.status(201).json(post)
   } catch (err) {
       res.status(500).json({ errors: 'Something went wrong' })
   }
}

postCtrl.myPosts = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }

   try {
      const post = await Post.find ({ author: req.user.id }).populate("author", "firstName lastName")
      return res.status(200).json(post)
   } catch(err){
      console.log(err)
      return res.status(500).json({ errors: "Something went wrong in finding your post, sorry!" })
   }
}

postCtrl.update = async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
   }
   try {
      const body = _.pick( req.body, ["title", "content"] )
      const postId = req.params.id
      const post = await Post.findById(postId)
      if (parseInt(post.author)==parseInt(req.user.id)) {
         const postUpdate = await Post.findByIdAndUpdate(postId, body, { new: true } )
         return res.status(200).json(postUpdate)
      } else {
         return res.status(500).json({ errors: "You're unauthorized to update" })
      }
   }catch(err) {
      return res.status(500).json({ errors: "Couldn't update your post, please check authorization" })
   }
}

postCtrl.delete = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() })
   }

   try {
       const postId = req.params.id
       const post = await Post.findById(postId)
       if (parseInt(post.author) === parseInt(req.user.id)) {
           await Post.findByIdAndDelete(postId)
           return res.status(200).json("Post deleted Successfully")
       } else {
           return res.status(500).json({ errors: "You're not authorized to delete" })
       }
   } catch (err) {
       res.status(500).json({ errors: "Couldn't update your post, please check authorization" })
   }
}

module.exports = postCtrl 
