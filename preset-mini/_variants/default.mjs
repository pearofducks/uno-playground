import { variantBreakpoints } from "./breakpoints.mjs";
import { variantCombinators } from "./combinators.mjs";
import { variantColorsMediaOrClass } from "./dark.mjs";
import { variantLanguageDirections } from "./directions.mjs";
import { variantCssLayer, variantInternalLayer, variantScope, variantSelector, variantVariables } from "./misc.mjs";
import { variantNegative } from "./negative.mjs";
import { variantImportant } from "./important.mjs";
import { variantCustomMedia, variantPrint } from "./media.mjs";
import { variantSupports } from "./supports.mjs";
import { partClasses, variantPseudoClassFunctions, variantPseudoClassesAndElements, variantTaggedPseudoClasses } from "./pseudo.mjs";
export const variants = (options) => [
  variantVariables,
  variantCssLayer,
  variantSelector,
  variantInternalLayer,
  variantNegative,
  variantImportant,
  variantSupports,
  variantPrint,
  variantCustomMedia,
  variantBreakpoints,
  ...variantCombinators,
  variantPseudoClassesAndElements,
  variantPseudoClassFunctions,
  ...variantTaggedPseudoClasses(options),
  partClasses,
  ...variantColorsMediaOrClass(options),
  ...variantLanguageDirections,
  variantScope
];
