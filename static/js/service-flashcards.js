// ==========================================
// SERVICE SCOPE FLASHCARDS
// "Letter opening" reading experience
// Scope: pages with .svcflash-card (Services page)
// Depends on: GSAP (must load before this file)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

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

});
