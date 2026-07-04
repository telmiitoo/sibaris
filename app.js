/* ==========================================================================
   SIBARIS CAFE SEVILLA - INTERACTIVE SCRIPTS (JS)
   Author: Professional UX/UI Web Design Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    initLucideIcons();

    // 2. Header Scroll Effects & Progress Bar
    initHeaderScroll();

    // 3. Mobile Navigation Menu
    initMobileNav();

    // 4. Parallax Effect on Hero
    initHeroParallax();

    // 5. Scroll Reveal Animations (Intersection Observer)
    initScrollReveal();

    // 6. Interactive Gallery Lightbox
    initGalleryLightbox();

    // 7. Auto-playing Reviews Slider
    initReviewsSlider();

    // 8. FAQ Accordions (Smooth Heights)
    initFaqAccordions();

    // 9. Interactive Map (Leaflet.js)
    initInteractiveMap();
});

/* --------------------------------------------------------------------------
   1. LUCIDE ICONS INITIALIZATION
   -------------------------------------------------------------------------- */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        // Fallback retry if CDN loads after script execution
        const interval = setInterval(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                clearInterval(interval);
            }
        }, 100);
        // Timeout after 5 seconds to prevent infinite loops
        setTimeout(() => clearInterval(interval), 5000);
    }
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL EFFECTS & PROGRESS BAR
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const progressBar = document.getElementById('progressBar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Toggle sticky state
        if (scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update Page Progress Bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const scrollPercent = (scrollY / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Active Link Highlighting based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    function toggleMenu() {
        const isOpen = navMenu.classList.contains('open');
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', !isOpen);
        
        // Prevent scroll on body when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu if window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   4. PARALLAX EFFECT ON HERO
   -------------------------------------------------------------------------- */
function initHeroParallax() {
    const heroBg = document.querySelector('.hero-parallax-bg');
    const hero = document.getElementById('hero');
    if (!heroBg || !hero) return;

    let tick = false;

    window.addEventListener('scroll', () => {
        if (!tick) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = hero.offsetHeight;
                
                // Only animate when hero is visible
                if (scrollY <= heroHeight) {
                    const yPos = scrollY * 0.35; // speed multiplier
                    heroBg.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
                tick = false;
            });
            tick = true;
        }
    });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once visible, stop tracking to preserve system resources
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach(element => {
            element.classList.add('active');
        });
    }
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE GALLERY LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

    let currentIndex = 0;
    const imagesList = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = imagesList[currentIndex];
        lightboxImg.alt = galleryItems[currentIndex].querySelector('img').alt;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Hide browser address bar helper/focus trap
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imagesList.length;
        lightboxImg.src = imagesList[currentIndex];
        lightboxImg.alt = galleryItems[currentIndex].querySelector('img').alt;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
        lightboxImg.src = imagesList[currentIndex];
        lightboxImg.alt = galleryItems[currentIndex].querySelector('img').alt;
    }

    // Attach click listeners to gallery elements
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on overlay clicking
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard navigation accessibility
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

/* --------------------------------------------------------------------------
   7. AUTO-PLAYING REVIEWS SLIDER
   -------------------------------------------------------------------------- */
function initReviewsSlider() {
    const track = document.getElementById('reviewsTrack');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = cards.length - cardsPerView + 1;
    let slideTimer;

    // Build pagination dots
    function buildDots() {
        dotsContainer.innerHTML = '';
        totalSlides = cards.length - cardsPerView + 1;
        if (totalSlides <= 1) return;

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir a opinión ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 992) return 2;
        return 3;
    }

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        currentIndex = index;
        
        // Calculate offset percentage
        const cardStyle = window.getComputedStyle(cards[0]);
        const cardMargin = parseFloat(cardStyle.marginRight) || 0;
        const cardWidth = cards[0].offsetWidth;
        const offset = currentIndex * (cardWidth + 24); // 24px is gap

        track.style.transform = `translateX(-${offset}px)`;

        // Update active dot
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function showNextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Wrap around to first slide
        }
    }

    function showPrevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(totalSlides - 1); // Wrap to last
        }
    }

    function startAutoPlay() {
        slideTimer = setInterval(showNextSlide, 5000); // 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(slideTimer);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Attach listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNextSlide();
            resetAutoPlay();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPrevSlide();
            resetAutoPlay();
        });
    }

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Initial setup
    buildDots();
    startAutoPlay();

    // Resize recalculations
    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            buildDots();
            goToSlide(0);
        } else {
            // Re-adjust layout widths
            goToSlide(currentIndex);
        }
    });
}

/* --------------------------------------------------------------------------
   8. FAQ ACCORDIONS (SMOOTH HEIGHTS)
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
    const accordionTriggers = document.querySelectorAll('.faq-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.faq-content');
            const isOpen = item.classList.contains('active');

            // Close all other accordions first (Single-expanded accordion behavior)
            const activeItems = document.querySelectorAll('.faq-item.active');
            activeItems.forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    const activeContent = activeItem.querySelector('.faq-content');
                    activeContent.style.maxHeight = '0px';
                    activeItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle selected accordion
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = `${content.scrollHeight}px`;
                trigger.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                content.style.maxHeight = '0px';
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   9. INTERACTIVE MAP (LEAFLET.JS)
   -------------------------------------------------------------------------- */
function initInteractiveMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const lat = 37.38914;
    const lng = -5.98448;

    function renderMap() {
        if (typeof L === 'undefined') return;

        // Clear fallback/loading display contents
        mapElement.innerHTML = '';

        // Initialize Map centered on coordinate
        const map = L.map('map', {
            center: [lat, lng],
            zoom: 16,
            scrollWheelZoom: false // Prevent zoom issues on page scrolling
        });

        // Add minimalist tile styling layer (CartoDB Positron / Light style matches brand)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom Leaflet Marker Icon design matching Cafe color palette
        const customIcon = L.divIcon({
            html: '<div style="background-color: #6F4E37; border: 3px solid #FAF8F5; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>',
            className: 'custom-map-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Create Marker & Popup info
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #1F1F1F; padding: 4px;">
                <strong style="font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #6F4E37;">Sibaris</strong><br>
                Calle San Alonso de Orozco 9<br>
                41003 Sevilla
            </div>
        `).openPopup();
    }

    if (typeof L !== 'undefined') {
        renderMap();
    } else {
        // Wait for Leaflet JS script file to fully load
        const mapCheckInterval = setInterval(() => {
            if (typeof L !== 'undefined') {
                renderMap();
                clearInterval(mapCheckInterval);
            }
        }, 150);
        // Timeout after 6 seconds
        setTimeout(() => clearInterval(mapCheckInterval), 6000);
    }
}
