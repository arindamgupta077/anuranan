// ==================== 
// Navigation Bar Functionality
// ==================== 

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksItems.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ==================== 
// Smooth Scrolling
// ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 
// Scroll Animations
// ==================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(element => {
    observer.observe(element);
});

// ==================== 
// Gallery Pagination with Swipe Support
// ==================== 

let currentGalleryPage = 0;
const itemsPerPage = 6;
let totalGalleryItems = 0;

function initializeGalleryPagination() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const paginationContainer = document.getElementById('galleryPagination');
    
    if (!galleryGrid || !galleryItems.length) return;
    
    totalGalleryItems = galleryItems.length;
    const totalPages = Math.ceil(totalGalleryItems / itemsPerPage);
    
    // Create pagination dots
    paginationContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'pagination-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToGalleryPage(i));
        paginationContainer.appendChild(dot);
    }
    
    // Show initial page
    showGalleryPage(0);
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentGalleryPage > 0) {
            goToGalleryPage(currentGalleryPage - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentGalleryPage < totalPages - 1) {
            goToGalleryPage(currentGalleryPage + 1);
        }
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe();
    }, { passive: true });
    
    function handleGallerySwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentGalleryPage < totalPages - 1) {
                // Swipe left - next page
                goToGalleryPage(currentGalleryPage + 1);
            } else if (diff < 0 && currentGalleryPage > 0) {
                // Swipe right - previous page
                goToGalleryPage(currentGalleryPage - 1);
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentGalleryPage > 0) {
            goToGalleryPage(currentGalleryPage - 1);
        } else if (e.key === 'ArrowRight' && currentGalleryPage < totalPages - 1) {
            goToGalleryPage(currentGalleryPage + 1);
        }
    });
}

function showGalleryPage(pageIndex) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const totalPages = Math.ceil(totalGalleryItems / itemsPerPage);
    
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    galleryItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.classList.remove('hidden');
            setTimeout(() => item.classList.add('visible'), 10);
        } else {
            item.classList.remove('visible');
            item.classList.add('hidden');
        }
    });
    
    // Update pagination dots
    document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === pageIndex);
    });
    
    // Update button states
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex === totalPages - 1;
    
    currentGalleryPage = pageIndex;
}

function goToGalleryPage(pageIndex) {
    showGalleryPage(pageIndex);
    
    // Scroll to gallery if needed
    const gallerySection = document.getElementById('gallery');
    const galleryTop = gallerySection.offsetTop - 100;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > galleryTop + 400 || scrollTop < galleryTop - 100) {
        window.scrollTo({
            top: galleryTop,
            behavior: 'smooth'
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGalleryPagination);

// ==================== 
// Scroll to Top Button
// ==================== 

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== 
// Contact Form Handling
// ==================== 

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

// ==================== 
// Notification System
// ==================== 

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
    }
    
    .notification-content i {
        font-size: 20px;
    }
`;
document.head.appendChild(style);

// ==================== 
// Gallery Image Modal (Optional Enhancement)
// ==================== 

let currentImageIndex = 0;
let galleryImages = [];

function initializeGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img && img.src) {
            galleryImages.push({
                src: img.src,
                alt: img.alt || 'Gallery Image'
            });
            
            // Remove previous event listeners by cloning
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add click event to open lightbox
            newItem.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox();
            });
            
            // Add pointer cursor
            newItem.style.cursor = 'pointer';
        }
    });
}

// Initialize on page load
initializeGalleryLightbox();

function openLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${galleryImages[currentImageIndex].src}" alt="${galleryImages[currentImageIndex].alt}">
            <div class="lightbox-caption">${galleryImages[currentImageIndex].alt}</div>
            ${galleryImages.length > 1 ? `
                <button class="lightbox-prev">&#10094;</button>
                <button class="lightbox-next">&#10095;</button>
            ` : ''}
        </div>
    `;
    
    // Add lightbox styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigation
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
    document.removeEventListener('keydown', handleKeyPress);
}

function updateLightboxImage() {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    img.style.animation = 'fadeIn 0.3s ease';
    img.src = galleryImages[currentImageIndex].src;
    img.alt = galleryImages[currentImageIndex].alt;
    caption.textContent = galleryImages[currentImageIndex].alt;
}

function handleKeyPress(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }
}

// Add lightbox styles
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 40px;
        color: white;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .lightbox-close:hover {
        color: #FDB813;
    }
    
    .lightbox-caption {
        color: white;
        padding: 15px;
        font-size: 18px;
        margin-top: 10px;
    }
    
    .lightbox-prev,
    .lightbox-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(253, 184, 19, 0.8);
        color: #1B4B8F;
        border: none;
        font-size: 30px;
        padding: 15px 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }
    
    .lightbox-prev:hover,
    .lightbox-next:hover {
        background: #FDB813;
    }
    
    .lightbox-prev {
        left: 20px;
    }
    
    .lightbox-next {
        right: 20px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @media (max-width: 768px) {
        .lightbox-prev,
        .lightbox-next {
            font-size: 20px;
            padding: 10px 15px;
        }
        
        .lightbox-prev {
            left: 10px;
        }
        
        .lightbox-next {
            right: 10px;
        }
        
        .lightbox-caption {
            font-size: 16px;
        }
    }
`;
document.head.appendChild(lightboxStyle);

// ==================== 
// Course Card Hover Effects
// ==================== 

const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==================== 
// Number Counter Animation
// ==================== 

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statCards = document.querySelectorAll('.stat-card h3');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounter(statCards[0], 250);
            animateCounter(statCards[1], 50);
        }
    });
}, { threshold: 0.5 });

if (statCards.length > 0) {
    statsObserver.observe(statCards[0].parentElement.parentElement);
}

// ==================== 
// Form Validation
// ==================== 

const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#EF4444';
        } else if (this.type === 'email' && !isValidEmail(this.value)) {
            this.style.borderColor = '#EF4444';
        } else {
            this.style.borderColor = '#10B981';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#1B4B8F';
    });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== 
// Loading Animation
// ==================== 

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger animations for elements in viewport
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== 
// Parallax Effect (Optional)
// ==================== 

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==================== 
// Dynamic Year in Footer
// ==================== 

const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// ==================== 
// Prevent Right Click on Images (Optional - for protecting gallery images)
// ==================== 

// Uncomment if you want to prevent right-click on gallery images
/*
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNotification('Image download is disabled', 'error');
    });
});
*/

// ==================== 
// Mobile-Specific Optimizations
// ==================== 

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    // Close mobile menu on orientation change
    if (navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Recalculate viewport height for mobile browsers
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
});

// Set initial viewport height
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, 250);
});

// Prevent zoom on double-tap for specific elements
const preventDoubleTapZoom = (element) => {
    let lastTouchEnd = 0;
    element.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
};

// Apply to buttons and links
document.querySelectorAll('button, a.btn, .nav-link').forEach(element => {
    preventDoubleTapZoom(element);
});

// Passive event listeners for better scroll performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Any scroll-related actions
    }, 100);
}, { passive: true });

// ==================== 
// Console Message
// ==================== 

console.log('%cAnuranan Recitation Training Institute', 'color: #FDB813; font-size: 24px; font-weight: bold;');
console.log('%cWebsite developed with ❤️ for Bengali Culture', 'color: #1B4B8F; font-size: 16px;');
console.log('%cFor inquiries: info@anuranan.in', 'color: #5A6C7D; font-size: 14px;');

// ==================== 
// Performance Monitoring
// ==================== 

if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}
