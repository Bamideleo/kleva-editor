document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburgerLines.forEach(line => line.classList.toggle('active'));
        
        // Animate hamburger to X
        if (navMenu.classList.contains('active')) {
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburgerLines.forEach(line => line.classList.remove('active'));
                    hamburgerLines[0].style.transform = 'none';
                    hamburgerLines[1].style.opacity = '1';
                    hamburgerLines[2].style.transform = 'none';
                }
            }
        });
    });

    // Hero section button interactions
    const viewWorkBtn = document.getElementById('viewWorkBtn');
    const contactBtn = document.getElementById('contactBtn');
    
    viewWorkBtn.addEventListener('click', function() {
        const portfolioSection = document.querySelector('#portfolio');
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const portfolioPosition = portfolioSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: portfolioPosition,
            behavior: 'smooth'
        });
    });
    
    contactBtn.addEventListener('click', function() {
        const contactSection = document.querySelector('#contact');
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const contactPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: contactPosition,
            behavior: 'smooth'
        });
    });

    // Animate skill bars on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    
    function animateSkillBars() {
        skillItems.forEach(item => {
            const skillLevel = item.getAttribute('data-skill-level');
            const skillProgress = item.querySelector('.skill-progress');
            const rect = item.getBoundingClientRect();
            
            if (rect.top < window.innerHeight - 100) {
                skillProgress.style.width = skillLevel + '%';
                skillProgress.style.transition = 'width 1.5s ease-in-out';
            }
        });
    }
    
    // Initial check and scroll listener for skill bars
    animateSkillBars();
    window.addEventListener('scroll', animateSkillBars);

    // Portfolio project buttons
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            alert(`Viewing details for ${project} project - This would typically open a modal or navigate to a project page.`);
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`);
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Header scroll effect
    const header = document.querySelector('.site-header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);

    // Intersection Observer for fade-in animations
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
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Social links interaction
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('aria-label');
            alert(`This would navigate to ${platform} profile - Add actual links in the HTML.`);
        });
    });

    // Company card hover effects
    const companyCards = document.querySelectorAll('.company-card');
    
    companyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Portfolio item interactions
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});