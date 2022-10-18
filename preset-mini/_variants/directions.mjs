import { variantMatcher } from "../utils.mjs";
export const variantLanguageDirections = [
  variantMatcher("rtl", (input) => ({ prefix: `[dir="rtl"] $$ ${input.prefix}` })),
  variantMatcher("ltr", (input) => ({ prefix: `[dir="ltr"] $$ ${input.prefix}` }))
];
