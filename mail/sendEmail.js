const transporter = require('./transporter');
const { getEmailTemplate } = require('./getEmailTemplate');

async function sendEmail(to, subject, type, details) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        const emailBody = getEmailTemplate(type, details);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to, subject,
            html: emailBody,
        });
    } catch (error) {
        console.warn('Email not sent (check SMTP setup):', error.message);
    }
}

exports.sendEmail = sendEmail;
