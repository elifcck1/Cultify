// ==========================================
// ADMIN DASHBOARD LOGIC (The Control Room)
// This file handles all operations available only to administrators:
// managing users, approving/deleting comments, and adding/editing content.
// ==========================================

async function renderAdmin() {
    const user = window.getCurrentUser();
    if (!user) {
        window.location.replace('login.html');
        return;
    }
    if (user.role !== 'admin') {
        window.location.replace('index.html');
        return;
    }

    renderAdminLibrary();

    // 1. CALCULATE STATISTICS
    // Count how many Movies, Series, Books, and Games exist in our database to show in the sidebar.
    const db = window.getContentDB ? window.getContentDB() : {};
    const items = Object.values(db);
    const categories = { 'Movie': 0, 'Series': 0, 'Book': 0, 'Game': 0 };
    items.forEach(item => {
        const tag = (item.tags && item.tags[0]) || '';
        if (tag.includes('Movie') || tag.includes('Series')) {
            if (tag.includes('Series')) categories['Series']++;
            else categories['Movie']++;
        } else if (tag.includes('Book')) {
            categories['Book']++;
        } else if (tag.includes('Game')) {
            categories['Game']++;
        } else {
            categories['Movie']++; // default
        }
    });

    const catEl = document.getElementById('admin-category-stats');
    if (catEl) {
        catEl.innerHTML = Object.entries(categories).map(([name, count]) => `
            <div class="admin-category-item">
                <span class="admin-category-name">${name}</span>
                <span class="admin-category-count">${count}</span>
            </div>
        `).join('');
    }

    // 2. LOAD BACKEND STATS
    // Fetch global server stats (like total registered users) from the backend.
    try {
        const statsRes = await window.cultifyFetch('admin_stats.php', { method: 'GET' });
        if (statsRes.data.ok) {
            // Update the UI with actual stats from the database
            const totalUsersEl = document.getElementById('sidebar-total-users');
            if (totalUsersEl) totalUsersEl.textContent = statsRes.data.users || 0;

            const totalReviewsEl = document.getElementById('sidebar-total-reviews');
            if (totalReviewsEl) totalReviewsEl.textContent = statsRes.data.comments_total || 0;
        }
    } catch (e) { 
        console.error("Admin dashboard stats could not be loaded from backend:", e);
        window.showToast("Failed to load admin statistics", "error");
    }

    // 3. LOAD COMMENTS (The Moderation Queue)
    // Fetch all comments from the database to see which ones are waiting for approval (pending)
    // and which ones are already public.
    const commentsEl = document.getElementById('admin-comments');
    const allReviewsEl = document.getElementById('admin-all-reviews-list');
    try {
        const cRes = await window.cultifyFetch('comments_admin.php', { method: 'GET' });
        if (cRes.data.ok) {
            const comments = cRes.data.comments || [];
            const pending = comments.filter(c => c.status === 'pending');
            const db = window.getContentDB ? window.getContentDB() : {};

            // 1. Pending Reviews Section
            if (commentsEl) {
                const totalEl = document.getElementById('admin-reviews-total');
                if (totalEl) totalEl.textContent = `Total: ${pending.length}`;

                // Sidebar Badge update
                const badgeEl = document.getElementById('pending-reviews-count');
                if (badgeEl) {
                    badgeEl.textContent = pending.length;
                    if (pending.length > 0) badgeEl.classList.remove('hidden');
                    else badgeEl.classList.add('hidden');
                }

                if (pending.length === 0) {
                    commentsEl.innerHTML = '<p class="text-secondary">No pending comments.</p>';
                } else {
                    commentsEl.innerHTML = pending.map(c => {
                        const item = db[c.itemId] || {};
                        const itemTitle = item.title || `Item ${c.itemId}`;
                        const itemImg = item.img || '../images/default-placeholder.jpg';
                        return `
                        <div class="admin-content-row">
                            <img src="${itemImg}" alt="cover" class="admin-row-img">
                            <div class="admin-row-info">
                                <div class="admin-row-title">${window.escapeHtml(c.userName)}</div>
                                <div class="admin-row-meta">on <strong>${window.escapeHtml(itemTitle)}</strong></div>
                                <div class="admin-row-comment-text">${window.escapeHtml(c.text)}</div>
                            </div>
                            <div class="admin-row-actions">
                                <button class="btn btn-primary btn-sm" onclick="window.adminApproveComment('${c.itemId}', '${c.id}')">Approve</button>
                                <button class="btn btn-danger btn-sm" onclick="window.adminDeleteComment('${c.itemId}', '${c.id}')">Delete</button>
                            </div>
                        </div>`;
                    }).join('');
                }
            }

            // 3b. All Reviews Section
            // Shows a complete history of every comment ever posted, with an option to delete them.
            if (allReviewsEl) {
                const totalAllEl = document.getElementById('admin-all-reviews-total');
                if (totalAllEl) totalAllEl.textContent = `Total: ${comments.length}`;

                if (comments.length === 0) {
                    allReviewsEl.innerHTML = '<p class="text-secondary">No reviews found.</p>';
                } else {
                    allReviewsEl.innerHTML = comments.map(c => {
                        const item = db[c.itemId] || {};
                        const itemTitle = item.title || `Item ${c.itemId}`;
                        const itemImg = item.img || '../images/default-placeholder.jpg';
                        const statusBadge = c.status === 'pending' ? '<span class="badge-role" style="background:rgba(251,191,36,0.1); color:#fbbf24; border:1px solid rgba(251,191,36,0.2); margin-left:0.5rem; vertical-align:middle;">Pending</span>' : '';
                        return `
                        <div class="admin-content-row">
                            <img src="${itemImg}" alt="cover" class="admin-row-img">
                            <div class="admin-row-info">
                                <div class="admin-row-title">${window.escapeHtml(c.userName)} ${statusBadge}</div>
                                <div class="admin-row-meta">on <strong>${window.escapeHtml(itemTitle)}</strong></div>
                                <div class="admin-row-comment-text">${window.escapeHtml(c.text)}</div>
                            </div>
                            <div class="admin-row-actions">
                                <button class="btn btn-danger btn-sm" onclick="window.adminDeleteComment('${c.itemId}', '${c.id}')">Delete</button>
                            </div>
                        </div>`;
                    }).join('');
                }
            }
            
            // Sidebar sync - Using ALL comments count for Total Reviews
            const sideTotalEl = document.getElementById('sidebar-total-reviews');
            if (sideTotalEl) sideTotalEl.textContent = comments.length;
        }
    } catch (e) {
        if (commentsEl) commentsEl.innerHTML = '<p class="text-secondary">Error loading comments.</p>';
        if (allReviewsEl) allReviewsEl.innerHTML = '<p class="text-secondary">Error loading reviews.</p>';
    }

    // 4. LOAD USERS (The Member Directory)
    // Fetch all registered users to display them in a card-based layout.
    const usersEl = document.getElementById('admin-users');
    try {
        const uRes = await window.cultifyFetch('admin_users.php', { method: 'GET' });
        if (uRes.data.ok) {
            const users = uRes.data.users || [];
            const totalEl = document.getElementById('admin-users-total');
            if (totalEl) totalEl.textContent = `Total: ${users.length}`;

            // Sidebar sync
            const sideTotalEl = document.getElementById('sidebar-total-users');
            if (sideTotalEl) sideTotalEl.textContent = users.length;

            usersEl.innerHTML = users.map(u => `
                <div class="admin-content-row">
                    <div class="admin-row-avatar">${window.escapeHtml(u.firstName.charAt(0))}${window.escapeHtml(u.lastName.charAt(0))}</div>
                    <div class="admin-row-info">
                        <div class="admin-row-title">${window.escapeHtml(u.firstName)} ${window.escapeHtml(u.lastName)}</div>
                        <div class="admin-row-meta">${window.escapeHtml(u.email)} · <span class="badge-role ${u.role}">${window.escapeHtml(u.role)}</span></div>
                    </div>
                    <div class="admin-row-actions">
                    ${u.id !== user.id ? `
                        <button class="btn btn-primary btn-sm" onclick="window.adminToggleUserRole('${u.id}', '${u.role === 'admin' ? 'user' : 'admin'}')">Make ${u.role === 'admin' ? 'User' : 'Admin'}</button>
                        <button class="btn btn-danger btn-sm" onclick="window.adminDeleteUser('${u.id}')">Delete</button>
                    ` : '<span class="badge-role admin">You</span>'}
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        usersEl.innerHTML = '<p class="text-secondary">Error loading users.</p>';
    }
}

// ==========================================
// MODERATION: APPROVE COMMENT
// Moves a comment from 'pending' status to public visibility.
// ==========================================
window.adminApproveComment = async function (itemId, commentId) {
    await window.cultifyFetch('comment_approve.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, comment_id: commentId })
    });
    renderAdmin();
};

window.adminDeleteComment = async function (itemId, commentId) {
    if (!confirm("Delete comment?")) return;
    await window.cultifyFetch('comment_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, comment_id: commentId })
    });
    renderAdmin();
};

window.adminToggleUserRole = async function (userId, newRole) {
    if (!confirm(`Change role to ${newRole}?`)) return;
    await window.cultifyFetch('admin_user_role.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole })
    });
    renderAdmin();
};

window.adminDeleteUser = async function (id) {
    if (!confirm("Delete user?")) return;
    await window.cultifyFetch('admin_user_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id })
    });
    renderAdmin();
};

// ==========================================
// Admin Content Library Management
// ==========================================

let adminEditingItemId = null;
let adminCurrentImageBase64 = null;
let adminSelectedTags = [];
let adminLibraryFilter = 'All';
let adminSearchQuery = '';

window.setAdminLibraryFilter = function (category) {
    adminLibraryFilter = category;

    // Update active UI
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(p => {
        p.classList.remove('active');
        // Check text content or we could have used data attributes, but text is fine here
        if (category === 'All' && p.innerText === 'All') p.classList.add('active');
        if (category === 'Movie' && p.innerText === 'Movies') p.classList.add('active');
        if (category === 'Series' && p.innerText === 'Series') p.classList.add('active');
        if (category === 'Game' && p.innerText === 'Games') p.classList.add('active');
        if (category === 'Book' && p.innerText === 'Books') p.classList.add('active');
    });

    renderAdminLibrary();
};

function renderAdminTagPills() {
    const container = document.getElementById('admin-selected-tags');
    if (!container) return;
    container.innerHTML = adminSelectedTags.map(tag => {
        const cls = tag.toLowerCase().replace(/[^a-z0-9]/g, match => match === '/' ? '\\/' : '-');
        return `<span class="detail-tag tag-${cls} admin-tag-pill">${tag}<button type="button" onclick="window.adminRemoveTag('${tag}')">&times;</button></span>`;
    }).join('');
}

window.adminRemoveTag = function(tag) {
    adminSelectedTags = adminSelectedTags.filter(t => t !== tag);
    renderAdminTagPills();
};

// ==========================================
// LIBRARY RENDERER: CONTENT MANAGEMENT
// Displays the grid of all movies, series, books, and games for the admin to edit or delete.
// Also handles the live search and filtering on the admin panel.
// ==========================================
async function renderAdminLibrary() {
    const listEl = document.getElementById('admin-content-list');
    if (!listEl) return;

    const db = window.getContentDB ? window.getContentDB() : {};
    let items = Object.entries(db).map(([id, data]) => ({ id, ...data }));

    // Apply Filter
    if (adminLibraryFilter !== 'All') {
        items = items.filter(item => {
            const primaryTag = (item.tags && item.tags[0]) || '';
            return primaryTag.includes(adminLibraryFilter);
        });
    }

    // Apply Search
    if (adminSearchQuery) {
        const q = adminSearchQuery.toLocaleLowerCase('tr-TR');
        items = items.filter(item => 
            (item.title && item.title.toLocaleLowerCase('tr-TR').includes(q)) || 
            (item.tags && item.tags.some(tag => tag.toLocaleLowerCase('tr-TR').includes(q)))
        );
    }

    if (items.length === 0) {
        listEl.innerHTML = `<p class="text-secondary">No ${adminLibraryFilter === 'All' ? '' : adminLibraryFilter.toLowerCase() + 's'} found.</p>`;
        return;
    }

    listEl.innerHTML = items.map(item => `
        <div class="admin-content-row">
            <img src="${item.img || '../images/default-placeholder.jpg'}" alt="cover" class="admin-row-img">
            <div class="admin-row-info">
                <div class="admin-row-title">${window.escapeHtml(item.title)}</div>
                <div class="admin-row-meta">${window.escapeHtml(item.tags ? item.tags[0] : 'Unknown')} • ${window.escapeHtml(item.year)}</div>
            </div>
            <div class="admin-row-actions">
                <button class="btn btn-primary btn-sm" onclick="window.adminOpenAddForm('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="window.adminDeleteContent('${item.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// CONTENT FORM OPENER (Add/Edit)
// Prepares the form modal for either creating a new item or editing an existing one.
// Pre-fills data if an itemId is provided.
// ==========================================
window.adminOpenAddForm = function (itemId = null) {
    const wrap = document.getElementById('admin-content-form-wrap');
    if (!wrap) return;

    wrap.classList.remove('hidden');
    adminEditingItemId = itemId;
    document.getElementById('admin-content-form-title').innerText = itemId ? 'Edit Content' : 'Add Content';

    const imgInput = document.getElementById('add-image-file');
    const imgPreview = document.getElementById('add-image-preview');

    imgInput.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                adminCurrentImageBase64 = evt.target.result;
                imgPreview.src = adminCurrentImageBase64;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    if (itemId) {
        const db = window.getContentDB();
        const item = db[itemId];
        if (item) {
            document.getElementById('add-type').value = (item.tags && item.tags[0]) || 'Movie';
            document.getElementById('add-name').value = item.title || '';
            document.getElementById('add-detail').value = item.desc || '';
            adminSelectedTags = (item.tags && item.tags.slice(1)) || [];
            renderAdminTagPills();
            document.getElementById('add-year').value = item.year || '';
            document.getElementById('add-time').value = item.length || '';
            document.getElementById('add-author').value = item.creator || '';
            document.getElementById('add-age').value = item.age || '';

            adminCurrentImageBase64 = item.img || null;
            if (adminCurrentImageBase64) {
                imgPreview.src = adminCurrentImageBase64;
                imgPreview.style.display = 'block';
            } else {
                imgPreview.style.display = 'none';
            }
        }
    } else {
        document.getElementById('add-name').value = '';
        document.getElementById('add-detail').value = '';
        adminSelectedTags = [];
        renderAdminTagPills();
        document.getElementById('add-year').value = '';
        document.getElementById('add-time').value = '';
        document.getElementById('add-author').value = '';
        document.getElementById('add-age').value = '';
        adminCurrentImageBase64 = null;
        imgPreview.style.display = 'none';
        imgInput.value = '';
    }

    // Scroll to form and focus
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        document.getElementById('add-name').focus();
    }, 400);
};

window.adminCloseAddForm = function () {
    const wrap = document.getElementById('admin-content-form-wrap');
    if (wrap) wrap.classList.add('hidden');
    adminEditingItemId = null;
};

// ==========================================
// SAVE CONTENT (Create or Update)
// Gathers data from the admin form (title, desc, image base64, tags) 
// and sends it to the backend to be inserted or updated.
// ==========================================
window.adminSaveContent = async function () {
    const primaryType = document.getElementById('add-type').value;
    const rawTags = adminSelectedTags.slice();

    // Package the form data into a JSON object
    const body = {
        primaryType: primaryType,
        categoryId: 0,
        title: document.getElementById('add-name').value || 'Untitled',
        desc: document.getElementById('add-detail').value || '',
        img: adminCurrentImageBase64 || '../images/default-placeholder.jpg',
        tags: [primaryType, ...rawTags],
        year: document.getElementById('add-year').value || '2024',
        length: document.getElementById('add-time').value || 'N/A',
        creator: document.getElementById('add-author').value || 'Cultify',
        age: document.getElementById('add-age').value || '+13'
    };

    const endpoint = adminEditingItemId ? 'item_update.php' : 'item_create.php';
    if (adminEditingItemId) body.id = adminEditingItemId;

    try {
        const r = await window.cultifyFetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (r.res.ok && r.data.ok) {
            window.adminCloseAddForm();
            await window.cultifyInit();
            renderAdminLibrary();
            renderAdmin();
            window.showToast("Content saved successfully.", "success");
        } else {
            window.showToast(r.data.error || 'Save failed.', "error");
        }
    } catch (e) {
        window.showToast('Error saving content.', "error");
    }
};

// ==========================================
// DELETE CONTENT
// Permanently removes a movie/series/game/book from the database.
// ==========================================
window.adminDeleteContent = async function (id) {
    if (!confirm("Are you sure you want to delete this content? This cannot be undone.")) return;
    try {
        const r = await window.cultifyFetch('item_delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        if (r.res.ok && r.data.ok) {
            await window.cultifyInit();
            renderAdminLibrary();
            renderAdmin();
            window.showToast("Content deleted successfully.", "success");
        } else {
            window.showToast(r.data.error || 'Delete failed.', "error");
        }
    } catch (e) {
        window.showToast('Error deleting content.', "error");
    }
};



// ==========================================
// Admin Sidebar Navigation & Mobile Toggle
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-sidebar-overlay');
    const toggleBtn = document.getElementById('admin-sidebar-toggle');

    // Nav switching
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-section');

            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById('section-' + target);
            if (targetSection) targetSection.classList.add('active');

            // Close sidebar on mobile
            closeSidebar();
        });
    });

    // Mobile sidebar toggle
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Logout
    const logoutLink = document.getElementById('admin-logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (window.logoutWithApi) await window.logoutWithApi();
            window.location.href = 'index.html';
        });
    }
    // Tag select dropdown
    const tagSelect = document.getElementById('add-tag-select');
    if (tagSelect) {
        tagSelect.addEventListener('change', () => {
            const val = tagSelect.value;
            if (val && !adminSelectedTags.includes(val)) {
                adminSelectedTags.push(val);
                renderAdminTagPills();
            }
            tagSelect.selectedIndex = 0; // Reset to placeholder
        });
    }

    // Library Search Listener
    const searchInput = document.getElementById('admin-library-search');
    if (searchInput) {
        searchInput.oninput = (e) => {
            adminSearchQuery = e.target.value.trim();
            renderAdminLibrary();
        };
    }
});
