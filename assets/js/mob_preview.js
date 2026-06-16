document.addEventListener("DOMContentLoaded", () => {
    const preview = document.createElement("div");
    preview.className = "mob-preview";

    document.body.appendChild(preview);

    const cache = new Map();

    document.querySelectorAll(".mob-card").forEach(card => {

        card.addEventListener("mouseenter", async () => {

            const url = card.href;

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
                    || "Unknown";

                const imgElement =
                    doc.querySelector(".img img");

                const image = imgElement
                    ? new URL(
                        imgElement.getAttribute("src"),
                        url
                    ).href
                    : card.querySelector("img")?.src;

                const description =
                    doc.querySelector(".text p")
                        ?.textContent
                        ?.trim()
                    || "No description available.";

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

            preview.style.left =
                `${e.pageX + 15}px`;

            preview.style.top =
                `${e.pageY + 15}px`;

        });

        card.addEventListener("mouseleave", () => {

            preview.style.display = "none";

        });

    });

    function renderPreview(data) {

        preview.innerHTML = `
            <div class="preview-image">
                <img src="${data.image}" alt="${data.title}">
            </div>

            <div class="preview-title">
                ${data.title}
            </div>
            <div class="preview-description">
                ${data.description}
            </div>
        `;

        preview.style.display = "block";
    }

});