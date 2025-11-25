/* ============================================================
   TEAMS MODULE - Dynamic Unit Cards Generator
   ============================================================
   Responsibilities:
   - Load JSON team data
   - Build "Units" section HTML dynamically
   - Keep structure scalable and maintainable
============================================================ */

class TeamsService {
    /**
     * Fetches JSON from a given URL.
     */
    static async loadTeamsJSON(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load teams JSON from: ${url}`);
        }

        return await response.json();
    }
}

class UnitCardBuilder {
    /**
     * Builds a single <li> list item from feature text.
     */
    static buildFeatureItem(text) {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
    }

    /**
     * Builds the <ul> block from an array of features.
     */
    static buildFeaturesList(features) {
        const ul = document.createElement("ul");
        ul.classList.add("unit-list");

        features.forEach(feature => {
            ul.appendChild(UnitCardBuilder.buildFeatureItem(feature));
        });

        return ul;
    }

    /**
     * Builds a full <article> card for a team unit.
     */
    static buildUnitCard(unit) {
        const article = document.createElement("article");
        article.classList.add("unit-card");

        // Optional custom class for styling (unit-ai, unit-studio, etc.)
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

        // CTA button (opens link in new tab)
        const ctaButton = document.createElement("a");
        ctaButton.href = unit.link;
        ctaButton.target = "_blank";
        ctaButton.rel = "noopener";
        ctaButton.classList.add("unit-cta-button");
        ctaButton.textContent = "Visitar sitio";

        article.appendChild(iconWrapper);
        article.appendChild(title);
        article.appendChild(desc);
        article.appendChild(featuresList);
        article.appendChild(ctaButton);

        return article;
    }
}

class TeamsRenderer {
    /**
     * Renders all units into the grid container.
     */
    static renderTeams(unitsData, containerSelector = ".units-grid") {
        const grid = document.querySelector(containerSelector);

        if (!grid) {
            console.warn("Units grid container not found.");
            return;
        }

        // Clear previous content (in case of reload)
        grid.innerHTML = "";

        unitsData.forEach(unit => {
            const card = UnitCardBuilder.buildUnitCard(unit);
            grid.appendChild(card);
        });
    }
}

/* ============================================================
   MAIN INITIALIZER
============================================================ */

(async function initTeamsSection() {
    try {
        const jsonUrl = "web/JS/teams/teams.json"; // Adjust if needed
        const unitsData = await TeamsService.loadTeamsJSON(jsonUrl);

        TeamsRenderer.renderTeams(unitsData);

    } catch (error) {
        console.error("Error loading teams:", error);
    }
})();
