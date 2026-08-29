// ==========================================
// ABOUT PAGE — HERO PIN & FADE
// Pins the leadership hero in place while the user
// scrolls, then fades it out as the next section
// approaches. Desktop/laptop only — on smaller
// screens this is skipped entirely and the hero
// just sits as a normal static section, since
// scroll-pin effects are the most likely thing to
// misbehave on mobile browsers.
//
// Scope: About page only (#about-hero)
// Depends on: GSAP + ScrollTrigger (must load before this file)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const aboutHeroWrap = document.querySelector(
        ".about-hero-wrap"
    );

    const aboutHero = document.getElementById(
        "about-hero"
    );

    if (
        aboutHeroWrap &&
        aboutHero &&
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined" &&
        window.matchMedia("(min-width: 993px)").matches
    ) {

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: aboutHeroWrap,
            start: "top top",
            end: "+=90%",
            pin: aboutHero,
            scrub: true,

            onUpdate: (self) => {
                gsap.set(aboutHero, {
                    opacity: 1 - self.progress,
                });
            },

            // If the hero is fully faded and the user scrolls
            // back up, restore full opacity rather than leaving
            // it invisible.
            onLeaveBack: () => {
                gsap.set(aboutHero, { opacity: 1 });
            },
        });
    }

});
