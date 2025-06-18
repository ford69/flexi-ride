// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
const apiKey = process.env.SENDGRID_API_KEY;
console.log('API Key:', apiKey);
console.log('API Key starts with:', apiKey?.substring(0, 3));
if (!apiKey) {
  throw new Error('SendGrid API key not found in environment variables');
}
sgMail.setApiKey(apiKey);

const msg = {
  to: 'cliffordmanu7@gmail.com', // Change to your recipient
  from: 'tech@flexiride.co', // Change to your verified sender
  subject: 'Flexiride - Verification Code Test',
  text: 'Send verification Test',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }); 