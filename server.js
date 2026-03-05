import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // In production you can restrict origin: { origin: 'https://your-domain.com' }
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (good for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// SMTP transporter
const smtpTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,              // Better performance in production
  maxMessages: 100,
  rateDelta: 1000,
});

// Verify connection on startup (logs only – doesn't crash)
smtpTransporter.verify()
  .then(() => console.log('✅ SMTP connection verified'))
  .catch(err => console.error('⚠️ SMTP verification failed:', err.message));

// Email endpoint
app.post('/api/email', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"Zigma Neutral" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #7c3aed;">New Contact Message</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
      </div>
    `,
  };

  try {
    await smtpTransporter.sendMail(mailOptions);
    console.log(`Email sent successfully from ${email}`);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Zigma Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});