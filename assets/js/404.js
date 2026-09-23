document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a[href]");

    links.forEach(link => {
        checkLink(link);
    });
});

async function checkLink(link) {
    const href = link.getAttribute("href");

    if (!href) {
        return;
    }

    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
    }

    let url;

    try {
        url = new URL(href, window.location.href);
    } catch {
        return;
    }

    if (url.origin !== window.location.origin) {
        return;
    }

    const hash = url.hash;

    const pageUrl = new URL(url.href);
    pageUrl.hash = "";

    try {
        const response = await fetch(pageUrl.href, {
            method: "GET", cache: "no-store"
        });

        if (!response.ok) {
            markBroken(link);
            return;
        }

        const text = await response.text();

        const is404 = text.includes("<title>404") || text.includes(">404 Not Found<") || text.includes("Page Not Found") || text.includes("404 - Not Found");

        if (is404) {
            markBroken(link);
            return;
        }

        if (!hash) {
            return;
        }

        const parser = new DOMParser();
        const page = parser.parseFromString(text, "text/html");

        const id = decodeURIComponent(hash.substring(1));

        if (!page.getElementById(id)) {
            markBroken(link);
        }

    } catch (error) {
        console.warn("Failed to check link:", link.href, error);
    }
}

function markBroken(link) {
    link.classList.add("broken-link");

    link.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
    });
}