import type { Preset, PresetOptions } from '@unocss/core';
import type { Theme, ThemeAnimation } from './theme';
export { preflights } from './preflights';
export { theme, colors } from './theme';
export { parseColor } from './utils';
export type { ThemeAnimation, Theme };
export interface DarkModeSelectors {
    /**
     * Selector for light variant.
     *
     * @default '.light'
     */
    light?: string;
    /**
     * Selector for dark variant.
     *
     * @default '.dark'
     */
    dark?: string;
}
export interface PresetMiniOptions extends PresetOptions {
    /**
     * Dark mode options
     *
     * @default 'class'
     */
    dark?: 'class' | 'media' | DarkModeSelectors;
    /**
     * Generate pesudo selector as `[group=""]` instead of `.group`
     *
     * @default false
     */
    attributifyPseudo?: Boolean;
    /**
     * Prefix for CSS variables.
     *
     * @default 'un-'
     */
    variablePrefix?: string;
    /**
     * Utils prefix
     *
     * @default undefined
     */
    prefix?: string;
    /**
     * Generate preflight
     *
     * @default true
     */
    preflight?: boolean;
}
export declare const presetMini: (options?: PresetMiniOptions) => Preset<Theme>;
export default presetMini;
