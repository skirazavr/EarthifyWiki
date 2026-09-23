document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copy-btn").forEach(button => {

        button.addEventListener("click", async () => {

            const code =
			    button.closest(".code-block").querySelector("code");

            await navigator.clipboard.writeText(
                code.textContent
            );

            button.classList.add("copied");
            button.textContent = "Copied!";

            setTimeout(() => {
                button.classList.remove("copied");
                button.textContent = "Copy";
            }, 2000);
        });
    });
});