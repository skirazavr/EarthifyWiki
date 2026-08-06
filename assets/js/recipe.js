document.addEventListener("DOMContentLoaded", () => {

    let mouseX = 0;
    let mouseY = 0;
    let isScrolling = false;
    let scrollTimer;

    const ITEM_PATH = "../assets/items/";
    const SLOT_SIZE = 48;

    const layouts = {
        crafting: {
            width: 384,
            slots: {
                i1: [21, 21],
                i2: [75, 21],
                i3: [129, 21],

                i4: [21, 75],
                i5: [75, 75],
                i6: [129, 75],

                i7: [21, 129],
                i8: [75, 129],
                i9: [129, 129],

                output: [303, 75]
            }
        },

        extractor: {
            width: 384,
            slots: {
                input: [75, 75],
                output: [250, 75]
            }
        }
    };

    const itemInfo = {
        mixture: {
            name: "Mixture",
            color: "#7391C8"
        },

        winter_flower: {
            name: "Winter Flower",
            color: "#FAE199"
        },

        rosewood_oil: {
            name: "Rosewood Oil",
            color: "#FAE199"
        },

        extractor: {
            name: "Extractor",
            color: "#FAE199"
        },

        nether_star: {
            name: "Nether Star",
            color: "#55FFFF"
        }
    };

    function setSlotImage(slot, item) {

        const img = new Image();

        img.onload = () => {
            slot.style.backgroundImage = `url("${ITEM_PATH}${item}.png")`;
        };

        img.onerror = () => {
            slot.style.backgroundImage = `url("${ITEM_PATH}${item}.svg")`;
        };

        img.src = `${ITEM_PATH}${item}.png`;
    }

    function renderRecipe(recipe) {

        recipe.querySelectorAll(".recipe-slot").forEach(slot => slot.remove());

        const type = recipe.dataset.type || "crafting";
        const layout = layouts[type];

        if (!layout) {
            console.warn(`Unknown recipe layout: ${type}`);
            return;
        }

        const scale = recipe.clientWidth / layout.width;

        for (const [key, pos] of Object.entries(layout.slots)) {

            const item = recipe.dataset[key];

            if (!item) continue;

            const slot = document.createElement("div");

            slot.className = "recipe-slot";

            slot.style.left = `${pos[0] * scale}px`;
            slot.style.top = `${pos[1] * scale}px`;
            slot.style.width = `${SLOT_SIZE * scale}px`;
            slot.style.height = `${SLOT_SIZE * scale}px`;

            slot.dataset.item = item;

            setSlotImage(slot, item);

            recipe.appendChild(slot);
        }
    }

    const recipes = document.querySelectorAll(".recipe-image");

    function renderAllRecipes() {
        recipes.forEach(renderRecipe);
    }

    renderAllRecipes();

    window.addEventListener("resize", renderAllRecipes);

    const tooltip = document.getElementById("item-tooltip");

    function hideTooltip() {
        tooltip.style.display = "none";
        tooltip.style.color = "#eaecf0";
    }

    function showTooltip(id) {

        const info = itemInfo[id];

        if (info) {

            tooltip.textContent = info.name;
            tooltip.style.color = info.color;

        } else {

            tooltip.textContent = id
                .replaceAll("_", " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            tooltip.style.color = "#eaecf0";
        }

        tooltip.style.display = "flex";
    }

    window.addEventListener("scroll", () => {

        isScrolling = true;

        hideTooltip();

        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 150);

    }, { passive: true });

    document.addEventListener("mousemove", e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        const offset = 16;

        let x = mouseX + offset;
        let y = mouseY + offset;

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        if (x + tooltipWidth > window.innerWidth - 8) {
            x = mouseX - tooltipWidth - offset;
        }

        if (y + tooltipHeight > window.innerHeight - 8) {
            y = mouseY - tooltipHeight - offset;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;

    });

    document.addEventListener("touchmove", hideTooltip, { passive: true });

    document.addEventListener("mouseover", e => {

        if (isScrolling) return;

        const slot = e.target.closest(".recipe-slot");

        if (!slot) return;

        showTooltip(slot.dataset.item);

    });

    document.addEventListener("mouseout", e => {

        const slot = e.target.closest(".recipe-slot");

        if (!slot) return;

        hideTooltip();

    });

});