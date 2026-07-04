/* ==========================================================================
   SIBARIS CAFE SEVILLA - TYPOGRAPHIC & INTERACTIVE SCRIPTS (JS)
   Author: Professional UX/UI Web Design Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    initLucideIcons();

    // 2. Header Scroll Effects & Progress Bar
    initHeaderScroll();

    // 3. Mobile Navigation Menu
    initMobileNav();

    // 4. Scroll Reveal Animations (Intersection Observer)
    initScrollReveal();

    // 5. Hero Mouse-Parallax Glow Effect (Interactive Ambiance)
    initHeroMouseParallax();

    // 6. Cards Mouse Spotlight Tracking (Interactive Glow)
    initCardsSpotlight();

    // 7. FAQ Accordions (Smooth Heights)
    initFaqAccordions();

    // 8. Interactive Map (Leaflet.js)
    initInteractiveMap();
});

/* --------------------------------------------------------------------------
   1. LUCIDE ICONS INITIALIZATION
   -------------------------------------------------------------------------- */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        const interval = setInterval(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                clearInterval(interval);
            }
        }, 100);
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

        // Active Link Highlighting
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
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
        reveals.forEach(element => {
            element.classList.add('active');
        });
    }
}

/* --------------------------------------------------------------------------
   5. HERO MOUSE-PARALLAX GLOW EFFECT (INTERACTIVE AMBIANCE)
   -------------------------------------------------------------------------- */
function initHeroMouseParallax() {
    const glow1 = document.getElementById('glow1');
    const glow2 = document.getElementById('glow2');
    
    if (!glow1 || !glow2) return;

    window.addEventListener('mousemove', (e) => {
        // Subtle offset proportional to mouse coordinate
        const x = (e.clientX - window.innerWidth / 2) * 0.04;
        const y = (e.clientY - window.innerHeight / 2) * 0.04;
        
        // requestAnimationFrame yields fluid GPU-accelerated motion
        window.requestAnimationFrame(() => {
            glow1.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            glow2.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
        });
    });
}

/* --------------------------------------------------------------------------
   6. CARDS MOUSE SPOTLIGHT TRACKING (INTERACTIVE GLOW)
   -------------------------------------------------------------------------- */
function initCardsSpotlight() {
    const cards = document.querySelectorAll('.specialty-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Cursor position relative to card bounds
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS Custom Properties for radial-gradient spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* --------------------------------------------------------------------------
   7. FAQ ACCORDION SECTION (SMOOTH HEIGHTS)
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
    const accordionTriggers = document.querySelectorAll('.faq-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.faq-content');
            const isOpen = item.classList.contains('active');

            const activeItems = document.querySelectorAll('.faq-item.active');
            activeItems.forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    const activeContent = activeItem.querySelector('.faq-content');
                    activeContent.style.maxHeight = '0px';
                    activeItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

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
   8. INTERACTIVE MAP (LEAFLET.JS)
   -------------------------------------------------------------------------- */
function initInteractiveMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const lat = 37.38914;
    const lng = -5.98448;

    function renderMap() {
        if (typeof L === 'undefined') return;

        mapElement.innerHTML = '';

        const map = L.map('map', {
            center: [lat, lng],
            zoom: 16,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const customIcon = L.divIcon({
            html: '<div style=\"background-color: #0E2954; border: 3px solid #FAF8F5; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);\"></div>',
            className: 'custom-map-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
            <div style=\"font-family: 'Inter', sans-serif; font-size: 13px; color: #1F1F1F; padding: 4px;\">
                <strong style=\"font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #0E2954;\">Sibaris</strong><br>
                Calle San Alonso de Orozco 9<br>
                41003 Sevilla
            </div>
        `).openPopup();
    }

    if (typeof L !== 'undefined') {
        renderMap();
    } else {
        const mapCheckInterval = setInterval(() => {
            if (typeof L !== 'undefined') {
                renderMap();
                clearInterval(mapCheckInterval);
            }
        }, 150);
        setTimeout(() => clearInterval(mapCheckInterval), 6000);
    }
}
