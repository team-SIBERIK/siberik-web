/* ===========================================================
   SERVICE CAROUSEL - Siberik
   Carga servicios desde JSON + carga HTML dinámico
   =========================================================== */

class ServiceLoader {
    static async loadJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudo cargar el JSON de servicios.");
        return await res.json();
    }

    static async loadHTML(path) {
        // Ajustá este basePath según donde tengas los HTML
        const basePath = "web/JS/services/"; 
        const finalPath = path.startsWith("http")
            ? path
            : basePath + path;

        const res = await fetch(finalPath);
        if (!res.ok) throw new Error(`No se pudo cargar ${finalPath}`);
        return await res.text();
    }
}

/* ===========================================================
   CARRUSEL CON ANIMACIÓN SUAVE (posición + escala)
   =========================================================== */

class ServiceCarousel {
    constructor(services, rootId, detailId) {
        this.services = services;
        this.current = 0; // índice del servicio central
        this.visibleIndices = []; // [prev, current, next]

        this.root = document.getElementById(rootId);
        this.detail = document.getElementById(detailId);

        if (!this.root) throw new Error("No se encontró el root del carrusel.");
        if (!this.detail) throw new Error("No se encontró el contenedor de detalle.");

        this.isAnimating = false;
        this.animationDuration = 350; // ms

        this._renderSkeleton();

        this.carousel = this.root.querySelector(".service-carousel");
        this.btnView = this.root.querySelector("#serviceViewBtn");
        this.arrowLeft = this.root.querySelector("#serviceArrowLeft");
        this.arrowRight = this.root.querySelector("#serviceArrowRight");

        this.items = []; // referencias a los 3 .service-item

        this._setupInitialItems();
        this._attachEvents();
        this._handleResize();
    }

    /* ---------- ESTRUCTURA HTML DEL CARRUSEL ---------- */
    _renderSkeleton() {
        this.root.innerHTML = `
            <div class="service-carousel-container">
                <div id="serviceArrowLeft" class="service-arrow">‹</div>

                <div class="service-carousel" id="serviceCarousel"></div>

                <div id="serviceArrowRight" class="service-arrow">›</div>
            </div>

            <div class="service-view-btn-wrapper">
                <button id="serviceViewBtn" class="service-view-btn">Ver servicio</button>
            </div>
        `;
    }

    /* ---------- Cálculo de offset según ancho carrusel ---------- */
    _computeOffset() {
        const rect = this.carousel.getBoundingClientRect();
        const width = rect.width || 300;
        // separo los iconos aprox en un cuarto del ancho
        return width * 0.25;
    }

    /* ---------- Inicialización de los 3 items visibles ---------- */
    _setupInitialItems() {
        const prev = (this.current - 1 + this.services.length) % this.services.length;
        const next = (this.current + 1) % this.services.length;
        this.visibleIndices = [prev, this.current, next];

        const carr = this.carousel;
        carr.innerHTML = "";

        const offset = this._computeOffset();
        const baseXs = [-offset, 0, offset];
        const baseScales = [0.8, 1, 0.8];

        this.items = [];

        this.visibleIndices.forEach((serviceIndex, i) => {
            const service = this.services[serviceIndex];

            const item = document.createElement("div");
            item.classList.add("service-item");
            if (i === 1) item.classList.add("center");

            item.innerHTML = `
                <img src="${service.icon}" alt="${service.name}">
            `;

            // Sin transición CSS, animamos todo con JS
            item.style.transition = "none";
            item.style.transform = `translateX(${baseXs[i]}px) scale(${baseScales[i]})`;

            carr.appendChild(item);
            this.items.push(item);
        });
    }

    /* ---------- Re-posicionar en resize para que no se rompa ---------- */
    _handleResize() {
        window.addEventListener("resize", () => {
            if (this.isAnimating) return;

            const offset = this._computeOffset();
            const baseXs = [-offset, 0, offset];
            const baseScales = [0.8, 1, 0.8];

            this.items.forEach((item, i) => {
                item.style.transform = `translateX(${baseXs[i]}px) scale(${baseScales[i]})`;
            });
        });
    }

    /* ===========================================================
       ANIMACIÓN SUAVE (posición + escala lineal)
       direction: "left" -> voy al anterior
                  "right" -> voy al siguiente
       =========================================================== */
    _animate(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const len = this.services.length;
        const offset = this._computeOffset();

        const baseXs = [-offset, 0, offset];
        const baseScales = [0.8, 1, 0.8];

        let endXs, endScales;

        if (direction === "right") {
            // Me desplazo hacia la derecha: el item de la derecha pasa al centro
            endXs = [-2 * offset, -offset, 0];
            endScales = [0.8, 0.8, 1];
        } else {
            // Me desplazo hacia la izquierda: el item de la izquierda pasa al centro
            endXs = [0, offset, 2 * offset];
            endScales = [1, 0.8, 0.8];
        }

        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / this.animationDuration); // 0..1

            for (let i = 0; i < 3; i++) {
                const x = baseXs[i] + (endXs[i] - baseXs[i]) * t;
                const s = baseScales[i] + (endScales[i] - baseScales[i]) * t;
                this.items[i].style.transform = `translateX(${x}px) scale(${s})`;
            }

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                // Termina animación: actualizo índices, imágenes y reseteo posiciones
                if (direction === "right") {
                    this.current = (this.current + 1) % len;
                } else {
                    this.current = (this.current - 1 + len) % len;
                }

                const prev = (this.current - 1 + len) % len;
                const next = (this.current + 1) % len;
                this.visibleIndices = [prev, this.current, next];

                // Actualizar contenido de cada item
                this.items.forEach((item, i) => {
                    const service = this.services[this.visibleIndices[i]];
                    const img = item.querySelector("img");
                    img.src = service.icon;
                    img.alt = service.name;

                    item.classList.toggle("center", i === 1);
                });

                // Recoloco en posiciones base
                const newOffset = this._computeOffset();
                const xs = [-newOffset, 0, newOffset];
                const scales = [0.8, 1, 0.8];

                this.items.forEach((item, i) => {
                    item.style.transform = `translateX(${xs[i]}px) scale(${scales[i]})`;
                });

                this.isAnimating = false;
            }
        };

        requestAnimationFrame(step);
    }

    _moveLeft() {
        this._animate("left");
    }

    _moveRight() {
        this._animate("right");
    }

    /* ---------- EVENTOS ---------- */
    _attachEvents() {
        if (this.arrowLeft) {
            this.arrowLeft.addEventListener("click", () => this._moveLeft());
        }

        if (this.arrowRight) {
            this.arrowRight.addEventListener("click", () => this._moveRight());
        }

        if (this.btnView) {
            this.btnView.addEventListener("click", () => this._showDetail());
        }
    }

    /* ---------- CARGAR HTML DEL SERVICIO Y PINTARLO ---------- */
    async _showDetail() {
        const service = this.services[this.current];

        try {
            const html = await ServiceLoader.loadHTML(service.description);
            this.detail.innerHTML = html;
            this.detail.style.display = "block";

            this.detail.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (err) {
            console.error(err);
        }
    }
}

/* ===========================================================
   INICIALIZADOR PRINCIPAL
   =========================================================== */

async function initServiceCarousel() {
    try {
        const services = await ServiceLoader.loadJSON("web/JS/services/services.json");

        new ServiceCarousel(
            services,
            "serviceCarouselRoot",
            "serviceDetail"
        );
    } catch (err) {
        console.error("Error inicializando el carrusel:", err);
    }
}

document.addEventListener("DOMContentLoaded", initServiceCarousel);
