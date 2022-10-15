import type { Rule } from '../types';
export declare function withLayer<T extends {}>(layer: string, rules: Rule<T>[]): Rule<T>[];
