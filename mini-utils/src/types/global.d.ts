// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   global.d.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 10:30:35 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:30:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

declare global {
    interface Grecaptcha {
        render(
            container: HTMLElement | string,
            parameters: { sitekey: string } & Record<string, unknown>
        ): number;
        ready(cb: () => void): void;
        reset(id?: number): void;
        getResponse(id?: number): string;
        enterprise?: Grecaptcha; // Google mirrors the API under enterprise
    }

    interface Window {
        grecaptcha?: Grecaptcha;
    }
}

export { }; // make this a module
