export function withLayer(layer, rules) {
  rules.forEach((r) => {
    if (!r[2])
      r[2] = { layer };
    else
      r[2].layer = layer;
  });
  return rules;
}
