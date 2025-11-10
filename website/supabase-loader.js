// ==================== 
// Supabase Configuration for Main Site
// ==================== 

const SUPABASE_URL = 'https://dcbqaerzqfpntghptrfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYnFhZXJ6cWZwbnRnaHB0cmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTAxODQsImV4cCI6MjA3NzkyNjE4NH0.2j_2dXmFQM_ZZsKLeXu6x3-ewvpEjY9PwQ2BsrH0KPo';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket names
const GALLERY_BUCKET = 'gallery-photos';
const EVENTS_BUCKET = 'event-images';

// ==================== 
// Load Gallery from Supabase
// ==================== 

async function loadGalleryFromSupabase() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    try {
        // Always clear hardcoded gallery items first
        galleryGrid.innerHTML = '';

        // List files from gallery bucket
        const { data, error } = await supabaseClient.storage
            .from(GALLERY_BUCKET)
            .list('', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Error loading gallery:', error);
            galleryGrid.innerHTML = '<div class="no-items-message"><i class="fas fa-images"></i><p>Unable to load gallery. Please try again later.</p></div>';
            return;
        }

        if (!data || data.length === 0) {
            galleryGrid.innerHTML = '<div class="no-items-message"><i class="fas fa-images"></i><p>No gallery photos uploaded yet. Photos will appear here once added through the admin panel.</p></div>';
            return;
        }

        // Filter out placeholder files
        const galleryItems = data.filter(item => !item.name.includes('.emptyFolderPlaceholder'));
        
        if (galleryItems.length === 0) {
            galleryGrid.innerHTML = '<div class="no-items-message"><i class="fas fa-images"></i><p>No gallery photos uploaded yet. Photos will appear here once added through the admin panel.</p></div>';
            return;
        }

        // Render gallery items from Supabase
        for (const item of galleryItems) {
            const { data: urlData } = supabaseClient.storage
                .from(GALLERY_BUCKET)
                .getPublicUrl(item.name);

            // Add cache busting parameter
            const cacheBuster = item.updated_at ? new Date(item.updated_at).getTime() : Date.now();
            const imageUrl = `${urlData.publicUrl}?t=${cacheBuster}`;

            // Parse metadata from filename (format: title___description___timestamp.ext or title___description.ext)
            const fileNameParts = item.name.split('___');
            const title = fileNameParts[0] ? decodeURIComponent(fileNameParts[0]) : 'Gallery Image';
            // Handle both new format (with timestamp) and old format (without)
            const descPart = fileNameParts[1] || '';
            const description = descPart.split('.')[0].replace(/___\d+$/, ''); // Remove timestamp if present
            const cleanDescription = description ? decodeURIComponent(description) : '';

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item fade-in';
            galleryItem.innerHTML = `
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${title}</h3>
                    <p>${cleanDescription}</p>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        }

        // Re-observe fade-in elements
        const fadeElements = document.querySelectorAll('.gallery-item.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });

        // Reinitialize lightbox for dynamically loaded images
        initializeGalleryLightbox();
        
        // Reinitialize gallery pagination
        initializeGalleryPagination();

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// ==================== 
// Load Events from Supabase
// ==================== 

async function loadEventsFromSupabase() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    try {
        // List files from events bucket
        const { data, error } = await supabaseClient.storage
            .from(EVENTS_BUCKET)
            .list('', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Error loading events:', error);
            return;
        }

        if (!data || data.length === 0) {
            return; // Keep placeholder events
        }

        // Filter out placeholder files
        const eventItems = data.filter(item => !item.name.includes('.emptyFolderPlaceholder'));
        
        if (eventItems.length === 0) {
            return; // Keep placeholder events
        }

        // Clear existing events
        eventsGrid.innerHTML = '';

        // Render events from Supabase
        for (const item of eventItems) {
            // Fetch the JSON file to get all event data
            let eventData;
            try {
                const { data: fileData, error: fileError } = await supabaseClient.storage
                    .from(EVENTS_BUCKET)
                    .download(item.name);
                
                if (fileError) {
                    console.warn('Skipping event file:', item.name, fileError);
                    continue;
                }
                
                if (fileData) {
                    const text = await fileData.text();
                    eventData = JSON.parse(text);
                } else {
                    continue;
                }
            } catch (err) {
                console.error('Error loading event data:', err);
                continue;
            }

            // Extract data from JSON
            const day = eventData.day || '01';
            const month = eventData.month || 'JAN';
            const category = eventData.category || 'Event';
            const title = eventData.title || 'Untitled Event';
            const description = eventData.description || 'Join us for this exciting event.';
            const time = eventData.time || 'TBA';
            const location = eventData.location || 'TBA';
            const photoUrl = eventData.photoUrl || '';

            const eventCard = document.createElement('div');
            eventCard.className = 'event-card fade-in';
            eventCard.innerHTML = `
                ${photoUrl ? `
                    <div class="event-image">
                        <img src="${photoUrl}" alt="${title}">
                    </div>
                ` : ''}
                <div class="event-card-body">
                    <div class="event-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="event-content">
                        <span class="event-category">${category}</span>
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <div class="event-meta">
                            <span><i class="fas fa-clock"></i> ${time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                        </div>
                    </div>
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        }

        // Re-observe fade-in elements
        const fadeElements = document.querySelectorAll('.event-card.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });

    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// ==================== 
// Initialize on page load
// ==================== 

document.addEventListener('DOMContentLoaded', () => {
    // Check if Supabase is available
    if (typeof window.supabase !== 'undefined') {
        loadGalleryFromSupabase();
        loadEventsFromSupabase();
        
        // Auto-refresh gallery every 30 seconds to catch new uploads
        setInterval(() => {
            loadGalleryFromSupabase();
        }, 30000);
    }
});

// Expose reload function globally for manual refresh
window.refreshGallery = function() {
    loadGalleryFromSupabase();
};
