

function initHeader() {
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", () => {
        const open = menuToggle.classList.toggle("open");
        if (open) nav.classList.add("open");
        else nav.classList.remove("open");
    });

    nav.querySelectorAll("a.nav-link").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.classList.remove("open");
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const header = document.querySelector(".sb-header");
            const offset = (header?.offsetHeight || 0);
            const rect = target.getBoundingClientRect();
            const top = rect.top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initSmoothScroll();
});
