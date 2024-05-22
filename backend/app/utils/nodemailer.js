const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_FROM_EMAIL,
        pass: process.env.NODEMAILER_FROM_PASSWORD
    }
})


const welcomeEmail = (userEmail, userName) => {
    const mailBody = {
        from: process.env.NODEMAILER_FROM_EMAIL,
        to: userEmail,
        subject: 'Welcome to Bloggggs!',
        html: `<p>Hello, ${userName}</p>
        <p>Welcome to <strong>TechTales</strong>! We are happy to have you here.</p>`
    }

    transporter.sendMail(mailBody, (error, info) => {
        if (error) {
            console.log('Error sending a registration email', error.message)
        } else {
            console.log('Registration email sent successfully', info.response)
        }
    })
}

module.exports = {welcomeEmail}