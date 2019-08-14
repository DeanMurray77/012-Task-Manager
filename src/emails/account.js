const sgMail = require('@sendgrid/mail');

const config = require('../config'); //My method of storing the API key without having it end up on GitHub

const fromEmailAddress = 'test@test.com';

sgMail.setApiKey(config.sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: fromEmailAddress,
        subject: 'Welcome to Taskify!',
        text: `Hello, ${name}!\n\nI'm very glad to be able 
        to welcome you to Taskify.\n\n
        Thank you for joining, everyone here hopes that Taskify can 
        unlock a new world of productivity for you.\n\n
        Sincerely,\n\n
        Dean`
    })
}

module.exports = sendWelcomeEmail;