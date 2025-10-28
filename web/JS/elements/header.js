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
