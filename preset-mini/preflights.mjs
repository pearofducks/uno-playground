import { entriesToCss } from "@unocss/core";
export const preflights = [
  {
    layer: "preflights",
    getCSS(ctx) {
      if (ctx.theme.preflightBase) {
        const css = entriesToCss(Object.entries(ctx.theme.preflightBase));
        return `*,::before,::after{${css}}::backdrop{${css}}`;
      }
    }
  }
];
