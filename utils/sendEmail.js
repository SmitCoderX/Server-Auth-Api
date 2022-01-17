const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

/* const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport(sgTransported({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        auth: {
            // user: process.env.SMTP_EMAIL,
            // pass: process.env.SMTP_PASSWORD
            api_key: process.env.SMTP_PASSWORD
        }
    })); */

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
    
    // Point the Template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };
    
    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    // Send mail with defined transport object
    let message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        template: 'email',
        context: {
            link: options.resetURL
        }
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail