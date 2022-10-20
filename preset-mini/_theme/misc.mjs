export const breakpoints = {
  "sm": "480px",
  "md": "768px",
  "lg": "990px",
};
export const verticalBreakpoints = { ...breakpoints };
export const lineWidth = {
  DEFAULT: "1px",
  none: "0px"
};
export const spacing = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  6: '6px',
  8: '8px',
  10: '10px',
  12: '12px',
  14: '14px',
  16: '16px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  40: '40px',
  44: '44px',
  48: '48px',
  56: '56px',
  64: '64px',
  80: '80px',
  96: '96px',
  112: '112px',
  128: '128px',
  144: '144px',
};
export const duration = {
  DEFAULT: "150ms",
  none: "0ms",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1e3: "1000ms"
};
export const borderRadius = {
  0: '0px',
  2: '2px',
  4: '4px',
  8: '8px',
  16: '16px',
  full: '9999px',
};
export const boxShadow = {
  "DEFAULT": ["var(--un-shadow-inset) 0 1px 3px 0 rgba(0,0,0,0.1)", "var(--un-shadow-inset) 0 1px 2px -1px rgba(0,0,0,0.1)"],
  "none": "0 0 rgba(0,0,0,0)",
  "sm": "var(--un-shadow-inset) 0 1px 2px 0 rgba(0,0,0,0.05)",
  "md": ["var(--un-shadow-inset) 0 4px 6px -1px rgba(0,0,0,0.1)", "var(--un-shadow-inset) 0 2px 4px -2px rgba(0,0,0,0.1)"],
  "lg": ["var(--un-shadow-inset) 0 10px 15px -3px rgba(0,0,0,0.1)", "var(--un-shadow-inset) 0 4px 6px -4px rgba(0,0,0,0.1)"],
  "xl": ["var(--un-shadow-inset) 0 20px 25px -5px rgba(0,0,0,0.1)", "var(--un-shadow-inset) 0 8px 10px -6px rgba(0,0,0,0.1)"],
  "2xl": "var(--un-shadow-inset) 0 25px 50px -12px rgba(0,0,0,0.25)",
  "inner": "inset 0 2px 4px 0 rgba(0,0,0,0.05)"
};
export const easing = {
  "DEFAULT": "cubic-bezier(0.4, 0, 0.2, 1)",
  "linear": "linear",
  "in": "cubic-bezier(0.4, 0, 1, 1)",
  "out": "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
};
export const ringWidth = {
  DEFAULT: "1px",
  none: "0px"
};
