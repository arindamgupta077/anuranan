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

// Close mobile menu when clicking Join Now button
if (joinButton) {
    joinButton.addEventListener('click', closeMobileMenu);
}

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
// YouTube Videos Dynamic Loading with Pagination
// ==================== 

let allVideos = [];
let currentPage = 1;
const videosPerPage = 12;

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
            allVideos = videos;
            renderVideosPage(1);
            renderPagination();
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

function renderVideosPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToShow = allVideos.slice(startIndex, endIndex);
    
    renderVideos(videosToShow);
    
    // Scroll to top of videos section
    const videosSection = document.getElementById('videos');
    if (videosSection) {
        const yOffset = -100; // Offset for navbar
        const y = videosSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

function renderPagination() {
    const totalPages = Math.ceil(allVideos.length / videosPerPage);
    const paginationContainer = document.getElementById('videosPagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="renderVideosPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers
    paginationHTML += '<div class="pagination-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            paginationHTML += `
                <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                        onclick="renderVideosPage(${i})">
                    ${i}
                </button>
            `;
        } else if (
            i === currentPage - 3 || 
            i === currentPage + 3
        ) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    paginationHTML += '</div>';
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn" onclick="renderVideosPage(${currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    
    paginationContainer.innerHTML = paginationHTML;
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
        }, index * 50);
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

// ==================== 
// Load Courses for Footer
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
            renderFooterCourses(courses);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function renderFooterCourses(courses) {
    const footerCoursesList = document.querySelector('.footer-courses-list');
    if (!footerCoursesList) return;

    footerCoursesList.innerHTML = courses.map(course => `
        <li><a href="index.html#courses">${course.title}</a></li>
    `).join('');
}

// ==================== 
// Initialize Videos Page
// ==================== 

document.addEventListener('DOMContentLoaded', function() {
    // Wait for Supabase to load
    const checkSupabase = setInterval(() => {
        if (typeof supabaseClient !== 'undefined') {
            clearInterval(checkSupabase);
            loadVideos();
            loadCourses(); // Load courses for footer
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(checkSupabase);
        if (typeof supabaseClient === 'undefined') {
            const videosGrid = document.getElementById('videosGrid');
            if (videosGrid) {
                videosGrid.innerHTML = `
                    <div class="no-items-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Unable to load videos. Please try again later.</p>
                    </div>
                `;
            }
        }
    }, 5000);
});
