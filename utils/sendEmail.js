const nodemailer = require('nodemailer');
const sgTransported = require('nodemailer-sendgrid-transport');

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport(sgTransported({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        auth: {
            // user: process.env.SMTP_EMAIL,
            // pass: process.env.SMTP_PASSWORD
            api_key: process.env.SMTP_PASSWORD
        }
    }));

    // Send mail with defined transport object
    let message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail