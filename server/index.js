const express = require('express');
const cors = require('cors');
const path = require("path");
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (if you're developing in different environments)
app.use(cors({
  origin: '*', // Adjust according to your need for specific domains
}));

// Parse incoming JSON request bodies
app.use(express.json());
// AWS SES setup using credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: false, 
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send email function
const sendEmail = async (toEmail, subject, htmlBody, replyToEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, 
    to: toEmail,
    subject: subject,
    html: htmlBody,
    replyTo: replyToEmail,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// API endpoint to handle pricing form submissions
app.post('/api/pricing-form', async (req, res) => {
  console.log('Request received at /api/pricing-form');
  const {
    firstName, lastName, businessEmail, companyName, phoneNumber,
    country, facility, telematics, fleet, procurement,
    assetInventory, others, newsLetterSubscription,
  } = req.body;

  const mailOptions = {
    subject: `New Pricing Form Submission from ${firstName} ${lastName}`,
    htmlBody: `
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${businessEmail}</p>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Facility:</strong> ${facility || 'Not selected'}</p>
      <p><strong>Telematics:</strong> ${telematics || 'Not selected'}</p>
      <p><strong>Fleet:</strong> ${fleet || 'Not selected'}</p>
      <p><strong>Procurement:</strong> ${procurement || 'Not selected'}</p>
      <p><strong>Asset Inventory:</strong> ${assetInventory || 'Not selected'}</p>
      <p><strong>Others:</strong> ${others || 'Not selected'}</p>
      <p><strong>Newsletter Subscription:</strong> ${newsLetterSubscription || 'Not selected'}</p>
    `,
    toEmail: process.env.EMAIL_USER,
    replyToEmail: businessEmail, 
  };

  try {
    const result = await sendEmail(mailOptions.toEmail, mailOptions.subject, mailOptions.htmlBody, mailOptions.replyToEmail);
    res.json({ success: true, message: 'Form submitted successfully!', info: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to handle contact form submissions
app.post('/api/contact-form', async (req, res) => {
  const { firstName, lastName, email, phone, companyName, country, areYou, mainGoal } = req.body;

  const mailOptions = {
    subject: `New Contact Us Form Submission from ${firstName}`,
    htmlBody: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Company Type:</strong> ${areYou}</p>
      <p><strong>Main goal:</strong> ${mainGoal}</p>
    `,
    toEmail: process.env.EMAIL_USER,
    replyToEmail: email,
  };

  try {
    const result = await sendEmail(mailOptions.toEmail, mailOptions.subject, mailOptions.htmlBody, mailOptions.replyToEmail);
    res.json({ success: true, message: 'Contact form submitted successfully!', info: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to handle booking form submissions
app.post('/api/booking-form', async (req, res) => {
  const { timeSlot, firstName, lastName, email, phone, country, date, facility, telematics, fleet, procurement,
    assetInventory, others, mainGoal } = req.body;

  const mailOptions = {
    subject: `New Booking Form Submission from ${firstName}`,
    htmlBody: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Time slot:</strong> ${timeSlot}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Product(s) of Interest</strong></p>
      <p><strong>Facility:</strong> ${facility || 'Not selected'}</p>
      <p><strong>Telematics:</strong> ${telematics || 'Not selected'}</p>
      <p><strong>Fleet:</strong> ${fleet || 'Not selected'}</p>
      <p><strong>Procurement:</strong> ${procurement || 'Not selected'}</p>
      <p><strong>Asset Inventory:</strong> ${assetInventory || 'Not selected'}</p>
      <p><strong>Others:</strong> ${others || 'Not selected'}</p>
      <p><strong>Main goal:</strong> ${mainGoal}</p>
    `,
    toEmail: process.env.EMAIL_USER,
    replyToEmail: email,
  };

  try {
    const result = await sendEmail(mailOptions.toEmail, mailOptions.subject, mailOptions.htmlBody, mailOptions.replyToEmail);
    res.json({ success: true, message: 'Booking form submitted successfully!', info: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
});
