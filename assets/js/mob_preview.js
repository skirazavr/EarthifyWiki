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
                const html = await response.text();

                const doc = new DOMParser().parseFromString(
                    html,
                    "text/html"
                );

                const title =
                    doc.querySelector("h1")?.textContent?.trim()
                    || card.querySelector(".mob-name")?.textContent
                    || "Unknown";

                const image =
                    doc.querySelector(".img img")?.getAttribute("src")
                    || card.querySelector("img")?.src;

                let description = "No description available.";

                const h1 = doc.querySelector("h1");

                if (h1) {

                    let element = h1.nextElementSibling;

                    while (element) {

                        if (
                            element.tagName === "P" &&
                            element.textContent.trim().length > 0
                        ) {
                            description =
                                element.textContent.trim();
                            break;
                        }

                        element = element.nextElementSibling;
                    }
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
            <img src="${data.image}" alt="">
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