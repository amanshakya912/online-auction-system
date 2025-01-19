// sendEmail.js
const transporter = require('./transporter');
const { getEmailTemplate } = require('./getEmailTemplate');

async function sendEmail(to, subject, type, details) {
    try {
        console.log('working');
        const emailBody = getEmailTemplate(type, details);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to, // recipient's email
            subject, // subject of the email
            html: emailBody, // HTML body of the email
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.sendEmail = sendEmail;
