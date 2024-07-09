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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/createMockServer.ts
var createMockServer_exports = {};
__export(createMockServer_exports, {
  createMockServer: () => createMockServer,
  mockData: () => mockData,
  requestMiddleware: () => requestMiddleware
});
module.exports = __toCommonJS(createMockServer_exports);
var import_node_path = __toESM(require("node:path"));
var import_chokidar = __toESM(require("chokidar"));
var import_picocolors = __toESM(require("picocolors"));
var import_url = __toESM(require("url"));
var import_fast_glob = __toESM(require("fast-glob"));
var import_mockjs = __toESM(require("mockjs"));
var import_path_to_regexp = require("path-to-regexp");
var import_utils = require("./utils");
var import_bundle_require = require("bundle-require");
var mockData = [];
var mockPath = "mock-panel";
async function createMockServer(opt = { mockPath }, config) {
  opt = {
    mockPath,
    ...opt
  };
  if (mockData.length > 0)
    return;
  mockData = await getMockConfig(opt, config);
  await createWatch(opt, config);
}
async function requestMiddleware(opt) {
  const middleware = async (req, res, next) => {
    let queryParams = {};
    if (req.url) {
      queryParams = import_url.default.parse(req.url, true);
    }
    const reqUrl = queryParams.pathname;
    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false;
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false;
      }
      return (0, import_path_to_regexp.pathToRegexp)(item.url).test(reqUrl);
    });
    if (matchRequest) {
      const isGet = req.method && req.method.toUpperCase() === "GET";
      const { response, rawResponse, timeout, statusCode, url: url2 } = matchRequest;
      if (timeout) {
        await (0, import_utils.sleep)(timeout);
      }
      const urlMatch = (0, import_path_to_regexp.match)(url2, { decode: decodeURIComponent });
      let query = queryParams.query;
      if (reqUrl) {
        if (isGet && JSON.stringify(query) === "{}" || !isGet) {
          const params = urlMatch(reqUrl).params;
          if (JSON.stringify(params) !== "{}") {
            query = urlMatch(reqUrl).params || {};
          } else {
            query = queryParams.query || {};
          }
        }
      }
      const self = { req, res, parseJson: parseJson.bind(null, req) };
      if ((0, import_utils.isFunction)(rawResponse)) {
        await rawResponse.bind(self)(req, res);
      } else {
        const body = await parseJson(req);
        res.setHeader("Content-Type", "application/json");
        if (opt) {
          res.setHeader("Access-Control-Allow-Credentials", true);
          res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
        }
        res.statusCode = statusCode || 200;
        const mockResponse = (0, import_utils.isFunction)(response) ? response.bind(self)({ url: req.url, body, query, headers: req.headers }) : response;
        res.end(JSON.stringify(import_mockjs.default.mock(mockResponse)));
      }
      return;
    }
    next();
  };
  return middleware;
}
function createWatch(opt, config) {
  const { absMockPath } = getPath(opt);
  if (process.env.VITE_DISABLED_WATCH_MOCK === "true") {
    return;
  }
  const watchDir = [];
  watchDir.push(absMockPath);
  const watcher = import_chokidar.default.watch(watchDir, {
    ignoreInitial: true,
    // ignore files generated by `bundle require`
    ignored: "**/_*.bundled_*.(mjs|cjs)"
  });
  watcher.on("all", async (event, file) => {
    mockData = await getMockConfig(opt, config);
  });
}
function parseJson(req) {
  return new Promise((resolve) => {
    let jsonStr = {};
    let str = "";
    req.on("data", function(chunk) {
      str += chunk;
    });
    req.on("end", () => {
      try {
        jsonStr = JSON.parse(str);
      } catch (e) {
        const params = new URLSearchParams(str);
        const body = {};
        params.forEach((value, key) => {
          body[key] = value;
        });
        jsonStr = body;
      }
      resolve(jsonStr);
      return;
    });
  });
}
async function getMockConfig(opt, config) {
  const { absMockPath } = getPath(opt);
  let ret = [];
  const mockFiles = import_fast_glob.default.sync(`**/*.{ts,mjs,js}`, {
    cwd: absMockPath
  });
  try {
    ret = [];
    const resolveModulePromiseList = [];
    for (let index = 0; index < mockFiles.length; index++) {
      const mockFile = mockFiles[index];
      resolveModulePromiseList.push(resolveModule(import_node_path.default.join(absMockPath, mockFile), config));
    }
    const loadAllResult = await Promise.all(resolveModulePromiseList);
    for (const resultModule of loadAllResult) {
      let mod = resultModule;
      if (!(0, import_utils.isArray)(mod)) {
        mod = [mod];
      }
      ret = [...ret, ...mod];
    }
  } catch (error) {
    loggerOutput(`mock reload error`, error);
    ret = [];
  }
  return ret;
}
var getOutputFile = (filepath, format) => {
  const dirname = import_node_path.default.dirname(filepath);
  const basename = import_node_path.default.basename(filepath);
  const randomname = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  return import_node_path.default.resolve(
    dirname,
    `_${basename.replace(import_bundle_require.JS_EXT_RE, `.bundled_${randomname}.${format === "esm" ? "mjs" : "cjs"}`)}`
  );
};
async function resolveModule(p, config) {
  const mockData2 = await (0, import_bundle_require.bundleRequire)({
    filepath: p,
    getOutputFile
  });
  let mod = mockData2.mod.default || mockData2.mod;
  if ((0, import_utils.isFunction)(mod)) {
    mod = await mod({ env: config.env, mode: config.mode, command: config.command });
  }
  return mod;
}
function getPath(opt) {
  const { mockPath: mockPath2 } = opt;
  const cwd = process.cwd();
  const absMockPath = (0, import_utils.isAbsPath)(mockPath2) ? mockPath2 : import_node_path.default.join(cwd, mockPath2 || "");
  return {
    absMockPath
  };
}
function loggerOutput(title, msg, type = "info") {
  const tag = type === "info" ? import_picocolors.default.cyan(`[vite:mock]`) : import_picocolors.default.red(`[vite:mock-server]`);
  return console.log(
    `${import_picocolors.default.dim((/* @__PURE__ */ new Date()).toLocaleTimeString())} ${tag} ${import_picocolors.default.green(title)} ${import_picocolors.default.dim(
      msg
    )}`
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMockServer,
  mockData,
  requestMiddleware
});
