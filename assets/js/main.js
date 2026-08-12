// Main JavaScript file for Kingson Residences

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Mobile hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Image gallery functionality
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.style.opacity = '0.6');
                this.style.opacity = '1';
            });
        });
        // Set first thumbnail as active
        thumbnails[0].style.opacity = '1';
    }

    // Property filter functionality
    const filterBtn = document.querySelector('.btn-filter');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const type = document.getElementById('propertyType').value;
            const priceRange = document.getElementById('priceRange').value;
            const location = document.getElementById('location').value;
            
            const propertyCards = document.querySelectorAll('.property-card');
            
            propertyCards.forEach(card => {
                let show = true;
                
                // Filter by type
                if (type !== 'all') {
                    const cardType = card.dataset.type || 'apartment';
                    if (cardType !== type) show = false;
                }
                
                // Filter by price
                if (priceRange !== 'all' && show) {
                    const priceText = card.querySelector('.price').textContent;
                    const price = parseInt(priceText.replace(/[₹,]/g, ''));
                    
                    if (priceRange === 'below50' && price >= 5000000) show = false;
                    else if (priceRange === '50to1cr' && (price < 5000000 || price > 10000000)) show = false;
                    else if (priceRange === 'above1cr' && price <= 10000000) show = false;
                }
                
                // Filter by location
                if (location !== 'all' && show) {
                    const cardLocation = card.querySelector('.location')?.textContent || '';
                    if (!cardLocation.toLowerCase().includes(location)) show = false;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simple validation
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                // Import Firebase functions dynamically
                const { addContactMessage } = await import('./firebase-auth.js');
                await addContactMessage(formData);
                
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification('Error sending message. Please try again.', 'error');
            }
        });
    }

    // ===== PROPERTY ENQUIRY =====
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                propertyId: document.getElementById('propertyId').value || '',
                name: document.getElementById('enquiryName').value,
                email: document.getElementById('enquiryEmail').value,
                phone: document.getElementById('enquiryPhone').value,
                message: document.getElementById('enquiryMessage').value,
                preferredDate: document.getElementById('preferredDate').value,
                preferredTime: document.getElementById('preferredTime').value
            };
            
            try {
                const { addEnquiry } = await import('./firebase-auth.js');
                await addEnquiry(formData);
                
                showNotification('Enquiry submitted successfully! We\'ll contact you soon.', 'success');
                enquiryForm.reset();
            } catch (error) {
                console.error('Error submitting enquiry:', error);
                showNotification('Error submitting enquiry. Please try again.', 'error');
            }
        });
    }

    // ===== WISHLIST FUNCTIONALITY =====
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            if (icon.classList.contains('fas')) {
                this.style.color = '#e74c3c';
                showNotification('Property added to wishlist!', 'success');
            } else {
                this.style.color = '';
                showNotification('Property removed from wishlist.', 'info');
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    // Simple scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .property-card, .benefit-card, .mv-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #e67e22;
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 5px 15px rgba(230, 126, 34, 0.3);
        transition: all 0.3s;
        opacity: 0;
        visibility: hidden;
        z-index: 999;
    `;
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(230, 126, 34, 0.5)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(230, 126, 34, 0.3)';
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // ===== NOTIFICATION SYSTEM =====
    window.showNotification = function(message, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${colors[type] || colors.info};
            color: #fff;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
            cursor: pointer;
        `;
        notification.textContent = message;

        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            margin-left: 15px;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
        `;
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', function() {
            this.remove();
        });
    };

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== UTILITY FUNCTIONS =====

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
}

// Format price in Indian Rupees
export function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Get property type label
export function getPropertyTypeLabel(type) {
    const types = {
        'apartment': 'Apartment',
        'house': 'House/Villa',
        'land': 'Residential Land',
        'commercial': 'Commercial Property'
    };
    return types[type] || type;
}

// Get status label with color
export function getStatusInfo(status) {
    const statuses = {
        'available': { label: 'Available', class: 'status-available' },
        'sold': { label: 'Sold', class: 'status-sold' },
        'under_construction': { label: 'Under Construction', class: 'status-under-construction' },
        'booked': { label: 'Booked', class: 'status-booked' }
    };
    return statuses[status] || { label: status, class: '' };
}

// Truncate text
export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Generate slug from title
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Get current date in ISO format
export function getCurrentDate() {
    return new Date().toISOString();
}

// Format date
export function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year);
}

console.log('Kingson Residences - Website Loaded Successfully!');