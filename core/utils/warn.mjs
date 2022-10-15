const warned = /* @__PURE__ */ new Set();
export function warnOnce(msg) {
  if (warned.has(msg))
    return;
  console.warn("[unocss]", msg);
  warned.add(msg);
}
