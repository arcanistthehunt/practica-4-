
document.addEventListener("DOMContentLoaded", function () {
    const menuCheckbox = document.querySelector("#menu-toggle");
    const menuButton = document.querySelector(".menu-button");
    const mainNavigation = document.querySelector("#main-navigation");

    if (menuCheckbox && mainNavigation) {
        function updateMenuState() {
            if (menuButton) {
                menuButton.setAttribute("aria-expanded", String(menuCheckbox.checked));
            }
            mainNavigation.setAttribute("aria-hidden", String(!menuCheckbox.checked && window.innerWidth <= 600));
        }

        menuCheckbox.addEventListener("change", updateMenuState);
        updateMenuState();
        mainNavigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menuCheckbox.checked = false;
                updateMenuState();
            });
        });
        document.addEventListener("click", function (event) {
            const clickIsInsideHeader = event.target.closest(".site-header");
            if (!clickIsInsideHeader && menuCheckbox.checked) {
                menuCheckbox.checked = false;
                updateMenuState();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 600) {
                menuCheckbox.checked = false;
            }
            updateMenuState();
        });
    }
    const communityTrigger = document.querySelector(".nav-dropdown-trigger");
    const communityPanel = document.querySelector(".nav-dropdown-panel");
    if (communityTrigger && communityPanel) {
        communityTrigger.setAttribute("aria-expanded", "false");
        communityTrigger.addEventListener("click", function (event) {
            event.preventDefault();
            const isOpen = communityPanel.classList.toggle("dropdown-open");
            communityTrigger.setAttribute("aria-expanded", String(isOpen));
        });
    }
    const streamingRadios = document.querySelectorAll('input[name="streaming-service"]');
    const streamingPanel = document.querySelector("#streaming-panel");
    const streamingTitles = {
        "tab-prime": ["The Boys", "The Lord of the Rings", "Reacher", "Invincible", "Fallout", "Good Omens", "The Expanse", "Jack Ryan"],
        "tab-disney": ["Inside Out 2", "Loki", "The Mandalorian", "WandaVision", "Andor", "The Bear", "Ahsoka", "Hawkeye"],
        "tab-hulu": ["The Bear", "Only Murders in the Building", "Shōgun", "Fargo", "Atlanta", "The Handmaid's Tale", "The Great", "Ramy"],
        "tab-netflix": ["Stranger Things", "Wednesday", "The Queen's Gambit", "One Piece", "Dark", "Bridgerton", "The Witcher", "Narcos"],
        "tab-hbo": ["The Last of Us", "House of the Dragon", "Succession", "Euphoria", "The White Lotus", "Chernobyl", "Band of Brothers", "Westworld"]
    };
    function posterFor() {
        return "assets/last-of-us.jpg";
    }

    function renderStreamingTitles(selectedTabId) {
        if (!streamingPanel) return;
        const titles = streamingTitles[selectedTabId] || streamingTitles["tab-prime"];
        streamingPanel.replaceChildren();

        titles.forEach(function (title, index) {
            const card = document.createElement("article");
            card.className = "stream-card";

            const poster = document.createElement("img");
            poster.src = posterFor(title);
            poster.alt = title + " poster";
            poster.loading = "lazy";

            const titleText = document.createElement("strong");
            titleText.textContent = title;

            const rating = document.createElement("div");
            rating.className = "rating";
            const score = document.createElement("span");
            score.textContent = "★ " + (8.0 + (index % 5) / 10).toFixed(1);
            rating.append(score);

            card.append(poster, titleText, rating);
            streamingPanel.append(card);
        });
        streamingPanel.setAttribute("aria-label", titles.length + " titles for selected streaming service");
    }

    streamingRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (!radio.checked) return;
            renderStreamingTitles(radio.id);
            streamingRadios.forEach(function (otherRadio) {
                const label = document.querySelector('label[for="' + otherRadio.id + '"]');
                if (label) {
                    label.setAttribute("aria-selected", String(otherRadio.checked));
                    label.setAttribute("tabindex", otherRadio.checked ? "0" : "-1");
                }
            });
        });
    });
    const initiallySelectedTab = document.querySelector('input[name="streaming-service"]:checked');
    if (initiallySelectedTab) renderStreamingTitles(initiallySelectedTab.id);
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        item.addEventListener("toggle", function () {
            if (!item.open) return;
            faqItems.forEach(function (otherItem) {
                if (otherItem !== item) otherItem.open = false;
            });
        });
    });
    const sliderArrowGroups = document.querySelectorAll("[data-slider-controls]");
    sliderArrowGroups.forEach(function (arrowGroup) {
        const section = arrowGroup.closest("section");
        const track = section ? section.querySelector("[data-slider-track]") : null;
        if (!track) return;
        track.classList.add("js-slider-track");

        const previousButton = arrowGroup.querySelector("[data-slider-prev]");
        const nextButton = arrowGroup.querySelector("[data-slider-next]");

        function scrollByCard(direction) {
            const firstCard = track.firstElementChild;
            if (!firstCard) return;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 12;
            track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
        }

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                scrollByCard(-1);
            });
        }
        if (nextButton) {
            nextButton.addEventListener("click", function () {
                scrollByCard(1);
            });
        }
    });
    const modalCheckbox = document.querySelector("#info-modal-toggle");
    const modalLayer = document.querySelector(".modal-layer");
    if (modalCheckbox && modalLayer) {
        let lastFocused = null;
        modalCheckbox.addEventListener("change", function () {
            modalLayer.classList.toggle("modal-is-open", modalCheckbox.checked);
            if (modalCheckbox.checked) {
                lastFocused = document.activeElement;
                const closeButton = modalLayer.querySelector(".modal-close");
                if (closeButton) closeButton.focus();
            } else if (lastFocused && lastFocused.focus) {
                lastFocused.focus();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (modalCheckbox.checked && event.key === "Escape") {
                modalCheckbox.checked = false;
                modalCheckbox.dispatchEvent(new Event("change"));
            }
        });
    }

    const cookieNotice = document.querySelector(".cookie-notice");
    const cookieCheckbox = document.querySelector("#cookie-dismissed");
    const cookieName = "imdbCookieConsent";
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=Lax";
    }
    function getCookie(name) {
        const match = document.cookie.split("; ").find(function (row) { return row.indexOf(name + "=") === 0; });
        return match ? decodeURIComponent(match.split("=")[1]) : null;
    }
    function cookieAccepted() {
        if (getCookie(cookieName) === "yes") return true;
        try { return localStorage.getItem(cookieName) === "yes"; } catch (e) { return false; }
    }
    if (cookieNotice && cookieCheckbox) {
        if (cookieAccepted()) cookieCheckbox.checked = true;
        cookieNotice.querySelector("[data-cookie-accept]").addEventListener("click", function () {
            setCookie(cookieName, "yes", 365);
            try { localStorage.setItem(cookieName, "yes"); } catch (e) {}
        });
        const resetLink = document.querySelector("[data-cookie-reset]");
        if (resetLink) {
            resetLink.addEventListener("click", function (event) {
                event.preventDefault();
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
                try { localStorage.removeItem(cookieName); } catch (e) {}
                cookieCheckbox.checked = false;
            });
        }
    }

    const feedbackForm = document.querySelector("#feedback-form");

    if (feedbackForm) {
        const nameInput = feedbackForm.querySelector("#feedback-name");
        const emailInput = feedbackForm.querySelector("#feedback-email");
        const messageInput = feedbackForm.querySelector("#feedback-topic");

        const formStatus = document.createElement("p");
        formStatus.className = "form-status";
        formStatus.setAttribute("role", "status");
        formStatus.setAttribute("aria-live", "polite");
        feedbackForm.append(formStatus);

        function validateField(field, customMessage) {
            field.setCustomValidity("");
            if (!field.checkValidity()) {
                field.setCustomValidity(customMessage);
            }
            return field.checkValidity();
        }
        if (nameInput) nameInput.addEventListener("blur", function () {
            validateField(nameInput, "Please enter a name with at least two characters.");
        });
        if (emailInput) emailInput.addEventListener("blur", function () {
            validateField(emailInput, "Please enter a valid email address.");
        });
        if (messageInput) messageInput.addEventListener("blur", function () {
            validateField(messageInput, "Please write a message of at least ten characters.");
        });
        [nameInput, emailInput, messageInput].filter(Boolean).forEach(function (field) {
            field.addEventListener("input", function () {
                field.setCustomValidity("");
                formStatus.textContent = "";
            });
        });

        feedbackForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fieldsAreValid = [
                validateField(nameInput, "Please enter a name with at least two characters."),
                validateField(emailInput, "Please enter a valid email address."),
                validateField(messageInput, "Please write a message of at least ten characters.")
            ].every(Boolean);

            if (!fieldsAreValid) {
                feedbackForm.reportValidity();
                formStatus.textContent = "Please correct the fields marked as invalid.";
                formStatus.classList.remove("form-success");
                return;
            }
            formStatus.textContent = "Thank you! Your message has been checked and is ready. (Demo: no message was sent to a server.)";
            formStatus.classList.add("form-success");
            feedbackForm.reset();
        });
    }

});
