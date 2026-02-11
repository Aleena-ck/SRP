const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: `"Lifeblood Connect" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// Email templates
const emailTemplates = {
    welcomeDonor: (name) => ({
        subject: 'Welcome to Lifeblood Connect!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Welcome to Lifeblood Connect, ${name}!</h2>
                <p>Thank you for registering as a blood donor. Your decision to donate blood can save lives.</p>
                <p>As a registered donor, you can:</p>
                <ul>
                    <li>View your donation history</li>
                    <li>Update your availability</li>
                    <li>Receive notifications for emergency requests</li>
                    <li>Track your next donation eligibility</li>
                </ul>
                <p>Stay connected and be ready to save lives!</p>
                <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
            </div>
        `
    }),

    emergencyRequest: (requestDetails) => ({
        subject: '🚨 Emergency Blood Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Emergency Blood Request</h2>
                <p>There is an urgent need for blood donation:</p>
                <div style="background: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p><strong>Patient:</strong> ${requestDetails.patientName}</p>
                    <p><strong>Blood Group:</strong> ${requestDetails.bloodGroup}</p>
                    <p><strong>Hospital:</strong> ${requestDetails.hospitalName}</p>
                    <p><strong>Reason:</strong> ${requestDetails.reason}</p>
                    <p><strong>Needed By:</strong> ${requestDetails.neededBy}</p>
                    <p><strong>Contact:</strong> ${requestDetails.contactPhone}</p>
                </div>
                <p>If you are eligible and available, please consider donating.</p>
                <p style="color: #666; font-size: 12px;">This is an automated emergency notification.</p>
            </div>
        `
    }),

    donationReminder: (donorName, nextDonationDate) => ({
        subject: '🩸 You are eligible to donate blood again!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Donation Reminder</h2>
                <p>Hello ${donorName},</p>
                <p>You are now eligible to donate blood again!</p>
                <p>Your next eligible donation date was: <strong>${nextDonationDate}</strong></p>
                <p>Your donation can help save up to 3 lives. Consider visiting a donation center soon.</p>
                <p>Thank you for being a life-saver!</p>
                <p style="color: #666; font-size: 12px;">This is an automated reminder email.</p>
            </div>
        `
    })
};

module.exports = { sendEmail, emailTemplates };