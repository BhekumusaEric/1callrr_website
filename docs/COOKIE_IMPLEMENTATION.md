# Cookie Implementation Guide - 1 Call Rapid Response

## Overview

This document provides a comprehensive guide to the cookie management system implemented for the 1 Call Rapid Response website. The system includes server-side cookie handling, client-side cookie management, user preferences, form auto-save functionality, and GDPR-compliant cookie consent.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Server-Side Implementation](#server-side-implementation)
3. [Client-Side Implementation](#client-side-implementation)
4. [Cookie Types and Usage](#cookie-types-and-usage)
5. [API Endpoints](#api-endpoints)
6. [User Interface Components](#user-interface-components)
7. [Security Considerations](#security-considerations)
8. [GDPR Compliance](#gdpr-compliance)
9. [Testing Guide](#testing-guide)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

The cookie management system consists of three main components:

1. **Server-Side Cookie Utilities** (`server.js`)
   - Built-in Express cookie parsing
   - Cookie utility functions for setting/clearing cookies
   - API endpoints for cookie-based features

2. **Client-Side Cookie Manager** (`js/cookie-manager.js`)
   - JavaScript class for cookie operations
   - User preferences management
   - Form auto-save functionality
   - Cookie consent handling

3. **User Interface** (`css/cookie-styles.css`)
   - Cookie consent banner
   - Theme toggle button
   - Notification system
   - Dark/light theme support

## Server-Side Implementation

### Cookie Parsing Middleware

```javascript
// Built-in cookie parsing middleware
app.use((req, res, next) => {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts.length === 2) {
        cookies[parts[0]] = decodeURIComponent(parts[1]);
      }
    });
  }
  req.cookies = cookies;
  next();
});
```

### Cookie Utility Functions

The server provides utility functions for cookie management:

- `cookieUtils.setCookie(res, name, value, options)` - Set a cookie with options
- `cookieUtils.clearCookie(res, name, options)` - Clear a cookie

### Cookie Options

Default cookie options include:
- `httpOnly: false` - Allow JavaScript access (configurable)
- `secure: true` (in production) - HTTPS only
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 24 * 60 * 60 * 1000` - 24 hours default

## Client-Side Implementation

### CookieManager Class

The `CookieManager` class provides comprehensive cookie management:

```javascript
// Initialize cookie manager
const cookieManager = new CookieManager();

// Basic cookie operations
cookieManager.setCookie('name', 'value', options);
const value = cookieManager.getCookie('name');
cookieManager.deleteCookie('name');
```

### Key Features

1. **User Preferences Management**
   - Theme switching (light/dark)
   - Language preferences
   - Auto-fill settings
   - Notification preferences

2. **Form Auto-Save**
   - Automatic form progress saving
   - Form data restoration
   - Progress notifications

3. **Cookie Consent**
   - GDPR-compliant consent banner
   - Granular consent options
   - Consent persistence

## Cookie Types and Usage

### 1. User Preferences Cookie (`user_preferences`)

**Purpose**: Store user interface preferences
**Duration**: 30 days
**Structure**:
```json
{
  "theme": "light|dark",
  "language": "en|other",
  "autoFill": true|false,
  "notifications": true|false,
  "lastUpdated": "ISO_DATE_STRING"
}
```

### 2. Form Progress Cookies (`form_progress_[formType]`)

**Purpose**: Save partially completed forms
**Duration**: 1 hour
**Structure**:
```json
{
  "formType": "contact|quote",
  "formData": {
    "name": "value",
    "email": "value",
    // ... other form fields
  },
  "timestamp": "ISO_DATE_STRING"
}
```

### 3. Cookie Consent Cookie (`cookie_consent`)

**Purpose**: Store user's cookie consent preferences
**Duration**: 1 year
**Structure**:
```json
{
  "functional": true,
  "analytics": true|false,
  "marketing": true|false,
  "timestamp": "ISO_DATE_STRING"
}
```

## API Endpoints

### User Preferences

#### GET `/api/preferences`
Retrieve user preferences from cookies.

**Response**:
```json
{
  "success": true,
  "preferences": {
    "theme": "light",
    "language": "en",
    "autoFill": true,
    "notifications": true
  }
}
```

#### POST `/api/preferences`
Save user preferences to cookies.

**Request Body**:
```json
{
  "theme": "dark",
  "language": "en",
  "autoFill": true,
  "notifications": false
}
```

### Form Progress

#### POST `/api/form-progress`
Save form progress.

**Request Body**:
```json
{
  "formType": "contact",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/form-progress/:formType`
Retrieve saved form progress.

#### DELETE `/api/form-progress/:formType`
Clear saved form progress.

### Cookie Consent

#### GET `/api/cookie-consent`
Get current cookie consent status.

#### POST `/api/cookie-consent`
Save cookie consent preferences.

**Request Body**:
```json
{
  "functional": true,
  "analytics": true,
  "marketing": false
}
```

## User Interface Components

### Cookie Consent Banner

The consent banner appears at the bottom of the page for new users:

- **Essential Only**: Accept only functional cookies
- **Accept Selected**: Accept user-selected cookie types
- **Accept All**: Accept all cookie types

### Theme Toggle Button

Fixed position button for switching between light and dark themes:
- Located on the right side of the screen
- Animated icon rotation
- Instant theme application

### Notifications

Toast-style notifications for user feedback:
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Auto-dismiss after 3 seconds

## Security Considerations

### Cookie Security

1. **Secure Flag**: Cookies are marked as secure in production (HTTPS only)
2. **SameSite Protection**: Set to 'lax' to prevent CSRF attacks
3. **HttpOnly Option**: Configurable based on cookie purpose
4. **Domain Restriction**: Cookies are domain-specific

### Data Validation

1. **Server-Side Validation**: All cookie data is validated on the server
2. **Input Sanitization**: User input is sanitized before storage
3. **Size Limits**: Cookies are limited to 4KB per cookie
4. **Expiration**: All cookies have appropriate expiration times

### Privacy Protection

1. **No Sensitive Data**: Personal information is not stored in cookies
2. **Consent Required**: Analytics and marketing cookies require explicit consent
3. **Easy Opt-Out**: Users can easily clear cookies and change preferences

## GDPR Compliance

### Consent Management

The system implements GDPR-compliant consent management:

1. **Explicit Consent**: Users must actively consent to non-essential cookies
2. **Granular Control**: Users can choose specific cookie categories
3. **Easy Withdrawal**: Consent can be withdrawn at any time
4. **Consent Records**: Consent decisions are timestamped and stored

### Cookie Categories

1. **Functional/Essential**: Required for basic site functionality (no consent needed)
2. **Analytics**: Help improve the website (consent required)
3. **Marketing**: Personalized content and ads (consent required)

### User Rights

Users have the right to:
- View what cookies are being used
- Consent to or refuse non-essential cookies
- Withdraw consent at any time
- Clear all cookies

## Testing Guide

### Manual Testing

1. **Cookie Consent Flow**:
   - Visit site in incognito mode
   - Verify consent banner appears
   - Test all consent options
   - Verify banner doesn't reappear after consent

2. **Theme Switching**:
   - Click theme toggle button
   - Verify theme changes immediately
   - Refresh page and verify theme persists
   - Test in different browsers

3. **Form Auto-Save**:
   - Start filling a form
   - Navigate away and return
   - Verify form data is restored
   - Test form submission clears saved data

### Automated Testing

```javascript
// Example test for cookie functionality
describe('Cookie Management', () => {
  test('should set and retrieve cookies', () => {
    cookieManager.setCookie('test', 'value');
    expect(cookieManager.getCookie('test')).toBe('value');
  });

  test('should handle user preferences', async () => {
    const preferences = { theme: 'dark' };
    const success = await cookieManager.saveUserPreferences(preferences);
    expect(success).toBe(true);
  });
});
```

### Browser Testing

Test across different browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

## Troubleshooting

### Common Issues

1. **Cookies Not Saving**
   - Check browser cookie settings
   - Verify HTTPS in production
   - Check domain configuration

2. **Theme Not Persisting**
   - Verify cookie expiration
   - Check JavaScript errors
   - Ensure CSS variables are properly set

3. **Form Auto-Save Not Working**
   - Check form field `name` attributes
   - Verify API endpoints are accessible
   - Check browser console for errors

4. **Consent Banner Not Appearing**
   - Clear existing consent cookies
   - Check JavaScript initialization
   - Verify CSS is loaded

### Debug Mode

Enable debug mode by adding to browser console:
```javascript
cookieManager.debug = true;
```

This will log all cookie operations to the console.

### Performance Monitoring

Monitor cookie-related performance:
- API response times
- Cookie size limits
- JavaScript execution time
- Network requests

## Best Practices

### Development

1. **Test Thoroughly**: Test all cookie functionality across browsers
2. **Monitor Size**: Keep cookie sizes minimal
3. **Use Appropriate Expiration**: Set reasonable expiration times
4. **Handle Errors**: Implement proper error handling
5. **Document Changes**: Update documentation when modifying cookie logic

### Production

1. **Monitor Usage**: Track cookie consent rates
2. **Performance**: Monitor impact on page load times
3. **Compliance**: Regularly review GDPR compliance
4. **Security**: Keep security measures up to date
5. **User Feedback**: Collect and respond to user feedback

## Conclusion

The cookie management system provides a robust, secure, and GDPR-compliant solution for managing user preferences, form data, and consent. The modular architecture allows for easy maintenance and extension of functionality.

For questions or issues, refer to the troubleshooting section or contact the development team.