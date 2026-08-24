// ==========================================
// THE BEST ESTIMATOR - ANIMATIONS ENGINE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. ENTRANCE REVEAL ANIMATION
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
    // 2. HERO SECTION ENTRANCE ANIMATIONS
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


    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS
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
    // 3b. EAGER REVEAL
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


    // ==========================================
    // 3c. NAVBAR AUTO-HIDE ON SCROLL
    // ==========================================

    const siteHeader = document.getElementById("site-header");
    const mobileNavPanel = document.getElementById(
        "mobile-nav-panel"
    );

    if (siteHeader) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const hideThreshold = 100;

        function updateHeader() {
            /*
             * Never auto-hide the header while the mobile
             * navigation is open.
             */
            if (mobileNavPanel?.classList.contains("is-open")) {
                ticking = false;
                return;
            }

            /*
             * Also don't hide the navbar while a user is
             * actively interacting with the Services dropdown.
             */
            const servicesDropdown = document.querySelector(
                ".nav-item-dropdown.is-open"
            );

            if (servicesDropdown) {
                ticking = false;
                return;
            }

            const currentScrollY = window.scrollY;

            if (currentScrollY <= hideThreshold) {
                siteHeader.classList.remove("nav-hidden");
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down
                siteHeader.classList.add("nav-hidden");
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                siteHeader.classList.remove("nav-hidden");
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeader);
                    ticking = true;
                }
            },
            { passive: true }
        );
    }


    // ==========================================
    // 3d. SERVICES DROPDOWN
    // Enhanced hover + keyboard behavior
    // ==========================================

    const serviceDropdown = document.querySelector(
        ".nav-item-dropdown"
    );

    if (serviceDropdown) {
        const serviceTrigger =
            serviceDropdown.querySelector(":scope > a");

        const servicePanel =
            serviceDropdown.querySelector(".nav-dropdown-panel");

        const serviceItems =
            serviceDropdown.querySelectorAll(
                ".nav-dropdown-item"
            );

        /*
         * Give assistive technologies useful information
         * without changing the visible markup.
         */
        if (serviceTrigger) {
            serviceTrigger.setAttribute(
                "aria-haspopup",
                "true"
            );

            serviceTrigger.setAttribute(
                "aria-expanded",
                "false"
            );

            if (servicePanel) {
                servicePanel.setAttribute(
                    "role",
                    "menu"
                );
            }
        }

        serviceItems.forEach((item) => {
            item.setAttribute("role", "menuitem");
        });


        // ------------------------------------------
        // Open dropdown
        // ------------------------------------------

        function openServicesDropdown() {
            serviceDropdown.classList.add("is-open");

            serviceTrigger?.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        // ------------------------------------------
        // Close dropdown
        // ------------------------------------------

        function closeServicesDropdown() {
            serviceDropdown.classList.remove("is-open");

            serviceTrigger?.setAttribute(
                "aria-expanded",
                "false"
            );

            // Also close the nested "Estimating Services" flyout,
            // if it happens to be open, so nothing is left stuck
            // open when the whole Services menu closes.
            const openSubmenu = serviceDropdown.querySelector(
                ".nav-subitem-dropdown.is-open"
            );

            openSubmenu?.classList.remove(
                "is-open",
                "nav-subitem-flip"
            );
        }


        // ------------------------------------------
        // Mouse / pointer interaction
        //
        // CSS handles the actual hover animation.
        // JS only keeps the state synchronized.
        // ------------------------------------------

        serviceDropdown.addEventListener(
            "pointerenter",
            (event) => {
                /*
                 * Only use this behavior for a mouse/stylus.
                 * Touch devices should not get forced hover behavior.
                 */
                if (
                    event.pointerType === "mouse" ||
                    event.pointerType === "pen"
                ) {
                    openServicesDropdown();
                }
            }
        );

        serviceDropdown.addEventListener(
            "pointerleave",
            (event) => {
                if (
                    event.pointerType === "mouse" ||
                    event.pointerType === "pen"
                ) {
                    /*
                     * Small delay makes movement from the
                     * Services label into the panel forgiving.
                     */
                    window.setTimeout(() => {
                        if (
                            !serviceDropdown.matches(
                                ":hover"
                            )
                        ) {
                            closeServicesDropdown();
                        }
                    }, 60);
                }
            }
        );


        // ------------------------------------------
        // Keyboard accessibility
        // ------------------------------------------

        serviceTrigger?.addEventListener(
            "focus",
            () => {
                openServicesDropdown();
            }
        );

        serviceItems.forEach((item) => {
            item.addEventListener("focus", () => {
                openServicesDropdown();
            });
        });


        // ------------------------------------------
        // Escape closes dropdown
        // ------------------------------------------

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (
                    serviceDropdown.classList.contains(
                        "is-open"
                    )
                ) {
                    closeServicesDropdown();

                    serviceTrigger?.focus();
                }
            }
        });


        // ------------------------------------------
        // Click outside closes dropdown
        // ------------------------------------------

        document.addEventListener("click", (event) => {
            if (
                !serviceDropdown.contains(event.target)
            ) {
                closeServicesDropdown();
            }
        });


        // ------------------------------------------
        // If user leaves the entire navigation with
        // keyboard focus, clean up the state.
        // ------------------------------------------

        serviceDropdown.addEventListener(
            "focusout",
            () => {
                window.setTimeout(() => {
                    if (
                        !serviceDropdown.contains(
                            document.activeElement
                        )
                    ) {
                        closeServicesDropdown();
                    }
                }, 0);
            }
        );
    }


    // ==========================================
    // 3d-ii. ESTIMATING SERVICES SUBMENU
    // Nested flyout inside the Services dropdown.
    // Same interaction pattern as the outer dropdown,
    // scoped to its own element so it never touches
    // the outer dropdown's logic above.
    // ==========================================

    const submenu = document.querySelector(
        ".nav-subitem-dropdown"
    );

    if (submenu) {
        const submenuTrigger =
            submenu.querySelector(":scope > a");

        const submenuPanel = submenu.querySelector(
            ".nav-subdropdown-panel"
        );

        const submenuItems = submenu.querySelectorAll(
            ".nav-subdropdown-panel .nav-dropdown-item"
        );

        if (submenuTrigger) {
            submenuTrigger.setAttribute("aria-haspopup", "true");
            submenuTrigger.setAttribute("aria-expanded", "false");

            if (submenuPanel) {
                submenuPanel.setAttribute("role", "menu");
            }
        }

        submenuItems.forEach((item) => {
            item.setAttribute("role", "menuitem");
        });


        // ------------------------------------------
        // Flip to the left if the flyout would
        // overflow past the right edge of the viewport.
        // ------------------------------------------

        function positionSubmenu() {
            if (!submenuPanel) {
                return;
            }

            submenu.classList.remove("nav-subitem-flip");

            const rect = submenuPanel.getBoundingClientRect();

            if (rect.right > window.innerWidth - 12) {
                submenu.classList.add("nav-subitem-flip");
            }
        }


        function openSubmenu() {
            positionSubmenu();

            submenu.classList.add("is-open");

            submenuTrigger?.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        function closeSubmenu() {
            submenu.classList.remove(
                "is-open",
                "nav-subitem-flip"
            );

            submenuTrigger?.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        submenu.addEventListener(
            "pointerenter",
            (event) => {
                if (
                    event.pointerType === "mouse" ||
                    event.pointerType === "pen"
                ) {
                    openSubmenu();
                }
            }
        );

        submenu.addEventListener(
            "pointerleave",
            (event) => {
                if (
                    event.pointerType === "mouse" ||
                    event.pointerType === "pen"
                ) {
                    window.setTimeout(() => {
                        if (!submenu.matches(":hover")) {
                            closeSubmenu();
                        }
                    }, 60);
                }
            }
        );

        submenuTrigger?.addEventListener("focus", () => {
            openSubmenu();
        });

        submenuItems.forEach((item) => {
            item.addEventListener("focus", () => {
                openSubmenu();
            });
        });

        // Escape closes just the submenu first, leaving the
        // outer Services panel open — a second Escape (handled
        // by the outer dropdown's own listener) closes that too.
        submenu.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                submenu.classList.contains("is-open")
            ) {
                event.stopPropagation();
                closeSubmenu();
                submenuTrigger?.focus();
            }
        });
    }


    // ==========================================
    // 3e. MOBILE NAV MENU
    // ==========================================

    const mobileNavToggle = document.getElementById(
        "mobile-nav-toggle"
    );

    if (mobileNavToggle && mobileNavPanel) {

        mobileNavToggle.addEventListener("click", () => {
            const isOpen =
                mobileNavPanel.classList.toggle(
                    "is-open"
                );

            mobileNavToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileNavToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close menu"
                    : "Open menu"
            );

            mobileNavToggle.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });


        // Close mobile menu after tapping any link
        mobileNavPanel
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener("click", () => {
                    mobileNavPanel.classList.remove(
                        "is-open"
                    );

                    mobileNavToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileNavToggle.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                    mobileNavToggle.innerHTML =
                        '<i class="fas fa-bars"></i>';
                });
            });


        // Escape closes mobile menu too
        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    mobileNavPanel.classList.contains(
                        "is-open"
                    )
                ) {
                    mobileNavPanel.classList.remove(
                        "is-open"
                    );

                    mobileNavToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileNavToggle.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                    mobileNavToggle.innerHTML =
                        '<i class="fas fa-bars"></i>';

                    mobileNavToggle.focus();
                }
            }
        );
    }


    // ==========================================
    // 4. CLIENT TESTIMONIAL SLIDER
    // ==========================================

    const testimonials =
        document.querySelectorAll(
            ".testimonial-card"
        );

    const testimonialDots =
        document.querySelectorAll(
            ".testimonial-dot"
        );

    let currentTestimonial = 0;
    let testimonialTimer = null;


    function showTestimonial(index) {
        /*
         * Defensive checks prevent errors if the number
         * of cards/dots changes.
         */
        if (!testimonials.length) return;

        testimonials[
            currentTestimonial
        ]?.classList.remove("active");

        testimonialDots[
            currentTestimonial
        ]?.classList.remove("active");

        currentTestimonial = index;

        testimonials[
            currentTestimonial
        ]?.classList.add("active");

        testimonialDots[
            currentTestimonial
        ]?.classList.add("active");
    }


    function startTestimonialRotation() {
        testimonialTimer = setInterval(() => {
            showTestimonial(
                (currentTestimonial + 1) %
                    testimonials.length
            );
        }, 6000);
    }


    if (testimonials.length > 1) {

        testimonials[
            currentTestimonial
        ].classList.add("active");

        testimonialDots[
            currentTestimonial
        ]?.classList.add("active");


        startTestimonialRotation();


        testimonialDots.forEach((dot) => {
            dot.addEventListener("click", () => {
                const index = parseInt(
                    dot.getAttribute(
                        "data-index"
                    ),
                    10
                );

                if (Number.isNaN(index)) return;

                showTestimonial(index);

                clearInterval(
                    testimonialTimer
                );

                startTestimonialRotation();
            });
        });
    }


    // ==========================================
    // 5. SERVICE SCOPE FLASHCARDS
    // "Letter opening" reading experience
    // ==========================================

    const serviceCards =
        document.querySelectorAll(
            ".svcflash-card"
        );

    if (serviceCards.length > 0) {

        const serviceGrid =
            document.querySelector(
                ".svcflash-grid"
            );

        const backdrop =
            document.getElementById(
                "svcflash-letter-backdrop"
            );

        const scopeTitle =
            document.getElementById(
                "service-scope-title"
            );

        const scopeSubtitle =
            document.getElementById(
                "service-scope-subtitle"
            );

        const defaultTitle =
            scopeTitle?.textContent ||
            "Service Scope & Capabilities";

        const defaultSubtitle =
            scopeSubtitle?.textContent ||
            "Every discipline we estimate, broken down by what's covered, what you receive, and where it applies.";


        let currentlyOpenCard = null;


        const openLetter = (
            card,
            updateUrl = true
        ) => {

            if (
                currentlyOpenCard === card
            ) {
                return;
            }


            serviceGrid?.classList.add(
                "has-letter-open"
            );

            document.body.classList.add(
                "has-letter-open"
            );

            backdrop?.classList.add(
                "is-visible"
            );


            card.classList.add(
                "is-letter-open",
                "is-expanded"
            );

            currentlyOpenCard = card;


            // Unroll animation
            gsap.fromTo(
                card,
                {
                    xPercent: -50,
                    yPercent: -50,
                    scaleX: 0.55,
                    scaleY: 0.045,
                    opacity: 0,
                },
                {
                    xPercent: -50,
                    yPercent: -50,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    duration: 0.75,
                    ease: "back.out(1.4)",
                }
            );


            // Inner content animation
            const innerContent =
                card.querySelectorAll(
                    ".svcflash-title, .svcflash-overview, .svcflash-expand, .svcflash-footer"
                );

            gsap.fromTo(
                innerContent,
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.25,
                    stagger: 0.05,
                    ease: "power2.out",
                }
            );


            if (scopeTitle) {
                scopeTitle.textContent =
                    card.dataset.serviceName ||
                    "Selected Service";
            }


            if (scopeSubtitle) {
                const csi =
                    card.dataset.serviceCsi ||
                    "";

                scopeSubtitle.textContent =
                    csi
                        ? `${csi} · Detailed scope, deliverables, applications, and relevant sample.`
                        : "Detailed scope, deliverables, applications, and relevant sample.";
            }


            if (updateUrl) {
                const newHash =
                    `#${card.id}`;

                if (
                    window.location.hash !==
                    newHash
                ) {
                    history.pushState(
                        null,
                        "",
                        newHash
                    );
                }
            }
        };


        const closeLetter = (
            updateUrl = true
        ) => {

            if (!currentlyOpenCard) {
                return;
            }


            const card =
                currentlyOpenCard;


            gsap.to(card, {
                scaleX: 0.55,
                scaleY: 0.045,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",

                onComplete: () => {

                    card.classList.remove(
                        "is-letter-open",
                        "is-expanded"
                    );

                    gsap.set(card, {
                        clearProps:
                            "transform,opacity",
                    });


                    serviceGrid?.classList.remove(
                        "has-letter-open"
                    );

                    document.body.classList.remove(
                        "has-letter-open"
                    );

                    backdrop?.classList.remove(
                        "is-visible"
                    );


                    currentlyOpenCard = null;


                    if (scopeTitle) {
                        scopeTitle.textContent =
                            defaultTitle;
                    }


                    if (scopeSubtitle) {
                        scopeSubtitle.textContent =
                            defaultSubtitle;
                    }
                },
            });


            if (
                updateUrl &&
                window.location.hash
            ) {
                history.pushState(
                    null,
                    "",
                    window.location.pathname +
                        window.location.search
                );
            }
        };


        // Open flashcard
        serviceCards.forEach((card) => {

            const toggle =
                card.querySelector(
                    ".svcflash-toggle"
                );


            toggle?.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    openLetter(card);
                }
            );


            // Close flashcard
            card.querySelector(
                ".svcflash-letter-close"
            )?.addEventListener(
                "click",
                () => {
                    closeLetter();
                }
            );
        });


        // Click backdrop to close
        backdrop?.addEventListener(
            "click",
            () => closeLetter()
        );


        // Escape closes flashcard
        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    currentlyOpenCard
                ) {
                    closeLetter();
                }
            }
        );


        // ------------------------------------------
        // Open linked service from URL hash
        // ------------------------------------------

        const openLinkedService = () => {

            const rawHash =
                window.location.hash;


            if (
                !rawHash ||
                !rawHash.startsWith(
                    "#svc-"
                )
            ) {
                if (currentlyOpenCard) {
                    closeLetter(false);
                }

                return;
            }


            let targetId;


            try {
                targetId =
                    decodeURIComponent(
                        rawHash.substring(1)
                    );
            } catch {
                targetId =
                    rawHash.substring(1);
            }


            const targetCard =
                document.getElementById(
                    targetId
                );


            if (
                !targetCard ||
                !targetCard.classList.contains(
                    "svcflash-card"
                )
            ) {
                if (currentlyOpenCard) {
                    closeLetter(false);
                }

                return;
            }


            openLetter(
                targetCard,
                false
            );
        };


        window.setTimeout(
            openLinkedService,
            180
        );


        window.addEventListener(
            "hashchange",
            openLinkedService
        );


        window.addEventListener(
            "popstate",
            openLinkedService
        );
    }


    // ==========================================
    // 6. FAQ ACCORDION
    // ==========================================

    const faqQuestions =
        document.querySelectorAll(
            ".faq-question"
        );

    if (faqQuestions.length > 0) {

        faqQuestions.forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {

                    const isOpen =
                        btn.getAttribute(
                            "aria-expanded"
                        ) === "true";

                    btn.setAttribute(
                        "aria-expanded",
                        String(!isOpen)
                    );
                }
            );
        });
    }


    // ==========================================
    // 7. ABOUT PAGE — HERO PIN & FADE
    // Pins the leadership hero in place while the user
    // scrolls, then fades it out as the next section
    // approaches. Desktop/laptop only — on smaller
    // screens this is skipped entirely and the hero
    // just sits as a normal static section, since
    // scroll-pin effects are the most likely thing to
    // misbehave on mobile browsers.
    // ==========================================

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


    // ==========================================
    // 8. THEME TOGGLE (DARK MODE)
    // Persistent state via localStorage
    // ==========================================

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
