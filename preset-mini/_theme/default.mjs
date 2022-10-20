import { colors } from "./colors.mjs";
import { fontFamily, fontSize } from "./font.mjs";
import { borderRadius, boxShadow, breakpoints, duration, easing, lineWidth, ringWidth, spacing, verticalBreakpoints } from "./misc.mjs";
// import { blur, dropShadow } from "./filters.mjs";
import { height, maxHeight, maxWidth, width } from "./size.mjs";
import { preflightBase } from "./preflight.mjs";

export const theme = {
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth: maxWidth,
  minHeight: maxHeight,
  inlineSize: width,
  blockSize: height,
  maxInlineSize: maxWidth,
  maxBlockSize: maxHeight,
  minInlineSize: maxWidth,
  minBlockSize: maxHeight,
  colors,
  fontFamily,
  fontSize,
  breakpoints,
  verticalBreakpoints,
  borderRadius,
  // lineHeight,
  // letterSpacing,
  // wordSpacing,
  boxShadow,
  // textIndent,
  // textShadow,
  // textStrokeWidth,
  // blur,
  // dropShadow,
  easing,
  lineWidth,
  spacing,
  duration,
  ringWidth,
  preflightBase
};
