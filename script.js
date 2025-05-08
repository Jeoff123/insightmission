document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNavbar = hamburger.contains(event.target) || navLinks.contains(event.target);
        
        if (!isClickInsideNavbar) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});
