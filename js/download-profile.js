/*
* 1 Call Rapid Response - Download Profile JavaScript
* Author: Bhekumusa Eric Ntshwenya
* Version: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Get all "Download Profile" buttons - specifically target the download-profile-btn class
    const downloadButtons = document.querySelectorAll('.download-profile-btn');
    
    console.log('Found download buttons:', downloadButtons.length);

    // Add click event to all download buttons
    downloadButtons.forEach((button, index) => {
        console.log(`Setting up button ${index + 1}:`, button.textContent.trim());
        // Set up the download attributes
        button.setAttribute('href', 'files/1CallRR_Business_Profile_2025.pdf');
        button.setAttribute('download', '1CallRR_Business_Profile_2025.pdf');
        button.setAttribute('target', '_blank');

        // Add click tracking
        button.addEventListener('click', function(e) {
            console.log('1CallRR Business Profile 2025 download initiated');
            
            // Force download using a different method if direct link fails
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'files/1CallRR_Business_Profile_2025.pdf';
                link.download = '1CallRR_Business_Profile_2025.pdf';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 100);

            // Show a toast notification
            showDownloadNotification();
        });
    });

    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastHTML = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
            <div id="downloadToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="background-color: #002244; color: white; border: 2px solid #ffd700;">
                <div class="toast-header" style="background-color: #002244; color: white; border-bottom: 1px solid #ffd700;">
                    <i class="fas fa-download me-2" style="color: #ffd700;"></i>
                    <strong class="me-auto" style="color: white;">1 Call Rapid Response</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body" style="background-color: #002244; color: white;">
                    <i class="fas fa-check-circle me-2" style="color: #28a745;"></i>
                    Your 2025 Business Profile download has started. Thank you for your interest in our services!
                </div>
            </div>
        </div>
        `;

        // Append toast to body
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }

    // Function to show download notification
    function showDownloadNotification() {
        const toastElement = document.getElementById('downloadToast');
        if (toastElement) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    }
});
