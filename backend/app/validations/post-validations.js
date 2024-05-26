const postValidationSchema = {
   title: {
       in: ['body'],
       exists: {
           errorMessage: 'Title is required'
       },
       notEmpty: {
           errorMessage: 'Title cannot be empty'
       },
       trim: true
   },
   content: {
       in: ['body'],
       exists: {
           errorMessage: 'Content is required'
       },
       notEmpty: {
           errorMessage: 'Content cannot be empty'
       },
       isLength: {
           options: {
               min: 5
           },
           errorMessage: 'Content Should be atleast 5-10 characters long'
       },
       trim: true
   },
}

module.exports =  { postValidationSchema }