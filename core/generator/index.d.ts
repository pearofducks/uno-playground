import type { CSSEntries, CSSObject, GenerateOptions, GenerateResult, ParsedUtil, RawUtil, ResolvedConfig, RuleContext, RuleMeta, ShortcutValue, StringifiedUtil, UserConfig, UserConfigDefaults, VariantMatchedResult } from '../types';
export declare class UnoGenerator {
    userConfig: UserConfig;
    defaults: UserConfigDefaults;
    version: any;
    private _cache;
    config: ResolvedConfig;
    blocked: Set<string>;
    parentOrders: Map<string, number>;
    events: import("../utils/events").Emitter<{
        config: (config: ResolvedConfig) => void;
    }>;
    constructor(userConfig?: UserConfig, defaults?: UserConfigDefaults);
    setConfig(userConfig?: UserConfig, defaults?: UserConfigDefaults): void;
    applyExtractors(code: string, id?: string, set?: Set<string>): Promise<Set<string>>;
    makeContext(raw: string, applied: VariantMatchedResult): RuleContext<{}>;
    parseToken(raw: string, alias?: string): Promise<StringifiedUtil[]>;
    generate(input: string | Set<string> | string[], options?: GenerateOptions): Promise<GenerateResult>;
    matchVariants(raw: string, current?: string): VariantMatchedResult;
    private applyVariants;
    constructCustomCSS(context: Readonly<RuleContext>, body: CSSObject | CSSEntries, overrideSelector?: string): string;
    parseUtil(input: string | VariantMatchedResult, context: RuleContext, internal?: boolean): Promise<(ParsedUtil | RawUtil)[] | undefined>;
    stringifyUtil(parsed?: ParsedUtil | RawUtil, context?: RuleContext): StringifiedUtil | undefined;
    expandShortcut(input: string, context: RuleContext, depth?: number): [ShortcutValue[], RuleMeta | undefined] | undefined;
    stringifyShortcuts(parent: VariantMatchedResult, context: RuleContext, expanded: ShortcutValue[], meta?: RuleMeta): Promise<StringifiedUtil[] | undefined>;
    isBlocked(raw: string): boolean;
}
export declare function createGenerator(config?: UserConfig, defaults?: UserConfigDefaults): UnoGenerator;
export declare const regexScopePlaceholder: RegExp;
export declare const hasScopePlaceholder: (css: string) => RegExpMatchArray;
export declare function movePseudoElementsEnd(selector: string): string;
export declare function toEscapedSelector(raw: string): string;
