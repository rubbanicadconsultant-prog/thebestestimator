// ==========================================
// ENTRANCE OVERLAY + HERO REVEAL
// Scope: pages with #entrance-overlay / .hero-headline
// (currently the homepage; harmless no-op elsewhere)
// Depends on: GSAP (must load before this file)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ENTRANCE REVEAL ANIMATION
    // ==========================================

    const overlay = document.getElementById("entrance-overlay");
    const overlayLine = document.querySelector(".overlay-line");
    const overlayLogo = document.querySelector(".overlay-logo-img");

    if (overlay && overlayLine && overlayLogo) {
        const entranceTl = gsap.timeline();

        // Step A: Logo fades and scales in
        entranceTl.to(overlayLogo, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
        });

        // Step B: Gold line draws underneath
        entranceTl.to(
            overlayLine,
            {
                width: "120px",
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.35"
        );

        // Step C: Slide overlay away
        entranceTl.to(
            overlay,
            {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => {
                    overlay.style.display = "none";
                    triggerHeroAnimations();
                },
            },
            "+=0.5"
        );
    } else {
        triggerHeroAnimations();
    }


    // ==========================================
    // HERO SECTION ENTRANCE ANIMATIONS
    // ==========================================

    function triggerHeroAnimations() {
        gsap.from(".hero-headline", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(".hero-subtitle", {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
        });

        gsap.from(".hero-ctas", {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
        });
    }

});
