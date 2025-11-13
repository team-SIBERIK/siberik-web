// === NAV ACTIVE LINK ON SCROLL ===
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 140; // adjust based on header height
        const sectionHeight = section.offsetHeight;

        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
        }
    });
});


// Apply smooth scroll to all nav links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToWithOffset(this.getAttribute('href'));
    });
});

// === SMOOTH SCROLL FUNCTION WITH OFFSET ===

function scrollToWithOffset(selector) {
    const target = document.querySelector(selector);
    const headerOffset = 120; // header height + extra offset
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function initHeaderMenu() {
    const toggleBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    if (!toggleBtn || !nav) {
        console.error("Header initialization failed: missing DOM elements.");
        return;
    }

    setupHeaderMenuEvents(toggleBtn, nav);
}

function setupHeaderMenuEvents(toggleBtn, nav) {
    toggleBtn.addEventListener("click", (e) => handleMenuToggle(e, nav));
    document.addEventListener("click", (e) =>
        handleOutsideClick(e, toggleBtn, nav)
    );
}

function handleMenuToggle(event, nav) {
    event.stopPropagation();
    nav.classList.toggle("show");
}

function handleOutsideClick(event, toggleBtn, nav) {
    const clickedOutside =
        !nav.contains(event.target) && !toggleBtn.contains(event.target);
    if (clickedOutside) {
        nav.classList.remove("show");
    }
}

/* === Initialization === */
document.addEventListener("DOMContentLoaded", initHeaderMenu);

