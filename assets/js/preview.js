document.addEventListener("DOMContentLoaded", () => {
    const preview = document.createElement("div");
    preview.className = "mob-preview";

    document.body.appendChild(preview);

    const cache = new Map();

    document.querySelectorAll(
        '.mob-card, .main .text a[href$=".html"]'
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

                const data = {
                    title,
                    image,
                    description
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

            let x = e.pageX + 20;
            let y = e.pageY + 20;

            const rect =
                preview.getBoundingClientRect();

            if (
                x + rect.width >
                window.scrollX + window.innerWidth
            ) {
                x = e.pageX - rect.width - 20;
            }

            if (
                y + rect.height >
                window.scrollY + window.innerHeight
            ) {
                y = e.pageY - rect.height - 20;
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
                    <div class="preview-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                ` : ""}

            </div>
        `;

        preview.style.display = "block";
    }

});