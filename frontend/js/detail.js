// ==========================================
// DETAIL PAGE LOGIC (The Content Showcase)
// This file controls what happens when you click on a movie, series, book, or game.
// It loads the item's info, shows user reviews, and handles the "Add to List" button.
// ==========================================

async function renderDetail() {
    const container = document.getElementById('detail-container');
    if (!container) return; // If we're not on the detail page, stop running this code.

    // Get the unique ID from the website URL (e.g., website.com/detail.html?id=item_1)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // SECURITY: If the URL doesn't have an ID, show an error.
    if (!id) {
        container.innerHTML = '<p>Item not found.</p>';
        return;
    }

    // Look up the requested item in our local dictionary (contentDB)
    const db = window.getContentDB ? window.getContentDB() : {};
    const item = db[id];

    if (!item) {
        container.innerHTML = '<p>Item not found in database.</p>';
        return;
    }

    // CHECK VIP STATUS: Is the user logged in? Are they an admin?
    const isLoggedIn = window.isLoggedIn && window.isLoggedIn();
    const isAdmin = isLoggedIn && window.getCurrentUser && window.getCurrentUser().role === 'admin';
    let actionHtml = '';
    let ratingHtml = '';

    // Default values before we check the user's personal list
    let inList = false;
    let userRating = 0;

    // If logged in, fetch their personal watchlist and their specific rating for this item
    if (isLoggedIn) {
        const uid = window.getCurrentUserId();
        const list = window.getUserList ? window.getUserList(uid) : [];
        inList = list.includes(id); // True if they already added it
        userRating = window.getRating ? window.getRating(uid, id) : 0;
    }

    // BUILD THE UI BUTTON: Change color and text based on whether it's already in their list.
    actionHtml = `
        <button id="toggle-list-btn" class="btn ${inList ? 'btn-danger' : 'btn-primary'}">
            ${inList ? 'Remove from List' : 'Add to List'}
        </button>
    `;

    // BUILD THE STAR RATING SYSTEM (1 to 10 stars)
    let stars = '';
    for (let i = 1; i <= 10; i++) {
        // If the star's number is less than or equal to the user's rating, color it gold (active).
        stars += `<span data-val="${i}" class="${i <= userRating ? 'active' : ''}">★</span>`;
    }
    ratingHtml = `
        <div class="detail-rating-block">
            <div class="detail-rating-label">Your Rating:</div>
            <div class="star-widget" id="detail-star-widget">${stars}</div>
        </div>
    `;

    // TAG PILLS: Convert tags like 'Sci-Fi' into beautifully styled colorful badges.
    const tagsHtml = item.tags ? item.tags.map(tag => {
        const cls = tag.toLowerCase().replace(/[^a-z0-9]/g, match => match === '/' ? '\\/' : '-');
        return `<span class="detail-tag tag-${cls}">${window.escapeHtml(tag)}</span>`;
    }).join('') : '';

    // Calculate the overall community average rating for this specific item
    const avgRating = window.getItemAverageRating ? window.getItemAverageRating(id) : 0;
    const avgStr = avgRating > 0 ? avgRating.toFixed(1) : 'N/A';

    // PAINT THE SCREEN: Inject the massive block of HTML structure into the page.
    container.innerHTML = `
        <div class="detail-header">
            <img src="${item.img || '../images/default-placeholder.jpg'}" alt="${window.escapeHtml(item.title)}" class="detail-image">
            <div class="detail-info">
                <h1>${window.escapeHtml(item.title)}</h1>
                <div class="detail-tags">${tagsHtml}</div>
                <div class="detail-meta-row">
                    <span class="detail-meta-item">
                        <svg class="meta-icon-calendar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${item.year || 'N/A'}
                    </span>
                    <span class="detail-meta-item">
                        <svg class="meta-icon-clock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${item.length || 'N/A'}
                    </span>
                    <span class="detail-meta-item">
                        <svg class="meta-icon-person" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ${window.escapeHtml(item.creator || 'Unknown')}
                    </span>
                    <span class="detail-meta-item">
                        <svg class="meta-icon-age" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        ${item.age || 'N/A'}
                    </span>
                </div>
                <div class="detail-rating-row">
                    ${ratingHtml}
                    <div class="detail-rating-block">
                        <div class="detail-rating-label">Average Rating:</div>
                        <div class="detail-avg-display">
                            <span class="avg-star">★</span>
                            <span class="avg-number">${avgStr}</span>
                        </div>
                    </div>
                </div>
                <div class="mb-1">${actionHtml}</div>
                <p class="detail-desc">${window.escapeHtml(item.desc || 'No description available.')}</p>
            </div>
        </div>
        <div class="comments-section">
            <h2>Comments</h2>
            <div class="form-group" style="margin-top: 1rem;">
                <textarea id="comment-input" class="form-control" rows="3" placeholder="Add a comment..."></textarea>
            </div>
            <button id="add-comment-btn" class="btn btn-primary" style="margin-bottom: 2rem;">Post Comment</button>
            <div id="comments-list">Loading...</div>
        </div>
    `;

    // INTERACTIVITY 1: "Add to List" Button Logic
    const toggleBtn = document.getElementById('toggle-list-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', async () => {
            if (!isLoggedIn) {
                window.showToast("Please log in to manage your list.", "error");
                return;
            }
            const uid = window.getCurrentUserId();
            const list = window.getUserList(uid);
            
            // If already in list, tell the backend to remove it. Otherwise, add it.
            if (list.includes(id)) {
                await window.removeFromUserList(uid, id);
            } else {
                await window.addToUserList(uid, id);
            }
            
            // Refresh the page so the button changes color instantly.
            renderDetail();
        });
    }

    // INTERACTIVITY 2: Hover & Click effects for the 10-Star System
    const starWidget = document.getElementById('detail-star-widget');
    if (starWidget) {
        const starSpans = starWidget.querySelectorAll('span');
        starSpans.forEach(span => {
            
            // Hover effect: light up the stars up to where the mouse is pointing
            span.addEventListener('mouseover', function () {
                const val = parseInt(this.getAttribute('data-val'));
                starSpans.forEach(s => {
                    if (parseInt(s.getAttribute('data-val')) <= val) s.style.color = '#f59e0b';
                    else s.style.color = '';
                });
            });
            
            // Mouse out: reset colors to whatever they clicked previously
            span.addEventListener('mouseout', function () {
                starSpans.forEach(s => s.style.color = '');
            });
            
            // Click to Save: Send rating to the backend database
            span.addEventListener('click', async function () {
                if (!isLoggedIn) {
                    window.showToast("Please log in to rate content.", "error");
                    return;
                }
                const uid = window.getCurrentUserId();
                const val = parseInt(this.getAttribute('data-val'));
                
                // If they clicked the exact same rating again, it acts as a "remove rating" button (val = 0).
                const finalVal = (val === userRating) ? 0 : val;
                if (window.setRating) await window.setRating(uid, id, finalVal);
                renderDetail();
            });
        });
    }

    // FETCH COMMENTS: Go to the database and get all reviews written by the community for this item.
    if (window.cultifyEnsureComments) {
        await window.cultifyEnsureComments(id);
    }
    renderComments(id, isAdmin);

    // INTERACTIVITY 3: "Post Comment" Button Logic
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
        addCommentBtn.addEventListener('click', async () => {
            if (!isLoggedIn) {
                window.showToast("Please log in to post a comment.", "error");
                return;
            }
            const input = document.getElementById('comment-input');
            const text = input.value.trim();
            if (!text) return; // Don't let users post empty comments.

            const uid = window.getCurrentUserId();
            const res = await window.addComment(id, uid, text); // Send to backend
            
            if (res && res.ok) {
                window.showToast("Comment posted and pending approval (if applicable).", "success");
                input.value = ''; // Clear the text box
                renderComments(id, isAdmin); // Refresh the comment list
            } else {
                window.showToast("Failed to post comment.", "error");
            }
        });
    }
}

/*
 * ====================================================================
 * RENDER COMMENTS
 * Takes the raw comment data from the database and turns it into HTML.
 * ====================================================================
 */
function renderComments(itemId, isAdmin = false) {
    const listEl = document.getElementById('comments-list');
    if (!listEl) return;

    const comments = window.getCommentsForItem ? window.getCommentsForItem(itemId) : [];

    if (comments.length === 0) {
        listEl.innerHTML = '<p class="text-secondary">No comments yet.</p>';
        return;
    }

    // Loop through every comment and generate its HTML structure.
    const currentUserId = window.isLoggedIn() ? window.getCurrentUserId() : null;

    listEl.innerHTML = comments.map(c => {
        let avatarHtml = '';
        
        // Handle custom uploaded avatars vs font-awesome icon avatars
        if (c.userAvatar && (c.userAvatar.includes('/') || c.userAvatar.includes('.'))) {
            avatarHtml = `<img src="${c.userAvatar}" class="comment-avatar" alt="Avatar">`;
        } else {
            avatarHtml = `<div class="comment-avatar"><i class="${c.userAvatar || 'fa-solid fa-user'}"></i></div>`;
        }

        const isOwnComment = currentUserId === c.userId;

        return `
        <div class="comment">
            <div class="comment-header">
                <a href="profile.html?handle=${c.userHandle}" class="comment-user-link" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none;">
                    ${avatarHtml}
                    <strong>${window.escapeHtml(c.userName || 'User')}</strong>
                </a>
                
                <!-- Delete button: Shown if user is Admin OR if it's the user's own comment -->
                ${(isAdmin || isOwnComment) ? `<button class="comment-delete-btn" onclick="${isAdmin ? 'window.adminDeleteCommentFromDetail' : 'window.userDeleteOwnCommentFromDetail'}('${itemId}', '${c.id}')" title="Delete comment">✕</button>` : ''}
            </div>
            
            <!-- We MUST escape the text to prevent hackers from executing JS inside comments -->
            <div class="comment-body">${window.escapeHtml(c.text)}</div>
        </div>
        `;
    }).join('');
}

/*
 * USER POWERS: Delete own comment
 */
window.userDeleteOwnCommentFromDetail = async function (itemId, commentId) {
    if (!confirm("Delete your comment?")) return;
    const res = await window.cultifyFetch('comment_delete_self.php', { method: 'POST', body: JSON.stringify({ item_id: itemId, comment_id: commentId }) });
    if (res?.ok) { window.showToast("Deleted.", "success"); window.renderDetail(); }
    else window.showToast("Error deleting comment.", "error");
}

/*
 * ====================================================================
 * ADMIN SUPERPOWERS: Delete any comment directly from the detail page.
 * ====================================================================
 */
window.adminDeleteCommentFromDetail = async function (itemId, commentId) {
    // Always double-check before deleting something permanently.
    if (!confirm("Delete this comment?")) return;
    
    try {
        // Send the execution order to the backend courier
        await window.cultifyFetch('comment_delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, comment_id: commentId })
        });
        
        // Refresh the local cache so the deleted comment disappears
        if (window.cultifyEnsureComments) {
            await window.cultifyEnsureComments(itemId);
        }
        
        const isAdmin = window.getCurrentUser && window.getCurrentUser().role === 'admin';
        renderComments(itemId, isAdmin);
        window.showToast("Comment deleted.", "success");
    } catch (e) {
        window.showToast('Error deleting comment.', 'error');
    }
};
