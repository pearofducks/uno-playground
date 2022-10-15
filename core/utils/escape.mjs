export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function escapeSelector(str) {
  const length = str.length;
  let index = -1;
  let codeUnit;
  let result = "";
  const firstCodeUnit = str.charCodeAt(0);
  while (++index < length) {
    codeUnit = str.charCodeAt(index);
    if (codeUnit === 0) {
      result += "\uFFFD";
      continue;
    }
    if (codeUnit === 44) {
      result += "\\,";
      continue;
    }
    if (codeUnit >= 1 && codeUnit <= 31 || codeUnit === 127 || index === 0 && codeUnit >= 48 && codeUnit <= 57 || index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }
    if (index === 0 && length === 1 && codeUnit === 45) {
      result += `\\${str.charAt(index)}`;
      continue;
    }
    if (codeUnit >= 128 || codeUnit === 45 || codeUnit === 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
      result += str.charAt(index);
      continue;
    }
    result += `\\${str.charAt(index)}`;
  }
  return result;
}
export const e = escapeSelector;
