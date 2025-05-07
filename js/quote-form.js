/*
* 1 Call Rapid Response - Quote Form JavaScript
* Author: Bhekumusa Eric Ntshwenya
* Version: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Get all "Get A Quote" buttons - specifically target buttons with glow-button class
    const quoteButtons = document.querySelectorAll('a.glow-button, a.btn-primary:not(.download-profile-btn)');

    // Create modal container if it doesn't exist
    if (!document.getElementById('quoteModal')) {
        const modalHTML = `
        <div class="modal fade" id="quoteModal" tabindex="-1" aria-labelledby="quoteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content glass-card">
                    <div class="modal-header border-0">
                        <h5 class="modal-title gradient-text" id="quoteModalLabel">Request a Quote</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-4">Please fill out the form below to request a customized security solution quote.</p>
                        <form id="quoteForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="name" class="form-label">Full Name*</label>
                                    <input type="text" class="form-control" id="quoteName" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="email" class="form-label">Email Address*</label>
                                    <input type="email" class="form-control" id="quoteEmail" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="phone" class="form-label">Phone Number*</label>
                                    <input type="tel" class="form-control" id="quotePhone" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="company" class="form-label">Company Name</label>
                                    <input type="text" class="form-control" id="quoteCompany">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="serviceType" class="form-label">Service Type*</label>
                                <select class="form-select" id="serviceType" required>
                                    <option value="" selected disabled>Select a service</option>
                                    <option value="Armed Response">Armed & Unarmed Response</option>
                                    <option value="Event Security">Event Security</option>
                                    <option value="VIP Security">VIP Security</option>
                                    <option value="Offsite Monitoring">Offsite Monitoring</option>
                                    <option value="Surveillance">Surveillance</option>
                                    <option value="Disaster Response">Disaster Response</option>
                                    <option value="Other">Other (Please specify)</option>
                                </select>
                            </div>
                            <div class="mb-3" id="otherServiceContainer" style="display: none;">
                                <label for="otherService" class="form-label">Please Specify Service</label>
                                <input type="text" class="form-control" id="otherService">
                            </div>
                            <div class="mb-3">
                                <label for="requirements" class="form-label">Requirements & Details*</label>
                                <textarea class="form-control" id="requirements" rows="4" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="location" class="form-label">Location*</label>
                                <select class="form-select" id="location" required>
                                    <option value="" selected disabled>Select location</option>
                                    <option value="Johannesburg">Johannesburg</option>
                                    <option value="Cape Town">Cape Town</option>
                                    <option value="Durban">Durban</option>
                                    <option value="Other">Other (Please specify)</option>
                                </select>
                            </div>
                            <div class="mb-3" id="otherLocationContainer" style="display: none;">
                                <label for="otherLocation" class="form-label">Please Specify Location</label>
                                <input type="text" class="form-control" id="otherLocation">
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="termsCheck" required>
                                <label class="form-check-label" for="termsCheck">I agree to the terms and conditions*</label>
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="btn btn-primary glow-button">Submit Quote Request</button>
                            </div>
                        </form>
                        <div id="quoteFormSuccess" class="alert alert-success mt-4" style="display: none;">
                            <h4 class="alert-heading">Quote Request Submitted!</h4>
                            <p>Thank you for your interest in 1 Call Rapid Response security services. We have received your quote request and will get back to you shortly with a customized solution.</p>
                            <hr>
                            <p class="mb-0">Our team typically responds within 24 hours.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Initialize the modal
        const quoteModal = new bootstrap.Modal(document.getElementById('quoteModal'));

        // Show/hide "Other" fields based on selection
        document.getElementById('serviceType').addEventListener('change', function() {
            const otherServiceContainer = document.getElementById('otherServiceContainer');
            if (this.value === 'Other') {
                otherServiceContainer.style.display = 'block';
                document.getElementById('otherService').setAttribute('required', 'required');
            } else {
                otherServiceContainer.style.display = 'none';
                document.getElementById('otherService').removeAttribute('required');
            }
        });

        document.getElementById('location').addEventListener('change', function() {
            const otherLocationContainer = document.getElementById('otherLocationContainer');
            if (this.value === 'Other') {
                otherLocationContainer.style.display = 'block';
                document.getElementById('otherLocation').setAttribute('required', 'required');
            } else {
                otherLocationContainer.style.display = 'none';
                document.getElementById('otherLocation').removeAttribute('required');
            }
        });

        // Handle form submission
        document.getElementById('quoteForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // In a real application, you would send the form data to a server
            // For this demo, we'll just show a success message
            document.getElementById('quoteForm').style.display = 'none';
            document.getElementById('quoteFormSuccess').style.display = 'block';

            // Reset form after 5 seconds and close modal
            setTimeout(() => {
                document.getElementById('quoteForm').reset();
                document.getElementById('quoteForm').style.display = 'block';
                document.getElementById('quoteFormSuccess').style.display = 'none';
                quoteModal.hide();
            }, 5000);
        });
    }

    // Add click event to all quote buttons
    quoteButtons.forEach(button => {
        // Only add event listener if it's a quote button (contains "Get A Quote" text)
        if (button.textContent.includes('Get A Quote')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const quoteModal = new bootstrap.Modal(document.getElementById('quoteModal'));
                quoteModal.show();
            });
        }
    });
});
