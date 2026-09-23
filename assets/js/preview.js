document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 768) {
        return;
    }

	const preview = document.createElement("div");
    preview.className = "wiki-preview";

    document.body.appendChild(preview);

    const cache = new Map();

    document.querySelectorAll(
        '.card, .main a'
    ).forEach(card => {

        card.addEventListener("mouseenter", async () => {

            const url = card.href;

            if (!url) {
                return;
            }

            if (cache.has(url)) {
                renderPreview(cache.get(url));
                return;
            }

            try {

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const html = await response.text();

                const doc = new DOMParser().parseFromString(
                    html,
                    "text/html"
                );

                const title =
                    doc.querySelector("h1")?.textContent.trim()
                    || card.querySelector(".mob-name")?.textContent
                    || card.textContent.trim()
                    || "Unknown";

                const imgElement =
                    doc.querySelector(".img img")
                    || doc.querySelector(".infobox .img img")
                    || doc.querySelector(".infobox img");

                const image = imgElement
                    ? new URL(
                        imgElement.getAttribute("src"),
                        url
                    ).href
                    : null;

                const descriptionElement =
                    doc.querySelector(".text p")
                    || doc.querySelector("main p")
                    || doc.querySelector("p");

                let description =
                    descriptionElement?.textContent?.trim()
                    || "No description available.";

                if (description.length > 180) {
                    description =
                        description.substring(0, 180) + "...";
                }

                const pageType =
                    url.includes("/biomes/") ? "biome" :
                    url.includes("/structures/") ? "structure" :
                    url.includes("/items/") ? "item" :
                    url.includes("/blocks/") ? "block" :
                    "mob";

                const data = {
                    title,
                    image,
                    description,
                    pageType
                };

                cache.set(url, data);

                renderPreview(data);

            } catch (error) {

                console.error(
                    "Preview loading failed:",
                    error
                );

            }

        });

        card.addEventListener("mousemove", e => {
            const gap = 20;

            const rect = preview.getBoundingClientRect();

            const cursorX = e.pageX;
            const cursorY = e.pageY;

            const viewportLeft = window.scrollX;
            const viewportRight = window.scrollX + window.innerWidth;
            const viewportBottom = window.scrollY + window.innerHeight;

            const spaceRight = viewportRight - cursorX;
            const spaceLeft = cursorX - viewportLeft;

            let x;

            if (spaceRight >= rect.width + gap) {
                x = cursorX + gap;
            } else if (spaceLeft >= rect.width + gap) {
                x = cursorX - rect.width - gap;
            } else {
                x = Math.max(
                    viewportLeft + gap,
                    viewportRight - rect.width - gap
                );
            }

            let y = cursorY + gap;

            if (y + rect.height > viewportBottom - gap) {
                y = cursorY - rect.height - gap;
            }

            if (y < window.scrollY + gap) {
                y = window.scrollY + gap;
            }

            preview.style.left = `${x}px`;
            preview.style.top = `${y}px`;
        });

        card.addEventListener("mouseleave", () => {

            preview.style.display = "none";

        });

    });

    function renderPreview(data) {

        preview.innerHTML = `
            <div class="preview-layout">

                <div class="preview-text">

                    <div class="preview-title">
                        ${data.title}
                    </div>

                    <div class="preview-description">
                        ${data.description}
                    </div>

                </div>

                ${data.image ? `
                    <div class="preview-image ${data.pageType}">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                ` : ""}

            </div>
        `;

        preview.style.display = "block";
    }

});