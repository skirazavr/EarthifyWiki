document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 900) {
        return;
    }

    if (localStorage.getItem("footer-popup-hidden") === "true") {
        return;
    }

    const popup = document.createElement("div");

    popup.className = "footer-popup";
    popup.innerHTML = `
        <span>
            Earthify Wiki is an open-source project.
            <a href="https://github.com/Skirazavr/EarthifyWiki" target="_blank">
                View source on GitHub
            </a>
        </span>

        <button class="footer-popup-close" aria-label="Close">
            ✕
        </button>
    `;

    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.classList.add("show");
    });

    popup.querySelector(".footer-popup-close").addEventListener("click", () => {
        localStorage.setItem("footer-popup-hidden", "true");

        popup.style.animation = "none";
        popup.offsetHeight;

        popup.classList.remove("show");
        popup.classList.add("closing");

        popup.addEventListener("transitionend", () => {
            popup.remove();
        }, { once: true });

        setTimeout(() => {
            popup.remove();
        }, 250);
    });
});