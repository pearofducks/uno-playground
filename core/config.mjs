import { clone, isStaticRule, mergeDeep, normalizeVariant, toArray, uniq } from "./utils/index.mjs";
import { extractorSplit } from "./extractors/index.mjs";
import { DEFAULT_LAYERS } from "./constants.mjs";
export function resolveShortcuts(shortcuts) {
  return toArray(shortcuts).flatMap((s) => {
    if (Array.isArray(s))
      return [s];
    return Object.entries(s);
  });
}
export function resolvePreset(preset) {
  const shortcuts = preset.shortcuts ? resolveShortcuts(preset.shortcuts) : undefined;
  preset.shortcuts = shortcuts;
  if (preset.prefix || preset.layer) {
    const apply = (i) => {
      if (!i[2])
        i[2] = {};
      const meta = i[2];
      if (meta.prefix == null && preset.prefix)
        meta.prefix = preset.prefix;
      if (meta.layer == null && preset.layer)
        meta.prefix = preset.layer;
    };
    shortcuts?.forEach(apply);
    preset.rules?.forEach(apply);
  }
  return preset;
}
export function resolveConfig(userConfig = {}, defaults = {}) {
  const config = Object.assign({}, defaults, userConfig);
  const rawPresets = (config.presets || []).flatMap(toArray).map(resolvePreset);
  const sortedPresets = [
    ...rawPresets.filter((p) => p.enforce === "pre"),
    ...rawPresets.filter((p) => !p.enforce),
    ...rawPresets.filter((p) => p.enforce === "post")
  ];
  const layers = Object.assign(DEFAULT_LAYERS, ...rawPresets.map((i) => i.layers), userConfig.layers);
  function mergePresets(key) {
    return uniq([
      ...sortedPresets.flatMap((p) => toArray(p[key] || [])),
      ...toArray(config[key] || [])
    ]);
  }
  const extractors = mergePresets("extractors");
  if (!extractors.length)
    extractors.push(extractorSplit);
  extractors.sort((a, b) => (a.order || 0) - (b.order || 0));
  const rules = mergePresets("rules");
  const rulesStaticMap = {};
  const rulesSize = rules.length;
  const rulesDynamic = rules.map((rule, i) => {
    if (isStaticRule(rule)) {
      const prefix = rule[2]?.prefix || "";
      rulesStaticMap[prefix + rule[0]] = [i, rule[1], rule[2], rule];
      return undefined;
    }
    return [i, ...rule];
  }).filter(Boolean).reverse();
  const theme = clone([
    ...sortedPresets.map((p) => p.theme || {}),
    config.theme || {}
  ].reduce((a, p) => mergeDeep(a, p), {}));
  mergePresets("extendTheme").forEach((extendTheme) => extendTheme(theme));
  const autocomplete = {
    templates: uniq(sortedPresets.map((p) => toArray(p.autocomplete?.templates)).flat()),
    extractors: sortedPresets.map((p) => toArray(p.autocomplete?.extractors)).flat().sort((a, b) => (a.order || 0) - (b.order || 0))
  };
  return {
    mergeSelectors: true,
    warn: true,
    blocklist: [],
    sortLayers: (layers2) => layers2,
    ...config,
    presets: sortedPresets,
    envMode: config.envMode || "build",
    shortcutsLayer: config.shortcutsLayer || "shortcuts",
    layers,
    theme,
    rulesSize,
    rulesDynamic,
    rulesStaticMap,
    preprocess: mergePresets("preprocess"),
    postprocess: mergePresets("postprocess"),
    preflights: mergePresets("preflights"),
    autocomplete,
    variants: mergePresets("variants").map(normalizeVariant),
    shortcuts: resolveShortcuts(mergePresets("shortcuts")),
    extractors,
    safelist: mergePresets("safelist"),
    blocklist: mergePresets("blocklist")
  };
}
