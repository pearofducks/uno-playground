import type { ParsedUtil, RawUtil, StringifiedUtil, Variant, VariantObject } from '../types';
export declare const attributifyRE: RegExp;
export declare const cssIdRE: RegExp;
export declare const validateFilterRE: RegExp;
export declare const CONTROL_SHORTCUT_NO_MERGE = "$$shortcut-no-merge";
export declare function isAttributifySelector(selector: string): RegExpMatchArray;
export declare function isValidSelector(selector?: string): selector is string;
export declare function normalizeVariant(variant: Variant): VariantObject;
export declare function isRawUtil(util: ParsedUtil | RawUtil | StringifiedUtil): util is RawUtil;
export declare function notNull<T>(value: T | null | undefined): value is T;
export declare function noop(): void;
