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

// ==================== 
// State Management
// ==================== 

let currentDeleteItem = null;
let currentDeleteType = null;
let galleryItems = [];
let eventItems = [];
let classItems = [];
let currentUser = null;

// ==================== 
// Authentication with Supabase Auth
// ==================== 

async function checkAuth() {
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && session.user) {
        currentUser = session.user;
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'flex';
        loadGalleryItems();
        loadEventItems();
        loadClassItems();
        loadContactMessages();
    } else {
        currentUser = null;
        loginSection.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        errorMessage.classList.remove('show');
        await checkAuth();
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message || 'Login failed. Please check your credentials.';
        errorMessage.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentUser = null;
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
            
            // Fetch the JSON file to get photo URL
            let photoUrl = '';
            try {
                const { data: fileData, error: fileError } = await supabase.storage
                    .from(EVENTS_BUCKET)
                    .download(item.name);
                
                if (!fileError && fileData) {
                    const text = await fileData.text();
                    const jsonData = JSON.parse(text);
                    photoUrl = jsonData.photoUrl || '';
                }
            } catch (err) {
                console.error('Error loading event data:', err);
            }
            
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                ${photoUrl ? `<div class="item-image" style="background-image: url('${photoUrl}');"></div>` : ''}
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
    document.getElementById('eventPhotoPreview').style.display = 'none';
    document.getElementById('eventPhotoPreviewImg').src = '';
    currentEventPhotoUrl = ''; // Reset current photo URL
    photoRemoved = false; // Reset removal flag
    openModal('eventModal');
});

// ==================== 
// Event Photo Preview
// ==================== 

const eventPhotoInput = document.getElementById('eventPhoto');
const eventPhotoPreview = document.getElementById('eventPhotoPreview');
const eventPhotoPreviewImg = document.getElementById('eventPhotoPreviewImg');
const removeEventPhotoBtn = document.getElementById('removeEventPhoto');

let currentEventPhotoUrl = ''; // Track current photo URL when editing
let photoRemoved = false; // Track if photo was explicitly removed

eventPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            eventPhotoPreviewImg.src = e.target.result;
            eventPhotoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
        photoRemoved = false; // Reset removal flag when new photo selected
    }
});

removeEventPhotoBtn.addEventListener('click', () => {
    eventPhotoInput.value = '';
    eventPhotoPreview.style.display = 'none';
    eventPhotoPreviewImg.src = '';
    photoRemoved = true; // Mark that photo was explicitly removed
    currentEventPhotoUrl = ''; // Clear the current photo URL
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
    const photoFile = document.getElementById('eventPhoto').files[0];
    
    try {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        let photoUrl = '';
        
        // Determine photo URL logic:
        // 1. If new photo uploaded, use new photo
        // 2. If photo was explicitly removed, use empty string
        // 3. If editing and no new photo and not removed, keep existing photo
        if (photoFile) {
            // Upload new photo
            const photoFileName = `${day}_${month}_${Date.now()}_${photoFile.name}`;
            const { data: photoData, error: photoError } = await supabase.storage
                .from(EVENTS_BUCKET)
                .upload(`photos/${photoFileName}`, photoFile, {
                    contentType: photoFile.type,
                    cacheControl: '3600',
                    upsert: true
                });
            
            if (photoError) throw photoError;
            
            // Get public URL for the photo
            const { data: { publicUrl } } = supabase.storage
                .from(EVENTS_BUCKET)
                .getPublicUrl(`photos/${photoFileName}`);
            
            photoUrl = publicUrl;
        } else if (photoRemoved) {
            // Photo was explicitly removed
            photoUrl = '';
        } else {
            // Keep existing photo URL if editing
            photoUrl = currentEventPhotoUrl;
        }
        
        if (eventId) {
            // Delete old event file
            await supabase.storage.from(EVENTS_BUCKET).remove([eventId]);
            // Note: old photos are not deleted to avoid breaking references
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
            photoUrl: photoUrl || '',
            created_at: new Date().toISOString()
        };
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from(EVENTS_BUCKET)
            .upload(fileName, JSON.stringify(eventData), {
                contentType: 'application/json',
                cacheControl: 'no-cache',
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
async function editEventItem(fileName) {
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
    
    // Reset photo state
    document.getElementById('eventPhotoPreview').style.display = 'none';
    document.getElementById('eventPhoto').value = '';
    currentEventPhotoUrl = ''; // Reset current photo URL
    photoRemoved = false; // Reset removal flag
    
    try {
        const { data: fileData, error: fileError } = await supabase.storage
            .from(EVENTS_BUCKET)
            .download(fileName);
        
        if (!fileError && fileData) {
            const text = await fileData.text();
            const jsonData = JSON.parse(text);
            
            if (jsonData.photoUrl) {
                currentEventPhotoUrl = jsonData.photoUrl; // Store current photo URL
                document.getElementById('eventPhotoPreviewImg').src = jsonData.photoUrl;
                document.getElementById('eventPhotoPreview').style.display = 'block';
            }
        }
    } catch (err) {
        console.error('Error loading event photo:', err);
    }
    
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
// Class Details Management
// ==================== 

async function loadClassItems() {
    try {
        const { data, error } = await supabase
            .from('class_details')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        classItems = data || [];
        displayClassItems();
    } catch (error) {
        console.error('Error loading class items:', error);
        document.getElementById('classDetailsItemsGrid').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading class details: ${error.message}</p>
            </div>
        `;
    }
}

function displayClassItems() {
    const grid = document.getElementById('classDetailsItemsGrid');
    
    if (classItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chalkboard-teacher"></i>
                <p>No class details added yet</p>
                <button class="btn-add" onclick="document.getElementById('addClassBtn').click()">
                    <i class="fas fa-plus"></i> Add Your First Class
                </button>
            </div>
        `;
        return;
    }
    
    // Get day color based on day of week
    const getDayColor = (day) => {
        const colors = {
            'Sunday': '#FF6B6B',
            'Monday': '#4ECDC4',
            'Tuesday': '#45B7D1',
            'Wednesday': '#FFA07A',
            'Thursday': '#98D8C8',
            'Friday': '#F7DC6F',
            'Saturday': '#BB8FCE'
        };
        return colors[day] || '#1B4B8F';
    };
    
    grid.innerHTML = classItems.map(item => `
        <div class="class-card">
            <div class="class-card-header" style="background: linear-gradient(135deg, ${getDayColor(item.day)}, ${getDayColor(item.day)}dd);">
                <div class="class-day-badge">
                    <i class="fas fa-calendar-day"></i>
                    <span>${item.day}</span>
                </div>
                <div class="class-card-actions">
                    <button class="btn-icon-modern btn-edit" onclick="editClass('${item.id}')" title="Edit Class">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-modern btn-delete" onclick="deleteClass('${item.id}')" title="Delete Class">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="class-card-body">
                <div class="class-subject">
                    <i class="fas fa-book-reader"></i>
                    <h3>${item.subject}</h3>
                </div>
                <div class="class-details-grid">
                    <div class="class-detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Branch</span>
                            <span class="detail-value">${item.branch}</span>
                        </div>
                    </div>
                    <div class="class-detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="detail-content">
                            <span class="detail-label">Timings</span>
                            <span class="detail-value">${item.timings}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Class Button
document.getElementById('addClassBtn').addEventListener('click', () => {
    document.getElementById('classModalTitle').textContent = 'Add Class Details';
    document.getElementById('classForm').reset();
    document.getElementById('classId').value = '';
    openModal('classModal');
});

// Class Form Submission
document.getElementById('classForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const classId = document.getElementById('classId').value;
    const classData = {
        subject: document.getElementById('classSubject').value.trim(),
        branch: document.getElementById('classBranch').value.trim(),
        day: document.getElementById('classDay').value,
        timings: document.getElementById('classTimings').value.trim()
    };
    
    try {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        let error;
        
        if (classId) {
            // Update existing class
            const result = await supabase
                .from('class_details')
                .update(classData)
                .eq('id', classId);
            error = result.error;
        } else {
            // Insert new class
            const result = await supabase
                .from('class_details')
                .insert([classData]);
            error = result.error;
        }
        
        if (error) throw error;
        
        showToast(classId ? 'Class updated successfully!' : 'Class added successfully!');
        closeModal('classModal');
        loadClassItems();
    } catch (error) {
        console.error('Error saving class:', error);
        showToast('Error saving class: ' + error.message, true);
    } finally {
        const submitBtn = e.target.querySelector('.btn-save');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Class';
    }
});

// Edit Class
async function editClass(id) {
    const classItem = classItems.find(item => item.id === id);
    if (!classItem) return;
    
    document.getElementById('classModalTitle').textContent = 'Edit Class Details';
    document.getElementById('classId').value = classItem.id;
    document.getElementById('classSubject').value = classItem.subject;
    document.getElementById('classBranch').value = classItem.branch;
    document.getElementById('classDay').value = classItem.day;
    document.getElementById('classTimings').value = classItem.timings;
    
    openModal('classModal');
}

// Delete Class
async function deleteClass(id) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this class? This action cannot be undone.');
        if (!confirmDelete) return;
        
        const { error } = await supabase
            .from('class_details')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Class deleted successfully!');
        loadClassItems();
    } catch (error) {
        console.error('Error deleting class:', error);
        showToast('Error deleting class: ' + error.message, true);
    }
}

// Make functions globally available
window.editClass = editClass;
window.deleteClass = deleteClass;

// ==================== 
// Contact Messages Management
// ==================== 

let currentMessageFilter = 'all';
let allMessages = [];

async function loadContactMessages() {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
    
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allMessages = data || [];
        updateUnreadBadge();
        displayMessages(currentMessageFilter);
        
    } catch (error) {
        console.error('Error loading messages:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading messages: ${error.message}</p>
                <button onclick="loadContactMessages()" class="btn-retry">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

function displayMessages(filter) {
    const container = document.getElementById('messagesContainer');
    currentMessageFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    // Filter messages
    let filteredMessages = allMessages;
    if (filter === 'read') {
        filteredMessages = allMessages.filter(msg => msg.read === true);
    } else if (filter === 'unread') {
        filteredMessages = allMessages.filter(msg => msg.read === false);
    }
    
    if (filteredMessages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No ${filter === 'all' ? '' : filter} messages found</p>
            </div>
        `;
        return;
    }
    
    // Display messages
    let html = '<div class="messages-grid">';
    filteredMessages.forEach(msg => {
        const date = new Date(msg.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="message-card ${msg.read ? 'read' : 'unread'}">
                <div class="message-header">
                    <div class="message-sender">
                        <i class="fas fa-user-circle"></i>
                        <strong>${escapeHtml(msg.name)}</strong>
                    </div>
                    <span class="message-date">
                        <i class="far fa-clock"></i> ${formattedDate}
                    </span>
                </div>
                
                <div class="message-contact">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <a href="tel:${msg.phone}">${escapeHtml(msg.phone)}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${msg.email}">${escapeHtml(msg.email)}</a>
                    </div>
                    ${msg.course ? `
                        <div class="contact-item">
                            <i class="fas fa-book"></i>
                            <span>${escapeHtml(msg.course)}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${msg.message ? `
                    <div class="message-content">
                        <strong>Message:</strong>
                        <p>${escapeHtml(msg.message)}</p>
                    </div>
                ` : ''}
                
                <div class="message-actions">
                    <button 
                        onclick="toggleReadStatus('${msg.id}', ${msg.read})" 
                        class="btn-action ${msg.read ? 'btn-mark-unread' : 'btn-mark-read'}"
                        title="${msg.read ? 'Mark as Unread' : 'Mark as Read'}">
                        <i class="fas ${msg.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                        ${msg.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button 
                        onclick="deleteMessage('${msg.id}')" 
                        class="btn-action btn-delete"
                        title="Delete Message">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

async function toggleReadStatus(messageId, currentStatus) {
    try {
        const { error } = await supabase
            .from('contact_messages')
            .update({ read: !currentStatus })
            .eq('id', messageId);
        
        if (error) throw error;
        
        // Update local data
        const message = allMessages.find(m => m.id === messageId);
        if (message) {
            message.read = !currentStatus;
        }
        
        updateUnreadBadge();
        displayMessages(currentMessageFilter);
        showToast(currentStatus ? 'Message marked as unread' : 'Message marked as read');
        
    } catch (error) {
        console.error('Error updating message:', error);
        showToast('Error updating message status', true);
    }
}

async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', messageId);
        
        if (error) throw error;
        
        // Remove from local data
        allMessages = allMessages.filter(m => m.id !== messageId);
        
        updateUnreadBadge();
        displayMessages(currentMessageFilter);
        showToast('Message deleted successfully');
        
    } catch (error) {
        console.error('Error deleting message:', error);
        showToast('Error deleting message', true);
    }
}

function updateUnreadBadge() {
    const unreadCount = allMessages.filter(m => !m.read).length;
    const badge = document.getElementById('unreadBadge');
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event listeners for message filters
document.addEventListener('DOMContentLoaded', () => {
    const filterAll = document.getElementById('filterAll');
    const filterUnread = document.getElementById('filterUnread');
    const filterRead = document.getElementById('filterRead');
    const refreshBtn = document.getElementById('refreshMessagesBtn');
    
    if (filterAll) {
        filterAll.addEventListener('click', () => displayMessages('all'));
    }
    if (filterUnread) {
        filterUnread.addEventListener('click', () => displayMessages('unread'));
    }
    if (filterRead) {
        filterRead.addEventListener('click', () => displayMessages('read'));
    }
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => loadContactMessages());
    }
});

// Make functions globally available
window.toggleReadStatus = toggleReadStatus;
window.deleteMessage = deleteMessage;
window.loadContactMessages = loadContactMessages;

// ==================== 
// Initialize
// ==================== 

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
