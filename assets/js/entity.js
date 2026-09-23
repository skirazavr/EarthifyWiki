document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".entity-preview").forEach(preview => {
        const image = preview.querySelector(".entity-image");

        if (!image) {
            return;
        }

        const entity = preview.dataset.entity;

        const ageButtons = preview.querySelectorAll("[data-age]");
        const variantButtons = preview.querySelectorAll("[data-variant]");

        let age = "adult";
        let variant = null;

        const activeAge = preview.querySelector("[data-age].active");
        if (activeAge) {
            age = activeAge.dataset.age;
        }

        const activeVariant = preview.querySelector("[data-variant].active");
        if (activeVariant) {
            variant = activeVariant.dataset.variant;
        }

        function updateImage() {
            const filename = variant
                ? `${entity}_${variant}_${age}.png`
                : `${entity}_${age}.png`;

            const path = `/assets/images/mobs/${filename}`;

            console.log("Loading entity image:", path);

            image.src = path;

            const ageName = age === "adult" ? "Adult" : "Baby";

            if (variant) {
                const variantName =
                    variant.charAt(0).toUpperCase() + variant.slice(1);

                image.alt = `${variantName} ${entity} (${ageName})`;
            } else {
                image.alt = `${ageName} ${entity}`;
            }
        }

        ageButtons.forEach(button => {
            button.addEventListener("click", () => {
                age = button.dataset.age;

                ageButtons.forEach(btn => {
                    btn.classList.toggle("active", btn === button);
                });

                updateImage();
            });
        });

        variantButtons.forEach(button => {
            button.addEventListener("click", () => {
                variant = button.dataset.variant;

                variantButtons.forEach(btn => {
                    btn.classList.toggle("active", btn === button);
                });

                updateImage();
            });
        });

        updateImage();
    });
});