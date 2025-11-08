// ==================== 
// Supabase Configuration
// ==================== 

const SUPABASE_URL = 'https://dcbqaerzqfpntghptrfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYnFhZXJ6cWZwbnRnaHB0cmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTAxODQsImV4cCI6MjA3NzkyNjE4NH0.2j_2dXmFQM_ZZsKLeXu6x3-ewvpEjY9PwQ2BsrH0KPo';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket names
const GALLERY_BUCKET = 'gallery-photos';
const EVENTS_BUCKET = 'event-images';

// Admin password (In production, use proper authentication)
const ADMIN_PASSWORD = 'anuranan2024';

// ==================== 
// State Management
// ==================== 

let currentDeleteItem = null;
let currentDeleteType = null;
let galleryItems = [];
let eventItems = [];

// ==================== 
// Authentication
// ==================== 

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (isLoggedIn) {
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'flex';
        loadGalleryItems();
        loadEventItems();
    } else {
        loginSection.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        errorMessage.classList.remove('show');
        checkAuth();
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        errorMessage.classList.add('show');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.reload();
});

// ==================== 
// Navigation
// ==================== 

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        document.querySelectorAll('.management-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-management`).classList.add('active');
    });
});

// ==================== 
// Modal Management
// ==================== 

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        closeModal(modalId);
    });
});

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ==================== 
// Toast Notification
// ==================== 

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== 
// Gallery Management
// ==================== 

async function loadGalleryItems() {
    const grid = document.getElementById('galleryItemsGrid');
    grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading gallery items...</div>';
    
    try {
        console.log('Attempting to load gallery from bucket:', GALLERY_BUCKET);
        console.log('Supabase client:', supabase);
        
        // List files from gallery bucket
        const { data, error } = await supabase.storage
            .from(GALLERY_BUCKET)
            .list('', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });
        
        console.log('Gallery response - data:', data, 'error:', error);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>No Gallery Photos Yet</h3>
                    <p>Click "Add Photo" to upload your first gallery image</p>
                </div>
            `;
            galleryItems = [];
            return;
        }
        
        // Store items
        galleryItems = data.filter(item => !item.name.includes('.emptyFolderPlaceholder'));
        
        // Render items
        grid.innerHTML = '';
        for (const item of galleryItems) {
            const { data: urlData } = supabase.storage
                .from(GALLERY_BUCKET)
                .getPublicUrl(item.name);
            
            // Parse metadata from filename (format: title___description.ext)
            const fileNameParts = item.name.split('___');
            const title = fileNameParts[0] ? decodeURIComponent(fileNameParts[0]) : 'Untitled';
            const description = fileNameParts[1] ? decodeURIComponent(fileNameParts[1].split('.')[0]) : 'No description';
            
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${urlData.publicUrl}" alt="${title}" class="item-image">
                <div class="item-content">
                    <h3 class="item-title">${title}</h3>
                    <p class="item-description">${description}</p>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editGalleryItem('${item.name}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete-item" onclick="deleteGalleryItem('${item.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading gallery items:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            bucket: GALLERY_BUCKET,
            supabaseUrl: SUPABASE_URL
        });
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error Loading Gallery</h3>
                <p>${error.message}</p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">
                    Bucket: ${GALLERY_BUCKET}<br>
                    Check browser console (F12) for details
                </p>
            </div>
        `;
    }
}

// Add Gallery Item
document.getElementById('addGalleryBtn').addEventListener('click', () => {
    document.getElementById('galleryModalTitle').textContent = 'Add Gallery Photo';
    document.getElementById('galleryForm').reset();
    document.getElementById('galleryId').value = '';
    document.getElementById('galleryImagePreview').innerHTML = '';
    document.getElementById('galleryImagePreview').classList.remove('show');
    openModal('galleryModal');
});

// Image Preview
document.getElementById('galleryImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('galleryImagePreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
});

// Gallery Form Submit
document.getElementById('galleryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;
    const fileInput = document.getElementById('galleryImage');
    const galleryId = document.getElementById('galleryId').value;
    
    if (!fileInput.files[0] && !galleryId) {
        showToast('Please select an image', true);
        return;
    }
    
    try {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        if (galleryId) {
            // Update existing item - delete old and upload new
            await supabase.storage.from(GALLERY_BUCKET).remove([galleryId]);
        }
        
        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${encodeURIComponent(title)}___${encodeURIComponent(description)}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from(GALLERY_BUCKET)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });
            
            if (uploadError) throw uploadError;
        }
        
        showToast(galleryId ? 'Photo updated successfully!' : 'Photo added successfully!');
        closeModal('galleryModal');
        loadGalleryItems();
    } catch (error) {
        console.error('Error saving gallery item:', error);
        showToast('Error saving photo: ' + error.message, true);
    } finally {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Photo';
    }
});

// Edit Gallery Item
async function editGalleryItem(fileName) {
    const fileNameParts = fileName.split('___');
    const title = fileNameParts[0] ? decodeURIComponent(fileNameParts[0]) : '';
    const description = fileNameParts[1] ? decodeURIComponent(fileNameParts[1].split('.')[0]) : '';
    
    document.getElementById('galleryModalTitle').textContent = 'Edit Gallery Photo';
    document.getElementById('galleryTitle').value = title;
    document.getElementById('galleryDescription').value = description;
    document.getElementById('galleryId').value = fileName;
    
    // Show current image
    const { data: urlData } = supabase.storage
        .from(GALLERY_BUCKET)
        .getPublicUrl(fileName);
    
    const preview = document.getElementById('galleryImagePreview');
    preview.innerHTML = `<img src="${urlData.publicUrl}" alt="Current">`;
    preview.classList.add('show');
    
    openModal('galleryModal');
}

// Delete Gallery Item
function deleteGalleryItem(fileName) {
    currentDeleteItem = fileName;
    currentDeleteType = 'gallery';
    openModal('deleteModal');
}

// ==================== 
// Events Management
// ==================== 

async function loadEventItems() {
    const grid = document.getElementById('eventsItemsGrid');
    grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading events...</div>';
    
    try {
        // List files from events bucket
        const { data, error } = await supabase.storage
            .from(EVENTS_BUCKET)
            .list('', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });
        
        if (error) {
            // If bucket doesn't exist or error, show empty state
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No Events Yet</h3>
                    <p>Click "Add Event" to create your first event</p>
                </div>
            `;
            eventItems = [];
            return;
        }
        
        if (!data || data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No Events Yet</h3>
                    <p>Click "Add Event" to create your first event</p>
                </div>
            `;
            eventItems = [];
            return;
        }
        
        // Store items
        eventItems = data.filter(item => !item.name.includes('.emptyFolderPlaceholder'));
        
        // Render items
        grid.innerHTML = '';
        for (const item of eventItems) {
            // Parse metadata from filename
            // Format: day_month_category___title___description___time___location.json
            const parts = item.name.replace('.json', '').split('___');
            const dateParts = parts[0].split('_');
            
            const day = dateParts[0] || '01';
            const month = dateParts[1] || 'JAN';
            const category = dateParts[2] || 'Event';
            const title = parts[1] ? decodeURIComponent(parts[1]) : 'Untitled Event';
            const description = parts[2] ? decodeURIComponent(parts[2]) : 'No description';
            const time = parts[3] ? decodeURIComponent(parts[3]) : 'TBA';
            const location = parts[4] ? decodeURIComponent(parts[4]) : 'TBA';
            
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-content">
                    <div class="event-date-badge">${day} ${month}</div>
                    <div class="event-category-badge">${category}</div>
                    <h3 class="item-title">${title}</h3>
                    <p class="item-description">${description}</p>
                    <div class="event-meta-info">
                        <div class="event-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${time}</span>
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editEventItem('${item.name}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete-item" onclick="deleteEventItem('${item.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading events:', error);
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error Loading Events</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Add Event
document.getElementById('addEventBtn').addEventListener('click', () => {
    document.getElementById('eventModalTitle').textContent = 'Add Event';
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    openModal('eventModal');
});

// Event Form Submit
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const day = document.getElementById('eventDay').value.padStart(2, '0');
    const month = document.getElementById('eventMonth').value;
    const category = document.getElementById('eventCategory').value;
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const eventId = document.getElementById('eventId').value;
    
    try {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        if (eventId) {
            // Delete old event file
            await supabase.storage.from(EVENTS_BUCKET).remove([eventId]);
        }
        
        // Create filename with metadata
        const fileName = `${day}_${month}_${encodeURIComponent(category)}___${encodeURIComponent(title)}___${encodeURIComponent(description)}___${encodeURIComponent(time)}___${encodeURIComponent(location)}.json`;
        
        // Create JSON data
        const eventData = {
            day,
            month,
            category,
            title,
            description,
            time,
            location,
            created_at: new Date().toISOString()
        };
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from(EVENTS_BUCKET)
            .upload(fileName, JSON.stringify(eventData), {
                contentType: 'application/json',
                cacheControl: '3600',
                upsert: true
            });
        
        if (uploadError) throw uploadError;
        
        showToast(eventId ? 'Event updated successfully!' : 'Event added successfully!');
        closeModal('eventModal');
        loadEventItems();
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Error saving event: ' + error.message, true);
    } finally {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Event';
    }
});

// Edit Event Item
function editEventItem(fileName) {
    const parts = fileName.replace('.json', '').split('___');
    const dateParts = parts[0].split('_');
    
    document.getElementById('eventModalTitle').textContent = 'Edit Event';
    document.getElementById('eventDay').value = dateParts[0] || '';
    document.getElementById('eventMonth').value = dateParts[1] || '';
    document.getElementById('eventCategory').value = decodeURIComponent(dateParts[2] || '');
    document.getElementById('eventTitle').value = parts[1] ? decodeURIComponent(parts[1]) : '';
    document.getElementById('eventDescription').value = parts[2] ? decodeURIComponent(parts[2]) : '';
    document.getElementById('eventTime').value = parts[3] ? decodeURIComponent(parts[3]) : '';
    document.getElementById('eventLocation').value = parts[4] ? decodeURIComponent(parts[4]) : '';
    document.getElementById('eventId').value = fileName;
    
    openModal('eventModal');
}

// Delete Event Item
function deleteEventItem(fileName) {
    currentDeleteItem = fileName;
    currentDeleteType = 'event';
    openModal('deleteModal');
}

// ==================== 
// Delete Confirmation
// ==================== 

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (!currentDeleteItem || !currentDeleteType) return;
    
    try {
        const btn = document.getElementById('confirmDeleteBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        
        const bucket = currentDeleteType === 'gallery' ? GALLERY_BUCKET : EVENTS_BUCKET;
        
        const { error } = await supabase.storage
            .from(bucket)
            .remove([currentDeleteItem]);
        
        if (error) throw error;
        
        showToast('Item deleted successfully!');
        closeModal('deleteModal');
        
        if (currentDeleteType === 'gallery') {
            loadGalleryItems();
        } else {
            loadEventItems();
        }
        
        currentDeleteItem = null;
        currentDeleteType = null;
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting item: ' + error.message, true);
    } finally {
        const btn = document.getElementById('confirmDeleteBtn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    }
});

// ==================== 
// Initialize
// ==================== 

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
