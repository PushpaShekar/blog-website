const commentValidationSchema = {
   content: {
       in: ['body'],
       exists: {
           errorMessage: 'Content is required'
       },
       notEmpty: {
           errorMessage: 'Content cannot be empty'
       },
       trim: true
   }
}

module.exports = { commentValidationSchema }