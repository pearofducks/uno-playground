import { createValueHandler } from "@unocss/core";
import * as valueHandlers from "./handlers.mjs";
export const handler = createValueHandler(valueHandlers);
export const h = handler;
export { valueHandlers };
