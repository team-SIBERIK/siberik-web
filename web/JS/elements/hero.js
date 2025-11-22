/* ===========================================================
   HERO DYNAMIC UNITS - Siberik (sin carrusel)
=========================================================== */

class UnitLoader {
    static async loadUnits(jsonUrl) {
        const res = await fetch(jsonUrl);
        if (!res.ok) {
            throw new Error(`No se pudo cargar el JSON de unidades: ${jsonUrl}`);
        }
        return await res.json();
    }

    static async loadDescription(htmlPath) {
        const res = await fetch(htmlPath);
        if (!res.ok) {
            throw new Error(`No se pudo cargar la descripción: ${htmlPath}`);
        }
        return await res.text();
    }
}

/* ===========================================================
   PANEL: logo + título + descripción + barra
=========================================================== */

class HeroPanel {
    constructor({ panelEl, logoEl, titleEl, descriptionEl, linkEl, progressEl }, rotationMs = 8000) {
        this.panelEl = panelEl;
        this.logoEl = logoEl;
        this.titleEl = titleEl;
        this.descriptionEl = descriptionEl;
        this.linkEl = linkEl;
        this.progressEl = progressEl;
        this.rotationMs = rotationMs;

        this.units = [];
        this.currentIndex = 0;
        this.descriptionCache = new Map();
        this._fadeTimeout = null;
    }

    setUnits(units) {
        this.units = units || [];
    }

    async showUnit(index) {
        if (!this.units.length) return;

        const safeIndex = ((index % this.units.length) + this.units.length) % this.units.length;
        const unit = this.units[safeIndex];
        this.currentIndex = safeIndex;

        // cortamos animaciones previas
        if (this._fadeTimeout) {
            clearTimeout(this._fadeTimeout);
        }

        this._stopProgress();
        this.panelEl.classList.add('is-fading');

        this._fadeTimeout = setTimeout(async () => {
            // logo + título + link
            this.logoEl.src = unit.icon;
            this.logoEl.alt = unit.name;
            this.titleEl.textContent = unit.name;
            this.linkEl.href = unit.link;

            // descripción HTML
            let html;
            if (this.descriptionCache.has(unit.description)) {
                html = this.descriptionCache.get(unit.description);
            } else {
                try {
                    html = await UnitLoader.loadDescription("web/JS/teams/" + unit.description);
                    this.descriptionCache.set(unit.description, html);
                } catch (err) {
                    console.error(err);
                    html = `<p>No se pudo cargar la descripción.</p>`;
                }
            }

            this.descriptionEl.innerHTML = html;

            // fade-in
            this.panelEl.classList.remove('is-fading');

            // arrancamos barra
            this._startProgress();
        }, 220);
    }

    _startProgress() {
        if (!this.progressEl) return;

        this.progressEl.style.transition = 'none';
        this.progressEl.style.width = '0%';

        // reflow
        void this.progressEl.offsetWidth;

        this.progressEl.style.transition = `width ${this.rotationMs}ms linear`;
        this.progressEl.style.width = '100%';
    }

    _stopProgress() {
        if (!this.progressEl) return;
        this.progressEl.style.transition = 'none';
        this.progressEl.style.width = '0%';
    }
}

/* ===========================================================
   HERO CONTROLLER
   - carga JSON
   - rota unidades
   - actualiza HeroPanel
=========================================================== */

class HeroController {
    constructor(heroEl, rotationMs = 8000) {
        this.heroEl = heroEl;
        this.rotationMs = rotationMs;
        this.units = [];
        this.currentIndex = 0;
        this._intervalId = null;

        // refs DOM
        const panelEl = heroEl.querySelector('#heroPanel');
        const logoEl = heroEl.querySelector('#heroPanelLogo');
        const titleEl = heroEl.querySelector('#heroPanelTitle');
        const descEl = heroEl.querySelector('#heroPanelDescription');
        const linkEl = heroEl.querySelector('#heroPanelLink');
        const progressEl = heroEl.querySelector('#heroPanelProgress');

        this.panel = new HeroPanel(
            { panelEl, logoEl, titleEl, descriptionEl: descEl, linkEl, progressEl },
            rotationMs
        );
    }

    async init() {
        const jsonUrl = this.heroEl.dataset.unitsJson;
        if (!jsonUrl) {
            console.warn('HeroController: falta data-units-json en el hero');
            return;
        }

        try {
            const units = await UnitLoader.loadUnits(jsonUrl);
            this.units = units;
            this.panel.setUnits(units);

            // Primer elemento
            await this.panel.showUnit(0);

            // Rotación automática
            this._startRotation();
        } catch (err) {
            console.error(err);
        }
    }

    _startRotation() {
        if (this._intervalId) clearInterval(this._intervalId);

        this._intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.units.length;
            this._showCurrent();
        }, this.rotationMs);
    }

    async _showCurrent() {
        await this.panel.showUnit(this.currentIndex);
    }
}

/* ===========================================================
   Inicialización
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const heroEl = document.querySelector('.hero[data-units-json]');
    if (!heroEl) return;

    const controller = new HeroController(heroEl, 8000);
    controller.init();
});
