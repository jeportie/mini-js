// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   dom.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:42:04 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 10:42:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function create<K extends keyof HTMLElementTagNameMap>(tag: K, className = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
}
