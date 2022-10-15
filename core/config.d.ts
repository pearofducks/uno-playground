import type { Preset, ResolvedConfig, Shortcut, UserConfig, UserConfigDefaults, UserShortcuts } from './types';
export declare function resolveShortcuts(shortcuts: UserShortcuts): Shortcut[];
export declare function resolvePreset(preset: Preset): Preset;
export declare function resolveConfig(userConfig?: UserConfig, defaults?: UserConfigDefaults): ResolvedConfig;
