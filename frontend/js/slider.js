/**
 * ==========================================
 * HERO SLIDER MODULE (slider.js)
 * ==========================================
 * Renders the dynamic featured slider on the index page.
 */
let heroSliderInterval = null;

window.renderHeroSlider = function() {
    const section = document.getElementById('hero-slider-section');
    if (!section) return;

    // Don't re-render if it's already there (to avoid flickering while filtering grid)
    if (section.innerHTML !== '') return;

    const db = window.getContentDB ? window.getContentDB() : {};
    let items = Object.values(db).filter(item =>
        item.tags && item.tags[0] === 'Movie'
    );

    if (items.length === 0) {
        // If there are no movies, hide the slider completely
        section.style.display = 'none';
        return;
    }

    // Randomize the items and select up to 5 for the slider
    const shuffled = items.sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 5);

    let slidesHtml = featured.map((item, idx) => {
        const tagsHtml = (item.tags || []).slice(0, 3).map(tag => {
            const cls = tag.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return `<span class="detail-tag tag-${cls}">${tag}</span>`;
        }).join('');

        return `
        <div class="slide ${idx === 0 ? 'active' : ''}" onclick="window.location.href='detail.html?id=${item.id}'">
            <img src="${item.img || '../images/default-placeholder.jpg'}" class="slide-img" alt="${item.title}">
            <div class="slide-overlay"></div>
            <div class="slide-content">
                <h1 class="slide-title">${window.escapeHtml(item.title)}</h1>
                <div class="slide-tags">${tagsHtml}</div>
                <p class="slide-desc">${window.escapeHtml(item.desc || 'Explore the details of this content.')}</p>
            </div>
        </div>`;
    }).join('');

    let dotsHtml = featured.map((_, idx) => `
        <button class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to slide ${idx + 1}"></button>
    `).join('');

    section.innerHTML = `
        <div class="hero-slider">
            <div class="slider-track" id="hero-slider-track">
                ${slidesHtml}
            </div>
            <button class="slider-arrow prev" id="slider-prev" aria-label="Previous slide">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="slider-arrow next" id="slider-next" aria-label="Next slide">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="slider-dots">
                ${dotsHtml}
            </div>
        </div>
    `;

    // Slider Logic
    let currentSlide = 0;
    const track = document.getElementById('hero-slider-track');
    const slides = section.querySelectorAll('.slide');
    const dots = section.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    // Function to handle the actual visual transition between slides
    function goToSlide(n) {
        // Ensure index wraps around (e.g., going previous from 0 goes to last slide)
        currentSlide = (n + featured.length) % featured.length;
        // Shift the entire track left or right using CSS transform
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active class on slides for fade effects
        slides.forEach(s => s.classList.remove('active'));
        slides[currentSlide].classList.add('active');

        dots.forEach(d => d.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    // Setup click listener for 'Previous' button
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the slide's link
            clearInterval(heroSliderInterval); // Pause auto-sliding while user interacts
            goToSlide(currentSlide - 1);
            startAutoSlide(); // Resume auto-sliding
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            clearInterval(heroSliderInterval);
            goToSlide(currentSlide + 1);
            startAutoSlide();
        };
    }

    // Setup click listeners for the pagination dots at the bottom
    dots.forEach(dot => {
        dot.onclick = (e) => {
            e.stopPropagation();
            clearInterval(heroSliderInterval);
            goToSlide(parseInt(dot.getAttribute('data-index')));
            startAutoSlide();
        };
    });

    // Automatically transition to the next slide every 5 seconds
    function startAutoSlide() {
        if (heroSliderInterval) clearInterval(heroSliderInterval);
        heroSliderInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    // Initialize the auto-slider when the component first mounts
    startAutoSlide();
};
