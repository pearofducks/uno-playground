import type { CSSObject, DynamicMatcher, ParsedColorValue, Rule, VariantContext } from '@unocss/core';
import type { Theme } from '../theme';
export declare const CONTROL_MINI_NO_NEGATIVE = "$$mini-no-negative";
/**
 * Provide {@link DynamicMatcher} function returning spacing definition. See spacing rules.
 *
 * @param {string} propertyPrefix - Property for the css value to be created. Postfix will be appended according to direction matched.
 * @see {@link directionMap}
 */
export declare function directionSize(propertyPrefix: string): DynamicMatcher;
/**
 * Parse color string into {@link ParsedColorValue} (if possible). Color value will first be matched to theme object before parsing.
 * See also color.tests.ts for more examples.
 *
 * @example Parseable strings:
 * 'red' // From theme, if 'red' is available
 * 'red-100' // From theme, plus scale
 * 'red-100/20' // From theme, plus scale/opacity
 * '[rgb(100,2,3)]/[var(--op)]' // Bracket with rgb color and bracket with opacity
 *
 * @param {string} body - Color string to be parsed.
 * @param {Theme} theme - {@link Theme} object.
 * @return {ParsedColorValue|undefined}  {@link ParsedColorValue} object if string is parseable.
 */
export declare function parseColor(body: string, theme: Theme): ParsedColorValue | undefined;
/**
 * Provide {@link DynamicMatcher} function to produce color value matched from rule.
 *
 * @see {@link parseColor}
 *
 * @example Resolving 'red' from theme:
 * colorResolver('background-color', 'background')('', 'red')
 * return { 'background-color': '#f12' }
 *
 * @example Resolving 'red-100' from theme:
 * colorResolver('background-color', 'background')('', 'red-100')
 * return { '--un-background-opacity': '1', 'background-color': 'rgba(254,226,226,var(--un-background-opacity))' }
 *
 * @example Resolving 'red-100/20' from theme:
 * colorResolver('background-color', 'background')('', 'red-100/20')
 * return { 'background-color': 'rgba(204,251,241,0.22)' }
 *
 * @example Resolving 'hex-124':
 * colorResolver('color', 'text')('', 'hex-124')
 * return { '--un-text-opacity': '1', 'color': 'rgba(17,34,68,var(--un-text-opacity))' }
 *
 * @param {string} property - Property for the css value to be created.
 * @param {string} varName - Base name for the opacity variable.
 * @param {function} [shouldPass] - Function to decide whether to pass the css.
 * @return {@link DynamicMatcher} object.
 */
export declare function colorResolver(property: string, varName: string, shouldPass?: (css: CSSObject) => boolean): DynamicMatcher;
export declare function colorableShadows(shadows: string | string[], colorVar: string): any[];
export declare function hasParseableColor(color: string | undefined, theme: Theme): boolean;
export declare function resolveBreakpoints({ theme, generator }: Readonly<VariantContext<Theme>>): Record<string, string>;
export declare function resolveVerticalBreakpoints({ theme, generator }: Readonly<VariantContext<Theme>>): Record<string, string>;
export declare function makeGlobalStaticRules(prefix: string, property?: string): Rule<{}>[];
export declare function getComponent(str: string, open: string, close: string, separator: string): string[];
export declare function getComponents(str: string, separator: string, limit?: number): any[];
