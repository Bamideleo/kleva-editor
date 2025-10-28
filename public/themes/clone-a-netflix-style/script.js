// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Search functionality
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', function() {
            searchBox.style.display = searchBox.style.display === 'block' ? 'none' : 'block';
            if (searchBox.style.display === 'block') {
                searchInput.focus();
            }
        });

        searchClose.addEventListener('click', function() {
            searchBox.style.display = 'none';
            searchInput.value = '';
        });

        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
                searchBox.style.display = 'none';
            }
        });

        // Search input animation
        searchInput.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        searchInput.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // User dropdown menu
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');

    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.style.display = 'none';
        });

        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Trending carousel functionality
    const trendingCarousel = document.getElementById('trendingCarousel');
    const trendingPrev = document.getElementById('trendingPrev');
    const trendingNext = document.getElementById('trendingNext');

    if (trendingCarousel && trendingPrev && trendingNext) {
        const scrollAmount = 320; // Width of carousel item + gap

        trendingPrev.addEventListener('click', function() {
            trendingCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        trendingNext.addEventListener('click', function() {
            trendingCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Add scroll indicators
        trendingCarousel.addEventListener('scroll', function() {
            const isAtStart = this.scrollLeft === 0;
            const isAtEnd = this.scrollLeft + this.clientWidth >= this.scrollWidth - 1;

            trendingPrev.style.opacity = isAtStart ? '0.5' : '1';
            trendingNext.style.opacity = isAtEnd ? '0.5' : '1';
        });
    }

    // Movie card hover animations
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.boxShadow = '0 10px 30px rgba(229, 9, 20, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Preview button functionality
    const previewPlayButtons = document.querySelectorAll('.preview-play');
    const previewAddButtons = document.querySelectorAll('.preview-add');

    previewPlayButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieCard = this.closest('.movie-card');
            const movieId = movieCard.getAttribute('data-movie-id');
            alert(`Playing movie with ID: ${movieId}`);
            // Add actual play functionality here
        });
    });

    previewAddButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieCard = this.closest('.movie-card');
            const movieId = movieCard.getAttribute('data-movie-id');
            
            // Toggle add/remove animation
            this.style.transform = 'scale(1.2)';
            this.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert(`Added movie with ID: ${movieId} to your list`);
            }, 200);
        });
    });

    // Hero section buttons
    const heroPlayBtn = document.querySelector('.hero-actions .btn-primary');
    const heroInfoBtn = document.querySelector('.hero-actions .btn-secondary');

    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert('Playing featured movie: The Last Adventure');
            }, 150);
        });
    }

    if (heroInfoBtn) {
        heroInfoBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert('Showing more info about: The Last Adventure');
            }, 150);
        });
    }

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggleIcon = this.querySelector('.faq-toggle');
            
            // Close all other answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('.faq-toggle');
                    otherAnswer.style.display = 'none';
                    otherIcon.src = otherIcon.src.replace('✕', '+').replace('×', '+');
                    otherIcon.alt = 'Toggle';
                }
            });
            
            // Toggle current answer
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                toggleIcon.src = toggleIcon.src.replace('✕', '+').replace('×', '+');
                toggleIcon.alt = 'Toggle';
            } else {
                answer.style.display = 'block';
                toggleIcon.src = toggleIcon.src.replace('+', '✕').replace('+', '×');
                toggleIcon.alt = 'Close';
                
                // Smooth scroll to ensure FAQ is visible
                answer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            header.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)';
        }
    });

    // Image error handling fallback
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            const fallbackSrc = this.getAttribute('onerror').match(/this\.src='([^']+)'/)[1];
            if (fallbackSrc && this.src !== fallbackSrc) {
                this.src = fallbackSrc;
            }
        });
    });

    // Form submission handling (for future forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading animation
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Loading...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert('Form submitted successfully!');
                }, 1500);
            }
        });
    });

    // Add scroll animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.trending-section, .category-section, .faq-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Utility function for smooth scrolling to any element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Utility function to toggle element visibility with animation
function toggleElement(element, duration = 300) {
    if (element.style.display === 'none' || !element.style.display) {
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        }, 10);
    } else {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}