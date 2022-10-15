export declare type ValueHandlerCallback = (str: string) => string | number | undefined;
export declare type ValueHandler<K extends string> = {
    [S in K]: ValueHandler<K>;
} & {
    (str: string): string | undefined;
    __options: {
        sequence: K[];
    };
};
export declare function createValueHandler<K extends string>(handlers: Record<K, ValueHandlerCallback>): ValueHandler<K>;
