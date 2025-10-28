// === ELEMENT REFERENCES ===
const intro = document.getElementById("intro");
const main = document.getElementById("main-content");
const btnKnowUs = document.getElementById("btnKnowUs");
const btnContactUs = document.getElementById("btnContactUs");
const footer = document.querySelector("footer");

// === FADE FUNCTIONS ===

// Fade out the intro section
function fadeOutIntro(callback) {
    intro.style.opacity = 0;
    setTimeout(() => {
        intro.style.display = "none";
        callback();
    }, 600);
}

// Show the main content section with fade-in effect
function showMainContent(callback) {
    main.style.display = "block";
    setTimeout(() => {
        main.style.opacity = 1;
        if (callback) callback();
            showFooter(); 
    }, 100);
}

// === FOOTER FUNCTIONS ===

// Show the footer with a smooth fade-in
function showFooter() {
    if (footer) {
        footer.style.display = "block";
        footer.style.opacity = 0;
        setTimeout(() => {
            footer.style.transition = "opacity 0.6s";
            footer.style.opacity = 1;
        }, 50);
    }
}

// === EVENT LISTENERS ===

// Show main content when clicking "Know Us" button
btnKnowUs.addEventListener("click", () => {
    fadeOutIntro(() => showMainContent());
});

// Show main content and scroll to "Contact" section when clicking "Contact Us"
btnContactUs.addEventListener("click", () => {
    fadeOutIntro(() => {
        showMainContent(() => {
            scrollToWithOffset("#contacto");
        });
    });
});

// === INITIALIZATION ON PAGE LOAD ===
window.addEventListener("load", () => {
    if (footer) {
        footer.style.display = "none"; // hide footer initially
    }
});
