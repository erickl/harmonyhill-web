
export function showHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('main-nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}