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
    const adminNavbar = document.querySelector('.admin-navbar');
    
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && session.user) {
        currentUser = session.user;
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'flex';
        if (adminNavbar) adminNavbar.style.display = 'block';
        loadDashboardData();
        loadGalleryItems();
        loadEventItems();
        loadCourses();
        loadClassItems();
        loadContactMessages();
    } else {
        currentUser = null;
        loginSection.style.display = 'flex';
        adminDashboard.style.display = 'none';
        if (adminNavbar) adminNavbar.style.display = 'none';
    }
}

// ==================== 
// Dashboard Functions
// ==================== 

async function loadDashboardData() {
    await Promise.all([
        loadDashboardStats(),
        loadRecentMessages()
    ]);
}

async function loadDashboardStats() {
    try {
        // Fetch counts - gallery and events from storage, others from tables
        const [galleryData, eventsData, coursesCount, classesCount, messagesCount, unreadCount] = await Promise.all([
            supabase.storage.from(GALLERY_BUCKET).list('', { limit: 1000 }),
            supabase.storage.from(EVENTS_BUCKET).list('', { limit: 1000 }),
            supabase.from('courses').select('*', { count: 'exact', head: true }),
            supabase.from('class_details').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
            supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false)
        ]);

        console.log('Dashboard Stats:', {
            gallery: galleryData,
            events: eventsData,
            courses: coursesCount,
            classes: classesCount,
            messages: messagesCount,
            unread: unreadCount
        });

        // Calculate counts from storage (filter out .emptyFolderPlaceholder)
        const galleryCount = galleryData.data ? galleryData.data.filter(item => item.name !== '.emptyFolderPlaceholder').length : 0;
        const eventsCount = eventsData.data ? eventsData.data.filter(item => item.name !== '.emptyFolderPlaceholder').length : 0;

        // Update stats display
        document.getElementById('totalGallery').textContent = galleryCount;
        document.getElementById('totalEvents').textContent = eventsCount;
        document.getElementById('totalCourses').textContent = coursesCount.count || 0;
        document.getElementById('totalClasses').textContent = classesCount.count || 0;
        document.getElementById('totalMessages').textContent = messagesCount.count || 0;
        document.getElementById('unreadMessages').textContent = unreadCount.count || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentMessages() {
    const container = document.getElementById('recentMessages');
    
    try {
        const { data: messages, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        if (messages && messages.length > 0) {
            container.innerHTML = messages.map(msg => `
                <div class="recent-message-item ${msg.read ? 'read' : 'unread'}">
                    <div class="message-indicator ${msg.read ? '' : 'unread'}"></div>
                    <div class="message-content">
                        <div class="message-header">
                            <strong>${msg.name}</strong>
                            <span class="message-time">${formatMessageTime(msg.created_at)}</span>
                        </div>
                        <div class="message-subject">${msg.subject}</div>
                        <div class="message-preview">${msg.message.substring(0, 80)}${msg.message.length > 80 ? '...' : ''}</div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="no-messages"><i class="fas fa-inbox"></i> No messages yet</div>';
        }
    } catch (error) {
        console.error('Error loading recent messages:', error);
        container.innerHTML = '<div class="error-message">Failed to load recent messages</div>';
    }
}

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

// Dashboard refresh button
document.getElementById('refreshDashboardBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('refreshDashboardBtn');
    const icon = btn.querySelector('i');
    icon.classList.add('fa-spin');
    await loadDashboardData();
    setTimeout(() => icon.classList.remove('fa-spin'), 500);
});

// Quick action buttons
document.querySelectorAll('.quick-action-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.dataset.section;
        const action = card.dataset.action;

        if (section) {
            // Navigate to section
            const menuItem = document.querySelector(`.menu-item[data-section="${section}"]`);
            if (menuItem) {
                menuItem.click();
                // If it's gallery section, trigger add photo
                if (section === 'gallery') {
                    setTimeout(() => document.getElementById('addGalleryBtn')?.click(), 100);
                }
            }
        } else if (action) {
            // Perform action
            switch (action) {
                case 'add-event':
                    document.querySelector(`.menu-item[data-section="events"]`)?.click();
                    setTimeout(() => document.getElementById('addEventBtn')?.click(), 100);
                    break;
                case 'add-course':
                    document.querySelector(`.menu-item[data-section="courses"]`)?.click();
                    setTimeout(() => document.getElementById('addCourseBtn')?.click(), 100);
                    break;
                case 'add-class':
                    document.querySelector(`.menu-item[data-section="class-details"]`)?.click();
                    setTimeout(() => document.getElementById('addClassBtn')?.click(), 100);
                    break;
                case 'view-site':
                    window.open('index.html', '_blank');
                    break;
            }
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('loginError');
    const errorText = errorMessage.querySelector('.error-text');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    try {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        errorMessage.classList.remove('show');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        await checkAuth();
    } catch (error) {
        console.error('Login error:', error);
        errorText.textContent = error.message || 'Login failed. Please check your credentials.';
        errorMessage.classList.add('show');
        submitBtn.disabled = false;
        btnText.style.display = 'flex';
        btnLoader.style.display = 'none';
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
        const section = item.dataset.section;
        
        // If it's an external link (no data-section), allow default behavior
        if (!section) {
            return; // Let the link navigate normally
        }
        
        e.preventDefault();
        
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
        
        // Check if we have any valid items after filtering
        if (galleryItems.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>No Gallery Photos Yet</h3>
                    <p>Click "Add Photo" to upload your first gallery image</p>
                </div>
            `;
            return;
        }
        
        // Render items
        grid.innerHTML = '';
        const validItems = [];
        
        for (const item of galleryItems) {
            try {
                // Add cache busting parameter to public URL
                const { data: urlData } = supabase.storage
                    .from(GALLERY_BUCKET)
                    .getPublicUrl(item.name);
                
                if (!urlData || !urlData.publicUrl) {
                    console.warn('Skipping item with invalid URL:', item.name);
                    continue;
                }
                
                // Add cache buster using item's updated_at timestamp
                const cacheBuster = item.updated_at ? new Date(item.updated_at).getTime() : Date.now();
                const imageUrl = `${urlData.publicUrl}?t=${cacheBuster}`;
                
                // Parse metadata from filename (format: title___description___timestamp.ext or title___description.ext)
                const fileNameParts = item.name.split('___');
                const title = fileNameParts[0] ? decodeURIComponent(fileNameParts[0]) : 'Untitled';
                // Handle both new format (with timestamp) and old format (without)
                const descPart = fileNameParts[1] || 'No description';
                const description = descPart.split('.')[0].replace(/___\d+$/, ''); // Remove timestamp if present
                const cleanDescription = decodeURIComponent(description);
                
                validItems.push(item);
                
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${title}" class="item-image" onerror="this.parentElement.style.display='none'">
                    <div class="item-content">
                    <h3 class="item-title">${title}</h3>
                    <p class="item-description">${cleanDescription}</p>
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
            } catch (err) {
                console.error('Error rendering gallery item:', item.name, err);
                continue;
            }
        }
        
        // Update galleryItems to only include valid items
        galleryItems = validItems;
        
        // If no valid items after filtering, show empty state
        if (galleryItems.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>No Gallery Photos Yet</h3>
                    <p>Click "Add Photo" to upload your first gallery image</p>
                </div>
            `;
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

// Refresh Gallery Button
document.getElementById('refreshGalleryBtn').addEventListener('click', () => {
    const btn = document.getElementById('refreshGalleryBtn');
    const icon = btn.querySelector('i');
    icon.classList.add('fa-spin');
    btn.disabled = true;
    
    loadGalleryItems().then(() => {
        icon.classList.remove('fa-spin');
        btn.disabled = false;
        showGalleryStatus('Gallery refreshed successfully', 'success');
    }).catch(() => {
        icon.classList.remove('fa-spin');
        btn.disabled = false;
        showGalleryStatus('Error refreshing gallery', 'error');
    });
});

// Show gallery status message
function showGalleryStatus(message, type = 'info') {
    const statusDiv = document.getElementById('galleryStatusMessage');
    const statusText = document.getElementById('galleryStatusText');
    
    statusText.textContent = message;
    statusDiv.style.display = 'block';
    
    // Set color based on type
    if (type === 'success') {
        statusDiv.style.background = '#e8f5e9';
        statusDiv.style.borderColor = '#4caf50';
    } else if (type === 'error') {
        statusDiv.style.background = '#ffebee';
        statusDiv.style.borderColor = '#f44336';
    } else {
        statusDiv.style.background = '#e3f2fd';
        statusDiv.style.borderColor = '#2196f3';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
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
            // Update existing item - delete old file first
            console.log('Deleting old file:', galleryId);
            const { error: deleteError } = await supabase.storage
                .from(GALLERY_BUCKET)
                .remove([galleryId]);
            
            if (deleteError) {
                console.error('Error deleting old file:', deleteError);
            }
        }
        
        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            // Add timestamp to make filename unique and avoid cache issues
            const timestamp = Date.now();
            const fileName = `${encodeURIComponent(title)}___${encodeURIComponent(description)}___${timestamp}.${fileExt}`;
            
            console.log('Uploading new file:', fileName);
            console.log('File size:', file.size, 'bytes');
            console.log('File type:', file.type);
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(GALLERY_BUCKET)
                .upload(fileName, file, {
                    cacheControl: '300', // 5 minutes cache for faster updates
                    upsert: false // Don't upsert to ensure fresh upload
                });
            
            if (uploadError) {
                console.error('Upload error details:', uploadError);
                throw uploadError;
            }
            
            console.log('Upload successful:', uploadData);
            
            // Verify the upload by listing files
            const { data: verifyData, error: verifyError } = await supabase.storage
                .from(GALLERY_BUCKET)
                .list('', {
                    limit: 1,
                    search: fileName
                });
            
            if (verifyError) {
                console.warn('Could not verify upload:', verifyError);
                showGalleryStatus('Photo uploaded but verification failed. Please refresh to confirm.', 'info');
            } else if (verifyData && verifyData.length > 0) {
                console.log('Upload verified successfully:', verifyData[0]);
                showGalleryStatus('Photo uploaded and verified successfully! It will appear on the website within 30 seconds.', 'success');
            } else {
                console.warn('Upload completed but file not found in verification');
                showGalleryStatus('Photo uploaded but not found in verification. Please refresh to check.', 'info');
            }
        }
        
        showToast(galleryId ? 'Photo updated successfully!' : 'Photo added successfully!');
        closeModal('galleryModal');
        
        // Wait a moment before reloading to ensure storage is updated
        setTimeout(() => {
            loadGalleryItems();
        }, 500);
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
    // Handle both new format (with timestamp) and old format (without)
    const descPart = fileNameParts[1] || '';
    const description = descPart.split('.')[0].replace(/___\d+$/, ''); // Remove timestamp if present
    const cleanDescription = decodeURIComponent(description);
    
    document.getElementById('galleryModalTitle').textContent = 'Edit Gallery Photo';
    document.getElementById('galleryTitle').value = title;
    document.getElementById('galleryDescription').value = cleanDescription;
    document.getElementById('galleryId').value = fileName;
    
    // Show current image with cache buster
    const { data: urlData } = supabase.storage
        .from(GALLERY_BUCKET)
        .getPublicUrl(fileName);
    
    const cacheBuster = Date.now();
    const imageUrl = `${urlData.publicUrl}?t=${cacheBuster}`;
    
    const preview = document.getElementById('galleryImagePreview');
    preview.innerHTML = `<img src="${imageUrl}" alt="Current">`;
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
        
        // Check if we have any valid items after filtering
        if (eventItems.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No Events Yet</h3>
                    <p>Click "Add Event" to create your first event</p>
                </div>
            `;
            return;
        }
        
        // Render items
        grid.innerHTML = '';
        const validItems = [];
        
        for (const item of eventItems) {
            // Fetch the JSON file to get all event data
            let eventData;
            try {
                const { data: fileData, error: fileError } = await supabase.storage
                    .from(EVENTS_BUCKET)
                    .download(item.name);
                
                if (fileError) {
                    // File doesn't exist (was deleted), skip this item
                    console.warn('Skipping deleted/invalid event file:', item.name);
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
                // Skip this item if we can't load it
                continue;
            }
            
            // Extract data from JSON
            const day = eventData.day || '01';
            const month = eventData.month || 'JAN';
            const category = eventData.category || 'Event';
            const title = eventData.title || 'Untitled Event';
            const description = eventData.description || 'No description';
            const time = eventData.time || 'TBA';
            const location = eventData.location || 'TBA';
            const photoUrl = eventData.photoUrl || '';
            
            validItems.push(item);
            
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
        
        // Update eventItems to only include valid items
        eventItems = validItems;
        
        // If no valid items after filtering, show empty state
        if (eventItems.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No Events Yet</h3>
                    <p>Click "Add Event" to create your first event</p>
                </div>
            `;
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
        
        // Create a simple filename using timestamp and basic info (no special characters)
        // Store all metadata in the JSON file instead
        const timestamp = Date.now();
        const fileName = `event_${day}_${month}_${timestamp}.json`;
        
        // Create JSON data with all metadata
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
    document.getElementById('eventModalTitle').textContent = 'Edit Event';
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
            const eventData = JSON.parse(text);
            
            // Populate form fields from JSON data
            document.getElementById('eventDay').value = eventData.day || '';
            document.getElementById('eventMonth').value = eventData.month || '';
            document.getElementById('eventCategory').value = eventData.category || '';
            document.getElementById('eventTitle').value = eventData.title || '';
            document.getElementById('eventDescription').value = eventData.description || '';
            document.getElementById('eventTime').value = eventData.time || '';
            document.getElementById('eventLocation').value = eventData.location || '';
            
            if (eventData.photoUrl) {
                currentEventPhotoUrl = eventData.photoUrl; // Store current photo URL
                document.getElementById('eventPhotoPreviewImg').src = eventData.photoUrl;
                document.getElementById('eventPhotoPreview').style.display = 'block';
            }
        }
    } catch (err) {
        console.error('Error loading event data:', err);
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
// Course Management
// ==================== 

let currentCourseId = null;

// Add Course button
const addCourseBtn = document.getElementById('addCourseBtn');
if (addCourseBtn) {
    addCourseBtn.addEventListener('click', () => {
        currentCourseId = null;
        document.getElementById('courseModalTitle').textContent = 'Add Course';
        document.getElementById('submitBtnText').textContent = 'Save Course';
        document.getElementById('courseForm').reset();
        document.getElementById('courseId').value = '';
        document.getElementById('iconPreview').innerHTML = '';
        
        // Reset features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = `
            <div class="feature-item" style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="text" class="feature-input" placeholder="Enter a feature..." required 
                       style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                <button type="button" class="btn-remove-feature" onclick="removeFeature(this)"
                        style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        openModal('courseModal');
    });
}

// Icon preview
const courseIconInput = document.getElementById('courseIcon');
if (courseIconInput) {
    courseIconInput.addEventListener('input', (e) => {
        const preview = document.getElementById('iconPreview');
        preview.innerHTML = `<i class="${e.target.value}"></i>`;
    });
}

// Add feature button
const addFeatureBtn = document.getElementById('addFeatureBtn');
if (addFeatureBtn) {
    addFeatureBtn.addEventListener('click', () => {
        const featuresList = document.getElementById('featuresList');
        const newFeature = document.createElement('div');
        newFeature.className = 'feature-item';
        newFeature.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
        newFeature.innerHTML = `
            <input type="text" class="feature-input" placeholder="Enter a feature..." required 
                   style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
            <button type="button" class="btn-remove-feature" onclick="removeFeature(this)"
                    style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        featuresList.appendChild(newFeature);
    });
}

// Remove feature function
function removeFeature(btn) {
    const featuresList = document.getElementById('featuresList');
    if (featuresList.children.length > 1) {
        btn.parentElement.remove();
    } else {
        alert('At least one feature is required!');
    }
}

// Load courses
async function loadCourses() {
    const grid = document.getElementById('coursesItemsGrid');
    grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading courses...</div>';

    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        if (!courses || courses.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>No courses found</p>
                    <small>Click "Add Course" to create your first course</small>
                </div>
            `;
            return;
        }

        grid.innerHTML = courses.map(course => {
            const features = Array.isArray(course.features) ? course.features : [];
            const badgeHtml = course.badge ? 
                `<span class="badge ${course.badge_type || 'popular'}">
                    <i class="fas fa-tag"></i> ${course.badge}
                </span>` : '';
            const featuredBadge = course.is_featured ? 
                `<span class="badge featured">
                    <i class="fas fa-star"></i> Featured
                </span>` : '';
            
            return `
                <div class="course-card">
                    <!-- Course Header with Gradient -->
                    <div class="course-card-header">
                        <div class="course-header-content">
                            <div class="course-icon-wrapper">
                                <i class="${course.icon}"></i>
                            </div>
                            <div class="course-title-wrapper">
                                <h3>${escapeHtml(course.title)}</h3>
                                <div class="course-order-info">
                                    <i class="fas fa-sort-numeric-down"></i>
                                    Order: ${course.display_order}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Badges Section -->
                    ${(badgeHtml || featuredBadge || course.is_active !== undefined) ? `
                    <div class="course-badges-section">
                        <div class="course-badges-flex">
                            ${badgeHtml}
                            ${featuredBadge}
                            <span class="badge ${course.is_active ? 'success' : 'warning'}">
                                <i class="fas fa-${course.is_active ? 'check-circle' : 'exclamation-circle'}"></i>
                                ${course.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Description -->
                    <div class="course-description-section">
                        <p class="course-description">${escapeHtml(course.description)}</p>
                    </div>
                    
                    <!-- Features -->
                    ${features.length > 0 ? `
                    <div class="course-features-section">
                        <div class="course-features-title">
                            <i class="fas fa-list-check"></i>
                            Key Features
                        </div>
                        <ul class="features-list">
                            ${features.slice(0, 4).map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
                            ${features.length > 4 ? `<li><i class="fas fa-ellipsis-h"></i> +${features.length - 4} more features</li>` : ''}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <!-- Footer Meta -->
                    <div class="course-meta-footer">
                        <div class="course-meta-info">
                            <div class="meta-item">
                                <i class="fas fa-mouse-pointer"></i>
                                Button: <strong>"${escapeHtml(course.button_text || 'Enroll Now')}"</strong>
                            </div>
                            ${course.is_featured && course.featured_text ? `
                            <div class="meta-item">
                                <i class="fas fa-award"></i>
                                Featured: <strong>"${escapeHtml(course.featured_text)}"</strong>
                            </div>
                            ` : ''}
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="course-actions-footer">
                            <button class="btn-action-footer btn-edit" onclick="editCourse('${course.id}')" title="Edit Course">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-action-footer btn-toggle ${course.is_active ? '' : 'btn-toggle-off'}" 
                                    onclick="toggleCourse('${course.id}', ${!course.is_active})"
                                    title="${course.is_active ? 'Hide Course' : 'Show Course'}">
                                <i class="fas fa-${course.is_active ? 'eye' : 'eye-slash'}"></i> ${course.is_active ? 'Hide' : 'Show'}
                            </button>
                            <button class="btn-action-footer btn-delete" 
                                    data-course-id="${course.id}" 
                                    data-course-title="${escapeHtml(course.title)}"
                                    title="Delete Course">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event delegation for delete buttons
        const deleteButtons = grid.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const courseId = this.getAttribute('data-course-id');
                const courseTitle = this.getAttribute('data-course-title');
                deleteCourse(courseId, courseTitle);
            });
        });

    } catch (error) {
        console.error('Error loading courses:', error);
        grid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading courses</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Edit course
async function editCourse(courseId) {
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (error) throw error;

        currentCourseId = courseId;
        
        // Populate form
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseIcon').value = course.icon;
        document.getElementById('courseBadge').value = course.badge || '';
        document.getElementById('badgeType').value = course.badge_type || 'popular';
        document.getElementById('buttonText').value = course.button_text || 'Enroll Now';
        document.getElementById('displayOrder').value = course.display_order || 0;
        document.getElementById('isFeatured').checked = course.is_featured || false;
        document.getElementById('featuredText').value = course.featured_text || '';
        document.getElementById('isActive').checked = course.is_active;

        // Update icon preview
        document.getElementById('iconPreview').innerHTML = `<i class="${course.icon}"></i>`;

        // Populate features
        const featuresList = document.getElementById('featuresList');
        const features = Array.isArray(course.features) ? course.features : [];
        // Clear the list first
        featuresList.innerHTML = '';
        
        // Create feature items properly without escapeHtml in input values
        features.forEach(feature => {
            const featureDiv = document.createElement('div');
            featureDiv.className = 'feature-item';
            featureDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'feature-input';
            input.value = feature; // Direct assignment - browser handles special chars safely
            input.required = true;
            input.style.cssText = 'flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;';
            
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-remove-feature';
            button.style.cssText = 'background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;';
            button.innerHTML = '<i class="fas fa-trash"></i>';
            button.onclick = function() { removeFeature(this); };
            
            featureDiv.appendChild(input);
            featureDiv.appendChild(button);
            featuresList.appendChild(featureDiv);
        });

        // Update modal title
        document.getElementById('courseModalTitle').textContent = 'Edit Course';
        document.getElementById('submitBtnText').textContent = 'Update Course';

        // Open modal
        openModal('courseModal');
    } catch (error) {
        console.error('Error loading course:', error);
        alert('Error loading course details: ' + error.message);
    }
}

// Toggle course
async function toggleCourse(courseId, newStatus) {
    try {
        const { error } = await supabase
            .from('courses')
            .update({ is_active: newStatus })
            .eq('id', courseId);

        if (error) throw error;

        loadCourses();
    } catch (error) {
        console.error('Error toggling course:', error);
        alert('Error updating course status: ' + error.message);
    }
}

// Delete course
async function deleteCourse(courseId, courseTitle) {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
        return;
    }

    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId);

        if (error) throw error;

        alert('Course deleted successfully!');
        loadCourses();
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course: ' + error.message);
    }
}

// Course form submit
const courseForm = document.getElementById('courseForm');
if (courseForm) {
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect features
        const featureInputs = document.querySelectorAll('.feature-input');
        const features = Array.from(featureInputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (features.length === 0) {
            alert('Please add at least one feature!');
            return;
        }

        const courseData = {
            title: document.getElementById('courseTitle').value.trim(),
            description: document.getElementById('courseDescription').value.trim(),
            icon: document.getElementById('courseIcon').value.trim(),
            badge: document.getElementById('courseBadge').value.trim() || null,
            badge_type: document.getElementById('badgeType').value,
            features: features,
            is_featured: document.getElementById('isFeatured').checked,
            featured_text: document.getElementById('featuredText').value.trim() || null,
            button_text: document.getElementById('buttonText').value.trim() || 'Enroll Now',
            display_order: parseInt(document.getElementById('displayOrder').value) || 0,
            is_active: document.getElementById('isActive').checked
        };

        try {
            const courseId = document.getElementById('courseId').value;
            let result;

            if (courseId) {
                // Update existing course
                result = await supabase
                    .from('courses')
                    .update(courseData)
                    .eq('id', courseId);
            } else {
                // Insert new course
                result = await supabase
                    .from('courses')
                    .insert([courseData]);
            }

            if (result.error) throw result.error;

            alert(courseId ? 'Course updated successfully!' : 'Course added successfully!');
            closeModal('courseModal');
            loadCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error saving course: ' + error.message);
        }
    });
}

// Make course functions globally available
window.removeFeature = removeFeature;
window.editCourse = editCourse;
window.toggleCourse = toggleCourse;
window.deleteCourse = deleteCourse;
window.loadCourses = loadCourses;

// ==================== 
// Initialize
// ==================== 

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
});
