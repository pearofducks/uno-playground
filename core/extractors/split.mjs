import { isValidSelector } from "../utils/index.mjs";
export const splitCode = (code) => [...new Set(code.split(/\\?[\s'"`;={}]+/g))].filter(isValidSelector);
export const extractorSplit = {
  name: "split",
  order: 0,
  extract({ code }) {
    return splitCode(code);
  }
};
