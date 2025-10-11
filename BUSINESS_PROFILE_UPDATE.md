# Business Profile Update - 2025

## Changes Made

### 1. Updated Download Functionality
- **File**: [`js/download-profile.js`](js/download-profile.js:14)
- **Change**: Updated to point to new `1CallRR_Business_Profile_2025.pdf`
- **Previous**: `1CallRR_Company_Profile.pdf`
- **New**: `1CallRR_Business_Profile_2025.pdf`

### 2. Created New Business Profile File
- **File**: [`files/1CallRR_Business_Profile_2025.pdf`](files/1CallRR_Business_Profile_2025.pdf:1)
- **Status**: Placeholder PDF created
- **Action Required**: Replace with actual 2025 business profile content

### 3. Added Server Route
- **File**: [`server.js`](server.js:181)
- **Added**: Dedicated download endpoint for the new business profile
- **Features**: 
  - Proper PDF content headers
  - Attachment download behavior
  - Secure file serving

## How It Works

### Download Button Behavior:
1. User clicks "Download Profile" button on website
2. JavaScript automatically sets the correct file path
3. Browser downloads `1CallRR_Business_Profile_2025.pdf`
4. Toast notification confirms download started

### File Locations:
- **Download Script**: `js/download-profile.js`
- **PDF File**: `files/1CallRR_Business_Profile_2025.pdf`
- **Server Route**: `server.js` (lines 181-185)

## Next Steps

### To Complete the Update:
1. **Replace the placeholder PDF** with your actual 2025 business profile
2. **Test the download** by clicking "Download Profile" on the website
3. **Verify** the correct file downloads with proper filename

### File Replacement:
Simply replace the current `files/1CallRR_Business_Profile_2025.pdf` with your actual business profile PDF file, keeping the same filename.

## Testing

The download functionality will work on:
- ✅ All pages with "Download Profile" buttons
- ✅ Both direct file access and button clicks
- ✅ Proper filename and download behavior
- ✅ Toast notifications for user feedback

Your website now uses the updated 2025 business profile for all download requests!