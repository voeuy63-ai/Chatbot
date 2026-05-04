const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'voeuy63@gmail.com',
        pass: 'qejzixuqvfznibby' // App Password 16 ខ្ទង់របស់អ្នក
    }
});

app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send("Please enter your email!");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    const mailOptions = {
        from: '"ForestSMP" <voeuy63@gmail.com>',
        to: email,
        subject: 'ForestSMP Verification Code',
        text: `Hello!\nThis is the code to enter to confirm the code.\n\nYour code (otp): ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send("Error: " + error.message);
        res.status(200).send("OTP code has been sent!");
    });
});

app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email];
        res.status(200).send("Success! Welcome to ForestSMP.");
    } else {
        res.status(400).send("Invalid or expired OTP!");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
