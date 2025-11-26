// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Hamburger Animation
    hamburger.classList.toggle('toggle');
});

// Close mobile menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
        links.forEach(l => l.style.animation = '');
    });
});

// Scroll Animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Target elements to animate
document.querySelectorAll('.section-title, .timeline-item, .card, .skill-category, .cert-list li').forEach(el => {
    el.classList.add('hidden-el');
    observer.observe(el);
});

// Add active class to nav links on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});
// Contact Modal Toggle
const contactBtn = document.querySelector('.btn-contact');
const contactModal = document.querySelector('.contact-modal');

if (contactBtn && contactModal) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.toggle('active');
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!contactBtn.contains(e.target) && !contactModal.contains(e.target)) {
            contactModal.classList.remove('active');
        }
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Copy Email to Clipboard
const emailLinks = document.querySelectorAll('.email-copy');

emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('data-email');

        // Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Create notification toast
            const notification = document.createElement('div');
            notification.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 0.5rem;">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
                <span>Email copied to clipboard!</span>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: var(--primary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                box-shadow: 0 10px 40px rgba(65, 189, 248, 0.4);
                animation: slideDown 0.4s ease forwards;
            `;

            document.body.appendChild(notification);

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideUp 0.4s ease forwards';
                setTimeout(() => notification.remove(), 400);
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy email:', err);
            // Show error notification
            alert('Failed to copy email. Please try again.');
        });
    });
});
