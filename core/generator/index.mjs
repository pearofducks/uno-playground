import { createNanoEvents } from "../utils/events.mjs";
import { resolveConfig } from "../config.mjs";
import { CONTROL_SHORTCUT_NO_MERGE, TwoKeyMap, e, entriesToCss, expandVariantGroup, isRawUtil, isStaticShortcut, isString, noop, normalizeCSSEntries, normalizeCSSValues, notNull, uniq, warnOnce } from "../utils/index.mjs";
import pkg from "../../package.json" assert { type: 'json' };
import { LAYER_DEFAULT, LAYER_PREFLIGHTS } from "../constants.mjs";
const { version } = pkg

export class UnoGenerator {
  version = version;
  _cache = new Map();
  blocked = new Set();
  parentOrders = new Map();
  events = createNanoEvents();

  constructor(userConfig = {}, defaults = {}) {
    this.config = resolveConfig(userConfig, defaults);
    this.events.emit('config', this.config);
  }

  setConfig(userConfig, defaults) {
    if (!userConfig) return;
    if (defaults) this.defaults = defaults;
    this.userConfig = userConfig;
    this.blocked.clear();
    this.parentOrders.clear();
    this._cache.clear();
    this.config = resolveConfig(userConfig, this.defaults);
    this.events.emit("config", this.config);
  }

  async applyExtractors(code, id, set = /* @__PURE__ */ new Set()) {
    const context = {
      get original() { return code; },
      code,
      id
    };

    for (const extractor of this.config.extractors) {
      const result = await extractor.extract(context);
      if (result) {
        for (const token of result) set.add(token);
      }
    }

    return set;
  }

  makeContext(raw, applied) {
    const context = {
      rawSelector: raw,
      currentSelector: applied[1],
      theme: this.config.theme,
      generator: this,
      variantHandlers: applied[2],
      constructCSS: (...args) => this.constructCustomCSS(context, ...args),
      variantMatch: applied
    };
    return context;
  }

  async parseToken(raw, alias) {
    if (this.blocked.has(raw)) return;
    const cacheKey = `${raw}${alias ? ` ${alias}` : ""}`;

    // use cache if possible
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    let current = raw;
    for (const p of this.config.preprocess) current = p(raw);

    if (this.isBlocked(current)) {
      this.blocked.add(raw);
      this._cache.set(cacheKey, null);
      return;
    }

    const applied = this.matchVariants(raw, current);

    if (!applied || this.isBlocked(applied[1])) {
      this.blocked.add(raw);
      this._cache.set(cacheKey, null);
      return;
    }

    const context = this.makeContext(raw, [alias || applied[0], applied[1], applied[2], applied[3]]);

    if (this.config.details) context.variants = [...applied[3]];

    // expand shortcuts
    const expanded = this.expandShortcut(context.currentSelector, context);
    const utils = expanded
      ? await this.stringifyShortcuts(context.variantMatch, context, expanded[0], expanded[1])
      // no shortcuts
      : (await this.parseUtil(context.variantMatch, context))?.map((i) => this.stringifyUtil(i, context)).filter(notNull);

    if (utils?.length) {
      this._cache.set(cacheKey, utils);
      return utils;
    }

    // null cache for unmatched result
    this._cache.set(cacheKey, null);
  }

  async generate(input, options = {}) {
    const {
      id,
      scope,
      preflights = true,
      safelist = true,
      blocklist = true,
      minify = false
    } = options;

    const tokens = isString(input)
      ? await this.applyExtractors(input, id)
      : Array.isArray(input)
        ? new Set(input)
        : input;

    if (safelist) this.config.safelist.forEach((s) => tokens.add(s));
    if (blocklist) this.config.blocklist.forEach((s) => tokens.delete(s));

    const nl = minify ? "" : "\n";

    const layerSet = new Set([LAYER_DEFAULT]);
    const matched = new Set();
    const sheet = new Map();
    let preflightsMap = {};

    const tokenPromises = Array.from(tokens).map(async (raw) => {
      if (matched.has(raw)) return;

      const payload = await this.parseToken(raw);
      if (payload == null) return;

      matched.add(raw);

      for (const item of payload) {
        const parent = item[3] || "";
        const layer = item[4]?.layer;
        if (!sheet.has(parent)) sheet.set(parent, []);
        sheet.get(parent).push(item);
        if (layer) layerSet.add(layer);
      }
    });

    const preflightPromise = (async () => {
      if (!preflights) return;

      const preflightContext = {
        generator: this,
        theme: this.config.theme
      };

      const preflightLayerSet = new Set([]);
      this.config.preflights.forEach(({ layer = LAYER_PREFLIGHTS }) => {
        layerSet.add(layer);
        preflightLayerSet.add(layer);
      });

      preflightsMap = Object.fromEntries(
        await Promise.all(Array.from(preflightLayerSet).map(
          async (layer) => {
            const preflights2 = await Promise.all(
              this.config.preflights
                .filter((i) => (i.layer || LAYER_PREFLIGHTS) === layer)
                .map(async (i) => await i.getCSS(preflightContext))
            );
            const css = preflights2.filter(Boolean).join(nl);
            return [layer, css];
          }
        ))
      );
    })();

    await Promise.all([
      ...tokenPromises,
      preflightPromise
    ]);

    const layers = this.config.sortLayers(
      Array.from(layerSet)
        .sort((a, b) => (this.config.layers[a] ?? 0) - (this.config.layers[b] ?? 0) || a.localeCompare(b))
    );

    const layerCache = {};
    const getLayer = (layer) => {
      if (layerCache[layer]) return layerCache[layer];

      let css = Array.from(sheet)
        .sort((a, b) => (this.parentOrders.get(a[0]) ?? 0) - (this.parentOrders.get(b[0]) ?? 0) || a[0]?.localeCompare(b[0] || "") || 0)
        .map(([parent, items]) => {
          const size = items.length;
          const sorted = items
            .filter((i) => (i[4]?.layer || LAYER_DEFAULT) === layer)
            .sort((a, b) => a[0] - b[0] || (a[4]?.sort || 0) - (b[4]?.sort || 0) || a[1]?.localeCompare(b[1] || "") || a[2]?.localeCompare(b[2] || "") || 0)
            .map(([, selector, body,, meta,, variantNoMerge]) => {
              const scopedSelector = selector ? applyScope(selector, scope) : selector;
              return [
                [[scopedSelector ?? "", meta?.sort ?? 0]],
                body,
                !!(variantNoMerge ?? meta?.noMerge)
              ];
            });
          if (!sorted.length) return undefined;
          const rules = sorted
            .reverse()
            .map(([selectorSortPair, body, noMerge], idx) => {
              if (!noMerge && this.config.mergeSelectors) {
                for (let i = idx + 1; i < size; i++) {
                  const current = sorted[i];
                  if (current && !current[2] && (selectorSortPair && current[0] || selectorSortPair == null && current[0] == null) && current[1] === body) {
                    if (selectorSortPair && current[0]) current[0].push(...selectorSortPair);
                    return null;
                  }
                }
              }
            const selectors = selectorSortPair
              ? uniq(selectorSortPair
                .sort((a, b) => a[1] - b[1] || a[0]?.localeCompare(b[0] || "") || 0)
                .map((pair) => pair[0])
                .filter(Boolean))
              : [];
            return selectors.length ? `${selectors.join(`,${nl}`)}{${body}}` : body;
          }).filter(Boolean).reverse().join(nl);
        if (!parent) return rules;
        const parents = parent.split(" $$ ");
        return `${parents.join("{")}{${nl}${rules}${nl}}${parents.map((_) => "").join("}")}`;
      }).filter(Boolean).join(nl);
      if (preflights) {
        css = [preflightsMap[layer], css].filter(Boolean).join(nl);
      }
      const layerMark = minify ? "" : `/* layer: ${layer} */${nl}`;
      return layerCache[layer] = css ? layerMark + css : "";
    };
    const getLayers = (includes = layers, excludes) => {
      return includes.filter((i) => !excludes?.includes(i)).map((i) => getLayer(i) || "").filter(Boolean).join(nl);
    };
    return {
      get css() { return getLayers(); },
      layers,
      matched,
      getLayers,
      getLayer
    };
  }

  matchVariants(raw, current) {
    const variants = new Set();
    const handlers = [];
    let processed = current || raw;
    let applied = false;
    const context = {
      rawSelector: raw,
      theme: this.config.theme,
      generator: this
    };
    while (true) {
      applied = false;
      for (const v of this.config.variants) {
        if (!v.multiPass && variants.has(v)) continue;
        let handler = v.match(processed, context);
        if (!handler) continue;
        if (isString(handler)) handler = { matcher: handler };
        processed = handler.matcher;
        handlers.unshift(handler);
        variants.add(v);
        applied = true;
        break;
      }
      if (!applied) break;
      if (handlers.length > 500) throw new Error(`Too many variants applied to "${raw}"`);
    }
    return [raw, processed, handlers, variants];
  }

  applyVariants(parsed, variantHandlers = parsed[4], raw = parsed[1]) {
    const handler = [...variantHandlers].sort((a, b) => (a.order || 0) - (b.order || 0)).reverse().reduce(
      (previous, v) => (input) => {
        const entries = v.body?.(input.entries) || input.entries;
        const parents = Array.isArray(v.parent) ? v.parent : [v.parent, undefined];
        return (v.handle ?? defaultVariantHandler)({
          ...input,
          entries,
          selector: v.selector?.(input.selector, entries) || input.selector,
          parent: parents[0] || input.parent,
          parentOrder: parents[1] || input.parentOrder,
          layer: v.layer || input.layer,
          sort: v.sort || input.sort
        }, previous);
      },
      (input) => input
    );
    const variantContextResult = handler({
      prefix: "",
      selector: toEscapedSelector(raw),
      pseudo: "",
      entries: parsed[2]
    });
    const { parent, parentOrder } = variantContextResult;
    if (parent != null && parentOrder != null) this.parentOrders.set(parent, parentOrder);
    const obj = {
      selector: movePseudoElementsEnd([
        variantContextResult.prefix,
        variantContextResult.selector,
        variantContextResult.pseudo
      ].join("")),
      entries: variantContextResult.entries,
      parent,
      layer: variantContextResult.layer,
      sort: variantContextResult.sort,
      noMerge: variantContextResult.noMerge
    };
    for (const p of this.config.postprocess) p(obj);
    return obj;
  }

  constructCustomCSS(context, body, overrideSelector) {
    const normalizedBody = normalizeCSSEntries(body);
    if (isString(normalizedBody)) return normalizedBody;
    const { selector, entries, parent } = this.applyVariants([0, overrideSelector || context.rawSelector, normalizedBody, undefined, context.variantHandlers]);
    const cssBody = `${selector}{${entriesToCss(entries)}}`;
    if (parent) return `${parent}{${cssBody}}`;
    return cssBody;
  }

  async parseUtil(input, context, internal = false) {
    const [raw, processed, variantHandlers] = isString(input) ? this.matchVariants(input) : input;
    // console.log({ raw, processed, variantHandlers })
    if (this.config.details) context.rules = context.rules ?? [];
    const staticMatch = this.config.rulesStaticMap[processed];
    if (staticMatch) {
      if (staticMatch[1] && (internal || !staticMatch[2]?.internal)) {
        if (this.config.details) context.rules.push(staticMatch[3]);
        const index = staticMatch[0];
        const entry = normalizeCSSEntries(staticMatch[1]);
        const meta = staticMatch[2];
        if (isString(entry)) return [[index, entry, meta]];
        else return [[index, raw, entry, meta, variantHandlers]];
      }
    }
    context.variantHandlers = variantHandlers;
    const { rulesDynamic } = this.config;
    for (const [i, matcher, handler, meta] of rulesDynamic) {
      if (meta?.internal && !internal) continue;
      let unprefixed = processed;
      if (meta?.prefix) {
        if (!processed.startsWith(meta.prefix)) continue;
        unprefixed = processed.slice(meta.prefix.length);
      }
      const match = unprefixed.match(matcher);
      // console.log("MATCH", unprefixed, matcher, match)
      if (!match) continue;
      const result = await handler(match, context);
      if (!result) continue;
      if (this.config.details) context.rules.push([matcher, handler, meta]);
      const entries = normalizeCSSValues(result).filter((i2) => i2.length);
      if (entries.length) {
        return entries.map((e2) => {
          if (isString(e2)) return [i, e2, meta];
          else return [i, raw, e2, meta, variantHandlers];
        });
      }
    }
  }

  stringifyUtil(parsed, context) {
    if (!parsed) return;
    if (isRawUtil(parsed)) return [parsed[0], undefined, parsed[1], undefined, parsed[2], this.config.details ? context : undefined, undefined];
    const { selector, entries, parent, layer: variantLayer, sort: variantSort, noMerge } = this.applyVariants(parsed);
    const body = entriesToCss(entries);
    if (!body) return;
    const { layer: metaLayer, sort: metaSort, ...meta } = parsed[3] ?? {};
    const ruleMeta = {
      ...meta,
      layer: variantLayer ?? metaLayer,
      sort: variantSort ?? metaSort
    };
    return [parsed[0], selector, body, parent, ruleMeta, this.config.details ? context : undefined, noMerge];
  }
  expandShortcut(input, context, depth = 5) {
    if (depth === 0) return;
    const recordShortcut = this.config.details ? (s) => {
      context.shortcuts = context.shortcuts ?? [];
      context.shortcuts.push(s);
    } : noop;
    let meta;
    let result;
    for (const s of this.config.shortcuts) {
      const unprefixed = s[2]?.prefix ? input.slice(s[2].prefix.length) : input;
      if (isStaticShortcut(s)) {
        if (s[0] === unprefixed) {
          meta = meta || s[2];
          result = s[1];
          recordShortcut(s);
          break;
        }
      } else {
        const match = unprefixed.match(s[0]);
        if (match) result = s[1](match, context);
        if (result) {
          meta = meta || s[2];
          recordShortcut(s);
          break;
        }
      }
    }
    if (isString(result))
      result = expandVariantGroup(result.trim()).split(/\s+/g);
    if (!result) {
      const [raw, inputWithoutVariant] = isString(input) ? this.matchVariants(input) : input;
      if (raw !== inputWithoutVariant) {
        const expanded = this.expandShortcut(inputWithoutVariant, context, depth - 1);
        if (expanded)
          result = expanded[0].map((item) => isString(item) ? raw.replace(inputWithoutVariant, item) : item);
      }
    }
    if (!result)
      return;
    return [
      result.flatMap((r) => (isString(r) ? this.expandShortcut(r, context, depth - 1)?.[0] : undefined) || [r]).filter(Boolean),
      meta
    ];
  }
  async stringifyShortcuts(parent, context, expanded, meta = { layer: this.config.shortcutsLayer }) {
    const selectorMap = new TwoKeyMap();
    const parsed = (await Promise.all(uniq(expanded).map(async (i) => {
      const result = isString(i) ? await this.parseUtil(i, context, true) : [[Infinity, "{inline}", normalizeCSSEntries(i), undefined, []]];
      if (!result)
        warnOnce(`unmatched utility "${i}" in shortcut "${parent[1]}"`);
      return result || [];
    }))).flat(1).filter(Boolean).sort((a, b) => a[0] - b[0]);
    const [raw, , parentVariants] = parent;
    const rawStringfieldUtil = [];
    for (const item of parsed) {
      if (isRawUtil(item)) {
        rawStringfieldUtil.push([item[0], undefined, item[1], undefined, item[2], context, undefined]);
        continue;
      }
      const { selector, entries, parent: parent2, sort, noMerge } = this.applyVariants(item, [...item[4], ...parentVariants], raw);
      const mapItem = selectorMap.getFallback(selector, parent2, [[], item[0]]);
      mapItem[0].push([entries, !!(noMerge ?? item[3]?.noMerge), sort ?? 0]);
    }
    return rawStringfieldUtil.concat(selectorMap.map(([e2, index], selector, joinedParents) => {
      const stringify = (flatten, noMerge, entrySortPair) => {
        const maxSort = Math.max(...entrySortPair.map((e3) => e3[1]));
        const entriesList = entrySortPair.map((e3) => e3[0]);
        return (flatten ? [entriesList.flat(1)] : entriesList).map((entries) => {
          const body = entriesToCss(entries);
          if (body)
            return [index, selector, body, joinedParents, { ...meta, noMerge, sort: maxSort }, context, undefined];
          return undefined;
        });
      };
      const merges = [
        [e2.filter(([, noMerge]) => noMerge).map(([entries, , sort]) => [entries, sort]), true],
        [e2.filter(([, noMerge]) => !noMerge).map(([entries, , sort]) => [entries, sort]), false]
      ];
      return merges.map(([e3, noMerge]) => [
        ...stringify(false, noMerge, e3.filter(([entries]) => entries.some((entry) => entry[0] === CONTROL_SHORTCUT_NO_MERGE))),
        ...stringify(true, noMerge, e3.filter(([entries]) => entries.every((entry) => entry[0] !== CONTROL_SHORTCUT_NO_MERGE)))
      ]);
    }).flat(2).filter(Boolean));
  }
  isBlocked(raw) {
    return !raw || this.config.blocklist.some((e2) => isString(e2) ? e2 === raw : e2.test(raw));
  }
}
export function createGenerator(config, defaults) {
  return new UnoGenerator(config, defaults);
}
export const regexScopePlaceholder = / \$\$ /;
export const hasScopePlaceholder = (css) => css.match(regexScopePlaceholder);
function applyScope(css, scope) {
  if (hasScopePlaceholder(css))
    return css.replace(regexScopePlaceholder, scope ? ` ${scope} ` : " ");
  else
    return scope ? `${scope} ${css}` : css;
}
export function movePseudoElementsEnd(selector) {
  const pseudoElements = selector.match(/::[\w-]+(\([\w-]+\))?/g);
  if (pseudoElements) {
    for (const e2 of pseudoElements)
      selector = selector.replace(e2, "");
    selector += pseudoElements.join("");
  }
  return selector;
}
const attributifyRe = /^\[(.+?)(~?=)"(.*)"\]$/;
export function toEscapedSelector(raw) {
  if (attributifyRe.test(raw))
    return raw.replace(attributifyRe, (_, n, s, i) => `[${e(n)}${s}"${e(i)}"]`);
  return `.${e(raw)}`;
}
function defaultVariantHandler(input, next) {
  return next(input);
}
