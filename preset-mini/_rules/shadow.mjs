import { colorResolver, colorableShadows, handler as h } from "../utils.mjs";
import { varEmpty } from "./static.mjs";
export const boxShadowsBase = {
  "--un-ring-offset-shadow": "0 0 rgba(0,0,0,0)",
  "--un-ring-shadow": "0 0 rgba(0,0,0,0)",
  "--un-shadow-inset": varEmpty,
  "--un-shadow": "0 0 rgba(0,0,0,0)"
};
export const boxShadows = [
  [/^shadow(?:-(.+))?$/, (match, context) => {
    const [, d] = match;
    const { theme } = context;
    const v = theme.boxShadow?.[d || "DEFAULT"] || h.bracket.cssvar(d);
    if (v) {
      return {
        "--un-shadow": colorableShadows(v, "--un-shadow-color").join(","),
        "box-shadow": "var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"
      };
    }
    return colorResolver("--un-shadow-color", "shadow")(match, context);
  }, { autocomplete: ["shadow-$colors", "shadow-$boxShadow"] }],
  [/^shadow-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-shadow-opacity": h.bracket.percent(opacity) }), { autocomplete: "shadow-(op|opacity)-<percent>" }],
  ["shadow-inset", { "--un-shadow-inset": "inset" }]
];
