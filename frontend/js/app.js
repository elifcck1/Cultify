// ============================================
// CULTIFY — APP.JS
// ============================================

// Determine paths based on location
const toPages = '';
const toRoot = '';

// --- AUTH SYSTEM ---
function isLoggedIn() { return localStorage.getItem('cultify_logged_in') === 'true' && !!getCurrentUserId(); }
function loginUser(user) {
    localStorage.setItem('cultify_logged_in', 'true');
    localStorage.setItem('cultify_user_name', `${user.firstName} ${user.lastName}`);
    localStorage.setItem('cultify_user_role', user.role);
    localStorage.setItem('cultify_user_avatar', user.avatar);
    setCurrentUser(user.id);
}
function logoutUser() {
    localStorage.setItem('cultify_logged_in', 'false');
    localStorage.removeItem('cultify_user_name');
    localStorage.removeItem('cultify_user_role');
    localStorage.removeItem('cultify_user_avatar');
    clearCurrentUser();
}
function showLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) m.classList.add('active');
}
function closeLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) m.classList.remove('active');
}
window.closeLoginModal = closeLoginModal;
window.showLoginModal = showLoginModal;

// Header login/logout toggle
const headerLoggedIn = document.getElementById('header-logged-in');
const headerLoggedOut = document.getElementById('header-logged-out');
if (headerLoggedIn && headerLoggedOut) {
    const navMyListLink = document.getElementById('nav-mylist-link');
    if (isLoggedIn()) {
        headerLoggedIn.style.display = '';
        headerLoggedOut.style.display = 'none';
        if (navMyListLink) navMyListLink.style.display = '';

        const currentUser = getCurrentUser();
        const nameSpan = headerLoggedIn.querySelector('.username');
        if (nameSpan && currentUser) nameSpan.textContent = `${currentUser.firstName} ${currentUser.lastName}`;

        const userIcon = headerLoggedIn.querySelector('i.fa-user');
        if (userIcon && currentUser) {
            userIcon.className = currentUser.avatar;
        }

        const adminItem = headerLoggedIn.querySelector('#admin-nav-item');
        if (adminItem && currentUser) adminItem.style.display = currentUser.role === 'admin' ? 'block' : 'none';
    }
    else {
        headerLoggedIn.style.display = 'none';
        headerLoggedOut.style.display = '';
        if (navMyListLink) navMyListLink.style.display = 'none';
    }
}
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault(); logoutUser(); window.location.href = toRoot + 'index.html';
    });
}

// Global listener to prevent unauthenticated users from viewing profiles
document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('profile.html')) {
        if (!isLoggedIn()) {
            e.preventDefault();
            window.location.href = 'login.html';
        }
    }
});

// Global Rating Helper
function getCardRatingHtml(itemId, title) {
    let rating = 0;
    if (typeof getItemAverageRating === 'function') {
        const r = parseFloat(getItemAverageRating(itemId));
        if (r > 0) rating = r;
    }
    if (rating === 0) {
        return `<div class="card-rating text-secondary fw-bold">N/A</div>`;
    }
    return `<div class="card-rating"><i class="fa-solid fa-star"></i> ${rating.toFixed(1)}</div>`;
}

// --- CONTENT DATABASE ---
let contentDB = getContentDB();

// Sort items by average rating (highest first, unrated last)
function sortByRating(items) {
    return items.sort((a, b) => {
        const rA = parseFloat(getItemAverageRating(a.id)) || 0;
        const rB = parseFloat(getItemAverageRating(b.id)) || 0;
        return rB - rA;
    });
}

// --- FEATURED SECTION (index.html) ---
const sliderWrapper = document.getElementById('main-slider-wrapper');
const booksGrid = document.getElementById('books-grid');
const gamesGrid = document.getElementById('games-grid');
const moviesSeriesGrid = document.getElementById('movies-series-grid');

// Global Search Logic
const searchInput = document.getElementById('global-search');
if (searchInput) {
    // Check if there is a search query in URL
    const urlParamsSearch = new URLSearchParams(window.location.search);
    const searchQuery = urlParamsSearch.get('search');
    if (searchQuery) {
        searchInput.value = searchQuery;
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        // If not on index.html, redirect to index.html with search query
        if (!booksGrid) {
            if (query.length > 0) {
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
            return;
        }

        // If on index.html, perform search
        const q = query.toLowerCase();
        const items = Object.entries(contentDB).map(([id, data]) => ({ id, ...data }));
        const sliderSection = document.querySelector('.split-hero-container');

        const booksSection = booksGrid.closest('.category-section');
        const gamesSection = gamesGrid.closest('.category-section');
        const moviesSection = moviesSeriesGrid.closest('.category-section');
        const moviesHeader = moviesSection.querySelector('.category-header');

        if (q.length > 0) {
            if (sliderSection) sliderSection.style.display = 'none';
            if (booksSection) booksSection.style.display = 'none';
            if (gamesSection) gamesSection.style.display = 'none';

            if (moviesHeader) {
                moviesHeader.querySelector('h3').innerHTML = `<i class="fa-solid fa-magnifying-glass me-2 text-accent"></i>Search Results for "${q}"`;
                moviesHeader.querySelector('p').style.display = 'none';
                moviesHeader.querySelector('a').style.display = 'none';
            }
            const filtered = sortByRating(items.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.creator.toLowerCase().includes(q) ||
                item.tags.some(t => t.toLowerCase().includes(q))
            ));
            renderGrid(filtered, moviesSeriesGrid);
        } else {
            if (sliderSection) sliderSection.style.display = 'block';
            if (booksSection) booksSection.style.display = 'block';
            if (gamesSection) gamesSection.style.display = 'block';

            if (moviesHeader) {
                moviesHeader.querySelector('h3').innerHTML = `<i class="fa-solid fa-film me-2 text-success"></i>Movies & Series`;
                moviesHeader.querySelector('p').style.display = 'block';
                moviesHeader.querySelector('a').style.display = 'block';
            }

            // Re-render initial data
            const booksItems = sortByRating(items.filter(item => item.tags[0] === 'Book'));
            const gamesItems = sortByRating(items.filter(item => item.tags[0] === 'Game'));
            const msItems = sortByRating(items.filter(item => item.tags[0] === 'Movie' || item.tags[0] === 'Series'));

            renderGrid(booksItems.slice(0, 5), booksGrid);
            renderGrid(gamesItems.slice(0, 5), gamesGrid);
            renderGrid(msItems.slice(0, 5), moviesSeriesGrid);

            // Remove search from URL if present
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    });
}

function renderGrid(data, targetGrid) {
    if (!targetGrid) return;
    if (data.length === 0) {
        targetGrid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-secondary">No results found for your search.</p></div>`;
        return;
    }
    targetGrid.innerHTML = data.map(r => `
        <div onclick="toggleCard(this, '${r.id}')" class="category-card">
            ${getCardRatingHtml(r.id, r.title)}
            <img src="${r.img}" alt="${r.title}">
            <div class="category-card-body">
                <div class="category-card-title">${r.title}</div>
                <div class="category-card-meta">${r.tags[0]} • ${r.creator} • ${r.year}</div>
            </div>
        </div>
    `).join('');
}

if (sliderWrapper && booksGrid) {
    const items = Object.entries(contentDB).map(([id, data]) => ({ id, ...data }));

    // Top 5 items for the slider (ONLY MOVIES)
    const movieItems = items.filter(item => item.tags[0] === 'Movie');
    const shuffledMovies = [...movieItems].sort(() => 0.5 - Math.random());
    const sliderItems = shuffledMovies.slice(0, 5);
    sliderWrapper.innerHTML = sliderItems.map(item => `
        <div class="swiper-slide">
            <div class="main-slider-item" style="background-image: url('${item.img}')">
                <div class="slider-content">
                    <h2 class="slider-title">${item.title}</h2>
                    <p class="slider-desc">${item.desc.substring(0, 120)}...</p>
                    <div class="slider-meta">
                        ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <div class="mt-4">
                        <a href="detail.html?id=${item.id}" class="btn btn-primary px-4 py-2" style="background: var(--accent); border: none; font-weight: 600;">View Details</a>
                        <button onclick="globalAddToList('${item.id}', this)" class="btn btn-outline-light ms-3 px-4 py-2" style="border-radius: 8px;">+ Add to List</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Search logic will execute via the event listener but we need to trigger it if there is a URL param
    if (searchInput && searchInput.value) {
        searchInput.dispatchEvent(new Event('input'));
    } else {
        // Initial Render
        const booksItems = sortByRating(items.filter(item => item.tags[0] === 'Book'));
        const gamesItems = sortByRating(items.filter(item => item.tags[0] === 'Game'));
        const msItems = sortByRating(items.filter(item => item.tags[0] === 'Movie' || item.tags[0] === 'Series'));

        renderGrid(booksItems.slice(0, 5), booksGrid);
        renderGrid(gamesItems.slice(0, 5), gamesGrid);
        renderGrid(msItems.slice(0, 5), moviesSeriesGrid);
    }

    // Initialize Swiper
    new Swiper('.main-slider', {
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true }
    });
}

window.toggleCard = function (element, id) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('.expanded-actions')) return;

    const isExpanded = element.classList.contains('expanded');

    // Close others
    document.querySelectorAll('.category-card.expanded, .featured-hero.expanded').forEach(el => {
        if (el !== element) {
            el.classList.remove('expanded');
            const content = el.querySelector('.card-expanded-content');
            if (content) content.remove();
        }
    });

    if (isExpanded) {
        element.classList.remove('expanded');
        const content = element.querySelector('.card-expanded-content');
        if (content) content.remove();
    } else {
        element.classList.add('expanded');
        const item = contentDB[id];

        let inList = false;
        const uid = getCurrentUserId();
        if (uid) {
            const list = getUserList(uid);
            inList = list.includes(id);
        }
        const btnHtml = inList
            ? `<button class="card-action-btn card-action-added" onclick="globalAddToList('${id}', this)"><i class="fa-solid fa-check me-2"></i>In List</button>`
            : `<button class="card-action-btn card-action-add" onclick="globalAddToList('${id}', this)"><i class="fa-solid fa-plus me-2"></i>Add to List</button>`;

        const expandedHtml = `
            <div class="card-expanded-content">
                <div class="expanded-desc">${item.desc}</div>
                <div class="meta-row" style="margin: 12px 0;">
                    <div class="meta-item" style="font-size: 0.8rem;"><i class="fa-solid fa-user-shield" style="font-size: 0.9rem;"></i> ${item.age}</div>
                    <div class="meta-item" style="font-size: 0.8rem;"><i class="fa-regular fa-clock" style="font-size: 0.9rem;"></i> ${item.length}</div>
                </div>
                <div class="expanded-actions" style="display:flex; gap:12px; margin-top:16px;">
                    ${btnHtml}
                    <a href="detail.html?id=${id}" class="card-action-btn card-action-details">Details</a>
                </div>
            </div>
        `;

        if (element.classList.contains('featured-hero')) {
            element.querySelector('.featured-hero-overlay').insertAdjacentHTML('beforeend', expandedHtml);
        } else {
            element.querySelector('.category-card-body').insertAdjacentHTML('beforeend', expandedHtml);
        }
    }
}

window.globalAddToList = function (id, btn) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }
    const uid = getCurrentUserId();
    let list = getUserList(uid);
    if (!list.includes(id)) {
        addToUserList(uid, id);
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
            btn.className = 'btn btn-outline-light ms-3 px-4 py-2';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'auto';
        }
    } else {
        removeFromUserList(uid, id);
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-plus me-2"></i>Add to List';
            btn.className = 'btn btn-primary ms-3 px-4 py-2';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    }
}

window.toggleMyList = function (event, id, btn) {
    event.stopPropagation();
    event.preventDefault();

    if (!isLoggedIn()) {
        alert('Please log in to add items to your list!');
        window.location.href = 'login.html';
        return;
    }

    const uid = getCurrentUserId();
    let list = getUserList(uid);
    if (!list.includes(id)) {
        addToUserList(uid, id);
        btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
        btn.className = 'card-action-btn card-action-added';
    } else {
        removeFromUserList(uid, id);
        btn.innerHTML = '<i class="fa-solid fa-plus me-2"></i>Add to List';
        btn.className = 'card-action-btn card-action-add';
    }
}

// --- REVIEWS SECTION (index.html) ---
const reviewsContainer = document.getElementById('reviews-container');

if (reviewsContainer) {
    const allReviews = getCommunityReviews();
    // Shuffle all reviews once
    for (let i = allReviews.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[allReviews[i], allReviews[j]] = [allReviews[j], allReviews[i]]; }

    let reviewsShown = 0;
    const REVIEWS_PER_PAGE = 6;
    const loadMoreContainer = document.getElementById('load-more-reviews-container');
    const loadMoreBtn = document.getElementById('load-more-reviews-btn');

    function renderReviewBatch() {
        const batch = allReviews.slice(reviewsShown, reviewsShown + REVIEWS_PER_PAGE);
        batch.forEach(rev => {
            const item = contentDB[rev.itemId];
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
                <div class="d-flex gap-3 p-3 h-100" style="background: rgba(19, 27, 44, 0.45); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; transition: transform 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
                    <div style="width: 100px; flex-shrink: 0; cursor: pointer;" onclick="window.location.href='detail.html?id=${rev.itemId}'">
                        <img src="${item ? item.img : ''}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <div class="text-warning mb-2" style="font-size: 0.8rem;">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(rev.stars)}
                        </div>
                        <p class="text-light mb-2" style="font-size: 0.9rem; font-style: italic; line-height: 1.4;">"${rev.text}"</p>
                        <a href="profile.html?user=${rev.userHandle}" class="text-secondary fw-bold text-decoration-none" style="font-size: 0.8rem;">- ${rev.userName}</a>
                    </div>
                </div>
            `;
            col.style.opacity = '0';
            col.style.transform = 'translateY(20px)';
            col.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            reviewsContainer.appendChild(col);
            requestAnimationFrame(() => {
                col.style.opacity = '1';
                col.style.transform = 'translateY(0)';
            });
        });
        reviewsShown += batch.length;

        if (loadMoreContainer) {
            if (reviewsShown < allReviews.length) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
    }

    renderReviewBatch();

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderReviewBatch);
        loadMoreBtn.addEventListener('mouseenter', function () {
            this.style.background = 'var(--accent)';
            this.style.color = 'var(--bg-primary)';
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.4)';
        });
        loadMoreBtn.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(168, 85, 247, 0.1)';
            this.style.color = 'var(--accent)';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
}

// --- DETAIL PAGE LOGIC ---
const detailIdParams = new URLSearchParams(window.location.search);
const currentId = detailIdParams.get('id');
const detailTitleEl = document.getElementById('detail-title');
if (detailTitleEl && currentId) {
    const itemData = contentDB[currentId];
    if (itemData) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = `${itemData.title} — Cultify`;
        detailTitleEl.textContent = itemData.title;
        const yearEl = document.getElementById('detail-year');
        if (yearEl) yearEl.textContent = itemData.year;
        const lengthEl = document.getElementById('detail-length');
        if (lengthEl) lengthEl.textContent = itemData.length;
        const creatorEl = document.getElementById('detail-creator');
        if (creatorEl) creatorEl.textContent = itemData.creator;
        const ageEl = document.getElementById('detail-age');
        if (ageEl) ageEl.textContent = itemData.age;
        const descEl = document.getElementById('detail-desc');
        if (descEl) descEl.textContent = itemData.desc;
        const imgEl = document.getElementById('detail-image');
        if (imgEl && itemData.img) imgEl.src = itemData.img;
        const tagsContainer = document.getElementById('detail-tags');
        if (tagsContainer) tagsContainer.innerHTML = itemData.tags.map((tag, i) => `<span class="tag tag-color-${(i % 3) + 1}">${tag}</span>`).join('');

        const avgRatingEl = document.getElementById('detail-average-rating');
        if (avgRatingEl) {
            const avg = getItemAverageRating(currentId);
            avgRatingEl.textContent = avg == 0 ? 'N/A' : avg;
        }
    }
}

// --- ADD TO LIST (user-based via testData) ---
const addListBtn = document.querySelector('.btn-add-list');
if (addListBtn) {
    const userId = getCurrentUserId();
    if (userId && currentId) {
        const myList = getUserList(userId);
        if (myList.includes(currentId)) {
            addListBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
            addListBtn.style.backgroundColor = 'var(--accent)';
            addListBtn.style.color = 'var(--bg-primary)';
        }
    }
    addListBtn.addEventListener('click', function () {
        if (!isLoggedIn()) { showLoginModal(); return; }
        const uid = getCurrentUserId();
        if (currentId && uid) {
            const list = getUserList(uid);
            if (!list.includes(currentId)) {
                addToUserList(uid, currentId);
                this.innerHTML = '<i class="fa-solid fa-check me-2"></i>In List';
                this.style.backgroundColor = 'var(--accent)';
                this.style.color = 'var(--bg-primary)';
            }
        }
    });
}

// --- DYNAMIC COMMENTS (detail page) ---
const detailCommentsContainer = document.getElementById('detail-comments-container');
if (detailCommentsContainer && currentId) {
    function renderComments() {
        const comments = getCommentsForItem(currentId);
        const loggedUserId = getCurrentUserId();
        detailCommentsContainer.innerHTML = '';
        comments.forEach(c => {
            const user = getUserById(c.userId);
            const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
            const userHandle = user ? (user.firstName + user.lastName).toLowerCase().replace(/\s/g, '') : 'unknown';
            const userAvatar = user ? user.avatar : 'fa-solid fa-user';
            const isOwn = loggedUserId && c.userId === loggedUserId;
            const editBtn = isOwn ? `<button class="btn btn-sm btn-outline-secondary ms-2" style="font-size:0.7rem; padding:2px 8px; border-radius:6px;" onclick="editMyComment('${currentId}', '${c.id}', this)"><i class="fa-solid fa-pen-to-square"></i></button>` : '';
            const commentEl = document.createElement('div');
            commentEl.className = 'comment-item';
            commentEl.innerHTML = `<div class="comment-avatar"><i class="${userAvatar}"></i></div><div style="flex:1;"><div style="display:flex;align-items:center;"><a href="profile.html?user=${userHandle}" class="comment-username" style="text-decoration: none;">${userName}</a>${editBtn}</div><div class="comment-text">${c.text}</div></div>`;
            detailCommentsContainer.appendChild(commentEl);
        });
    }
    renderComments();
}

window.editMyComment = function(itemId, commentId, btn) {
    const newText = prompt('Edit your comment:');
    if (newText !== null && newText.trim().length > 0) {
        editComment(itemId, commentId, newText.trim());
        alert('Your edited comment has been resubmitted and is pending admin approval.');
        // Re-render to remove the now-pending comment from view
        if (detailCommentsContainer && currentId) {
            const comments = getCommentsForItem(currentId);
            const loggedUserId = getCurrentUserId();
            detailCommentsContainer.innerHTML = '';
            comments.forEach(c => {
                const user = getUserById(c.userId);
                const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
                const userHandle = user ? (user.firstName + user.lastName).toLowerCase().replace(/\s/g, '') : 'unknown';
                const userAvatar = user ? user.avatar : 'fa-solid fa-user';
                const isOwn = loggedUserId && c.userId === loggedUserId;
                const editBtn = isOwn ? `<button class="btn btn-sm btn-outline-secondary ms-2" style="font-size:0.7rem; padding:2px 8px; border-radius:6px;" onclick="editMyComment('${currentId}', '${c.id}', this)"><i class="fa-solid fa-pen-to-square"></i></button>` : '';
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.innerHTML = `<div class="comment-avatar"><i class="${userAvatar}"></i></div><div style="flex:1;"><div style="display:flex;align-items:center;"><a href="profile.html?user=${userHandle}" class="comment-username" style="text-decoration: none;">${userName}</a>${editBtn}</div><div class="comment-text">${c.text}</div></div>`;
                detailCommentsContainer.appendChild(commentEl);
            });
        }
    }
};

const commentSendBtn = document.querySelector('.comment-send-btn');
if (commentSendBtn) {
    commentSendBtn.addEventListener('click', function () {
        if (!isLoggedIn()) { showLoginModal(); return; }
        const input = document.querySelector('.comment-input-wrapper input');
        if (input && input.value.trim() && currentId) {
            const uid = getCurrentUserId();
            addComment(currentId, uid, input.value.trim());
            input.value = '';
            alert('Your comment has been submitted and is pending admin approval.');
            // Re-render comments
            if (detailCommentsContainer) {
                const comments = getCommentsForItem(currentId);
                const loggedUserId = getCurrentUserId();
                detailCommentsContainer.innerHTML = '';
                comments.forEach(c => {
                    const user = getUserById(c.userId);
                    const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
                    const userHandle = user ? (user.firstName + user.lastName).toLowerCase().replace(/\s/g, '') : 'unknown';
                    const userAvatar = user ? user.avatar : 'fa-solid fa-user';
                    const isOwn = loggedUserId && c.userId === loggedUserId;
                    const editBtn = isOwn ? `<button class="btn btn-sm btn-outline-secondary ms-2" style="font-size:0.7rem; padding:2px 8px; border-radius:6px;" onclick="editMyComment('${currentId}', '${c.id}', this)"><i class="fa-solid fa-pen-to-square"></i></button>` : '';
                    const commentEl = document.createElement('div');
                    commentEl.className = 'comment-item';
                    commentEl.innerHTML = `<div class="comment-avatar"><i class="${userAvatar}"></i></div><div style="flex:1;"><div style="display:flex;align-items:center;"><a href="profile.html?user=${userHandle}" class="comment-username" style="text-decoration: none;">${userName}</a>${editBtn}</div><div class="comment-text">${c.text}</div></div>`;
                    detailCommentsContainer.appendChild(commentEl);
                });
            }
        }
    });
}

// --- STAR RATING (user-based via testData) ---
const stars = document.querySelectorAll('.star-rating i');
if (stars.length > 0) {
    // Load existing rating for current user
    const ratingUserId = getCurrentUserId();
    if (ratingUserId && currentId) {
        const existingRating = getRating(ratingUserId, currentId);
        if (existingRating > 0) {
            stars.forEach((s, i) => { if (i < existingRating) s.classList.add('active'); else s.classList.remove('active'); });
        } else {
            stars.forEach(s => s.classList.remove('active'));
        }
    } else {
        stars.forEach(s => s.classList.remove('active'));
    }

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            if (!isLoggedIn()) { showLoginModal(); return; }
            const uid = getCurrentUserId();
            const currentExistingRating = getRating(uid, currentId);
            let rating = index + 1;

            // If clicking the same rating, toggle it off
            if (currentExistingRating === rating) {
                rating = 0;
            }

            setRating(uid, currentId, rating);

            if (rating > 0) {
                stars.forEach((s, i) => { if (i < rating) s.classList.add('active'); else s.classList.remove('active'); });
            } else {
                stars.forEach(s => s.classList.remove('active'));
            }
        });
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => { s.style.color = i <= index ? '#fbbf24' : ''; });
        });
    });
    const ratingContainer = document.querySelector('.star-rating');
    if (ratingContainer) ratingContainer.addEventListener('mouseleave', () => { stars.forEach(s => { s.style.color = ''; }); });
}

// --- MY LIST PAGE (user-based) ---
const mylistGrid = document.getElementById('mylist-grid');
if (mylistGrid) {
    const userId = getCurrentUserId();
    const list = userId ? getUserList(userId) : [];
    const emptyEl = document.getElementById('mylist-empty');
    if (list.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        mylistGrid.style.display = 'none';
    } else {
        if (emptyEl) emptyEl.style.display = 'none';
        mylistGrid.innerHTML = list.map(id => {
            const item = contentDB[id];
            if (!item) return '';
            return `<div class="mylist-card" data-id="${id}"><button class="mylist-remove-btn" onclick="removeFromList(event, '${id}')"><i class="fa-solid fa-xmark"></i></button><a href="detail.html?id=${id}" class="text-decoration-none">${getCardRatingHtml(id, item.title)}<img src="${item.img}" alt="${item.title}"><div class="mylist-card-body"><div class="mylist-card-title">${item.title}</div><div class="mylist-card-meta">${item.tags[0]} • ${item.creator} • ${item.year}</div></div></a></div>`;
        }).join('');
    }
}
window.removeFromList = function (event, id) {
    event.stopPropagation();
    event.preventDefault();
    const uid = getCurrentUserId();
    if (uid) {
        removeFromUserList(uid, id);
    }
    location.reload();
};

// --- LOGIN FORM (via testData) ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        const user = getUser(email, pass);
        if (user) {
            loginUser(user);
            alert(`Login successful! Welcome, ${user.firstName}.`);
            window.location.href = toRoot + 'index.html';
        } else {
            alert('Invalid credentials! Please check your email and password.');
        }
    });
}

// --- REGISTER FORM (via testData) ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            avatarOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = registerForm.querySelectorAll('.auth-input');
        const firstName = inputs[0] ? inputs[0].value.trim() : '';
        const lastName = inputs[1] ? inputs[1].value.trim() : '';
        const email = inputs[2] ? inputs[2].value.trim() : '';
        const password = inputs[3] ? inputs[3].value.trim() : '';

        if (!firstName || !lastName || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        const selectedAvatar = document.querySelector('.avatar-option.selected i');
        const avatar = selectedAvatar ? selectedAvatar.className : 'fa-solid fa-user';

        const result = registerUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            avatar: avatar
        });

        if (result.success) {
            loginUser(result.user);
            alert(`Registration successful! Welcome, ${result.user.firstName}.`);
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    });
}

// --- PROFILE PICTURE EDIT (Settings) ---
const settingAvatarCircle = document.getElementById('setting-avatar-circle');
const editBtn = document.getElementById('setting-avatar-edit-btn');
const approveBtn = document.getElementById('setting-avatar-approve-btn');
const selectionGrid = document.getElementById('setting-avatar-selection-grid');

// Init Avatar from current user
function initAvatar() {
    const currentUser = getCurrentUser();
    const avatarClass = currentUser ? currentUser.avatar : (localStorage.getItem('cultify_user_avatar') || 'fa-solid fa-user');
    if (settingAvatarCircle) settingAvatarCircle.innerHTML = `<i class="${avatarClass}"></i>`;
    const profilePageAvatar = document.querySelector('.profile-avatar-circle');
    if (profilePageAvatar && !settingAvatarCircle) profilePageAvatar.innerHTML = `<i class="${avatarClass}"></i>`;
}
initAvatar();

if (editBtn && approveBtn && selectionGrid) {
    const avatarOpts = selectionGrid.querySelectorAll('.avatar-option');
    const currentUser = getCurrentUser();
    let tempAvatar = currentUser ? currentUser.avatar : 'fa-solid fa-user';

    avatarOpts.forEach(o => {
        if (o.querySelector('i').className === tempAvatar) o.classList.add('selected');
        else o.classList.remove('selected');
    });

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        selectionGrid.style.display = 'block';
        approveBtn.style.display = 'block';
        editBtn.style.display = 'none';
    });

    avatarOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            avatarOpts.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            tempAvatar = opt.querySelector('i').className;
            settingAvatarCircle.innerHTML = `<i class="${tempAvatar}"></i>`;
        });
    });

    approveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const uid = getCurrentUserId();
        if (uid) {
            updateUser(uid, { avatar: tempAvatar });
            localStorage.setItem('cultify_user_avatar', tempAvatar);
        }
        selectionGrid.style.display = 'none';
        approveBtn.style.display = 'none';
        editBtn.style.display = 'block';
        alert('Avatar updated successfully!');

        const userIcon = document.querySelector('#header-logged-in i.fa-user, #header-logged-in i[class*="fa-user-"]');
        if (userIcon) userIcon.className = tempAvatar;
    });
}

// --- ACCOUNT DELETE ---
const deleteBtn = document.getElementById('delete-account');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete your account?')) {
            const uid = getCurrentUserId();
            if (uid) deleteUser(uid);
            logoutUser();
            alert('Your account has been deleted.');
            window.location.href = 'index.html';
        }
    });
}

// --- ACCOUNT UPDATE ---
const updateBtn = document.getElementById('update-account');
if (updateBtn) {
    updateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const uid = getCurrentUserId();
        if (!uid) return;
        const firstName = document.getElementById('setting-firstname');
        const lastName = document.getElementById('setting-lastname');
        const username = document.getElementById('setting-username');
        const aboutMe = document.getElementById('setting-aboutme');
        const updates = {};
        if (firstName && firstName.value.trim()) updates.firstName = firstName.value.trim();
        if (lastName && lastName.value.trim()) updates.lastName = lastName.value.trim();
        if (aboutMe && aboutMe.value.trim()) updates.aboutMe = aboutMe.value.trim();
        updateUser(uid, updates);
        if (updates.firstName || updates.lastName) {
            const name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
            localStorage.setItem('cultify_user_name', name);
        }
        alert('Account updated successfully!');
    });
}


// --- AVATAR SELECTION ---
const avatarOptions = document.querySelectorAll('.avatar-option');
if (avatarOptions.length > 0) { avatarOptions.forEach(o => { o.addEventListener('click', () => { avatarOptions.forEach(x => x.classList.remove('selected')); o.classList.add('selected'); }); }); }

// --- FILTER TABS ---
const filterTabs = document.querySelectorAll('.filter-tab');
if (filterTabs.length > 0) { filterTabs.forEach(tab => { tab.addEventListener('click', () => { filterTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); }); }); }

// --- CATEGORY PAGE ---
const urlParams = new URLSearchParams(window.location.search);
const categoryType = urlParams.get('type');
const categoryNameEl = document.getElementById('category-name');
const categoryIconEl = document.getElementById('category-icon');
if (categoryNameEl && categoryType) {
    const categoryConfig = { games: { name: 'Games', icon: 'fa-gamepad' }, movies: { name: 'Movies & Series', icon: 'fa-film' }, books: { name: 'Books', icon: 'fa-book' } };
    const config = categoryConfig[categoryType];
    if (config) {
        categoryNameEl.textContent = config.name;
        if (categoryIconEl) categoryIconEl.className = `fa-solid ${config.icon} me-2 text-accent`;
        document.title = `${config.name} — Cultify`;
    }
    const allGrids = document.querySelectorAll('[id^="grid-"]');
    allGrids.forEach(grid => { grid.style.display = 'none'; });
    const activeGrid = document.getElementById(`grid-${categoryType}`);
    if (activeGrid) activeGrid.style.display = '';
}

// --- SWIPER (Profile) ---
const profileSwiperEl = document.querySelector(".profileSwiper");
if (profileSwiperEl) { new Swiper(".profileSwiper", { slidesPerView: 2, spaceBetween: 15, grabCursor: true, breakpoints: { 768: { slidesPerView: 4, spaceBetween: 20 } } }); }

// --- CATEGORY PAGE DYNAMIC GRID ---
const gridBooks = document.getElementById('grid-books');
const gridGames = document.getElementById('grid-games');
const gridMovies = document.getElementById('grid-movies');

if (gridBooks || gridGames || gridMovies) {
    function renderCategoryGrid(grid, filterTag) {
        if (!grid) return;
        const items = sortByRating(Object.entries(contentDB)
            .filter(([_, data]) => data.tags[0] === filterTag)
            .map(([id, data]) => ({ id, ...data })));
        grid.innerHTML = items.map(item => `
            <div onclick="toggleCard(this, '${item.id}')" class="category-card">
                ${getCardRatingHtml(item.id, item.title)}
                <img src="${item.img}" alt="${item.title}">
                <div class="category-card-body">
                    <div class="category-card-title">${item.title}</div>
                    <div class="category-card-meta">${item.creator} • ${item.year}</div>
                </div>
            </div>
        `).join('');
    }
    renderCategoryGrid(gridBooks, 'Book');
    renderCategoryGrid(gridGames, 'Game');
    // Movies grid includes both Movie and Series
    if (gridMovies) {
        const movieSeriesItems = sortByRating(Object.entries(contentDB)
            .filter(([_, data]) => data.tags[0] === 'Movie' || data.tags[0] === 'Series')
            .map(([id, data]) => ({ id, ...data })));
        gridMovies.innerHTML = movieSeriesItems.map(item => `
            <div onclick="toggleCard(this, '${item.id}')" class="category-card">
                ${getCardRatingHtml(item.id, item.title)}
                <img src="${item.img}" alt="${item.title}">
                <div class="category-card-body">
                    <div class="category-card-title">${item.title}</div>
                    <div class="category-card-meta">${item.creator} • ${item.year}</div>
                </div>
            </div>
        `).join('');
    }
}
// --- PROFILE PAGE DYNAMICS ---
const profileMyListContainer = document.getElementById('profile-mylist-container');
const profileReviewsContainer = document.getElementById('profile-reviews-container');
const profileGamesStat = document.getElementById('profile-games-stat');
const profileMoviesStat = document.getElementById('profile-movies-stat');
const profileBooksStat = document.getElementById('profile-books-stat');

if (profileMyListContainer || profileReviewsContainer) {
    const currentUid = getCurrentUserId();
    const myListIds = currentUid ? getUserList(currentUid) : [];
    if (profileMyListContainer) {
        if (myListIds.length === 0) {
            profileMyListContainer.innerHTML = `<div class="text-center w-100 text-secondary py-4 fst-italic" style="grid-column: 1/-1;">Your list is currently empty.</div>`;
            profileMyListContainer.classList.remove('swiper-wrapper'); // Remove wrapper class if empty so text centers properly
            profileMyListContainer.style.display = 'block';
        } else {
            const displayItems = myListIds.slice(0, 4);
            profileMyListContainer.innerHTML = displayItems.map(id => {
                const item = contentDB[id];
                if (!item) return '';
                return `<div class="swiper-slide"><img src="${item.img}" class="mini-book-cover" alt="${item.title}" style="cursor:pointer; width:100px; height:140px; object-fit:cover; border-radius:8px;" onclick="window.location.href='detail.html?id=${id}'"></div>`;
            }).join('');
        }
    }

    // 2. Fetch User Reviews
    let userReviews = JSON.parse(localStorage.getItem('cultify_user_reviews') || '[]');

    // 3. Render Reviews
    if (profileReviewsContainer) {
        if (userReviews.length === 0) {
            profileReviewsContainer.innerHTML = `<div class="text-center w-100 text-secondary py-4 fst-italic">You haven't written any reviews yet.</div>`;
        } else {
            profileReviewsContainer.innerHTML = userReviews.map(rev => {
                const item = contentDB[rev.itemId];
                if (!item) return '';
                return `
                    <div class="col-md-6 col-lg-4">
                        <div class="d-flex gap-3 p-3 h-100" style="background: rgba(19, 27, 44, 0.45); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
                            <div style="width: 100px; flex-shrink: 0; cursor: pointer;" onclick="window.location.href='detail.html?id=${rev.itemId}'">
                                <img src="${item.img}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div class="d-flex flex-column justify-content-center w-100">
                                <div class="text-warning mb-2" style="font-size: 0.8rem;">
                                    ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating)}${'<i class="fa-regular fa-star"></i>'.repeat(5 - rev.rating)}
                                </div>
                                <p class="text-white small fst-italic mb-2" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                    "${rev.text}"
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 4. Calculate Stats & Prepare Modal Data
    const categoryData = { games: [], movies: [], books: [] };

    userReviews.forEach(rev => {
        const item = contentDB[rev.itemId];
        if (item) {
            if (item.tags[0] === 'Game') categoryData.games.push({ id: rev.itemId, ...item, rating: rev.rating });
            else if (item.tags[0] === 'Movie' || item.tags[0] === 'Series') categoryData.movies.push({ id: rev.itemId, ...item, rating: rev.rating });
            else if (item.tags[0] === 'Book') categoryData.books.push({ id: rev.itemId, ...item, rating: rev.rating });
        }
    });

    if (profileGamesStat) profileGamesStat.textContent = categoryData.games.length;
    if (profileMoviesStat) profileMoviesStat.textContent = categoryData.movies.length;
    if (profileBooksStat) profileBooksStat.textContent = categoryData.books.length;

    // 5. Stats Modals Logic
    const statsModal = document.getElementById('stats-modal');
    const closeStatsModal = document.getElementById('close-stats-modal');
    const statsModalTitle = document.getElementById('stats-modal-title');
    const statsModalContent = document.getElementById('stats-modal-content');

    function openStatsModal(category, title) {
        if (!statsModal) return;
        statsModalTitle.textContent = title;
        const items = categoryData[category];

        if (items.length === 0) {
            statsModalContent.innerHTML = `<div class="text-center text-secondary py-5">No ${title.toLowerCase()} rated yet.</div>`;
        } else {
            statsModalContent.innerHTML = items.map(item => `
                <div class="d-flex align-items-center p-3" style="background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <img src="${item.img}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 6px; cursor:pointer;" onclick="window.location.href='detail.html?id=${item.id}'">
                    <div class="ms-3 flex-grow-1">
                        <h6 class="text-white mb-1" style="cursor:pointer;" onclick="window.location.href='detail.html?id=${item.id}'">${item.title}</h6>
                        <div class="text-warning small mb-1">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(item.rating)}${'<i class="fa-regular fa-star"></i>'.repeat(5 - item.rating)}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        statsModal.style.display = 'flex';
    }

    const cardGames = document.getElementById('profile-games-card');
    const cardMovies = document.getElementById('profile-movies-card');
    const cardBooks = document.getElementById('profile-books-card');

    if (cardGames) cardGames.addEventListener('click', () => openStatsModal('games', 'Games'));
    if (cardMovies) cardMovies.addEventListener('click', () => openStatsModal('movies', 'Movies & Series'));
    if (cardBooks) cardBooks.addEventListener('click', () => openStatsModal('books', 'Books'));

    if (closeStatsModal) closeStatsModal.addEventListener('click', () => statsModal.style.display = 'none');
    if (statsModal) statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) statsModal.style.display = 'none';
    });
}

// --- STARS BACKGROUND ---
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-bg-container';

    // Add 3 layers of stars
    for (let i = 1; i <= 3; i++) {
        const layer = document.createElement('div');
        layer.className = `star-layer star-layer-${i}`;

        let boxShadows = [];
        const numStars = i === 1 ? 150 : (i === 2 ? 75 : 30); // More small stars, fewer big stars
        for (let j = 0; j < numStars; j++) {
            const x = Math.floor(Math.random() * 100);
            const y = Math.floor(Math.random() * 100);
            boxShadows.push(`${x}vw ${y}vh #fff`);
        }

        layer.style.boxShadow = boxShadows.join(', ');

        // Duplicate layer for seamless scrolling animation
        const layerAfter = document.createElement('div');
        layerAfter.className = `star-layer star-layer-${i} after`;
        layerAfter.style.boxShadow = boxShadows.join(', ');

        starsContainer.appendChild(layer);
        starsContainer.appendChild(layerAfter);
    }

    // Insert behind everything
    document.body.prepend(starsContainer);
}
// Run on load
document.addEventListener('DOMContentLoaded', createStars);
