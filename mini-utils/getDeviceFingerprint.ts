// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getDeviceFingerprint.ts                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 18:28:09 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 18:43:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function getDeviceFingerprint(): string {
    const key = "device_fingerprint";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}
