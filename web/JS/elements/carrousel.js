// === Multi-carousel setup ===
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const images = Array.from(track.children);

    let currentIndex = 0;

    function updateCarousel() {
        const width = track.clientWidth;
        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);

    setInterval(() => nextBtn.click(), 5000);
});
