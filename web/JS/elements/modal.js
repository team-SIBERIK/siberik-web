document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".person-card");
    const fade = document.getElementById("fadeBackground");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const target = card.getAttribute("data-modal");
            openModal(target);
        });
    });

    fade.addEventListener("click", () => {
        closeAllModals();
    });
});


function openModal(id) {
    const modal = document.getElementById(id);
    const fade = document.getElementById("fadeBackground");
    modal.classList.add("show");
    fade.classList.add("show");
    document.body.style.overflow = "hidden"; // blocks page scroll
}

function closeModal(id) {
    const modal = document.getElementById(id);
    const fade = document.getElementById("fadeBackground");
    modal.classList.add("closing");
    fade.classList.add("closing");

    setTimeout(() => {
        modal.classList.remove("show", "closing");
        fade.classList.remove("show", "closing");
        document.body.style.overflow = ""; // reactivates page scroll
    }, 400);
}

function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.add("closing");
    });
    const fade = document.getElementById("fadeBackground");
    fade.classList.add("closing");

    setTimeout(() => {
        document.querySelectorAll(".modal").forEach(modal => modal.classList.remove("show", "closing"));
        fade.classList.remove("show", "closing");
        document.body.style.overflow = ""; // reactivates page scroll
    }, 400);
}
