/* ===========================================================
   SERVICE CAROUSEL - Siberik
   Carga servicios desde JSON + HTML dinámico
   =========================================================== */

class ServiceLoader {
    static async loadJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudo cargar el JSON de servicios.");
        return await res.json();
    }

    static async loadHTML(path) {
        const basePath = "web/JS/services/";
        const finalPath = path.startsWith("http") ? path : basePath + path;

        const res = await fetch(finalPath);
        if (!res.ok) throw new Error(`No se pudo cargar ${finalPath}`);
        return await res.text();
    }
}

/* ===========================================================
   CARRUSEL ANIMADO (posición + escala + opacidad)
   =========================================================== */

class ServiceCarousel {
    constructor(services, rootId, detailId) {
        this.services = services;
        this.current = 0;             // índice del servicio central
        this.visibleIndices = [];     // [left, center, right]
        this.isAnimating = false;
        this.animationDuration = 350; // ms

        this.root = document.getElementById(rootId);
        this.detail = document.getElementById(detailId);

        if (!this.root) throw new Error("No se encontró el root del carrusel.");
        if (!this.detail) throw new Error("No se encontró el contenedor de detalle.");

        this._renderSkeleton();
        this.carousel = this.root.querySelector(".service-carousel");
        this.arrowLeft = this.root.querySelector("#serviceArrowLeft");
        this.arrowRight = this.root.querySelector("#serviceArrowRight");
        this.btnView = this.root.querySelector("#serviceViewBtn");
        this.items = [];

        this._setupInitialItems();
        this._attachEvents();
        this._handleResize();
    }

    /* ---------- Estructura HTML del carrusel ---------- */
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

    /* ---------- Offset dinámico ---------- */
    _computeOffset() {
        const width = this.carousel.getBoundingClientRect().width || 300;
        return width * 0.40;
    }

    /* ---------- Cargar los 3 elementos iniciales ---------- */
    _setupInitialItems() {
        const len = this.services.length;

        const left  = (this.current - 1 + len) % len;
        const right = (this.current + 1) % len;
        this.visibleIndices = [left, this.current, right];

        const off = this._computeOffset();
        const xs = [-off, 0, off];
        const scales = [0.75, 1.15, 0.75];
        const op = [0.5, 1.0, 0.5];

        this.carousel.innerHTML = "";
        this.items = [];

        this.visibleIndices.forEach((index, i) => {
            const service = this.services[index];
            const item = document.createElement("div");

            item.classList.add("service-item");
            if (i === 1) item.classList.add("center");

            item.innerHTML = `<img src="${service.icon}" alt="${service.name}">`;
            item.style.transition = "none";
            item.style.transform = `translateX(${xs[i]}px) scale(${scales[i]})`;
            item.style.opacity = op[i];

            this.carousel.appendChild(item);
            this.items.push(item);
        });
    }

    /* ---------- Resize responsive ---------- */
    _handleResize() {
        window.addEventListener("resize", () => {
            if (this.isAnimating) return;
            const off = this._computeOffset();
            const xs = [-off, 0, off];
            const scales = [0.75, 1.15, 0.75];

            this.items.forEach((item, i) => {
                item.style.transform = `translateX(${xs[i]}px) scale(${scales[i]})`;
            });
        });
    }

    /* ===========================================================
       ANIMACIÓN SUAVE COMPLETA (posición + escala + opacidad)
       =========================================================== */
    _animate(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const len = this.services.length;
        const off = this._computeOffset();
        const parse = (tr) => {
            const m = /translateX\(([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(tr);
            return { x: m ? parseFloat(m[1]) : 0, s: m ? parseFloat(m[2]) : 1 };
        };

        // leer estado inicial real
        const startX = [], startS = [], startO = [];
        this.items.forEach(it => {
            const { x, s } = parse(it.style.transform);
            startX.push(x);
            startS.push(s);
            startO.push(parseFloat(it.style.opacity) || 0.5);
        });

        // destino según dirección
        let endX, endS, endO;
        if (direction === "right") {
            endX = [-2 * off, -off, 0];
            endS = [0.75, 0.75, 1.15];
            endO = [0.5, 0.5, 1.0];
        } else {
            endX = [0, off, 2 * off];
            endS = [1.15, 0.75, 0.75];
            endO = [1.0, 0.5, 0.5];
        }

        const t0 = performance.now();
        const dur = this.animationDuration;
        const lerp = (a, b, t) => a + (b - a) * t;

        const step = (now) => {
            const t = Math.min(1, (now - t0) / dur);

            for (let i = 0; i < 3; i++) {
                const x = lerp(startX[i], endX[i], t);
                const s = lerp(startS[i], endS[i], t);
                const o = lerp(startO[i], endO[i], t);

                this.items[i].style.transform = `translateX(${x}px) scale(${s})`;
                this.items[i].style.opacity = o.toFixed(3);
            }

            if (t < 1) return requestAnimationFrame(step);

            /* ---------- Actualizar índices ---------- */
            this.current = direction === "right"
                ? (this.current + 1) % len
                : (this.current - 1 + len) % len;

            const left  = (this.current - 1 + len) % len;
            const right = (this.current + 1) % len;
            this.visibleIndices = [left, this.current, right];

            /* ---------- Reset final + fade-in del nuevo ---------- */
            const newOff = this._computeOffset();
            const xs = [-newOff, 0, newOff];
            const scales = [0.75, 1.15, 0.75];
            const ops = [0.5, 1.0, 0.5];

            const newItemIndex = direction === "right" ? 2 : 0;

            this.items.forEach((item, i) => {
                const service = this.services[this.visibleIndices[i]];
                const img = item.querySelector("img");
                img.src = service.icon;
                img.alt = service.name;
                item.classList.toggle("center", i === 1);

                if (i === newItemIndex) {
                    // ítem nuevo → fade in
                    item.style.transition = "none";
                    item.style.opacity = 0;
                    item.style.transform = `translateX(${xs[i]}px) scale(${scales[i]})`;

                    requestAnimationFrame(() => {
                        item.style.transition = "opacity 0.40s ease";
                        item.style.opacity = ops[i];
                    });
                } else {
                    item.style.transition = "none";
                    item.style.opacity = ops[i];
                    item.style.transform = `translateX(${xs[i]}px) scale(${scales[i]})`;
                }
            });

            this.isAnimating = false;
        };

        requestAnimationFrame(step);
    }

    /* ---------- Movimientos ---------- */
    _moveLeft() { this._animate("left"); }
    _moveRight() { this._animate("right"); }

    /* ---------- Eventos ---------- */
    _attachEvents() {
        this.arrowLeft?.addEventListener("click", () => this._moveLeft());
        this.arrowRight?.addEventListener("click", () => this._moveRight());
        this.btnView?.addEventListener("click", () => this._showDetail());
    }

    /* ---------- Cargar HTML de servicio ---------- */
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
   INICIALIZADOR
   =========================================================== */
async function initServiceCarousel() {
    try {
        const services = await ServiceLoader.loadJSON("web/JS/services/services.json");
        new ServiceCarousel(services, "serviceCarouselRoot", "serviceDetail");
    } catch (err) {
        console.error("Error inicializando el carrusel:", err);
    }
}

document.addEventListener("DOMContentLoaded", initServiceCarousel);
