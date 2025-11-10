// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resolveElement.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 23:59:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 00:04:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Generic utility to resolve an element from multiple access patterns.
 *
 * Supports:
 *  - direct element (`el`)
 *  - lazy getter (`getEl`)
 *  - CSS selector (`selector`)
 *
 * Example:
 * ```ts
 * const button = resolveElement<HTMLButtonElement>({
 *   el: DOM.googleBtn,
 *   getEl: () => DOM.googleBtn,
 *   selector: "#login-google-btn",
 * });
 * ```
 */

interface resolveElementParams {
    el?: T | null;
    getEl?: () => T | null;
    selector?: string;
}

export function resolveElement<T extends HTMLElement>({
    el,
    getEl,
    selector,
}: resolveElementParams) {
    if (typeof getEl === "function") {
        const result = getEl();
        if (result) return result;
    }
    if (el) return el;
    if (selector) return document.querySelector<T>(selector);
    return null;
}
