// Import Document Items
const navHamburger = document.querySelector(".nav_hamburger");
const navMenuIcon = document.querySelector(".nav_menuIcon");
const navCloseIcon = document.querySelector(".nav_closeIcon");
const mobileNav = document.querySelector(".nav_mobileLinks");

// Event Listeners
navHamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains("nav_mobileMenuOpen")) {
        mobileNav.classList.remove("nav_mobileMenuOpen");
        navMenuIcon.style.display = "block";
        navCloseIcon.style.display = "none";
    } else {
        mobileNav.classList.add("nav_mobileMenuOpen");
        navMenuIcon.style.display = "none";
        navCloseIcon.style.display = "block";
    }
});