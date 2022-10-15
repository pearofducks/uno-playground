import { splitCode } from "./split.mjs";
export const extractorSvelte = {
  name: "svelte",
  order: 0,
  extract({ code, id }) {
    let result = splitCode(code);
    if (id && id.endsWith(".svelte")) {
      result = result.map((r) => {
        return r.startsWith("class:") ? r.slice(6) : r;
      });
    }
    return new Set(result);
  }
};
