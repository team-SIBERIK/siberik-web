document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".founder-btn");
    const fade = document.getElementById("fadeBackground");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
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
    document.body.style.overflow = "hidden"; // 🚫 bloquea scroll de la página
}

function closeModal(id) {
    const modal = document.getElementById(id);
    const fade = document.getElementById("fadeBackground");
    modal.classList.add("closing");
    fade.classList.add("closing");

    setTimeout(() => {
        modal.classList.remove("show", "closing");
        fade.classList.remove("show", "closing");
        document.body.style.overflow = ""; // ✅ reactiva scroll al cerrar
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
        document.body.style.overflow = ""; // ✅ vuelve a permitir scroll
    }, 400);
}
