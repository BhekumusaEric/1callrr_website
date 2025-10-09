/*
* 1 Call Rapid Response - Main JavaScript
* Author: Bhekumusa Eric Ntshwenya
* Version: 1.1
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top on page load to fix navigation blank space issue
    window.scrollTo(0, 0);

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Reveal animations on scroll
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');

        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Call once on page load

    // Activate heading animations
    function activateHeadings() {
        const headings = document.querySelectorAll('h2');

        for (let i = 0; i < headings.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = headings[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                headings[i].classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', activateHeadings);
    activateHeadings(); // Call once on page load

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            if (!name.value.trim()) {
                isValid = false;
                highlightField(name);
            } else {
                resetField(name);
            }

            if (!email.value.trim() || !isValidEmail(email.value)) {
                isValid = false;
                highlightField(email);
            } else {
                resetField(email);
            }

            if (!message.value.trim()) {
                isValid = false;
                highlightField(message);
            } else {
                resetField(message);
            }

            if (isValid) {
                // In a real application, you would send the form data to a server
                // For this demo, we'll just show a success message
                showFormSuccess();
            }
        });
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to highlight invalid fields
    function highlightField(field) {
        field.classList.add('is-invalid');
    }

    // Helper function to reset field styling
    function resetField(field) {
        field.classList.remove('is-invalid');
    }

    // Helper function to show form success message
    function showFormSuccess() {
        const form = document.getElementById('contactForm');
        const formContainer = form.parentElement;

        // Hide the form
        form.style.display = 'none';

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.innerHTML = `
            <h4 class="alert-heading">Message Sent!</h4>
            <p>Thank you for contacting 1 Call Rapid Response. We have received your message and will get back to you shortly.</p>
            <hr>
            <p class="mb-0">Our team typically responds within 24 hours.</p>
        `;

        // Add success message to the form container
        formContainer.appendChild(successMessage);

        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            successMessage.remove();
            form.style.display = 'block';
        }, 5000);
    }

    // Add active class to current page in navigation
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Add animated-link class to all links in the footer
    document.querySelectorAll('footer a').forEach(link => {
        link.classList.add('animated-link');
    });

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // Add animated classes to elements
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.classList.add('animated-element');
    });

    // Add reveal classes to sections
    document.querySelectorAll('section').forEach((section, index) => {
        if (index % 2 === 0) {
            section.classList.add('reveal', 'fade-bottom');
        } else {
            if (index % 4 === 1) {
                section.classList.add('reveal', 'fade-left');
            } else {
                section.classList.add('reveal', 'fade-right');
            }
        }
    });

    // Removed floating animation for professional corporate look

    // Add parallax effect to hero and page header sections
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        const pageHeader = document.querySelector('.page-header');
        const scrollPosition = window.scrollY;

        // We don't need to adjust background position for particles.js
        // as it creates its own dynamic background
    });

    // Add back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopButton = document.createElement('div');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopButton);

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
    }

    // Add preloader if it doesn't exist
    if (!document.querySelector('.preloader') && window.location.hash === '') {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(preloader);

        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    }

    // Add fade-in class to all images
    document.querySelectorAll('img').forEach(img => {
        img.classList.add('fade-in');

        // Trigger the animation once the image is loaded
        img.addEventListener('load', function() {
            this.classList.add('active');
        });

        // If the image is already loaded, add the active class immediately
        if (img.complete) {
            img.classList.add('active');
        }
    });
});
