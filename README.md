# 1 Call Rapid Response - Security Services Website

A professional, responsive website for 1 Call Rapid Response security services company, built with modern web technologies and featuring a complete backend for contact forms and quote requests.

## 🚀 Features

### Frontend
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Professional design with smooth animations and micro-interactions
- **Security Services Showcase**: Comprehensive service listings with detailed information
- **Interactive Forms**: Contact and quote request forms with validation
- **Performance Optimized**: Fast loading with optimized assets

### Backend
- **Node.js/Express Server**: Robust backend with security features
- **Email Integration**: Automated email notifications for form submissions
- **API Endpoints**: RESTful APIs for contact and quote forms
- **Security Features**: Rate limiting, CORS, input validation
- **Error Handling**: Comprehensive error management

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3
- Font Awesome Icons
- Google Fonts (Poppins & Roboto)
- Animate.css
- AOS (Animate On Scroll)

### Backend
- Node.js
- Express.js
- Nodemailer (Email sending)
- Helmet (Security)
- CORS
- Express Rate Limit

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for email functionality)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd 1callrr-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Contact Form Recipients
CONTACT_EMAIL=info@1callrr.co.za
QUOTE_EMAIL=info@1callrr.co.za

# Security
SESSION_SECRET=your-secure-session-secret-here
```

### 4. Gmail Setup

To enable email functionality:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Use the App Password** in the `.env` file (not your regular password)

### 5. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
1callrr-website/
├── css/
│   ├── style.css          # Main stylesheet
│   └── particles.css      # Particle animation styles
├── js/
│   ├── main.js           # Main JavaScript functionality
│   ├── quote-form.js     # Quote form modal and handling
│   └── download-profile.js # Profile download functionality
├── images/               # Website images and assets
├── docs/                 # Documentation
├── files/                # Downloadable files
├── .env                  # Environment variables (create this)
├── package.json          # Dependencies and scripts
├── server.js            # Express server
├── index.html           # Homepage
├── about.html           # About page
├── services.html        # Services page
├── contact.html         # Contact page
└── README.md            # This file
```

## 🔧 API Endpoints

### Contact Form
```
POST /api/contact
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Contact message"
}
```

### Quote Request
```
POST /api/quote
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+27123456789",
  "company": "ABC Corp",
  "service": "Armed Response",
  "message": "Quote requirements",
  "location": "Johannesburg"
}
```

### Health Check
```
GET /api/health
```

## 📧 Email Templates

The system includes professional email templates for:

- **Contact Form Submissions**: Sent to business email with customer details
- **Quote Requests**: Detailed quote requests with service specifications
- **Auto-Replies**: Confirmation emails sent to customers

## 🔒 Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Configured for allowed origins
- **Helmet Security Headers**: XSS and security protections
- **Email Sanitization**: Input cleaning and validation

## 📱 Responsive Breakpoints

- **Mobile**: ≤576px
- **Tablet**: 577px - 992px
- **Desktop**: 993px - 1199px
- **Large Desktop**: 1200px - 1399px
- **Extra Large**: ≥1400px

## 🎨 Customization

### Colors
The design uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-color: #002244;
  --secondary-color: #000000;
  --text-light: #ffffff;
  --text-dark: #000000;
}
```

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Roboto (Google Fonts)
- **Responsive Scaling**: Automatic font size adjustments

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
```

### Process Management
Consider using PM2 for production:
```bash
npm install -g pm2
pm2 start server.js --name "1callrr-website"
```

## 🐛 Troubleshooting

### Email Not Sending
1. Verify Gmail credentials in `.env`
2. Check that 2FA is enabled and App Password is correct
3. Review server logs for error messages

### Form Submissions Failing
1. Check network connectivity
2. Verify API endpoints are accessible
3. Check browser console for JavaScript errors

### Server Not Starting
1. Ensure Node.js v14+ is installed
2. Check that all dependencies are installed
3. Verify `.env` file exists and is properly configured

## 📄 License

This project is proprietary software for 1 Call Rapid Response.

## 👥 Support

For technical support or questions:
- Email: info@1callrr.co.za
- Phone: +27 11 568 6927 | +27 62 517 2088

## 🔄 Updates

### Version 1.1
- Added complete backend functionality
- Implemented email notifications
- Enhanced security features
- Improved responsive design
- Added professional form handling

---

**Built with ❤️ for 1 Call Rapid Response Security Services**
