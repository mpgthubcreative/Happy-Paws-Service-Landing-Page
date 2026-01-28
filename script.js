// Auto-activate card on scroll for mobile
const servicesCarousel = document.querySelector('.card-box');
const cards = document.querySelectorAll('.card');
function updateActiveCard() {
    if (window.innerWidth < 768 && servicesCarousel) {
        const containerCenter = servicesCarousel.scrollLeft + (servicesCarousel.clientWidth / 2);
        
        let closestCard = null;
        let closestDistance = Infinity;
        
        cards.forEach(card => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        });
        
        // Remove active from all cards
        cards.forEach(c => c.classList.remove('active'));
        
        // Add active to the centered card
        if (closestCard) {
            closestCard.classList.add('active');
        }
    }
}

// Listen to scroll events on the carousel
if (servicesCarousel) {
    servicesCarousel.addEventListener('scroll', updateActiveCard);
    // Initialize on load
    window.addEventListener('load', updateActiveCard);
    updateActiveCard();
}

// Card click interaction for mobile - allow clicking to manually activate
cards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Only apply on mobile
        if (window.innerWidth < 768) {
            // Don't toggle if clicking the Book Now button directly
            if (e.target.classList.contains('card-book-button')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active from all cards
            cards.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked card
            this.classList.add('active');
            
            // Scroll to center this card
            const cardLeft = this.offsetLeft;
            const cardWidth = this.offsetWidth;
            const containerWidth = servicesCarousel.clientWidth;
            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            
            servicesCarousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky Mobile CTA - Show/Hide based on Hero Section
const stickyCTA = document.querySelector('.sticky-mobile-cta-container');
const heroSection = document.querySelector('.hero-section');

if (stickyCTA && heroSection) {
    function toggleStickyCTA() {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        
        // Hide when in hero section, show when scrolled past
        if (heroBottom > 0) {
            stickyCTA.classList.add('hide');
            stickyCTA.classList.remove('show');
        } else {
            stickyCTA.classList.remove('hide');
            stickyCTA.classList.add('show');
        }
    }
    
    window.addEventListener('scroll', toggleStickyCTA);
    window.addEventListener('load', toggleStickyCTA);
    toggleStickyCTA();
}

// Service Card Mobile Touch/Click Interaction
cards.forEach(card => {
    // For mobile - toggle on click/touch
    card.addEventListener('click', function(e) {
        // Only toggle if not clicking the button
        if (!e.target.closest('.card-overlay-button')) {
            // Check if screen is mobile (less than 768px)
            if (window.innerWidth < 768) {
                // Close all other cards
                cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                // Toggle current card
                this.classList.toggle('active');
            }
        }
    });
});

// Close overlay when clicking outside on mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth < 768) {
        if (!e.target.closest('.card')) {
            cards.forEach(card => {
                card.classList.remove('active');
            });
        }
    }
});

// Hide Main Header in Footer CTA Section on Desktop
const mainHeader = document.querySelector('.main-header');
const footerCTA = document.querySelector('.footer-cta-box');

if (mainHeader && footerCTA) {
    function toggleMainHeader() {
        const isDesktop = window.innerWidth >= 768;
        
        if (isDesktop) {
            const footerCTATop = footerCTA.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Hide header when footer CTA is in view
            if (footerCTATop < windowHeight) {
                mainHeader.style.transform = 'translateY(-100%)';
                mainHeader.style.transition = 'transform 0.3s ease';
            } else {
                mainHeader.style.transform = 'translateY(0)';
            }
        } else {
            // Reset for mobile
            mainHeader.style.transform = 'translateY(0)';
        }
    }
    
    window.addEventListener('scroll', toggleMainHeader);
    window.addEventListener('load', toggleMainHeader);
    window.addEventListener('resize', toggleMainHeader);
    toggleMainHeader();
}
// Appointment Booking System
const appointmentData = {
    service: '',
    size: '',
    price: 0
};

// Save service selection
document.addEventListener('DOMContentLoaded', () => {
    // On service selection page (index.html)
    const serviceCards = document.querySelectorAll('.card:not(.size-card)');
    const continueBtn = document.getElementById('continueBtn');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all service cards
            serviceCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            const serviceName = card.querySelector('.card-badge').textContent;
            localStorage.setItem('selectedService', serviceName);
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.classList.remove('disabled');
                continueBtn.href = './size.html';
            }
        });
    });

    // On size selection page (size.html)
    const sizeCards = document.querySelectorAll('.size-card');
    const continueSizeBtn = document.getElementById('continueSizeBtn');
    
    sizeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all size cards
            sizeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            const sizeName = card.querySelector('.card-badge').textContent;
            localStorage.setItem('selectedSize', sizeName);
            
            // Calculate price based on service and size
            const service = localStorage.getItem('selectedService');
            const price = calculatePrice(service, sizeName);
            localStorage.setItem('selectedPrice', price);
            
            // Enable continue button
            if (continueSizeBtn) {
                continueSizeBtn.classList.remove('disabled');
                continueSizeBtn.href = './summary.html';
            }
        });
    });

    // On summary page - display the selections
    if (window.location.pathname.includes('summary.html')) {
        displaySummary();
    }
});

// Calculate price based on service and size
function calculatePrice(service, size) {
    const prices = {
        'Bath and Dry': { 'Small (1-10 kg)': 800, 'Medium (11-20 kg)': 900, 'Large (21-30 kg)': 1000, 'Extra Large (31+ Kg)': 1000 },
        'Full Groom': { 'Small (1-10 kg)': 1000, 'Medium (11-20 kg)': 1100, 'Large (21-30 kg)': 1200, 'Extra Large (31+ Kg)': 1300 },
        'à la carte': { 'Small (1-10 kg)': '150 - 250', 'Medium (11-20 kg)': '150 - 250', 'Large (21-30 kg)': '150 - 250', 'Extra Large (31+ Kg)': '150 - 250' }
    };
    
    return prices[service]?.[size] || 0;
}

// Display summary on summary page
function displaySummary() {
    const service = localStorage.getItem('selectedService');
    const size = localStorage.getItem('selectedSize');
    const price = localStorage.getItem('selectedPrice');
    
    if (service && size && price) {
        const summaryService = document.querySelector('.summary-service');
        const summaryPrice = document.querySelector('.summary-price');
        
        if (summaryService) {
            summaryService.textContent = `${service} / ${size}`;
        }
        if (summaryPrice) {
            summaryPrice.textContent = `₱${price}`;
        }
        
        // Map service and size combinations to Setmore booking links
        const setmoreLinks = {
            'Bath and Dry': {
                'Small (1-10 kg)': 'https://happypawssp2v.setmore.com/services/c44da64d-87bb-4531-89fd-b60705ee5dcc', // Replace with Small Dog Bath and Dry link
                'Medium (11-20 kg)': 'https://happypawssp2v.setmore.com/services/d57817db-ac2a-4071-9236-ba1dd9f707cb', // Replace with Medium Dog Bath and Dry link
                'Large (21-30 kg)': 'https://happypawssp2v.setmore.com/services/2df9a31e-c524-4215-8ecc-2a3396c0aa65', // Replace with Large Dog Bath and Dry link
                'Extra Large (31+ Kg)': 'https://happypawssp2v.setmore.com/services/ad004564-f5d3-48dc-aad0-965fa8b07441' // Replace with Extra Large Dog Bath and Dry link
            },
            'Full Groom': {
                'Small (1-10 kg)': 'https://happypawssp2v.setmore.com/services/4c3b862e-4e88-425f-a2ba-fea20d5e7322', // Replace with Small Dog Full Groom link
                'Medium (11-20 kg)': 'https://happypawssp2v.setmore.com/services/1fd8b0e7-747b-41e6-8172-532aa06f4033', // Replace with Medium Dog Full Groom link
                'Large (21-30 kg)': 'https://happypawssp2v.setmore.com/services/28a4d65e-d780-4414-b77d-a482a0f4d2a1', // Replace with Large Dog Full Groom link
                'Extra Large (31+ Kg)': 'https://happypawssp2v.setmore.com/services/6d17f83c-ff2c-4bcc-bd02-8bd39924f4a7' // Replace with Extra Large Dog Full Groom link
            },
            'à la carte': {
                'Small (1-10 kg)': 'https://happypawssp2v.setmore.com/services/c5a93d15-2177-4b0b-bcd7-f34216b3ad1c',
                'Medium (11-20 kg)': 'https://happypawssp2v.setmore.com/services/c21571b1-9b2f-4847-bcdd-bd5c3c764d79',
                'Large (21-30 kg)': 'https://happypawssp2v.setmore.com/services/eb3d5ebc-e63f-4f2c-8442-d6b0fb4cfb0c',
                'Extra Large (31+ Kg)': 'https://happypawssp2v.setmore.com/services/739da2bd-3142-4ebb-9f9d-80715246f9e5'
            }
        };
        
        // Update Schedule Appointment button with correct Setmore link
        const scheduleBtn = document.getElementById('scheduleBtn');
        if (scheduleBtn && setmoreLinks[service]?.[size]) {
            scheduleBtn.href = setmoreLinks[service][size];
        }
    }
}