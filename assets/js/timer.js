document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    if ((month === 12 && day >= 24) || (month === 1 && day <= 8)) {
        document.body.classList.add("christmas");
    } else if ((month === 12 && day <= 23) || (month === 1 && day >= 9) || month === 2) {
        document.body.classList.add("winter");
    } else if (month >= 3 && month <= 5) {
        document.body.classList.add("spring");
    }
});