// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   recaptcha.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+              //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 11:17:35 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 15:20:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let widgetId = null;
let grecaptchaReadyPromise = null;

/**
 * Ensure Google reCAPTCHA API is fully loaded and usable.
 */
async function waitForGrecaptchaReady() {
    if (grecaptchaReadyPromise) return grecaptchaReadyPromise;

    grecaptchaReadyPromise = new Promise((resolve, reject) => {
        const maxWait = 10000;
        let waited = 0;

        const check = () => {
            const g = window.grecaptcha?.render
                ? window.grecaptcha
                : window.grecaptcha?.enterprise?.render
                    ? window.grecaptcha.enterprise
                    : null;

            if (g && typeof g.render === "function") {
                g.ready(() => {
                    console.log("[reCAPTCHA] ✅ API ready");
                    resolve(g);
                });
                return;
            }

            if ((waited += 200) >= maxWait) {
                return reject(new Error("grecaptcha not loaded in time"));
            }
            setTimeout(check, 200);
        };
        check();
    });

    return grecaptchaReadyPromise;
}

/**
 * Initialize or re-initialize the widget.
 */
export async function initRecaptcha(siteKey, container) {
    if (!container) throw new Error("Missing captcha container");
    if (!siteKey) throw new Error("Missing siteKey for reCAPTCHA");

    const g = await waitForGrecaptchaReady();

    // Detect if iframe still exists
    const iframeExists = container.querySelector("iframe[src*='recaptcha']");
    if (widgetId !== null && iframeExists) {
        console.log("[reCAPTCHA] ♻️ Reset existing widget");
        g.reset(widgetId);
        return;
    }

    console.log("[reCAPTCHA] 🔁 Rendering new widget");
    container.innerHTML = "";
    widgetId = g.render(container, { sitekey: siteKey });
    console.log("[reCAPTCHA] ✅ Captcha rendered, widgetId =", widgetId);
}

/**
 * Cleanup for SPA transitions.
 * Destroys the widget and force-removes Google's challenge iframe if open.
 */
export function destroyRecaptcha() {
    document.body.classList.add("teardown");
    try {
        const g = window.grecaptcha;
        if (g && typeof g.reset === "function" && widgetId !== null) {
            console.log("[reCAPTCHA] 🧹 Widget destroyed");
            g.reset(widgetId);
            widgetId = null;
        }
        document.querySelectorAll("iframe[src*='recaptcha']").forEach(el => el.remove());
    } finally {
        // remove the teardown marker after 100ms (after DOM cleanup)
        setTimeout(() => document.body.classList.remove("teardown"), 100);
    }
}


/**
 * Retrieve current captcha token.
 */
export function getRecaptchaToken() {
    try {
        const g = window.grecaptcha?.getResponse
            ? window.grecaptcha
            : window.grecaptcha?.enterprise;
        if (!g) throw new Error("grecaptcha not available yet");
        if (widgetId === null) throw new Error("Captcha not initialized");

        const token = g.getResponse(widgetId);
        return token;
    } catch (error) {
        console.error("[reCAPTCHA] ❌ Token retrieval failed:", error);
        return "";
    }
}

