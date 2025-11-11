// ==================== 
// Navigation Bar Functionality
// ==================== 

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link');
const joinButton = document.querySelector('.btn-join');
const navOverlay = document.getElementById('navOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Function to close mobile menu
function closeMobileMenu(skipAnimation = false) {
    if (skipAnimation) {
        // Immediate close without animation (used after swipe animation)
        navLinks.style.transition = 'none';
    }
    
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (skipAnimation) {
        // Reset after a brief delay to ensure the active class removal is processed
        setTimeout(() => {
            navLinks.style.transition = '';
        }, 50);
    }
}

// Function to open mobile menu
function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

// Close mobile menu when clicking overlay
navOverlay.addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking close button
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking Join Now button and open contact modal
if (joinButton) {
    joinButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
        // Small delay to ensure smooth transition
        setTimeout(() => {
            openContactModal();
        }, 100);
    });
}

// Handle all "Join Now" buttons on the page
document.addEventListener('DOMContentLoaded', () => {
    const allJoinButtons = document.querySelectorAll('.btn-secondary, .btn-join');
    allJoinButtons.forEach(button => {
        // Only add listener if button text contains "Join Now"
        if (button.textContent.trim() === 'Join Now') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openContactModal();
            });
        }
    });
});

// ==================== 
// Swipe to Close Navigation
// ==================== 

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;
let isClosing = false;

navLinks.addEventListener('touchstart', (e) => {
    if (isClosing) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
}, { passive: true });

navLinks.addEventListener('touchmove', (e) => {
    if (!isSwiping || isClosing) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // If swiping more horizontally than vertically and to the right
    if (Math.abs(deltaX) > deltaY && deltaX > 50) {
        // Prevent scrolling while swiping
        e.preventDefault();
        
        // Visual feedback: move the menu with the swipe
        const distance = Math.max(0, deltaX);
        navLinks.style.transform = `translateX(${distance}px)`;
        navLinks.style.transition = 'none';
        navLinks.style.opacity = Math.max(0.3, 1 - (distance / 300));
    }
}, { passive: false });

navLinks.addEventListener('touchend', (e) => {
    if (!isSwiping || isClosing) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // If swipe right more than 100px and more horizontal than vertical
    if (deltaX > 100 && Math.abs(deltaX) > deltaY) {
        // Start closing with animation
        isClosing = true;
        
        // Add the closing animation - slide further right
        navLinks.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease';
        navLinks.style.transform = 'translateX(100%)';
        navLinks.style.opacity = '0';
        
        // Fade out overlay
        navOverlay.style.transition = 'opacity 0.25s ease';
        navOverlay.style.opacity = '0';
        
        // Close the menu after animation completes
        setTimeout(() => {
            // Close without triggering the CSS transition (skip animation)
            closeMobileMenu(true);
            
            // Reset all inline styles
            navLinks.style.transform = '';
            navLinks.style.opacity = '';
            navOverlay.style.transition = '';
            navOverlay.style.opacity = '';
            
            isClosing = false;
        }, 250);
    } else {
        // Reset transform if swipe wasn't enough - bounce back
        navLinks.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        navLinks.style.transform = '';
        navLinks.style.opacity = '';
        
        setTimeout(() => {
            navLinks.style.transition = '';
        }, 300);
    }
    
    isSwiping = false;
}, { passive: true });

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
let galleryInitialized = false;
let galleryKeyboardHandler = null;
let touchStartHandler = null;
let touchEndHandler = null;

function initializeGalleryPagination() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const paginationContainer = document.getElementById('galleryPagination');
    
    if (!galleryGrid || !galleryItems.length) return;
    
    totalGalleryItems = galleryItems.length;
    const totalPages = Math.ceil(totalGalleryItems / itemsPerPage);
    
    // Reset to first page when reinitializing
    currentGalleryPage = 0;
    
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
    
    // Remove old event listeners by cloning buttons (only if already initialized)
    if (galleryInitialized) {
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        // Update references
        const updatedPrevBtn = document.getElementById('galleryPrev');
        const updatedNextBtn = document.getElementById('galleryNext');
        
        // Navigation buttons
        updatedPrevBtn.addEventListener('click', () => {
            if (currentGalleryPage > 0) {
                goToGalleryPage(currentGalleryPage - 1);
            }
        });
        
        updatedNextBtn.addEventListener('click', () => {
            if (currentGalleryPage < totalPages - 1) {
                goToGalleryPage(currentGalleryPage + 1);
            }
        });
    } else {
        // First time initialization
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
        
        galleryInitialized = true;
    }
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Remove old touch handlers if reinitializing
    if (touchStartHandler && touchEndHandler) {
        galleryGrid.removeEventListener('touchstart', touchStartHandler);
        galleryGrid.removeEventListener('touchend', touchEndHandler);
    }
    
    touchStartHandler = (e) => {
        touchStartX = e.changedTouches[0].screenX;
    };
    
    touchEndHandler = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe();
    };
    
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
    
    galleryGrid.addEventListener('touchstart', touchStartHandler, { passive: true });
    galleryGrid.addEventListener('touchend', touchEndHandler, { passive: true });
    
    // Keyboard navigation - remove old handler if exists
    if (galleryKeyboardHandler) {
        document.removeEventListener('keydown', galleryKeyboardHandler);
    }
    
    galleryKeyboardHandler = (e) => {
        if (e.key === 'ArrowLeft' && currentGalleryPage > 0) {
            goToGalleryPage(currentGalleryPage - 1);
        } else if (e.key === 'ArrowRight' && currentGalleryPage < totalPages - 1) {
            goToGalleryPage(currentGalleryPage + 1);
        }
    };
    
    document.addEventListener('keydown', galleryKeyboardHandler);
}

function showGalleryPage(pageIndex, direction = 'next') {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const totalPages = Math.ceil(totalGalleryItems / itemsPerPage);
    
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // First, fade out and slide out current items
    galleryItems.forEach((item, index) => {
        if (item.classList.contains('visible')) {
            item.classList.add('gallery-exit');
            item.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
        }
    });
    
    // After exit animation, show new items with entrance animation
    setTimeout(() => {
        galleryItems.forEach((item, index) => {
            // Remove all animation classes first
            item.classList.remove('gallery-exit', 'slide-out-left', 'slide-out-right', 'gallery-enter', 'slide-in-left', 'slide-in-right');
            
            if (index >= startIndex && index < endIndex) {
                item.classList.remove('hidden');
                item.classList.add('gallery-enter');
                item.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
                
                // Stagger the entrance animation for each item
                const delay = (index - startIndex) * 80;
                item.style.animationDelay = `${delay}ms`;
                
                setTimeout(() => {
                    item.classList.add('visible');
                    item.classList.remove('gallery-enter', 'slide-in-left', 'slide-in-right');
                    item.style.animationDelay = '';
                }, 400 + delay);
            } else {
                item.classList.remove('visible');
                item.classList.add('hidden');
            }
        });
    }, 300);
    
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
    const direction = pageIndex > currentGalleryPage ? 'next' : 'prev';
    showGalleryPage(pageIndex, direction);
    
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

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get the submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            course: document.getElementById('course').value || null,
            message: document.getElementById('message').value || null
        };
        
        // Check if Supabase is available
        if (typeof supabaseClient === 'undefined') {
            throw new Error('Database connection not available. Please try again later.');
        }
        
        // Insert data into Supabase
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert([formData]);
        
        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Failed to send message. Please try again.');
        }
        
        // Show success message
        showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
        // Re-enable button and restore original text
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// ==================== 
// Modal Contact Form Handler
// ==================== 

const modalContactForm = document.getElementById('modalContactForm');

if (modalContactForm) {
    modalContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get the submit button
        const submitButton = modalContactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Get form data
            const formData = {
                name: document.getElementById('modal-name').value,
                phone: document.getElementById('modal-phone').value,
                email: document.getElementById('modal-email').value,
                course: document.getElementById('modal-course').value || null,
                message: document.getElementById('modal-message').value || null
            };
            
            // Check if Supabase is available
            if (typeof supabaseClient === 'undefined') {
                throw new Error('Database connection not available. Please try again later.');
            }
            
            // Insert data into Supabase
            const { data, error } = await supabaseClient
                .from('contact_messages')
                .insert([formData]);
            
            if (error) {
                console.error('Supabase error:', error);
                throw new Error('Failed to send message. Please try again.');
            }
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
            
            // Reset form
            modalContactForm.reset();
            
            // Close modal after short delay
            setTimeout(() => {
                closeContactModal();
            }, 1500);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification(error.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            // Re-enable button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

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
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
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
// Class Details Section
// ==================== 

// Image Carousel functionality
function initClassCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoSlideInterval;

    if (!slides.length) return;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        // Add prev class to previous slide for smooth transition
        const prevIndex = (index - 1 + slides.length) % slides.length;
        slides[prevIndex].classList.add('prev');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide(); // Restart auto-slide after manual navigation
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.querySelector('.class-carousel');

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    nextSlide();
                } else {
                    // Swiped right - previous slide
                    prevSlide();
                }
                stopAutoSlide();
                startAutoSlide();
            }
        }

        // Pause auto-slide on hover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // Initialize carousel
    showSlide(currentSlide);
    startAutoSlide();
}

async function loadClassDetails() {
    const container = document.getElementById('classScheduleList');
    
    // Check if Supabase is loaded
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase client not loaded');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load class details. Please refresh the page.</p>
            </div>
        `;
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('class_details')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        displayClassDetails(data || []);
    } catch (error) {
        console.error('Error loading class details:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load class details. Please try again later.</p>
                <small style="display: block; margin-top: 10px; color: #999;">${error.message}</small>
            </div>
        `;
    }
}

function displayClassDetails(classes) {
    const container = document.getElementById('classScheduleList');
    const contactContainer = document.getElementById('contactClassSchedule');
    
    if (classes.length === 0) {
        const noClassesHTML = `
            <div class="no-classes">
                <i class="fas fa-info-circle"></i>
                <p>No class schedules available at the moment.</p>
            </div>
        `;
        container.innerHTML = noClassesHTML;
        if (contactContainer) {
            contactContainer.innerHTML = `<p>No class schedules available at the moment.</p>`;
        }
        return;
    }
    
    // Group classes by day
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const groupedClasses = {};
    
    classes.forEach(classItem => {
        if (!groupedClasses[classItem.day]) {
            groupedClasses[classItem.day] = [];
        }
        groupedClasses[classItem.day].push(classItem);
    });
    
    // Full schedule HTML for Class Details section
    const fullScheduleHTML = daysOrder
        .filter(day => groupedClasses[day])
        .map(day => {
            const dayClasses = groupedClasses[day];
            return `
                <div class="day-schedule">
                    <div class="day-header">
                        <i class="fas fa-calendar-day"></i>
                        <h4>${day}</h4>
                    </div>
                    <div class="day-classes">
                        ${dayClasses.map(classItem => `
                            <div class="class-item">
                                <div class="class-info">
                                    <h5><i class="fas fa-book-reader"></i> ${classItem.subject}</h5>
                                    <p class="class-branch"><i class="fas fa-map-marker-alt"></i> ${classItem.branch}</p>
                                </div>
                                <div class="class-time">
                                    <i class="fas fa-clock"></i>
                                    <span>${classItem.timings}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    
    container.innerHTML = fullScheduleHTML;
    
    // Simplified schedule HTML for Contact section
    if (contactContainer) {
        const contactScheduleHTML = daysOrder
            .filter(day => groupedClasses[day])
            .map(day => {
                const dayClasses = groupedClasses[day];
                const timings = dayClasses.map(c => c.timings).join(', ');
                return `<p><strong>${day}:</strong> ${timings}</p>`;
            }).join('');
        
        contactContainer.innerHTML = contactScheduleHTML;
    }
}

// Load class details when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadClassDetails();
    initClassCarousel(); // Initialize image carousel
});

// ==================== 
// Courses Dynamic Loading
// ==================== 

async function loadCourses() {
    try {
        // Check if Supabase is loaded
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase client not loaded');
            return;
        }

        // Fetch courses from Supabase
        const { data: courses, error } = await supabaseClient
            .from('courses')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error loading courses:', error);
            return;
        }

        if (courses && courses.length > 0) {
            renderCourses(courses);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function renderCourses(courses) {
    const coursesGrid = document.querySelector('.courses-grid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = courses.map(course => {
        // Parse features from JSONB
        const features = Array.isArray(course.features) ? course.features : [];
        
        // Determine badge HTML
        let badgeHtml = '';
        if (course.badge) {
            const badgeClass = course.badge_type || 'popular';
            badgeHtml = `<span class="course-badge ${badgeClass}">${course.badge}</span>`;
        }

        // Determine if featured
        const cardClass = course.is_featured ? 'course-card featured-card fade-in' : 'course-card fade-in';
        
        // Featured badge for special offers
        let featuredBadgeHtml = '';
        if (course.is_featured && course.featured_text) {
            featuredBadgeHtml = `
                <div class="featured-badge">
                    <i class="fas fa-crown"></i> ${course.featured_text}
                </div>
            `;
        }

        // Button class
        const btnClass = course.is_featured ? 'course-btn featured-btn' : 'course-btn';
        const buttonText = course.button_text || 'Enroll Now';

        return `
            <div class="${cardClass}">
                ${featuredBadgeHtml}
                <div class="course-icon">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-header">
                    <h3>${course.title}</h3>
                    ${badgeHtml}
                </div>
                <p class="course-description">
                    ${course.description}
                </p>
                <ul class="course-features">
                    ${features.map(feature => `
                        <li><i class="fas fa-check"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <button class="${btnClass} enroll-btn" data-course="${course.title}">${buttonText}</button>
            </div>
        `;
    }).join('');

    // Re-trigger fade-in animations
    const cards = coursesGrid.querySelectorAll('.fade-in');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Update footer courses
    renderFooterCourses(courses);
    
    // Update contact form course dropdown
    renderCourseDropdown(courses);
    
    // Add event listeners to enroll buttons
    addEnrollButtonListeners();
}

function renderFooterCourses(courses) {
    const footerCoursesList = document.querySelector('.footer-courses-list');
    if (!footerCoursesList) return;

    footerCoursesList.innerHTML = courses.map(course => `
        <li><a href="#courses">${course.title}</a></li>
    `).join('');
}

function renderCourseDropdown(courses) {
    const courseDropdowns = document.querySelectorAll('.course-select-dropdown');
    if (!courseDropdowns.length) return;

    courseDropdowns.forEach(courseDropdown => {
        // Get the default "Select a course" option
        const defaultOption = courseDropdown.querySelector('option[value=""]');
        
        // Clear all options
        courseDropdown.innerHTML = '';
        
        // Add back the default option
        if (defaultOption) {
            courseDropdown.appendChild(defaultOption);
        } else {
            const newDefaultOption = document.createElement('option');
            newDefaultOption.value = '';
            newDefaultOption.textContent = 'Select a course';
            courseDropdown.appendChild(newDefaultOption);
        }
        
        // Add course options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.title.toLowerCase().replace(/\s+/g, '-');
            option.textContent = course.title;
            courseDropdown.appendChild(option);
        });
    });
}

// ==================== 
// Contact Form Modal Functionality
// ==================== 

function addEnrollButtonListeners() {
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    enrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const courseName = button.getAttribute('data-course');
            openContactModal(courseName);
        });
    });
}

// ==================== 
// YouTube Videos Dynamic Loading
// ==================== 

async function loadVideos() {
    try {
        // Check if Supabase is loaded
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase client not loaded');
            return;
        }

        // Fetch videos from Supabase
        const { data: videos, error } = await supabaseClient
            .from('youtube_videos')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error loading videos:', error);
            return;
        }

        if (videos && videos.length > 0) {
            renderVideos(videos);
        } else {
            // Show "no videos" message
            const videosGrid = document.getElementById('videosGrid');
            if (videosGrid) {
                videosGrid.innerHTML = `
                    <div class="no-items-message">
                        <i class="fas fa-video"></i>
                        <p>No videos available at the moment</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function renderVideos(videos) {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;

    videosGrid.innerHTML = videos.map(video => {
        // Extract YouTube ID from URL if not provided
        let youtubeId = video.youtube_id;
        if (!youtubeId && video.youtube_url) {
            const match = video.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/);
            if (match) {
                youtubeId = match[1];
            }
        }

        // Generate thumbnail URL
        const thumbnailUrl = video.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

        return `
            <div class="video-card fade-in">
                <div class="video-thumbnail" data-video-id="${youtubeId}">
                    <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    ${video.description ? `<p>${video.description}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Re-trigger fade-in animations
    const cards = videosGrid.querySelectorAll('.fade-in');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add click event to play video
    addVideoClickListeners();
}

function addVideoClickListeners() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoId = thumbnail.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });
}

function openVideoModal(videoId) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'video-modal active';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-wrapper" id="videoModalWrapper">
                <button class="video-modal-close" id="closeVideoModal">
                    <i class="fas fa-times"></i>
                </button>
                <button class="video-fullscreen-btn" id="videoFullscreenBtn" title="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
                <iframe 
                    id="videoIframe"
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                    webkitallowfullscreen
                    mozallowfullscreen>
                </iframe>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Get elements
    const closeBtn = modal.querySelector('#closeVideoModal');
    const fullscreenBtn = modal.querySelector('#videoFullscreenBtn');
    const videoWrapper = modal.querySelector('#videoModalWrapper');
    const videoIframe = modal.querySelector('#videoIframe');

    // Close modal events
    closeBtn.addEventListener('click', () => closeVideoModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal(modal);
        }
    });

    // Fullscreen button click
    fullscreenBtn.addEventListener('click', () => {
        toggleFullscreen(videoWrapper, fullscreenBtn);
    });

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
                closeVideoModal(modal);
                document.removeEventListener('keydown', escHandler);
            }
        }
    };
    document.addEventListener('keydown', escHandler);

    // Handle fullscreen change events
    const fullscreenChangeHandler = () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        const icon = fullscreenBtn.querySelector('i');
        if (isFullscreen) {
            icon.className = 'fas fa-compress';
            fullscreenBtn.title = 'Exit Fullscreen';
        } else {
            icon.className = 'fas fa-expand';
            fullscreenBtn.title = 'Fullscreen';
        }
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);

    // Store cleanup function
    modal.fullscreenCleanup = () => {
        document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
        document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
    };
}

// Toggle fullscreen for video
function toggleFullscreen(element, button) {
    if (!element) return;

    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;

    if (!isFullscreen) {
        // Enter fullscreen
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function closeVideoModal(modal) {
    // Clean up fullscreen event listeners
    if (modal.fullscreenCleanup) {
        modal.fullscreenCleanup();
    }
    
    // Exit fullscreen if active
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    if (isFullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function openContactModal(selectedCourse = '') {
    const modal = document.getElementById('contactModal');
    const modalCourseDropdown = document.getElementById('modal-course');
    
    if (!modal) return;
    
    // Set the selected course if provided
    if (selectedCourse && modalCourseDropdown) {
        const courseValue = selectedCourse.toLowerCase().replace(/\s+/g, '-');
        const option = modalCourseDropdown.querySelector(`option[value="${courseValue}"]`);
        if (option) {
            modalCourseDropdown.value = courseValue;
        }
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.getElementById('modalClose');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }
    
    // Click outside modal to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeContactModal();
        }
    });
});

// Load courses when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadVideos();
});

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
