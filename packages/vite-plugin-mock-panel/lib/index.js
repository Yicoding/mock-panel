var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  viteMockPanel: () => viteMockPanel
});
module.exports = __toCommonJS(src_exports);
var import_createMockServer = require("./createMockServer");
__reExport(src_exports, require("./types"), module.exports);
(async () => {
  try {
    await import("mockjs");
  } catch (e) {
    throw new Error("vite-plugin-vue-mock requires mockjs to be present in the dependency tree.");
  }
})();
function viteMockPanel(opt = {}) {
  let isDev = false;
  let config;
  return {
    name: "vite-plugin-mock-panel",
    enforce: "pre",
    configResolved(resolvedConfig) {
      console.log("vite-plugin-mock-panel启动了", opt);
      config = resolvedConfig;
      (0, import_createMockServer.createMockServer)(opt, config);
    },
    configureServer: async ({ middlewares }) => {
      const middleware = await (0, import_createMockServer.requestMiddleware)(opt);
      middlewares.use(middleware);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  viteMockPanel,
  ...require("./types")
});
