document.addEventListener("DOMContentLoaded", () => {
    const headings = document.querySelectorAll("main h2[id]");
    const links = document.querySelectorAll(".sidebar a");

    function updateSidebar() {
        let current = "";

        headings.forEach(heading => {
            if (window.scrollY >= heading.offsetTop - 120) {
                current = heading.id;
            }
        });

        links.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + current
            );
        });
    }

    window.addEventListener("scroll", updateSidebar);
    updateSidebar();
});