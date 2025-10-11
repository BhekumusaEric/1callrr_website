/*
 * 1 Call Rapid Response - Mobile Scroll Enhancement
 * Author: Bhekumusa Eric Ntshwenya
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced mobile scrolling for card sections
    const mobileScrollSections = [
        '.why-choose-mobile',
        '.services-mobile', 
        '.service-highlights-mobile',
        '.cyber-security-mobile',
        '.client-experience-mobile'
    ];

    mobileScrollSections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            enhanceMobileScroll(section);
        }
    });

    function enhanceMobileScroll(container) {
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;

        // Add smooth scroll behavior
        container.style.scrollBehavior = 'smooth';
        
        // Touch events for better mobile experience
        container.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.scrollBehavior = 'auto';
        });

        container.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('touchend', () => {
            isScrolling = false;
            container.style.scrollBehavior = 'smooth';
            snapToCard(container);
        });

        // Mouse events for desktop testing
        container.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';
            container.style.scrollBehavior = 'auto';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('mouseup', () => {
            isScrolling = false;
            container.style.cursor = 'grab';
            container.style.scrollBehavior = 'smooth';
            snapToCard(container);
        });

        container.addEventListener('mouseleave', () => {
            isScrolling = false;
            container.style.cursor = 'grab';
        });

        // Add grab cursor
        container.style.cursor = 'grab';
    }

    function snapToCard(container) {
        const cards = container.children;
        if (cards.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestCard = cards[0];
        let closestDistance = Infinity;

        Array.from(cards).forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        });

        // Smooth scroll to the closest card
        const cardOffsetLeft = closestCard.offsetLeft;
        const cardWidth = closestCard.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollTo = cardOffsetLeft - (containerWidth - cardWidth) / 2;

        container.scrollTo({
            left: Math.max(0, scrollTo),
            behavior: 'smooth'
        });
    }

    // Add scroll progress indicators
    mobileScrollSections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            addScrollProgress(section);
        }
    });

    function addScrollProgress(container) {
        const indicator = container.parentElement.querySelector('.scroll-indicator');
        if (!indicator) return;

        // Create progress dots
        const cards = container.children;
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        progressContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 10px;
        `;

        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
                cursor: pointer;
            `;
            
            dot.addEventListener('click', () => {
                const cardOffsetLeft = cards[i].offsetLeft;
                const cardWidth = cards[i].offsetWidth;
                const containerWidth = container.offsetWidth;
                const scrollTo = cardOffsetLeft - (containerWidth - cardWidth) / 2;
                
                container.scrollTo({
                    left: Math.max(0, scrollTo),
                    behavior: 'smooth'
                });
            });
            
            progressContainer.appendChild(dot);
        }

        indicator.appendChild(progressContainer);

        // Update active dot on scroll
        container.addEventListener('scroll', () => {
            updateProgressDots(container, progressContainer);
        });

        // Initial update
        updateProgressDots(container, progressContainer);
    }

    function updateProgressDots(container, progressContainer) {
        const dots = progressContainer.children;
        const cards = container.children;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let activeIndex = 0;
        let closestDistance = Infinity;

        Array.from(cards).forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                activeIndex = index;
            }
        });

        // Update dot styles
        Array.from(dots).forEach((dot, index) => {
            if (index === activeIndex) {
                dot.style.background = '#ffd700';
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.style.background = 'rgba(255, 255, 255, 0.3)';
                dot.style.transform = 'scale(1)';
            }
        });
    }

    // Add momentum scrolling for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        mobileScrollSections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.webkitOverflowScrolling = 'touch';
            }
        });
    }

    // Optimize performance by reducing animations on mobile
    if (window.innerWidth <= 768) {
        // Reduce AOS animations on mobile for better performance
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 400,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                disable: 'mobile'
            });
        }

        // Reduce particle density on mobile
        if (window.particlesJS && document.getElementById('particles-js')) {
            window.particlesJS('particles-js', {
                particles: {
                    number: { value: 30 }, // Reduced from default
                    size: { value: 3 },
                    move: { speed: 1 }
                }
            });
        }
    }
});

// Mobile Carousel System
class MobileCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.cards = Array.from(container.querySelectorAll('.carousel-card'));
        this.prevBtn = container.querySelector('.carousel-nav.prev');
        this.nextBtn = container.querySelector('.carousel-nav.next');
        this.dotsContainer = container.querySelector('.carousel-dots');

        this.currentIndex = 0;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.createDots();
        this.updateButtons();
        this.updateDots();
        this.bindEvents();
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateButtons() {
        this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
        this.nextBtn.classList.toggle('disabled', this.currentIndex === this.cards.length - 1);
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Touch events for swipe
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.track.classList.add('dragging');
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;
            e.preventDefault();
        });

        this.track.addEventListener('touchend', (e) => {
            if (!this.touchStartX) return;

            this.touchEndX = e.changedTouches[0].clientX;
            const diffX = this.touchStartX - this.touchEndX;

            this.track.classList.remove('dragging');

            // Minimum swipe distance
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.touchStartX = 0;
            this.touchEndX = 0;
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;

        this.isTransitioning = true;
        this.currentIndex = index;

        this.track.style.transform = `translateX(-${index * 100}%)`;

        this.updateButtons();
        this.updateDots();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    nextSlide() {
        if (this.currentIndex < this.cards.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
}

// Initialize carousels on mobile
if (window.innerWidth <= 768) {
    setTimeout(() => {
        const carousels = document.querySelectorAll('.mobile-carousel');
        carousels.forEach(carousel => {
            new MobileCarousel(carousel);
        });
    }, 1000); // Initialize after page animations
}

// Add CSS for scroll progress dots and animations
const style = document.createElement('style');
style.textContent = `
.scroll-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.progress-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.progress-dot::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: rgba(255, 215, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.progress-dot.active {
    background: #ffd700;
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.progress-dot.active::before {
    opacity: 1;
}

/* Auto-slide indicator */
.auto-slide-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 10;
}

.auto-slide-indicator i {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@media (max-width: 768px) {
    /* Ensure smooth scrolling on mobile */
    .mobile-only {
        scroll-snap-type: x mandatory;
    }

    .mobile-only > * {
        scroll-snap-align: center;
    }

    /* Optimize touch scrolling */
    .mobile-only {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
    }

    /* Add auto-slide indicators to mobile sections */
    .mobile-only {
        position: relative;
    }

    .mobile-only::after {
        content: 'Auto-sliding • Touch to pause';
        position: absolute;
        top: -25px;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 500;
        z-index: 10;
    }
}

/* Enhanced slide animations */
@keyframes slideInFromRight {
    0% {
        transform: translateX(100px) scale(0.9);
        opacity: 0;
    }
    100% {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
}

@keyframes slideInFromRightFar {
    0% {
        transform: translateX(150px) scale(0.8);
        opacity: 0;
    }
    100% {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
}

@keyframes slideInStaggered {
    0% {
        transform: translateX(80px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
}

/* Add bounce effect to cards */
.glass-card:hover,
.service-card:hover,
.client-experience-card:hover,
.service-highlight-card:hover {
    animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);