document.addEventListener('DOMContentLoaded', () => {

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;
    const navLogoA = document.querySelector('.nav-logo a');
    
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            rootElement.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="font-size: 1.1rem;"></i>';
            if(navLogoA) navLogoA.style.color = '#F5F5F7';
        }

        themeToggleBtn.addEventListener('click', () => {
            rootElement.classList.toggle('dark-mode');
            if (rootElement.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="font-size: 1.1rem;"></i>';
                if(navLogoA) navLogoA.style.color = '#F5F5F7';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon" style="font-size: 1.1rem;"></i>';
                if(navLogoA) navLogoA.style.color = '';
            }
        });
    }

    // 0. Bespoke Glass Shatter Entry Logic
    const glassOverlay = document.getElementById('glass-overlay');
    if (glassOverlay) {
        // Lock body scroll tightly so user can't peek behind the glass
        document.body.style.overflow = 'hidden';
        
        glassOverlay.addEventListener('click', () => {
            // Trigger explosion CSS
            glassOverlay.classList.add('shattered');
            
            // Release the scroll and destroy the DOM element thoroughly after physics finish
            setTimeout(() => {
                document.body.style.overflow = '';
                glassOverlay.remove();
            }, 1200);
        });
    }

    // 1. Premium Custom Cursor Glow
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let targetCursorScale = 1;
    let currentCursorScale = 1;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const renderCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        currentCursorScale += (targetCursorScale - currentCursorScale) * 0.15;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${currentCursorScale})`;
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Expand cursor on hover
    document.querySelectorAll('a, button, .project-card, .dark-project-card, .stack-card, .timeline-content, .solid-submit').forEach(el => {
        el.addEventListener('mouseenter', () => {
            targetCursorScale = 1.3;
            cursor.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%)';
        });
        el.addEventListener('mouseleave', () => {
            targetCursorScale = 1;
            cursor.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)';
        });
    });

    // 2. Magnetic Hover Effect for Buttons and Links
    const magneticElements = document.querySelectorAll('.nav-links a, .nav-icon, .nav-hire-btn, .project-btn, .cert-view-link');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);
            elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });
    });

    // 3. Ultra-Modern Cinematic Cards (3D Tilt + Parallax Depth + Magnetic + Inner Tracker Glow)
    const interactiveCards = document.querySelectorAll('.project-card, .dark-project-card, .stack-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Save the baseline transform strictly computed by specific layout systems (like Carousel)
            card.dataset.baseTransform = card.style.transform || '';
            card.dataset.baseBoxShadow = card.style.boxShadow || '';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            // Subtle tilt overriding the baseline transform while hovered
            const rotateX = (deltaY / centerY) * -6; 
            const rotateY = (deltaX / centerX) * 6;
            
            const transX = deltaX * 0.05;
            const transY = deltaY * 0.05;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            // Expand 1.04 precisely as required, adding parallax tilt
            card.style.transform = `translateY(-8px) scale(1.04) translate(${transX}px, ${transY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            if (card.classList.contains('project-card') || card.classList.contains('dark-project-card')) {
                card.style.boxShadow = `0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.06)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Drop gracefully back to exactly what the layout mandated (Carousel baseline)
            card.style.transform = card.dataset.baseTransform || ''; 
            card.style.boxShadow = card.dataset.baseBoxShadow || '';
            
            card.style.setProperty('--mouse-x', `${card.offsetWidth / 2}px`);
            card.style.setProperty('--mouse-y', `${card.offsetHeight / 2}px`);
        });
    });

    // 4. 3D Cover Flow Carousel Logic
    const carouselContainer = document.querySelector('.projects-carousel');
    if (carouselContainer) {
        const items = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.carousel-pagination .dot, .dark-carousel-pagination .circle-dot');
        
        let currentIndex = 0;
        
        function updateCarousel() {
            items.forEach((item, index) => {
                // Reversed offset mapping directly matching user linked list (1 at right, 3 at left)
                let offset = currentIndex - index;
                
                const total = items.length;
                if (offset < -Math.floor(total/2)) offset += total;
                if (offset > Math.floor(total/2)) offset -= total;
                
                const absOffset = Math.abs(offset);
                
                // Tighter overlapping mapping mimicking the exact Cover Flow depth in your reference image
                const translateX = 100 * offset; 
                const translateZ = absOffset === 0 ? 0 : -450 - (absOffset * 100);
                const rotateY = offset === 0 ? 0 : offset > 0 ? -45 : 45;
                const scale = offset === 0 ? 1 : 0.85;
                const opacity = offset === 0 ? 1 : Math.max(0.3, 1 - (absOffset * 0.4));
                const blur = offset === 0 ? 0 : absOffset * 6;
                const zIndex = 10 - absOffset;
                
                // Prevent interactions on background cards
                item.style.pointerEvents = offset === 0 ? 'auto' : 'none';
                
                // Safely translate from the natively clamped coordinate origin determined by CSS margins
                item.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.filter = `blur(${blur}px)`;
                item.style.zIndex = zIndex;
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };
        
        updateCarousel(); // Initialize structure
        
        nextBtn.addEventListener('click', () => {
            // User requested clicking Right button moves the active item Right (so previous item comes to middle = index decreases)
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', () => {
            // User requested clicking Left button moves the active item Left (so next item comes to middle = index increases)
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }

    // 4. Reveal animations on scroll (0.8s ease-out)
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Removed aggressive 3D tilt in favor of Magnetic Depth Hover (handled above)

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Force download CV
function forceDownload(e, url, filename) {
    if(window.location.protocol !== 'file:') {
        e.preventDefault();
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(err => {
                console.error("Download failed, opening instead", err);
            });
    }
}
