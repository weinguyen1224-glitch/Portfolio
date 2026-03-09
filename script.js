// Custom cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Header scroll effect
const header = document.querySelector('header');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Experience tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Portfolio data
const portfolioData = [
    { category: 'trung-thu', title: 'Trung thu', path: './asset/anhtrungthu/', count: 10 },
    { category: 'non-la', title: 'Nón lá', path: './asset/anhnonla/', count: 10 },
    { category: 'hoc-duong', title: 'Học đường', path: './asset/nhungnhanvattrongphimhocduong/', count: 4 },
    { category: 'nhom-nhac', title: 'Nhóm nhạc giả lập', path: './asset/duannhomnhacgialap/', count: 10 },
    { category: 'ao-dai', title: 'Áo dài mùa thu', path: './asset/aodaimuathu/', count: 10 },
    { category: 'ngoai-giao', title: 'Đọng lại ngoại giao', path: './asset/donglaingoaigiao/', count: 14 },
    { category: 'nang-tho', title: 'Nàng thơ', path: './asset/anhnangtho/', count: 7 }
];

// Carousel variables
let currentCategory = 'all';
let currentSlide = 0;
let slidesPerView = 3; // Default for desktop
let allSlides = [];

// Initialize carousel
function initCarousel() {
    // Determine slides per view based on screen width
    if (window.innerWidth < 768) {
        slidesPerView = 1; // Mobile
    } else if (window.innerWidth < 1024) {
        slidesPerView = 2; // Tablet
    } else {
        slidesPerView = 3; // Desktop
    }

    // Generate all slides
    generateSlides();

    // Set up carousel navigation
    setupCarouselNavigation();

    // Initial display
    updateCarousel();
}

// Generate all slides
function generateSlides() {
    const carouselTrack = document.querySelector('.carousel-track');
    carouselTrack.innerHTML = '';
    allSlides = [];

    portfolioData.forEach(category => {
        for (let i = 1; i <= category.count; i++) {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${category.category}`;
            slide.setAttribute('data-category', category.category);

            slide.innerHTML = `
                <img src="${category.path}${i}.jpg" alt="${category.title} ${i}">
                <div class="carousel-info">
                    <h3>${category.title}</h3>
                </div>
            `;

            carouselTrack.appendChild(slide);
            allSlides.push(slide);

            // Add click event for lightbox
            slide.addEventListener('click', () => {
                openLightbox(slide);
            });
        }
    });
}

// Set up carousel navigation
function setupCarouselNavigation() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    prevBtn.addEventListener('click', () => {
        navigateCarousel('prev');
    });

    nextBtn.addEventListener('click', () => {
        navigateCarousel('next');
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Update current category
            currentCategory = btn.getAttribute('data-filter');
            currentSlide = 0;

            // Update carousel
            updateCarousel();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateCarousel('prev');
        } else if (e.key === 'ArrowRight') {
            navigateCarousel('next');
        }
    });
}

// Navigate carousel
function navigateCarousel(direction) {
    const visibleSlides = getVisibleSlides();
    const maxSlide = Math.max(0, visibleSlides.length - slidesPerView);

    if (direction === 'prev') {
        currentSlide = Math.max(0, currentSlide - 1);
    } else {
        currentSlide = Math.min(maxSlide, currentSlide + 1);
    }

    updateCarousel();
}

// Get visible slides based on current category
function getVisibleSlides() {
    if (currentCategory === 'all') {
        return allSlides;
    } else {
        return allSlides.filter(slide => slide.getAttribute('data-category') === currentCategory);
    }
}

// Update carousel display
function updateCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const visibleSlides = getVisibleSlides();

    // Show/hide slides based on category
    allSlides.forEach(slide => {
        if (currentCategory === 'all' || slide.getAttribute('data-category') === currentCategory) {
            slide.style.display = 'block';
        } else {
            slide.style.display = 'none';
        }
    });

    // Calculate slide width and track position
    const slideWidth = 100 / slidesPerView;
    const trackPosition = -currentSlide * slideWidth;

    // Update slide width
    visibleSlides.forEach(slide => {
        slide.style.flex = `0 0 calc(${slideWidth}% - 20px)`;
    });

    // Update track position
    carouselTrack.style.transform = `translateX(${trackPosition}%)`;

    // Update navigation buttons
    updateNavigationButtons(visibleSlides);
}

// Update navigation buttons state
function updateNavigationButtons(visibleSlides) {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    // Disable prev button if at the beginning
    if (currentSlide === 0) {
        prevBtn.classList.add('disabled');
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }

    // Disable next button if at the end
    const maxSlide = Math.max(0, visibleSlides.length - slidesPerView);
    if (currentSlide >= maxSlide) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let currentImages = [];

// Open lightbox
function openLightbox(slide) {
    const visibleSlides = getVisibleSlides();
    currentImageIndex = visibleSlides.indexOf(slide);

    currentImages = visibleSlides.map(slide => ({
        src: slide.querySelector('img').src,
        alt: slide.querySelector('img').alt,
        title: slide.querySelector('.carousel-info h3').textContent
    }));

    showLightboxImage();
}

// Show lightbox image
function showLightboxImage() {
    const currentImage = currentImages[currentImageIndex];
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.title;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide lightbox
function hideLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
function navigateLightbox(direction) {
    if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    } else {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    }

    showLightboxImage();
}

// Set up lightbox event listeners
function setupLightbox() {
    // Close lightbox
    lightboxClose.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });

    // Navigate lightbox
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                hideLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.section-header, .about-content, .timeline-item, .skill-item, .contact-item');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Add CSS for reveal animations
const style = document.createElement('style');
style.textContent = `
    .section-header, .about-content, .timeline-item, .skill-item, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-header.active, .about-content.active, .timeline-item.active, .skill-item.active, .contact-item.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item:nth-child(even) {
        transform: translateX(-30px);
    }
    
    .timeline-item:nth-child(odd) {
        transform: translateX(30px);
    }
    
    .timeline-item.active {
        transform: translateX(0);
    }
`;
document.head.appendChild(style);

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you would typically send the form data to a server
    // For this example, we'll just log it and show a success message
    console.log('Form submitted:', { name, email, message });

    // Show success message
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.style.display = 'none');

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.style.display = 'none';

    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Cảm ơn bạn!</h3>
        <p>Tin nhắn của bạn đã được gửi thành công. Tôi sẽ liên hệ lại với bạn sớm nhất có thể.</p>
    `;

    contactForm.appendChild(successMessage);

    // Add CSS for success message
    const successStyle = document.createElement('style');
    successStyle.textContent = `
        .success-message {
            text-align: center;
            padding: 20px;
            animation: fadeIn 0.5s forwards;
        }
        
        .success-message i {
            font-size: 3rem;
            color: var(--color-secondary);
            margin-bottom: 15px;
        }
        
        .success-message h3 {
            color: var(--color-primary);
            margin-bottom: 10px;
        }
        
        .success-message p {
            color: var(--color-light-text);
        }
    `;
    document.head.appendChild(successStyle);

    // Reset form after 5 seconds
    setTimeout(() => {
        contactForm.reset();
        successMessage.remove();
        formGroups.forEach(group => group.style.display = 'block');
        submitBtn.style.display = 'block';
    }, 5000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Handle window resize for responsive carousel
window.addEventListener('resize', () => {
    // Update slides per view
    if (window.innerWidth < 768) {
        slidesPerView = 1; // Mobile
    } else if (window.innerWidth < 1024) {
        slidesPerView = 2; // Tablet
    } else {
        slidesPerView = 3; // Desktop
    }

    // Reset current slide if needed
    const visibleSlides = getVisibleSlides();
    const maxSlide = Math.max(0, visibleSlides.length - slidesPerView);
    if (currentSlide > maxSlide) {
        currentSlide = maxSlide;
    }

    // Update carousel
    updateCarousel();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    setupLightbox();
    revealOnScroll();

    window.addEventListener('scroll', revealOnScroll);
});