/**
 * Minimalist Cultify Frontend Logic
 */

window.showToast = function (message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;

    let bgColor = '#ef4444'; // default red for error
    if (type === 'success') bgColor = '#10b981'; // green
    if (type === 'info') bgColor = '#3b82f6'; // blue

    Object.assign(alertDiv.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: bgColor,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: '10000',
        transition: 'opacity 0.3s ease',
        fontWeight: '500'
    });

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. WAKE UP THE BACKEND
        // Connect to the server and load the user's data (if they are logged in) 
        // as well as the complete list of movies/series.
        if (typeof window.cultifyInit === 'function') {
            await window.cultifyInit();
        }
    } catch (err) {
        console.error("Backend init info:", err);
        // Do not alert here, as "not logged in" often throws an error in cultifyInit.
    }

    // Skip header/footer on admin page (it has its own sidebar)
    const page = window.location.pathname.split('/').pop() || '';
    if (!page.includes('admin.html')) {
        if (window.renderHeader) window.renderHeader();
        if (window.renderFooter) window.renderFooter();
    }
    routePage();
});


// ==========================================
// ROUTER: routePage()
// Determines which JavaScript functions to execute based on the current URL.
// This mimics a Single Page Application (SPA) feel across multiple HTML files.
// ==========================================
function routePage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    if (page.includes('index.html') || page === '') {
        const params = new URLSearchParams(window.location.search);
        currentSort = params.get('sort') === 'rating' ? 'rating' : 'date';
        renderIndex();
    } else if (page.includes('detail.html')) {
        renderDetail();
    } else if (page.includes('mylist.html')) {
        renderMyList();
    } else if (page.includes('profile.html')) {
        if (window.renderProfile) window.renderProfile();
    } else if (page.includes('login.html')) {
        setupLogin();
    } else if (page.includes('register.html')) {
        setupRegister();
    } else if (page.includes('admin.html')) {
        renderAdmin();
    } else if (page.includes('about.html')) {
        // no setup needed for static about
    }
}

// ==========================================
// THE PAGE BUILDERS (Renderers)
// These functions decide what HTML gets drawn on the screen
// depending on which page the user is currently looking at.
// ==========================================

function createContentCardHtml(item, showRemoveBtn = false) {
    const r = window.getItemAverageRating ? window.getItemAverageRating(item.id) : 0;
    const ratingStr = r > 0 ? r.toFixed(1) : 'N/A';
    return `
    <div class="card">
        <div class="card-badge"><span class="star-icon">★</span> ${ratingStr}</div>
        <a href="detail.html?id=${item.id}">
            <img src="${item.img || '../images/default-placeholder.jpg'}" alt="${window.escapeHtml(item.title)}">
        </a>
        <div class="card-body">
            <h3 class="card-title"><a href="detail.html?id=${item.id}">${window.escapeHtml(item.title)}</a></h3>
            <div class="card-meta">${window.escapeHtml(item.tags ? item.tags[0] : '')} • ${window.escapeHtml(item.year)}</div>
            ${showRemoveBtn ? `<button onclick="window.removeFromList('${item.id}')" class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-top: 0.5rem;">Remove</button>` : ''}
        </div>
    </div>
    `;
}

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'date';


let showAllItems = false;

function renderIndex(categoryFilter = currentCategory, searchQuery = currentSearch) {
    if (categoryFilter !== currentCategory || searchQuery !== currentSearch) {
        showAllItems = false;
    }
    currentCategory = categoryFilter;
    currentSearch = searchQuery;

    const grid = document.getElementById('content-grid');
    if (!grid) return;

    if (window.renderHeroSlider) window.renderHeroSlider();

    const db = window.getContentDB ? window.getContentDB() : {};
    let items = Object.entries(db).map(([id, data]) => ({ id, ...data }));

    // FILTER 1: CATEGORY (e.g., Only show "Movies")
    if (currentCategory !== 'all') {
        items = items.filter(item => item.tags && item.tags[0] === currentCategory);
    }

    // FILTER 2: SEARCH (e.g., Only show items matching "Batman")
    if (currentSearch) {
        const query = currentSearch.toLocaleLowerCase('tr-TR');
        items = items.filter(item => {
            if (item.title.toLocaleLowerCase('tr-TR').includes(query)) return true;
            if (item.tags && item.tags.some(tag => tag.toLocaleLowerCase('tr-TR').includes(query))) return true;
            return false;
        });
    }

    // SORTING (e.g., Newest first, or Highest Rated first)
    if (currentSort === 'date') {
        items.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at) : 0;
            const dateB = b.created_at ? new Date(b.created_at) : 0;
            return dateB - dateA;
        });
    } else {
        items.sort((a, b) => {
            const ratingA = window.getItemAverageRating ? window.getItemAverageRating(a.id) : 0;
            const ratingB = window.getItemAverageRating ? window.getItemAverageRating(b.id) : 0;
            return ratingB - ratingA;
        });
    }

    if (items.length === 0) {
        grid.innerHTML = '<p class="text-secondary" style="grid-column: 1/-1; text-align: center; padding: 3rem; font-size: 1.1rem; border: 1px dashed var(--glass-border); border-radius: 12px;">No content found matching your criteria.</p>';
    } else {
        let displayItems = items;
        let showMoreButton = false;

        if (!showAllItems && items.length > 30) {
            displayItems = items.slice(0, 29);
            showMoreButton = true;
        }

        grid.innerHTML = displayItems.map(item => createContentCardHtml(item, false)).join('');

        if (showMoreButton) {
            grid.innerHTML += `
                <div class="card show-all-card" id="show-all-btn" style="display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed var(--glass-border); background: rgba(255,255,255,0.02);">
                    <div class="text-center" style="padding: 2rem;">
                        <i class="fa-solid fa-plus" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-color);"></i>
                        <div style="font-weight: 700; font-size: 1.1rem;">Show All</div>
                        <div class="text-secondary" style="font-size: 0.85rem; margin-top: 0.5rem;">+${items.length - 29} more items</div>
                    </div>
                </div>
            `;

            // Add listener after DOM is updated
            setTimeout(() => {
                const btn = document.getElementById('show-all-btn');
                if (btn) {
                    btn.onclick = () => {
                        showAllItems = true;
                        renderIndex();
                    };
                }
            }, 0);
        }
    }

    // Setup filter button listeners
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.onclick = (e) => {
            const cat = e.target.getAttribute('data-category');
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentSort = 'rating'; // Reset sort to rating when filtering
            renderIndex(cat, currentSearch);
        };
    });

    // Setup search listener
    const searchInput = document.getElementById('content-search');
    if (searchInput) {
        // Use a simpler approach to avoid multiple listeners if renderIndex is called repeatedly
        searchInput.oninput = (e) => {
            currentSort = 'rating'; // Reset sort to rating when searching
            renderIndex(currentCategory, e.target.value);
        };
        // Preserve value on re-render
        if (searchInput.value !== currentSearch) {
            searchInput.value = currentSearch;
        }
    }

    if (window.cultifyLoadCommunityReviews) {
        window.cultifyLoadCommunityReviews().then(() => renderCommunityReviews());
    }
}

let visibleReviewsCount = 6;
function renderCommunityReviews() {
    const section = document.getElementById('community-reviews-section');
    const grid = document.getElementById('reviews-grid');
    const btnWrap = document.getElementById('load-more-reviews-wrap');
    if (!section || !grid) return;

    const reviews = window.getCommunityReviews ? window.getCommunityReviews() : [];
    if (reviews.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    const db = window.getContentDB ? window.getContentDB() : {};
    const toShow = reviews.slice(0, visibleReviewsCount);

    grid.innerHTML = toShow.map(r => {
        const item = db[r.itemId] || {};
        const img = item.img || '../images/default-placeholder.jpg';
        const stars = '★'.repeat(Math.ceil((r.stars || 0) / 2));
        return `
        <div class="review-card" style="cursor:pointer;" onclick="window.location.href='detail.html?id=${r.itemId}'">
            <img src="${img}" alt="cover">
            <div class="review-content">
                <div class="review-stars">${stars}</div>
                <div class="review-text">"${window.escapeHtml(r.text)}"</div>
                <div class="review-author">- ${window.escapeHtml(r.userName)}</div>
            </div>
        </div>
        `;
    }).join('');

    if (reviews.length > visibleReviewsCount) {
        btnWrap.style.display = 'block';
        const btn = document.getElementById('load-more-reviews-btn');
        if (btn) {
            btn.onclick = () => {
                visibleReviewsCount += 6;
                renderCommunityReviews();
            };
        }
    } else {
        btnWrap.style.display = 'none';
    }
}

function renderMyList() {
    const grid = document.getElementById('mylist-grid');
    if (!grid) return;

    if (!window.isLoggedIn()) {
        window.location.replace('login.html');
        return;
    }

    const uid = window.getCurrentUserId();
    const listIds = window.getUserList ? window.getUserList(uid) : [];
    const db = window.getContentDB ? window.getContentDB() : {};

    if (listIds.length === 0) {
        // Handle empty state gracefully
        grid.innerHTML = '<p>Your list is empty.</p>';
        return;
    }

    // Hydrate IDs into full item objects from the database
    const items = listIds.map(id => ({ id, ...db[id] })).filter(i => i.title);

    // Render the grid using the reusable card template
    grid.innerHTML = items.map(item => createContentCardHtml(item, true)).join('');
}

window.removeFromList = async function (id) {
    const uid = window.getCurrentUserId();
    if (uid) {
        await window.removeFromUserList(uid, id);
        renderMyList(); // Re-render
    }
};


function setupPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
        togglePassword.addEventListener('mouseenter', function () { this.style.opacity = '1'; });
        togglePassword.addEventListener('mouseleave', function () { this.style.opacity = '0.7'; });
    }
}

function setupLogin() {
    setupPasswordToggle();
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        try {
            const user = await window.loginWithApi(email, pass);
            if (user) {
                window.location.href = 'index.html';
            } else {
                window.showToast('Uncorrect password or email', 'error');
            }
        } catch (ex) {
            window.showToast('Error connecting to backend.', 'error');
        }
    });
}

function setupRegister() {
    setupPasswordToggle();
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('fname').value.trim();
        const lastName = document.getElementById('lname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!firstName || !lastName || !email || !password) {
            window.showToast("All fields required.", "error");
            return;
        }

        try {
            const res = await window.registerWithApi({ firstName, lastName, email, password });
            if (res && res.success) {
                window.location.href = 'index.html';
            } else {
                window.showToast(res.message || "Registration failed.", "error");
            }
        } catch (ex) {
            window.showToast('Error connecting to backend.', "error");
        }
    });
}
