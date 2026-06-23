/* ==========================================================================
   cloudbitlogicpro - Main JavaScript
   Core interactions, navigation, scroll effects
   ========================================================================== */

(function() {
    'use strict';

    // ===== DOM Ready =====
    document.addEventListener('DOMContentLoaded', function() {
        initPageLoader();
        initNavigation();
        initScrollEffects();
        initScrollReveal();
        initAccordion();
        initForms();
        initActiveNav();
        initCounters();
    });

    // ===== Page Loader =====
    function initPageLoader() {
        const loader = document.querySelector('.page-loader');
        if (!loader) return;
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
                setTimeout(function() {
                    loader.remove();
                }, 600);
            }, 400);
        });
    }

    // ===== Navigation =====
    function initNavigation() {
        const header = document.querySelector('.site-header');
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        // Header scroll effect
        if (header) {
            const onScroll = function() {
                if (window.scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // Mobile menu toggle
        if (toggle && menu) {
            toggle.addEventListener('click', function() {
                menu.classList.toggle('open');
                const isOpen = menu.classList.contains('open');
                toggle.setAttribute('aria-expanded', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            // Close menu on link click
            menu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    menu.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ===== Scroll Effects (Header, Parallax) =====
    function initScrollEffects() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    // ===== Scroll Reveal =====
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
                .forEach(function(el) { el.classList.add('visible'); });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
            .forEach(function(el) {
                observer.observe(el);
            });
    }

    // ===== Accordion =====
    function initAccordion() {
        document.querySelectorAll('.accordion-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const item = this.closest('.accordion-item');
                const isActive = item.classList.contains('active');
                const content = item.querySelector('.accordion-content');

                // Close others in the same accordion
                const accordion = item.closest('.accordion');
                if (accordion) {
                    accordion.querySelectorAll('.accordion-item').forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherContent = otherItem.querySelector('.accordion-content');
                            if (otherContent) otherContent.style.maxHeight = '0';
                        }
                    });
                }

                if (isActive) {
                    item.classList.remove('active');
                    if (content) content.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    if (content) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                }
            });
        });
    }

    // ===== Forms =====
    function initForms() {
        document.querySelectorAll('form[data-form]').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn?.textContent;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Transmitting...';
                }

                // Simulate sending
                setTimeout(function() {
                    if (submitBtn) {
                        submitBtn.textContent = '✓ Message Sent';
                        setTimeout(function() {
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                            form.reset();
                        }, 2400);
                    }
                }, 1200);
            });
        });
    }

    // ===== Active Nav State =====
    function initActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a, .footer-col a').forEach(function(link) {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkPath = href.split('/').pop();
            if (linkPath === path) {
                link.classList.add('active');
            }
        });
    }

    // ===== Animated Counters =====
    function initCounters() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-counter]').forEach(function(el) {
            observer.observe(el);
        });
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    // ===== Lazy Images =====
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for older browsers
        const lazyScript = document.createElement('script');
        lazyScript.src = 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.3/dist/lazyload.min.js';
        document.body.appendChild(lazyScript);
    }

    // ===== Console Signature =====
    if (window.console && console.log) {
        console.log('%c cloudbitlogicpro ', 'background: linear-gradient(90deg, #00f0ff, #7c3aed, #f472b6); color: #000; padding: 6px 14px; font-weight: 700; border-radius: 4px; font-family: monospace;');
        console.log('%c Building digital experiences that respect privacy. ', 'color: #00f0ff; font-family: monospace;');
        console.log('%c→ hello@cloudbitlogicpro.com', 'color: #5a6d8a; font-family: monospace;');
    }
})();
