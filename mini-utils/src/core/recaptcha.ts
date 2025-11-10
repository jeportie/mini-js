// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   recaptcha.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+              //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 11:17:35 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:31:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let widgetId: number | null = null;
let grecaptchaReadyPromise: Promise<Grecaptcha> | null = null;

/** Ensure Google reCAPTCHA API is fully loaded and usable. */
async function waitForGrecaptchaReady(): Promise<Grecaptcha> {
    if (grecaptchaReadyPromise) return grecaptchaReadyPromise;

    grecaptchaReadyPromise = new Promise<Grecaptcha>((resolve, reject) => {
        const maxWait = 10_000;
        let waited = 0;

        const tick = () => {
            const g =
                (window.grecaptcha?.render ? window.grecaptcha : undefined) ??
                (window.grecaptcha?.enterprise?.render ? window.grecaptcha?.enterprise : undefined);

            if (g && typeof g.render === "function") {
                g.ready(() => resolve(g));
                return;
            }

            waited += 200;
            if (waited >= maxWait) {
                reject(new Error("grecaptcha not loaded in time"));
                return;
            }
            setTimeout(tick, 200);
        };

        tick();
    });

    return grecaptchaReadyPromise;
}

/** Initialize or re-initialize the widget. */
export async function initRecaptcha(siteKey: string, container: HTMLElement): Promise<void> {
    if (!container) throw new Error("Missing captcha container");
    if (!siteKey) throw new Error("Missing siteKey for reCAPTCHA");

    const g = await waitForGrecaptchaReady();

    // Detect if iframe still exists
    const iframeExists = container.querySelector<HTMLIFrameElement>("iframe[src*='recaptcha']");
    if (widgetId !== null && iframeExists) {
        // reset existing
        g.reset(widgetId);
        return;
    }

    container.innerHTML = "";
    widgetId = g.render(container, { sitekey: siteKey });
}

/** Cleanup for SPA transitions. Destroys widget and removes challenge iframe. */
export function destroyRecaptcha(): void {
    document.body.classList.add("teardown");
    try {
        const g = window.grecaptcha;
        if (g && typeof g.reset === "function" && widgetId !== null) {
            g.reset(widgetId);
            widgetId = null;
        }
        document.querySelectorAll("iframe[src*='recaptcha']").forEach((el) => el.remove());
    } finally {
        setTimeout(() => document.body.classList.remove("teardown"), 100);
    }
}

/** Retrieve current captcha token (empty string if unavailable). */
export function getRecaptchaToken(): string {
    try {
        const g = window.grecaptcha?.getResponse ? window.grecaptcha : window.grecaptcha?.enterprise;
        if (!g) throw new Error("grecaptcha not available yet");
        if (widgetId === null) throw new Error("Captcha not initialized");
        return g.getResponse(widgetId) || "";
    } catch (error) {
        console.error("[reCAPTCHA] ❌ Token retrieval failed:", error);
        return "";
    }
}

