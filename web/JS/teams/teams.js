/**
 * ===========================================================
 *   TEAMS MODULE - Dynamic Unit Cards Generator
 * ===========================================================
 *   Responsibilities:
 *   - Load JSON team data
 *   - Build "Units" section HTML dynamically
 *   - Keep structure scalable and maintainable
 * ===========================================================
 */

class TeamsService {
    static async loadTeamsJSON(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load teams JSON from: ${url}`);
        }
        return await response.json();
    }
}

class UnitCardBuilder {
    static buildFeatureItem(text) {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
    }

    static buildFeaturesList(features) {
        const ul = document.createElement("ul");
        ul.classList.add("unit-list");

        features.forEach(feature => {
            ul.appendChild(UnitCardBuilder.buildFeatureItem(feature));
        });

        return ul;
    }

    /**
     * Inserts all core elements of the unit card, except CTA/footer.
     */
    static buildUnitBase(unit) {
        const article = document.createElement("article");
        article.classList.add("unit-card");

        if (unit.unit_class) {
            article.classList.add(unit.unit_class);
        }

        // Icon wrapper
        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("unit-icon-wrapper");

        const iconImg = document.createElement("img");
        iconImg.src = unit.icon;
        iconImg.alt = unit.name;
        iconImg.classList.add("unit-icon");

        iconWrapper.appendChild(iconImg);

        // Title
        const title = document.createElement("h3");
        title.textContent = unit.name;

        // Description
        const desc = document.createElement("p");
        desc.innerHTML = unit.description_html;

        // Features list
        const featuresList = UnitCardBuilder.buildFeaturesList(unit.features);

        // Append base content
        article.appendChild(iconWrapper);
        article.appendChild(title);
        article.appendChild(desc);
        article.appendChild(featuresList);

        return article;
    }

    /**
     * Build the footer (CTA button wrapped inside .unit-footer)
     */
    static buildFooter(unit) {
        const footer = document.createElement("div");
        footer.classList.add("unit-footer");

        const ctaButton = document.createElement("a");
        ctaButton.href = unit.link;
        ctaButton.target = "_blank";
        ctaButton.rel = "noopener";
        ctaButton.classList.add("unit-cta-button");
        ctaButton.textContent = "Visitar sitio";

        footer.appendChild(ctaButton);
        return footer;
    }

    /**
     * Full card assembly
     */
    static buildUnitCard(unit) {
        const article = UnitCardBuilder.buildUnitBase(unit);
        const footer = UnitCardBuilder.buildFooter(unit);

        article.appendChild(footer);
        return article;
    }
}

class TeamsRenderer {
    static renderTeams(unitsData, containerSelector = ".units-grid") {
        const grid = document.querySelector(containerSelector);

        if (!grid) {
            console.warn("Units grid container not found.");
            return;
        }

        grid.innerHTML = "";

        unitsData.forEach(unit => {
            const card = UnitCardBuilder.buildUnitCard(unit);
            grid.appendChild(card);
        });
    }
}

(async function initTeamsSection() {
    try {
        const jsonUrl = "web/JS/teams/teams.json";
        const unitsData = await TeamsService.loadTeamsJSON(jsonUrl);

        TeamsRenderer.renderTeams(unitsData);
    } catch (error) {
        console.error("Error loading teams:", error);
    }
})();
