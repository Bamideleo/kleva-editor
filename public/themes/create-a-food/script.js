// Cart functionality
let cart = [];
let cartCount = 0;

// DOM Elements
const cartButton = document.getElementById('cartButton');
const loginButton = document.getElementById('loginButton');
const orderNowBtn = document.getElementById('orderNowBtn');
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const closeCartModal = document.getElementById('closeCartModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');
const loginForm = document.getElementById('loginForm');
const menuGrid = document.getElementById('menuGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Modal functionality
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners for modals
cartButton.addEventListener('click', () => openModal(cartModal));
loginButton.addEventListener('click', () => openModal(loginModal));
closeCartModal.addEventListener('click', () => closeModal(cartModal));
closeLoginModal.addEventListener('click', () => closeModal(loginModal));

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) closeModal(cartModal);
    if (e.target === loginModal) closeModal(loginModal);
});

// Add to cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const itemElement = e.target.closest('.menu-item');
        const itemName = itemElement.querySelector('.item-name').textContent;
        const itemPrice = parseFloat(itemElement.querySelector('.item-price').textContent.replace('$', ''));
        const itemId = e.target.getAttribute('data-item');
        
        addToCart(itemId, itemName, itemPrice);
        
        // Animation feedback
        e.target.textContent = 'Added!';
        e.target.style.background = '#27ae60';
        
        setTimeout(() => {
            e.target.textContent = 'Add to Cart';
            e.target.style.background = '#2ecc71';
        }, 1000);
    }
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    cartCount += 1;
    updateCartUI();
}

function updateCartUI() {
    cartButton.textContent = `Cart (${cartCount})`;
    
    // Update cart modal
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <div>
                    <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div>$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" data-id="${item.id}" style="background: #e74c3c; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; margin-top: 5px;">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Cart item quantity management
cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
        const itemId = e.target.getAttribute('data-id');
        const action = e.target.getAttribute('data-action');
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            if (action === 'increase') {
                item.quantity += 1;
                cartCount += 1;
            } else if (action === 'decrease' && item.quantity > 1) {
                item.quantity -= 1;
                cartCount -= 1;
            }
            updateCartUI();
        }
    }
    
    if (e.target.classList.contains('remove-btn')) {
        const itemId = e.target.getAttribute('data-id');
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            cartCount -= cart[itemIndex].quantity;
            cart.splice(itemIndex, 1);
            updateCartUI();
        }
    }
});

// Menu filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        filterMenuItems(category);
    });
});

function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            // Add fade-in animation
            item.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            item.style.display = 'none';
        }
    });
}

// Form submissions
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '#2ecc71';
            contactForm.reset();
        }, 2000);
    }, 1500);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simulate login
    const submitBtn = loginForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Success!';
        submitBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            closeModal(loginModal);
            loginButton.textContent = 'Welcome!';
            loginButton.style.background = '#27ae60';
            loginForm.reset();
        }, 1000);
    }, 1500);
});

// Order Now button
orderNowBtn.addEventListener('click', () => {
    const menuSection = document.getElementById('menu');
    const offsetTop = menuSection.offsetTop - 70;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Simulate checkout process
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        alert('Order placed successfully! Thank you for your purchase.');
        cart = [];
        cartCount = 0;
        updateCartUI();
        closeModal(cartModal);
        
        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.disabled = false;
    }, 2000);
});

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .menu-item, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial styles for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .menu-item, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation check
    setTimeout(handleScrollAnimations, 100);
});

// Listen for scroll events
window.addEventListener('scroll', handleScrollAnimations);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .cart-item {
        transition: all 0.3s ease;
    }
    
    .quantity-btn {
        background: #f8f9fa;
        border: 1px solid #ddd;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quantity-btn:hover {
        background: #2ecc71;
        color: white;
        border-color: #2ecc71;
    }
`;
document.head.appendChild(style);