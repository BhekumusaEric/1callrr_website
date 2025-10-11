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

// Add CSS for scroll progress dots
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
    }
    
    .progress-dot.active {
        background: #ffd700;
        transform: scale(1.2);
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
    }
`;
document.head.appendChild(style);