/**
 * ==========================================
 * PROFILE MODULE (profile.js)
 * ==========================================
 * Handles the logic for displaying a user's profile page. 
 */
let profileFilter = 'All';

window.setProfileFilter = function (category) {
    profileFilter = category;
    window.renderProfile();
};

window.renderProfile = async function() {
    const container = document.getElementById('profile-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const handleParam = params.get('handle');

    let user, uid, userRatings, userComments, isOwnProfile;

    if (handleParam) {
        // If there's a handle in the URL, fetch and display that specific public profile
        const publicData = await window.getPublicProfileDetails(handleParam);
        if (!publicData) {
            container.innerHTML = '<p class="text-secondary" style="text-align:center; padding:5rem;">User not found.</p>';
            return;
        }
        user = publicData.user;
        uid = user.id;
        userRatings = publicData.ratings;
        userComments = publicData.comments;
        isOwnProfile = window.isLoggedIn() && window.getCurrentUserId() === uid;
    } else {
        // If there is no handle in the URL, display the currently logged-in user's profile
        if (!window.isLoggedIn()) {
            window.location.replace('login.html'); // Redirect to login if unauthenticated
            return;
        }
        user = window.getCurrentUser();
        uid = window.getCurrentUserId();
        userRatings = window.getUserRatings ? window.getUserRatings(uid) : {};
        userComments = window.getMyComments ? window.getMyComments() : [];
        isOwnProfile = true;
    }

    const db = window.getContentDB ? window.getContentDB() : {};

    // 2. BUILD THE REVIEW CARDS (What did they watch and rate?)
    const ratedItems = Object.entries(userRatings)
        .map(([itemId, rating]) => {
            const item = db[itemId];
            if (!item) return null;
            return { id: itemId, rating, ...item };
        })
        .filter(Boolean);

    // Apply category filters (Movie, Series, Book, Game) to the rated items
    let filteredRatedItems = ratedItems;
    if (profileFilter !== 'All') {
        filteredRatedItems = ratedItems.filter(item => {
            const primaryTag = (item.tags && item.tags[0]) || '';
            return primaryTag.includes(profileFilter);
        });
    }

    let ratedCardsHtml = '';
    if (ratedItems.length === 0) {
        ratedCardsHtml = `
            <div class="profile-section">
                <h2>${isOwnProfile ? 'My Ratings' : 'Ratings'}</h2>
                <p class="text-secondary">${isOwnProfile ? "You haven't rated any content yet." : "This user hasn't rated any content yet."}</p>
            </div>
        `;
    } else {
        const filterHtml = `
            <div class="category-filters">
                <button class="filter-pill ${profileFilter === 'All' ? 'active' : ''}" onclick="window.setProfileFilter('All')">All</button>
                <button class="filter-pill filter-movie ${profileFilter === 'Movie' ? 'active' : ''}" onclick="window.setProfileFilter('Movie')">Movies</button>
                <button class="filter-pill filter-series ${profileFilter === 'Series' ? 'active' : ''}" onclick="window.setProfileFilter('Series')">Series</button>
                <button class="filter-pill filter-game ${profileFilter === 'Game' ? 'active' : ''}" onclick="window.setProfileFilter('Game')">Games</button>
                <button class="filter-pill filter-book ${profileFilter === 'Book' ? 'active' : ''}" onclick="window.setProfileFilter('Book')">Books</button>
            </div>
        `;

        if (filteredRatedItems.length === 0) {
            ratedCardsHtml = `
                <div class="profile-section">
                    <h2>${isOwnProfile ? 'My Ratings' : 'Ratings'}</h2>
                    ${filterHtml}
                    <p class="text-secondary" style="margin-top: 1.5rem;">No ${profileFilter.toLowerCase()}s found.</p>
                </div>
            `;
        } else {
            ratedCardsHtml = `
                <div class="profile-section">
                    <h2>${isOwnProfile ? 'My Ratings' : 'Ratings'}</h2>
                    ${filterHtml}
                    <div class="grid">
                        ${filteredRatedItems.map(item => {
                const ratingStr = item.rating > 0 ? item.rating + '/10' : 'N/A';
                return `
                            <div class="card">
                                <div class="card-badge"><span class="star-icon">★</span> ${ratingStr}</div>
                                <a href="detail.html?id=${item.id}">
                                    <img src="${item.img || '../images/default-placeholder.jpg'}" alt="${window.escapeHtml(item.title)}">
                                </a>
                                <div class="card-body">
                                    <h3 class="card-title"><a href="detail.html?id=${item.id}">${window.escapeHtml(item.title)}</a></h3>
                                    <div class="card-meta">${window.escapeHtml(item.tags ? item.tags[0] : '')} • ${window.escapeHtml(item.year)}</div>
                                </div>
                            </div>`;
            }).join('')}
                    </div>
                </div>
            `;
        }
    }

    const handle = user.firstName.toLowerCase() + user.lastName.toLowerCase();
    const joinYear = user.joinYear || 2026;
    let avatarHtml = '';
    if (user.avatar && (user.avatar.includes('/') || user.avatar.includes('.'))) {
        avatarHtml = `<img src="${user.avatar}" class="profile-avatar-img" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                      <i class="fa-solid fa-user profile-avatar-icon" style="display:none;"></i>`;
    } else {
        const iconClass = user.avatar || 'fa-solid fa-user';
        avatarHtml = `<i class="${iconClass} profile-avatar-icon"></i>`;
    }

    container.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-container">
                ${avatarHtml}
            </div>
            <div class="profile-info">
                <div class="profile-name-row">
                    <h1 class="profile-name">${window.escapeHtml(user.firstName)} ${window.escapeHtml(user.lastName)}</h1>
                    ${user.role === 'admin' ? '<span class="profile-badge">Admin</span>' : ''}
                </div>
                <div class="profile-meta">
                    @${handle} • Member since ${joinYear}
                </div>
                <div class="profile-bio">
                    "${window.escapeHtml(user.aboutMe || 'No bio provided yet.')}"
                </div>
                <div class="profile-actions" style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${isOwnProfile ? `
                        <button id="edit-profile-btn" class="btn btn-primary" style="background: var(--accent-gradient); border:none;">✍️ Edit Profile</button>
                        <a href="mylist.html" class="btn btn-primary" style="background: rgba(255,255,255,0.05); border:1px solid var(--glass-border);">📋 My List</a>
                    ` : ''}
                </div>
            </div>
        </div>
        ${ratedCardsHtml}
        
        <div class="profile-section">
            <h2>${isOwnProfile ? 'My Comments' : 'Comments'}</h2>
            <div class="reviews-grid" id="profile-comments-grid">
                <!-- Rendered below -->
            </div>
        </div>
    `;

    // Render the user's past comments/reviews grid
    const commentsGrid = document.getElementById('profile-comments-grid');
    if (commentsGrid) {
        if (userComments.length === 0) {
            commentsGrid.innerHTML = `<p class="text-secondary">${isOwnProfile ? "You haven't made any comments yet." : "This user hasn't made any comments yet."}</p>`;
            commentsGrid.style.display = 'block';
        } else {
            commentsGrid.innerHTML = userComments.map(c => {
                const item = db[c.itemId] || {};
                const img = item.img || '../images/default-placeholder.jpg';
                // Convert numerical 1-10 rating to visual star representation
                const stars = c.stars ? '★'.repeat(Math.ceil((c.stars || 0) / 2)) : '';
                const statusBadge = (isOwnProfile && c.status === 'pending') ? '<span class="profile-badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; margin-left:0; font-size:0.7rem; padding:2px 6px;">Pending Approval</span>' : '';

                return `
                <div class="review-card" style="cursor:pointer;" onclick="window.location.href='detail.html?id=${c.itemId}'">
                    <img src="${img}" alt="cover">
                    <div class="review-content">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
                            <div class="review-stars">${stars}</div>
                            ${statusBadge}
                        </div>
                        <div class="review-text">"${window.escapeHtml(c.text)}"</div>
                        <div class="review-author" style="font-weight:600; color:#fff; margin-bottom:2px;">${window.escapeHtml(item.title || 'Unknown Item')}</div>
                        <div class="review-author">${new Date(c.date).toLocaleDateString()}</div>
                    </div>
                </div>
                `;
            }).join('');
        }
    }

    if (!isOwnProfile) return; // Stop here if it's not our own profile

    const delBtn = document.getElementById('delete-account-btn');
    if (delBtn) {

        delBtn.onclick = async () => {
            if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                if (window.deleteOwnAccountWithApi) {
                    await window.deleteOwnAccountWithApi();
                    window.location.href = 'index.html';
                }
            }
        };
    }

    // 3. EDIT PROFILE LOGIC (Only available if this is THEIR profile)
    const editBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const saveBtn = document.getElementById('save-profile-btn');

    if (editBtn && modal) {
        let selectedAvatar = user.avatar || 'fa-solid fa-user';

        editBtn.addEventListener('click', () => {
            document.getElementById('edit-fname').value = user.firstName || '';
            document.getElementById('edit-lname').value = user.lastName || '';
            document.getElementById('edit-bio').value = user.aboutMe || '';
            selectedAvatar = user.avatar || 'fa-solid fa-user';

            // Reset and set active avatar in selector
            const options = modal.querySelectorAll('.avatar-option');
            options.forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-icon') === selectedAvatar) {
                    opt.classList.add('active');
                }
            });

            modal.classList.remove('hidden');
        });

        // Avatar selection click handler
        modal.querySelectorAll('.avatar-option').forEach(opt => {
            opt.onclick = () => {
                modal.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                selectedAvatar = opt.getAttribute('data-icon');
            };
        });

        // Close modal when clicking 'X' or outside the modal box
        closeBtn.onclick = () => modal.classList.add('hidden');
        window.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

        // Handle the profile saving action via API
        saveBtn.onclick = async () => {
            const firstName = document.getElementById('edit-fname').value.trim();
            const lastName = document.getElementById('edit-lname').value.trim();
            const aboutMe = document.getElementById('edit-bio').value.trim();

            if (!firstName || !lastName) {
                window.showToast("Name and surname are required.", "error");
                return;
            }

            // Prevent multiple clicks while saving
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            const res = await window.updateUserProfile(uid, { firstName, lastName, aboutMe, avatar: selectedAvatar });

            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';

            if (res.ok) {
                modal.classList.add('hidden');
                // Refresh profile data and re-render
                await window.cultifyInit();
                window.renderProfile();

                // Show green success alert
                window.showToast('Profile updated successfully!', 'success');
            } else {
                window.showToast("Failed to update profile: " + res.error, "error");
            }
        };
    }
};
