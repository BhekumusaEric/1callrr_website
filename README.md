# 1 Call Rapid Response Website

A professional, modern, and responsive website for **1 Call Rapid Response**, a premier security services provider.

## 🚀 Features

-   **Modern Design**: Sleek, dark-themed UI with glass-morphism effects.
-   **Responsive**: Fully optimized for mobile, tablet, and desktop.
-   **Dynamic Content**:
    -   Animated counters for key statistics.
    -   Floating WhatsApp widget for instant communication.
    -   Scroll-triggered animations (AOS).
-   **Interactive Elements**:
    -   Particle background effects.
    -   Hover effects on service cards and buttons.
-   **Comprehensive Content**:
    -   Detailed service descriptions (Armed Response, VIP Protection, etc.).
    -   Accreditations (B-BBEE Level 1, PSIRA).
    -   Trusted Clients section.

## 📂 Project Structure

```
/
├── index.html          # Homepage
├── about.html          # About Us page
├── services.html       # Services page
├── contact.html        # Contact Us page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── main.js         # Main JavaScript logic
│   └── particles-config.js # Particle background settings
├── images/             # Image assets
├── files/              # Downloadable documents (e.g., Business Profile)
└── backend-api/        # (Optional) Node.js server for email/backend logic
```

## 🛠️ Setup & Usage

### Static (GitHub Pages)
This website handles form submissions in "Demo Mode" by default for static hosting.

1.  Clone the repository.
2.  Open `index.html` in your browser.

### Full Stack (Development)
To enable the backend (email sending, etc.):

1.  Navigate to `backend-api/`.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file with your email credentials.
4.  Run the server: `node server.js`.
5.  Uncomment the API call logic in `js/main.js`.

## 📦 Deployment

### GitHub Pages
1.  Push this repository to GitHub.
2.  Go to **Settings** > **Pages**.
3.  Select the **main** branch as the source.
4.  Save. Your site will be live at `https://[username].github.io/[repo-name]/`.

## 📄 Credits
-   **Design & Development**: 1 Call Rapid Response Team
-   **Icons**: FontAwesome
-   **Animations**: AOS & Particles.js
