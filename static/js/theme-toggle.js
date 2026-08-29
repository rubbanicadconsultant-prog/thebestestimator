// ==========================================
// THEME TOGGLE (DARK MODE)
// Scope: site-wide — every page (header + mobile menu toggles)
// Depends on: nothing (no GSAP, no other JS files)
// Persists choice via localStorage
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const themeToggles = document.querySelectorAll(
        "#theme-toggle, #mobile-theme-toggle"
    );

    const htmlElement = document.documentElement;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateToggleIcons(savedTheme);

    themeToggles.forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentTheme =
                htmlElement.getAttribute("data-theme");

            const newTheme =
                currentTheme === "light" ? "dark" : "light";

            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateToggleIcons(newTheme);
        });
    });

    function updateToggleIcons(theme) {
        themeToggles.forEach((btn) => {
            const icon = btn.querySelector("i");
            if (icon) {
                icon.className =
                    theme === "light"
                        ? "fas fa-moon"
                        : "fas fa-sun";
            }
        });
    }

});
