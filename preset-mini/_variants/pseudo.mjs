import { escapeRegExp } from "@unocss/core";
const PseudoClasses = Object.fromEntries([
  ["first-letter", "::first-letter"],
  ["first-line", "::first-line"],
  "any-link",
  "link",
  "visited",
  "target",
  ["open", "[open]"],
  "hover",
  "active",
  "focus-visible",
  "focus-within",
  "focus",
  "autofill",
  "enabled",
  "disabled",
  "read-only",
  "read-write",
  "placeholder-shown",
  "default",
  "checked",
  "indeterminate",
  "valid",
  "invalid",
  "in-range",
  "out-of-range",
  "required",
  "optional",
  "root",
  "empty",
  ["even-of-type", ":nth-of-type(even)"],
  ["even", ":nth-child(even)"],
  ["odd-of-type", ":nth-of-type(odd)"],
  ["odd", ":nth-child(odd)"],
  "first-of-type",
  ["first", ":first-child"],
  "last-of-type",
  ["last", ":last-child"],
  "only-child",
  "only-of-type",
  ["placeholder", "::placeholder"],
  ["before", "::before"],
  ["after", "::after"],
  ["selection", "::selection"],
  ["marker", "::marker"],
  ["file", "::file-selector-button"]
].map((key) => Array.isArray(key) ? key : [key, `:${key}`]));
const PseudoClassesColon = Object.fromEntries([
  ["backdrop", "::backdrop"]
].map((key) => Array.isArray(key) ? key : [key, `:${key}`]));
const PseudoClassFunctions = [
  "not",
  "is",
  "where",
  "has"
];
const PseudoClassesStr = Object.entries(PseudoClasses).filter(([, pseudo]) => !pseudo.startsWith("::")).map(([key]) => key).join("|");
const PseudoClassesColonStr = Object.entries(PseudoClassesColon).filter(([, pseudo]) => !pseudo.startsWith("::")).map(([key]) => key).join("|");
const PseudoClassFunctionsStr = PseudoClassFunctions.join("|");
const sortValue = (pseudo) => {
  if (pseudo === "active")
    return 1;
};
const taggedPseudoClassMatcher = (tag, parent, combinator) => {
  const rawRe = new RegExp(`^(${escapeRegExp(parent)}:)(\\S+)${escapeRegExp(combinator)}\\1`);
  const pseudoRE = new RegExp(`^${tag}-((?:(${PseudoClassFunctionsStr})-)?(${PseudoClassesStr}))[:-]`);
  const pseudoColonRE = new RegExp(`^${tag}-((?:(${PseudoClassFunctionsStr})-)?(${PseudoClassesColonStr}))[:]`);
  return {
    name: `pseudo:${tag}`,
    match(input) {
      const match = input.match(pseudoRE) || input.match(pseudoColonRE);
      if (match) {
        let pseudo = PseudoClasses[match[3]] || PseudoClassesColon[match[3]] || `:${match[3]}`;
        if (match[2])
          pseudo = `:${match[2]}(${pseudo})`;
        return {
          matcher: input.slice(match[0].length),
          handle: (input2, next) => next({
            ...input2,
            prefix: `${parent}${pseudo}${combinator}${input2.prefix}`.replace(rawRe, "$1$2:"),
            sort: sortValue(match[3])
          })
        };
      }
    },
    multiPass: true
  };
};
const PseudoClassesAndElementsStr = Object.entries(PseudoClasses).map(([key]) => key).join("|");
const PseudoClassesAndElementsColonStr = Object.entries(PseudoClassesColon).map(([key]) => key).join("|");
const PseudoClassesAndElementsRE = new RegExp(`^(${PseudoClassesAndElementsStr})[:-]`);
const PseudoClassesAndElementsColonRE = new RegExp(`^(${PseudoClassesAndElementsColonStr})[:]`);
export const variantPseudoClassesAndElements = {
  name: "pseudo",
  match: (input) => {
    const match = input.match(PseudoClassesAndElementsRE) || input.match(PseudoClassesAndElementsColonRE);
    if (match) {
      const pseudo = PseudoClasses[match[1]] || PseudoClassesColon[match[1]] || `:${match[1]}`;
      return {
        matcher: input.slice(match[0].length),
        handle: (input2, next) => {
          const selectors = pseudo.startsWith("::") ? {
            pseudo: `${input2.pseudo}${pseudo}`
          } : {
            selector: `${input2.selector}${pseudo}`
          };
          return next({
            ...input2,
            ...selectors,
            sort: sortValue(match[1])
          });
        }
      };
    }
  },
  multiPass: true,
  autocomplete: `(${PseudoClassesAndElementsStr}):`
};
const PseudoClassFunctionsRE = new RegExp(`^(${PseudoClassFunctionsStr})-(${PseudoClassesStr})[:-]`);
const PseudoClassColonFunctionsRE = new RegExp(`^(${PseudoClassFunctionsStr})-(${PseudoClassesColonStr})[:]`);
export const variantPseudoClassFunctions = {
  match: (input) => {
    const match = input.match(PseudoClassFunctionsRE) || input.match(PseudoClassColonFunctionsRE);
    if (match) {
      const fn = match[1];
      const pseudo = PseudoClasses[match[2]] || PseudoClassesColon[match[2]] || `:${match[2]}`;
      return {
        matcher: input.slice(match[0].length),
        selector: (s) => `${s}:${fn}(${pseudo})`
      };
    }
  },
  multiPass: true,
  autocomplete: `(${PseudoClassFunctionsStr})-(${PseudoClassesStr}|${PseudoClassesColonStr}):`
};
export const variantTaggedPseudoClasses = (options = {}) => {
  const attributify = !!options?.attributifyPseudo;
  return [
    taggedPseudoClassMatcher("group", attributify ? '[group=""]' : ".group", " "),
    taggedPseudoClassMatcher("peer", attributify ? '[peer=""]' : ".peer", "~"),
    taggedPseudoClassMatcher("parent", attributify ? '[parent=""]' : ".parent", ">"),
    taggedPseudoClassMatcher("previous", attributify ? '[previous=""]' : ".previous", "+")
  ];
};
const PartClassesRE = /(part-\[(.+)]:)(.+)/;
export const partClasses = {
  match: (input) => {
    const match = input.match(PartClassesRE);
    if (match) {
      const part = `part(${match[2]})`;
      return {
        matcher: input.slice(match[1].length),
        selector: (s) => `${s}::${part}`
      };
    }
  },
  multiPass: true
};
