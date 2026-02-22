import "../styles/app.scss";
/**
 * STYLO Theme - Main JavaScript
 * Built for Salla Twilight Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LAZY LOADING IMAGES
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS (Fade In on Scroll)
    // ==========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.vf-section, .vf-product-card, .vf-collection-card, .vf-lookbook-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('vf-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.classList.add('vf-animate');
            observer.observe(el);
        });
    };

    animateOnScroll();

    // ==========================================
    // HERO SLIDER (Using Swiper if available)
    // ==========================================
    const initHeroSlider = () => {
        const heroSlider = document.getElementById('heroSlider');
        if (!heroSlider) return;

        if (typeof Swiper !== 'undefined') {
            new Swiper('#heroSlider', {
                loop: true,
                speed: 800,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: '.vf-hero__pagination',
                    clickable: true,
                    bulletClass: 'vf-hero__bullet',
                    bulletActiveClass: 'vf-hero__bullet--active',
                },
                navigation: {
                    nextEl: '.vf-hero__next',
                    prevEl: '.vf-hero__prev',
                },
            });
        }
    };

    initHeroSlider();

    // ==========================================
    // PRODUCT QUICK VIEW
    // ==========================================
    document.querySelectorAll('.vf-quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            if (productId && typeof salla !== 'undefined') {
                salla.event.dispatch('salla-quick-view::open', { id: productId });
            }
        });
    });

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // CART COUNT UPDATE LISTENER
    // ==========================================
    if (typeof salla !== 'undefined') {
        salla.event.on('salla::cart.updated', (data) => {
            const cartCount = document.getElementById('cartCount');
            if (cartCount && data.count !== undefined) {
                cartCount.textContent = data.count;
                // Animate cart icon
                cartCount.closest('.vf-cart-btn')?.classList.add('vf-cart-bounce');
                setTimeout(() => {
                    cartCount.closest('.vf-cart-btn')?.classList.remove('vf-cart-bounce');
                }, 600);
            }
        });

        // Add to cart success notification
        salla.event.on('salla::cart.item.added', () => {
            showNotification('success');
        });
    }

    // ==========================================
    // NOTIFICATION TOAST
    // ==========================================
    function showNotification(type = 'success') {
        const toast = document.createElement('div');
        toast.className = `vf-toast vf-toast--${type}`;
        
        const messages = {
            success: document.documentElement.lang === 'ar' 
                ? 'تمت الإضافة بنجاح!' 
                : 'Added successfully!',
            error: document.documentElement.lang === 'ar' 
                ? 'حدث خطأ!' 
                : 'An error occurred!'
        };

        toast.innerHTML = `
            <i class="sicon-${type === 'success' ? 'check-circle' : 'warning'}"></i>
            <span>${messages[type]}</span>
        `;

        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('vf-toast--visible');
        });

        setTimeout(() => {
            toast.classList.remove('vf-toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // IMAGE ZOOM ON PRODUCT PAGE
    // ==========================================
    const productMainImage = document.getElementById('productMainImage');
    if (productMainImage) {
        const img = productMainImage.querySelector('.vf-product-gallery__img');
        
        productMainImage.addEventListener('mousemove', (e) => {
            const rect = productMainImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = 'scale(1.5)';
        });

        productMainImage.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    }

    // ==========================================
    // PRODUCTS GRID ANIMATION (staggered)
    // ==========================================
    const staggerProducts = () => {
        const grids = document.querySelectorAll('.vf-products-grid');
        grids.forEach(grid => {
            const cards = grid.querySelectorAll('.vf-product-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.08}s`;
            });
        });
    };

    staggerProducts();

});

// ==========================================
// CSS ANIMATIONS (injected)
// ==========================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    /* Scroll Animations */
    .vf-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .vf-visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Cart Bounce */
    @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }

    .vf-cart-bounce .vf-cart-count {
        animation: cartBounce 0.6s ease;
    }

    /* Toast Notification */
    .vf-toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #1a1a1a;
        color: #fff;
        padding: 0.875rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.625rem;
        font-size: 0.875rem;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .vf-toast--visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .vf-toast--success i { color: #4CAF50; }
    .vf-toast--error i { color: #E53935; }
`;
document.head.appendChild(styleSheet);

