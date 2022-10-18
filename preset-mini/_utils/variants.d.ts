import type { VariantHandlerContext, VariantObject } from '@unocss/core';
export declare const variantMatcher: (name: string, handler: (input: VariantHandlerContext) => Record<string, any>) => VariantObject;
export declare const variantParentMatcher: (name: string, parent: string) => VariantObject;
