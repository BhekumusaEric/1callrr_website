/*
* 1 Call Rapid Response - Download Profile JavaScript
* Author: Bhekumusa Eric Ntshwenya
* Version: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Get all "Download Profile" buttons - specifically target buttons with download-profile-btn class
    const downloadButtons = document.querySelectorAll('a.download-profile-btn, a.btn-primary:not(.glow-button)');

    // Add click event to all download buttons
    downloadButtons.forEach(button => {
        if (button.textContent.includes('Download Profile')) {
            button.setAttribute('href', 'files/1CallRR_Company_Profile.pdf');
            button.setAttribute('download', '1CallRR_Company_Profile.pdf');
            button.setAttribute('target', '_blank');

            // Add click tracking
            button.addEventListener('click', function(e) {
                // In a real application, you might want to track downloads
                console.log('Company profile downloaded');

                // Show a toast notification
                showDownloadNotification();
            });
        }
    });

    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastHTML = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="downloadToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">1 Call Rapid Response</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Your download has started. Thank you for your interest in our services!
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
