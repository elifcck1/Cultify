window.renderHeader = function() {
    const header = document.getElementById('app-header');
    if (!header) return;

    const isLoggedIn = window.isLoggedIn && window.isLoggedIn();
    let navContent = '';

    if (isLoggedIn) {
        const user = window.getCurrentUser ? window.getCurrentUser() : { firstName: 'User', role: 'user', avatar: 'fa-solid fa-user' };

        let avatarDisplay = '';
        if (user.avatar && (user.avatar.includes('/') || user.avatar.includes('.'))) {
            avatarDisplay = `<img src="${user.avatar}" alt="Avatar">`;
        } else {
            avatarDisplay = `<i class="${user.avatar || 'fa-solid fa-user'}"></i>`;
        }

        navContent = `
            <div class="user-menu-container" id="user-menu-container">
                <div class="user-trigger" id="user-menu-trigger">
                    <div class="user-avatar-mini">
                        ${avatarDisplay}
                    </div>
                    <span class="user-name-mini">${window.escapeHtml(user.firstName)}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="user-dropdown hidden" id="user-dropdown-menu">
                    <a href="profile.html"><i class="fa-solid fa-circle-user"></i> Profile</a>
                    ${user.role === 'admin' ? '<a href="admin.html"><i class="fa-solid fa-user-shield"></i> Admin</a>' : ''}
                    <div class="dropdown-divider"></div>
                    <a href="#" id="logout-link" class="logout-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                </div>
            </div>
        `;
    } else {
        navContent = `
            <div class="nav-links">
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            </div>
        `;
    }

    header.innerHTML = `
        <div class="container nav-container">
            <a href="index.html" class="brand">
                <img src="../images/main-logo.svg" alt="Cultify Logo" class="brand-logo">
                Cultify
            </a>
            ${navContent}
        </div>
    `;

    // Dropdown Toggle Logic
    const trigger = document.getElementById('user-menu-trigger');
    const menu = document.getElementById('user-dropdown-menu');
    const container = document.getElementById('user-menu-container');

    if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
            container.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.add('hidden');
                container.classList.remove('active');
            }
        });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (window.logoutWithApi) await window.logoutWithApi();
            window.location.href = 'index.html';
        });
    }
}

window.renderFooter = function() {
    let footer = document.getElementById('app-footer');
    if (!footer) {
        footer = document.createElement('footer');
        footer.id = 'app-footer';
        document.body.appendChild(footer);
    }

    footer.innerHTML = `
        <div class="container footer-container">
            <div class="footer-left">
                <div class="discover-stories">Discover <span>Stories</span></div>
            </div>
            <div class="footer-right">
                <a href="index.html" class="footer-copy footer-link">&copy; Cultify 2026</a>
                <a href="about.html" class="footer-link">About Us</a>
            </div>
        </div>
    `;
}
