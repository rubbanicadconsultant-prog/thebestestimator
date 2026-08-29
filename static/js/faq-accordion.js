// ==========================================
// FAQ ACCORDION
// Scope: any page with .faq-question elements
// (currently homepage/pricing/services; harmless no-op elsewhere)
// Depends on: nothing
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

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

});
