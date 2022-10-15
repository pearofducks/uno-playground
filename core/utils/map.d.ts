export declare class TwoKeyMap<K1, K2, V> {
    _map: Map<K1, Map<K2, V>>;
    get(key1: K1, key2: K2): V | undefined;
    getFallback(key1: K1, key2: K2, fallback: V): V;
    set(key1: K1, key2: K2, value: V): this;
    has(key1: K1, key2: K2): boolean;
    delete(key1: K1, key2: K2): boolean;
    deleteTop(key1: K1): boolean;
    map<T>(fn: (v: V, k1: K1, k2: K2) => T): T[];
}
export declare class BetterMap<K, V> extends Map<K, V> {
    map<R>(mapFn: (value: V, key: K) => R): R[];
}
