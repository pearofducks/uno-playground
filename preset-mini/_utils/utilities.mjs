import { toArray } from "@unocss/core";
import { colorOpacityToString, colorToString, parseCssColor } from "./colors.mjs";
import { handler as h } from "./handlers/index.mjs";
import { directionMap, globalKeywords } from "./mappings.mjs";
export const CONTROL_MINI_NO_NEGATIVE = "$$mini-no-negative";
export function directionSize(propertyPrefix) {
  return ([_, direction, size], { theme }) => {
    const v = theme.spacing?.[size || "DEFAULT"] ?? h.bracket.cssvar.global.auto.fraction.rem(size);
    if (v != null)
      return directionMap[direction].map((i) => [`${propertyPrefix}${i}`, v]);
  };
}
function getThemeColor(theme, colors) {
  let obj = theme.colors;
  let index = -1;
  for (const c of colors) {
    index += 1;
    if (obj && typeof obj !== "string") {
      const camel = colors.slice(index).join("-").replace(/(-[a-z])/g, (n) => n.slice(1).toUpperCase());
      if (obj[camel])
        return obj[camel];
      if (obj[c]) {
        obj = obj[c];
        continue;
      }
    }
    return void 0;
  }
  return obj;
}
export function parseColor(body, theme) {
  const split = body.split(/(?:\/|:)/);
  let main, opacity;
  if (split[0] === "[color") {
    main = split.slice(0, 2).join(":");
    opacity = split[2];
  } else {
    [main, opacity] = split;
  }
  const colors = main.replace(/([a-z])([0-9])/g, "$1-$2").split(/-/g);
  const [name] = colors;
  if (!name)
    return;
  let color;
  const bracket = h.bracketOfColor(main);
  const bracketOrMain = bracket || main;
  if (bracketOrMain.match(/^#[\da-fA-F]+/g))
    color = bracketOrMain;
  else if (bracketOrMain.match(/^hex-[\da-fA-F]+/g))
    color = `#${bracketOrMain.slice(4)}`;
  else if (main.startsWith("$"))
    color = h.cssvar(main);
  color = color || bracket;
  let no = "DEFAULT";
  if (!color) {
    let colorData;
    const [scale] = colors.slice(-1);
    if (scale.match(/^\d+$/)) {
      no = scale;
      colorData = getThemeColor(theme, colors.slice(0, -1));
      if (!colorData || typeof colorData === "string")
        color = void 0;
      else
        color = colorData[no];
    } else {
      colorData = getThemeColor(theme, colors);
      if (!colorData && colors.length <= 2) {
        [, no = no] = colors;
        colorData = getThemeColor(theme, [name]);
      }
      if (typeof colorData === "string")
        color = colorData;
      else if (no && colorData)
        color = colorData[no];
    }
  }
  return {
    opacity,
    name,
    no,
    color,
    cssColor: parseCssColor(color),
    alpha: h.bracket.cssvar.percent(opacity ?? "")
  };
}
export function colorResolver(property, varName, shouldPass) {
  return ([, body], { theme }) => {
    const data = parseColor(body, theme);
    if (!data)
      return;
    const { alpha, color, cssColor } = data;
    const css = {};
    if (cssColor) {
      if (alpha != null) {
        css[property] = colorToString(cssColor, alpha);
      } else {
        css[`--un-${varName}-opacity`] = colorOpacityToString(cssColor);
        css[property] = colorToString(cssColor, `var(--un-${varName}-opacity)`);
      }
    } else if (color) {
      css[property] = colorToString(color, alpha);
    }
    if (shouldPass?.(css) !== false)
      return css;
  };
}
export function colorableShadows(shadows, colorVar) {
  const colored = [];
  shadows = toArray(shadows);
  for (let i = 0; i < shadows.length; i++) {
    const components = getComponents(shadows[i], " ", 6);
    if (!components || components.length < 3)
      return shadows;
    const color = parseCssColor(components.pop());
    if (color == null)
      return shadows;
    colored.push(`${components.join(" ")} var(${colorVar}, ${colorToString(color)})`);
  }
  return colored;
}
export function hasParseableColor(color, theme) {
  return color != null && !!parseColor(color, theme)?.color;
}
export function resolveBreakpoints({ theme, generator }) {
  let breakpoints;
  if (generator.userConfig && generator.userConfig.theme)
    breakpoints = generator.userConfig.theme.breakpoints;
  if (!breakpoints)
    breakpoints = theme.breakpoints;
  return breakpoints;
}
export function resolveVerticalBreakpoints({ theme, generator }) {
  let verticalBreakpoints;
  if (generator.userConfig && generator.userConfig.theme)
    verticalBreakpoints = generator.userConfig.theme.verticalBreakpoints;
  if (!verticalBreakpoints)
    verticalBreakpoints = theme.verticalBreakpoints;
  return verticalBreakpoints;
}
export function makeGlobalStaticRules(prefix, property) {
  return globalKeywords.map((keyword) => [`${prefix}-${keyword}`, { [property ?? prefix]: keyword }]);
}
export function getComponent(str, open, close, separator) {
  if (str === "")
    return;
  const l = str.length;
  let parenthesis = 0;
  for (let i = 0; i < l; i++) {
    switch (str[i]) {
      case open:
        parenthesis++;
        break;
      case close:
        if (--parenthesis < 0)
          return;
        break;
      case separator:
        if (parenthesis === 0) {
          if (i === 0 || i === l - 1)
            return;
          return [
            str.slice(0, i),
            str.slice(i + 1)
          ];
        }
    }
  }
  return [
    str,
    ""
  ];
}
export function getComponents(str, separator, limit) {
  if (separator.length !== 1)
    return;
  limit = limit ?? 10;
  const components = [];
  let i = 0;
  while (str !== "") {
    if (++i > limit)
      return;
    const componentPair = getComponent(str, "(", ")", separator);
    if (!componentPair)
      return;
    const [component, rest] = componentPair;
    components.push(component);
    str = rest;
  }
  if (components.length > 0)
    return components;
}
