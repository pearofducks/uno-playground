import { transitions } from "./transition.mjs";
import { borders } from "./border.mjs";
import { bgColors, opacity, textColors } from "./color.mjs";
import { flex } from "./flex.mjs";
import { fonts, tabSizes, textIndents, textShadows, textStrokes } from "./typography.mjs";
import { gaps } from "./gap.mjs";
import { grids } from "./grid.mjs";
import { overflows } from "./layout.mjs";
import { alignments, boxSizing, insets, justifies, orders, placements, positions, zIndexes } from "./position.mjs";
import { rings } from "./ring.mjs";
import { boxShadows } from "./shadow.mjs";
import { aspectRatio, sizes } from "./size.mjs";
import { margins, paddings } from "./spacing.mjs";
import { appearances, breaks, contentVisibility, contents, cursors, displays, fontSmoothings, fontStyles, pointerEvents, resizes, textOverflows, textTransforms, userSelects, whitespaces } from "./static.mjs";
import { transforms } from "./transform.mjs";
import { cssProperty, cssVariables } from "./variables.mjs";
import { questionMark } from "./question-mark.mjs";
import { textAligns, verticalAligns } from "./align.mjs";
import { appearance, outline, willChange } from "./behaviors.mjs";
import { textDecorations } from "./decoration.mjs";
import { svgUtilities } from "./svg.mjs";
export const rules = [
  cssVariables,
  cssProperty,
  paddings,
  margins,
  displays,
  opacity,
  bgColors,
  svgUtilities,
  borders,
  contentVisibility,
  contents,
  fonts,
  tabSizes,
  textIndents,
  textOverflows,
  textDecorations,
  textStrokes,
  textShadows,
  textTransforms,
  textAligns,
  textColors,
  fontStyles,
  fontSmoothings,
  boxShadows,
  rings,
  flex,
  grids,
  gaps,
  positions,
  sizes,
  aspectRatio,
  cursors,
  appearances,
  pointerEvents,
  resizes,
  verticalAligns,
  userSelects,
  whitespaces,
  breaks,
  overflows,
  outline,
  appearance,
  orders,
  justifies,
  alignments,
  placements,
  insets,
  // floats,
  zIndexes,
  boxSizing,
  transitions,
  transforms,
  willChange,
  questionMark
].flat(1);
