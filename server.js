/*
 * 1 Call Rapid Response - Backend Server
 * Author: Bhekumusa Eric Ntshwenya
 * Version: 1.0.0
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files with caching
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache static assets for 1 day
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    // Cache images for 7 days
    if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.svg') || path.endsWith('.ico')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    // Don't cache HTML files
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// SEO files
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || 'info@1callrr.co.za',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002244;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #002244;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from the 1 Call Rapid Response website contact form.
          </p>
        </div>
      `,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting 1 Call Rapid Response',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002244;">Thank You for Contacting Us</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to 1 Call Rapid Response. We have received your message and will get back to you within 24 hours.</p>
            <p>Our team is committed to providing you with the best security solutions for your needs.</p>
            <p>Best regards,<br>The 1 Call Rapid Response Team</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #002244; color: white; border-radius: 4px;">
            <p style="margin: 0;"><strong>Contact Information:</strong></p>
            <p style="margin: 5px 0;">Phone: +27 11 568 6927 | +27 62 517 2088</p>
            <p style="margin: 5px 0;">Email: info@1callrr.co.za</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Quote request endpoint
app.post('/api/quote', limiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      message,
      location,
      urgency
    } = req.body;

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and service type are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Phone validation (South African numbers)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid South African phone number'
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.QUOTE_EMAIL || 'info@1callrr.co.za',
      subject: `New Quote Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002244;">New Quote Request</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #002244; margin-top: 0;">Client Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}

            <h3 style="color: #002244;">Service Request</h3>
            <p><strong>Service Type:</strong> ${service}</p>
            ${urgency ? `<p><strong>Urgency:</strong> ${urgency}</p>` : ''}
            ${message ? `<p><strong>Additional Details:</strong></p><p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #002244;">${message.replace(/\n/g, '<br>')}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This quote request was submitted through the 1 Call Rapid Response website.
          </p>
        </div>
      `,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Quote Request Received - 1 Call Rapid Response',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002244;">Quote Request Received</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p>Dear ${name},</p>
            <p>Thank you for your interest in 1 Call Rapid Response security services. We have received your quote request for <strong>${service}</strong> and will prepare a customized proposal for you.</p>
            <p>Our team will review your requirements and get back to you within 24-48 hours with a detailed quote.</p>
            <p>If you have any additional information or urgent requirements, please don't hesitate to contact us directly.</p>
            <p>Best regards,<br>The 1 Call Rapid Response Team</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #002244; color: white; border-radius: 4px;">
            <p style="margin: 0;"><strong>Direct Contact:</strong></p>
            <p style="margin: 5px 0;">Phone: +27 11 568 6927 | +27 62 517 2088</p>
            <p style="margin: 5px 0;">Email: info@1callrr.co.za</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.json({
      success: true,
      message: 'Quote request submitted successfully! We will get back to you within 24-48 hours.'
    });

  } catch (error) {
    console.error('Quote form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote request. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: '1 Call Rapid Response Website API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 1 Call Rapid Response server running on port ${PORT}`);
  console.log(`📧 Email service: ${transporter.options.service}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;