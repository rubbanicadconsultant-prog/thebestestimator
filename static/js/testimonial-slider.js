// ==========================================
// CLIENT TESTIMONIAL SLIDER
// Scope: pages with .testimonial-card (currently the homepage;
// harmless no-op elsewhere)
// Depends on: nothing
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

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

});
