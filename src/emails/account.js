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
        Dean`,
        html: "<p>This is the html version of the email</p>"
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: fromEmailAddress,
        subject: "I'm sorry to see you go!",
        text: `I've gone ahead and closed your Taskify account, ${name}, but I'm very sorry to see you go. If you have a moment, please respond back to this email and let me know what we could have done differently to keep you as a Taskify user.\n\nSincerly,\n\nDean Murray`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};