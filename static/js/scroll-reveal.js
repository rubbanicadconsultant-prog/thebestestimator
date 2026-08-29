// ==========================================
// SCROLL REVEAL ANIMATIONS
// Scope: site-wide — any element with .scroll-reveal or
// .scroll-reveal-eager, on any page
// Depends on: nothing (no GSAP, plain IntersectionObserver)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // SCROLL REVEAL (standard — reveals near viewport)
    // ==========================================

    const revealElements = document.querySelectorAll(".scroll-reveal");

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    }


    // ==========================================
    // EAGER REVEAL (reveals well before entering viewport —
    // used where a late pop-in would be distracting)
    // ==========================================

    const eagerRevealElements = document.querySelectorAll(
        ".scroll-reveal-eager"
    );

    if (eagerRevealElements.length > 0) {
        const eagerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        eagerObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "0px 0px 300px 0px",
            }
        );

        eagerRevealElements.forEach((el) =>
            eagerObserver.observe(el)
        );
    }

});
