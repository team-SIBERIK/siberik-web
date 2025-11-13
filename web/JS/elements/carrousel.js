// === Multi-carousel setup ===
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const images = Array.from(track.children);

    let currentIndex = 0;
    let autoSlide;

    function updateCarousel() {
        const width = track.clientWidth;
        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    // --- reset autoslide ---
    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 5000);
    }

    // --- button listener ---
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    // --- Resize ---
    window.addEventListener('resize', updateCarousel);

    // --- Initial Auto-slide ---
    resetAutoSlide();
});
