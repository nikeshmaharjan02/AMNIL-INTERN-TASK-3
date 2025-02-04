const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
})

transporter.verify((error,success) => {
    if (error) {
        console.log("Verifying transporter Error:",error)
    } else {
        console.log("Transporter ready for sending mails")
    }
})