import type { CSSColorValue, RGBAColorValue } from '@unocss/core';
export declare function hex2rgba(hex?: string): RGBAColorValue | undefined;
export declare function parseCssColor(str?: string): CSSColorValue | undefined;
export declare function colorOpacityToString(color: CSSColorValue): string | number;
export declare function colorToString(color: CSSColorValue | string, alphaOverride?: string | number): string;
