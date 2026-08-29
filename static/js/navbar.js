// ==========================================
// NAVBAR
// Scope: site-wide — header lives in base.html on every page
// Depends on: nothing (no GSAP)
// Covers: auto-hide on scroll, Services dropdown (+ nested
// Estimating Services submenu), full-screen mobile menu
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // NAVBAR AUTO-HIDE ON SCROLL
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
    // SERVICES DROPDOWN
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
    // ESTIMATING SERVICES SUBMENU
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
    // MOBILE NAV MENU (full-screen takeover)
    // ==========================================

    const mobileNavToggle = document.getElementById(
        "mobile-nav-toggle"
    );
    const mobileNavClose = document.getElementById(
        "mobile-nav-close"
    );

    if (mobileNavToggle && mobileNavPanel) {

        function openMobileNav() {
            mobileNavPanel.classList.add("is-open");
            document.body.classList.add("mobile-nav-locked");

            mobileNavToggle.setAttribute("aria-expanded", "true");
            mobileNavToggle.setAttribute("aria-label", "Close menu");
            mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
        }

        function closeMobileNav(returnFocus) {
            mobileNavPanel.classList.remove("is-open");
            document.body.classList.remove("mobile-nav-locked");

            mobileNavToggle.setAttribute("aria-expanded", "false");
            mobileNavToggle.setAttribute("aria-label", "Open menu");
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';

            if (returnFocus) {
                mobileNavToggle.focus();
            }
        }

        // Full-screen menu opens only on explicit button tap
        mobileNavToggle.addEventListener("click", () => {
            const isOpen = mobileNavPanel.classList.contains("is-open");
            if (isOpen) {
                closeMobileNav(false);
            } else {
                openMobileNav();
            }
        });

        // Dedicated close (X) button inside the full-screen panel
        if (mobileNavClose) {
            mobileNavClose.addEventListener("click", () => {
                closeMobileNav(false);
            });
        }

        // Close mobile menu after tapping any link
        mobileNavPanel
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener("click", () => {
                    closeMobileNav(false);
                });
            });

        // Escape closes mobile menu too
        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    mobileNavPanel.classList.contains("is-open")
                ) {
                    closeMobileNav(true);
                }
            }
        );
    }

});
