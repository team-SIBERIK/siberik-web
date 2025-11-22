/* ===========================================================
   TRUE INFINITE CAROUSEL - Siberik
=========================================================== */

class UltraSmoothCarousel {
    constructor(container, speed = 0.3) {
        this.container = container;
        this.speed = speed;

        this.track = document.createElement('div');
        this.track.classList.add('ia-logos-track');

        this.items = Array.from(container.children);
        container.innerHTML = '';
        container.appendChild(this.track);

        this._buildTrack();

        this.pos = 0;
        this.trackWidth = this.track.scrollWidth;

        this._animate = this._animate.bind(this);
        requestAnimationFrame(this._animate);
    }

    _buildTrack() {
        const seq = [...this.items, ...this.items, ...this.items];

        seq.forEach(item => {
            this.track.appendChild(item.cloneNode(true));
        });
    }

    _animate() {
        this.pos -= this.speed;

        if (Math.abs(this.pos) >= this.trackWidth / 3) {
            this.pos = 0;
        }

        this.track.style.transform = `translateX(${this.pos}px)`;
        requestAnimationFrame(this._animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ia-logos').forEach(el => {
        new UltraSmoothCarousel(el, 0.35);
    });
});
