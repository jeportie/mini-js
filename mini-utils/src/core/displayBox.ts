// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   errors.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 14:18:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 18:53:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function showBox(box: HTMLElement | null, message: string) {
    if (!box) return;
    box.textContent = message;
    box.classList.remove("hidden");
}

export function clearBox(box: HTMLElement | null) {
    if (!box) return;
    box.textContent = "";
    box.classList.add("hidden");
}

export function toggleVisibility(el: HTMLElement | null, visible: boolean) {
    if (!el) return;
    el.classList.toggle("hidden", !visible);
    el.style.opacity = visible ? "1" : "0";
}
