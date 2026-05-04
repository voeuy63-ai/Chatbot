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
        pass: 'qejzixuqvfznibby' 
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
        text: `Hello!\nYour verification code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send("Error: " + error.message);
        // ប្តូរអត្ថបទឆ្លើយតបនៅទីនេះ
        res.status(200).send("Code OTP send to your email"); 
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
