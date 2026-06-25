document.addEventListener("DOMContentLoaded", () => {
    const popup = document.createElement("div");

    popup.className = "opensource-popup";
    popup.innerHTML = `
        Earthify is an open-sourced project.
        <a href="https://github.com/Skirazavr/Earthify" target="_blank">
            View source on GitHub
        </a>
    `;

    document.body.appendChild(popup);
});
