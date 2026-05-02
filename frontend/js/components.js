// ============================================
// CULTIFY — COMPONENTS.JS
// Web Components for reusable Header and Footer
// ============================================

const pathPrefix = '';
const rootPrefix = '';
const imagePrefix = '../images/';

const AppHeaderHTML = `
    <header class="sticky-top">
        <div class="header-left">
            <a href="${rootPrefix}index.html"><img src="${imagePrefix}main-logo.svg" alt="Cultify" class="logo-image"></a>
            <div class="logo"><a href="${rootPrefix}index.html">Cultify</a></div>
        </div>
        <nav class="header-center">
            <a href="${rootPrefix}index.html">Discover</a>
            <a href="${pathPrefix}category.html?type=movies">Movies</a>
            <a href="${pathPrefix}category.html?type=books">Books</a>
            <a href="${pathPrefix}category.html?type=games">Games</a>
            <a href="${pathPrefix}mylist.html" id="nav-mylist-link" style="display:none;">My List</a>
        </nav>
        <div class="header-right">
            <div class="search-bar position-relative align-items-center">
                <i class="fa-solid fa-magnifying-glass position-absolute text-muted" style="left: 15px; pointer-events: none;"></i>
                <input type="text" id="global-search" placeholder="Search movies, books, games..." style="padding-left: 40px;">
            </div>
            
            <!-- Logged-in state -->
            <div class="user-profile" id="header-logged-in" style="display: none;">
                <div class="dropdown">
                    <button class="nav-icon-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fa-regular fa-user"></i>
                        <span class="username ms-2 d-none d-sm-inline">User</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg">
                        <li><a class="dropdown-item" href="${pathPrefix}profile.html"><i class="fa-solid fa-circle-user me-2"></i>Profile</a></li>
                        <li><a class="dropdown-item" href="${pathPrefix}setting.html"><i class="fa-solid fa-gear me-2"></i>Settings</a></li>
                        <li id="admin-nav-item" style="display: none;"><a class="dropdown-item" href="${pathPrefix}admin.html"><i class="fa-solid fa-shield-halved me-2"></i>Admin Panel</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
            <!-- Logged-out state -->
            <div class="user-profile" id="header-logged-out">
                <a href="${pathPrefix}login.html" class="nav-icon-btn d-flex align-items-center" style="width: auto; padding: 0 20px; border-radius: 20px; background: var(--accent); color: #fff; font-weight: 600; text-decoration: none;">
                    <i class="fa-solid fa-right-to-bracket me-2"></i>Login
                </a>
            </div>
        </div>
    </header>
`;

const AppFooterHTML = `
    <style>
        .hover-white { transition: color 0.2s; }
        .hover-white:hover { color: #fff !important; }
    </style>
    <footer class="site-footer py-3 mt-5" style="background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05);">
        <div class="container opacity-75">
            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
                
                <!-- Left: Brand -->
                <div class="d-flex align-items-center gap-3">
                    <h5 class="m-0 text-white fw-bold">Discover <span class="hero-highlight">Stories</span></h5>
                    <span class="text-secondary small d-none d-md-inline" style="border-left: 1px solid rgba(255,255,255,0.2); padding-left: 15px;">
                        The ultimate hub for geeks, cinephiles, and bookworms.
                    </span>
                </div>
                
                <!-- Middle: Stats -->
                <div class="d-flex align-items-center gap-4">
                    <div class="text-white small fw-bold">24K+ <span class="text-secondary fw-normal ms-1">Reviews</span></div>
                    <div class="text-white small fw-bold">150K+ <span class="text-secondary fw-normal ms-1">Titles</span></div>
                </div>

                <!-- Right: Links & Copyright -->
                <div class="d-flex flex-wrap justify-content-center align-items-center gap-3 text-secondary small">
                    <span>&copy; 2026 Cultify</span>
                    <a href="#" class="text-secondary text-decoration-none hover-white">About Us</a>
                    <a href="#" class="text-secondary text-decoration-none hover-white">Privacy</a>
                    <a href="#" class="text-secondary text-decoration-none hover-white">Terms</a>
                </div>

            </div>
        </div>
    </footer>
`;

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = AppHeaderHTML;

        // Re-run nav active state logic for the newly created nav links
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = this.querySelectorAll('nav a');
        const urlParams = new URLSearchParams(window.location.search);
        const categoryType = urlParams.get('type');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
            else if (href && href.includes('category.html') && currentPage === 'category.html') {
                const linkType = new URL(link.href, window.location.origin).searchParams.get('type');
                if (linkType === categoryType) link.classList.add('active'); else link.classList.remove('active');
            } else link.classList.remove('active');
        });
    }
}

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = AppFooterHTML;
    }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
