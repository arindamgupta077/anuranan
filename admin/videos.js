// ==========================================
// YouTube Videos Management - Admin Panel
// ==========================================

// Global variables
let editingVideoId = null;

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Load videos
    loadVideos();
    
    // Event listeners
    document.getElementById('videoForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    document.getElementById('extractBtn').addEventListener('click', extractYoutubeInfo);
    document.getElementById('refreshBtn').addEventListener('click', loadVideos);
    document.getElementById('youtubeUrl').addEventListener('input', handleUrlInput);
});

// ==========================================
// Authentication Check
// ==========================================

async function checkAuth() {
    if (typeof supabaseClient === 'undefined') {
        window.location.href = 'index.html';
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = 'index.html';
    }
}

// ==========================================
// Load Videos
// ==========================================

async function loadVideos() {
    try {
        const { data: videos, error } = await supabaseClient
            .from('youtube_videos')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        renderVideosTable(videos);
    } catch (error) {
        console.error('Error loading videos:', error);
        showMessage('Error loading videos', 'error');
    }
}

// ==========================================
// Render Videos Table
// ==========================================

function renderVideosTable(videos) {
    const tbody = document.getElementById('videosTableBody');
    
    if (!videos || videos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px;">
                    <i class="fas fa-video" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
                    <p style="color: #666;">No videos found. Add your first video above!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = videos.map(video => {
        const thumbnailUrl = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
        const statusBadge = video.is_active 
            ? '<span class="status-badge active">Active</span>' 
            : '<span class="status-badge inactive">Inactive</span>';
        const toggleText = video.is_active ? 'Deactivate' : 'Activate';
        const toggleClass = video.is_active ? '' : 'inactive';

        return `
            <tr>
                <td class="video-thumbnail-cell">
                    <img src="${thumbnailUrl}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/120x68?text=No+Image'">
                </td>
                <td>
                    <strong>${video.title}</strong>
                    <br>
                    <small style="color: #666;">ID: ${video.youtube_id}</small>
                </td>
                <td>
                    ${video.description ? (video.description.length > 80 ? video.description.substring(0, 80) + '...' : video.description) : '<em style="color: #999;">No description</em>'}
                </td>
                <td>${video.display_order}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="video-actions">
                        <button class="btn-edit" onclick="editVideo('${video.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-toggle ${toggleClass}" onclick="toggleVideoStatus('${video.id}', ${!video.is_active})">
                            <i class="fas fa-toggle-${video.is_active ? 'on' : 'off'}"></i> ${toggleText}
                        </button>
                        <button class="btn-delete" onclick="deleteVideo('${video.id}', '${video.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// Extract YouTube Info
// ==========================================

function extractYoutubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
        /youtube\.com\/shorts\/([^&\?\/]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

function handleUrlInput() {
    const url = document.getElementById('youtubeUrl').value.trim();
    if (url) {
        const videoId = extractYoutubeId(url);
        if (videoId) {
            showVideoPreview(videoId);
        }
    }
}

function extractYoutubeInfo() {
    const url = document.getElementById('youtubeUrl').value.trim();
    
    if (!url) {
        showMessage('Please enter a YouTube URL', 'error');
        return;
    }

    const videoId = extractYoutubeId(url);
    
    if (!videoId) {
        showMessage('Invalid YouTube URL. Please check and try again.', 'error');
        return;
    }

    // Show preview
    showVideoPreview(videoId);
    
    // Try to fetch video info using YouTube oEmbed API
    fetchYoutubeTitle(videoId);
    
    showMessage('YouTube ID extracted successfully!', 'success');
}

function showVideoPreview(videoId) {
    const preview = document.getElementById('videoPreview');
    const thumbnail = document.getElementById('thumbnailPreview');
    const videoIdText = document.getElementById('videoIdPreview');
    
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    videoIdText.textContent = `YouTube ID: ${videoId}`;
    preview.style.display = 'block';
}

async function fetchYoutubeTitle(videoId) {
    try {
        // Use YouTube oEmbed API to get video title
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        const data = await response.json();
        
        if (data.title && !document.getElementById('videoTitle').value) {
            document.getElementById('videoTitle').value = data.title;
        }
    } catch (error) {
        console.log('Could not auto-fetch video title:', error);
        // Silently fail - user can enter title manually
    }
}

// ==========================================
// Form Submit
// ==========================================

async function handleFormSubmit(e) {
    e.preventDefault();

    const url = document.getElementById('youtubeUrl').value.trim();
    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    const displayOrder = parseInt(document.getElementById('displayOrder').value) || 0;
    const isActive = document.getElementById('isActive').value === 'true';

    // Extract YouTube ID
    const youtubeId = extractYoutubeId(url);
    
    if (!youtubeId) {
        showMessage('Invalid YouTube URL', 'error');
        return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

    const videoData = {
        youtube_url: url,
        youtube_id: youtubeId,
        title: title,
        description: description || null,
        thumbnail_url: thumbnailUrl,
        display_order: displayOrder,
        is_active: isActive
    };

    try {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        let result;
        
        if (editingVideoId) {
            // Update existing video
            result = await supabaseClient
                .from('youtube_videos')
                .update(videoData)
                .eq('id', editingVideoId);
        } else {
            // Insert new video
            result = await supabaseClient
                .from('youtube_videos')
                .insert([videoData]);
        }

        if (result.error) throw result.error;

        showMessage(
            editingVideoId ? 'Video updated successfully!' : 'Video added successfully!',
            'success'
        );

        resetForm();
        loadVideos();
    } catch (error) {
        console.error('Error saving video:', error);
        showMessage('Error saving video: ' + error.message, 'error');
    } finally {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Video';
    }
}

// ==========================================
// Edit Video
// ==========================================

async function editVideo(videoId) {
    try {
        const { data: video, error } = await supabaseClient
            .from('youtube_videos')
            .select('*')
            .eq('id', videoId)
            .single();

        if (error) throw error;

        // Populate form
        editingVideoId = videoId;
        document.getElementById('videoId').value = videoId;
        document.getElementById('youtubeUrl').value = video.youtube_url;
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoDescription').value = video.description || '';
        document.getElementById('displayOrder').value = video.display_order;
        document.getElementById('isActive').value = video.is_active.toString();

        // Show preview
        showVideoPreview(video.youtube_id);

        // Update form title
        document.getElementById('formTitle').textContent = 'Edit Video';
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        showMessage('Editing video. Make your changes and click Save.', 'info');
    } catch (error) {
        console.error('Error loading video:', error);
        showMessage('Error loading video for editing', 'error');
    }
}

// ==========================================
// Toggle Video Status
// ==========================================

async function toggleVideoStatus(videoId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('youtube_videos')
            .update({ is_active: newStatus })
            .eq('id', videoId);

        if (error) throw error;

        showMessage(
            newStatus ? 'Video activated successfully!' : 'Video deactivated successfully!',
            'success'
        );
        
        loadVideos();
    } catch (error) {
        console.error('Error toggling video status:', error);
        showMessage('Error updating video status', 'error');
    }
}

// ==========================================
// Delete Video
// ==========================================

async function deleteVideo(videoId, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('youtube_videos')
            .delete()
            .eq('id', videoId);

        if (error) throw error;

        showMessage('Video deleted successfully!', 'success');
        loadVideos();
        
        // Reset form if editing this video
        if (editingVideoId === videoId) {
            resetForm();
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        showMessage('Error deleting video', 'error');
    }
}

// ==========================================
// Reset Form
// ==========================================

function resetForm() {
    editingVideoId = null;
    document.getElementById('videoForm').reset();
    document.getElementById('videoId').value = '';
    document.getElementById('displayOrder').value = '0';
    document.getElementById('formTitle').textContent = 'Add New Video';
    document.getElementById('videoPreview').style.display = 'none';
}

// ==========================================
// Show Messages
// ==========================================

function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: 'linear-gradient(135deg, #4CAF50, #45a049)',
        error: 'linear-gradient(135deg, #f44336, #da190b)',
        info: 'linear-gradient(135deg, #2196F3, #1976D2)'
    };

    messageDiv.style.background = colors[type] || colors.info;
    messageDiv.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
