// Intersection Observer for Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('section').forEach((el) => observer.observe(el));

// Add floating animation to social icons
const socialLinks = document.querySelectorAll('.social-links a');

socialLinks.forEach(link => {
    link.style.animation = 'float 3s ease-in-out infinite';
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const navLinks = document.getElementById('nav-links');
const navLinksList = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        menuToggle.style.display = 'none';
        menuClose.style.display = 'block';
    } else {
        menuToggle.style.display = 'block';
        menuClose.style.display = 'none';
    }
});

menuClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.style.display = 'block';
    menuClose.style.display = 'none';
});

// Close menu when clicking on a link
navLinksList.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.style.display = 'block';
        menuClose.style.display = 'none';
    });
});
