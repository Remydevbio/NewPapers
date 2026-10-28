(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
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

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // src/background/background.js
  var import_webextension_polyfill = __toESM(require_browser_polyfill(), 1);

  // src/lib/http.js
  var SourceError = class extends Error {
    constructor(message, { status = 0, offline = false, body = "" } = {}) {
      super(message);
      this.name = "SourceError";
      this.status = status;
      this.offline = offline;
      this.body = body;
    }
  };
  function createLimiter(intervalMs) {
    let last = 0;
    let chain = Promise.resolve();
    const limiter5 = (fn) => {
      const run = chain.then(async () => {
        const wait = last + limiter5.intervalMs - Date.now();
        if (wait > 0) await sleep(wait);
        last = Date.now();
        return fn();
      });
      chain = run.catch(() => {
      });
      return run;
    };
    limiter5.intervalMs = intervalMs;
    return limiter5;
  }
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function getText(url, {
    fetchImpl = globalThis.fetch,
    limiter: limiter5 = (fn) => fn(),
    retries = 2,
    timeoutMs = 25e3,
    backoffMs = 2e3,
    headers = {}
  } = {}) {
    let attempt = 0;
    for (; ; ) {
      let res;
      try {
        res = await limiter5(async () => {
          const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
          const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
          try {
            const r = await fetchImpl(url, { headers, signal: ctrl?.signal });
            const text2 = await r.text();
            return { status: r.status, ok: r.ok, text: text2, retryAfter: r.headers?.get?.("retry-after") };
          } finally {
            if (timer) clearTimeout(timer);
          }
        });
      } catch (err) {
        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        if (attempt < retries && !offline) {
          attempt++;
          await sleep(backoffMs * attempt);
          continue;
        }
        throw new SourceError(offline ? "Offline" : `Network error (${err?.name === "AbortError" ? "timeout" : err?.message || err})`, { offline });
      }
      if (res.ok) return res.text;
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        attempt++;
        const ra = Number(res.retryAfter);
        await sleep(Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1e3, 3e4) : backoffMs * 2 ** attempt);
        continue;
      }
      const body = String(res.text || "").slice(0, 1e3);
      const reason = apiReason(body);
      throw new SourceError(`HTTP ${res.status}${res.status === 429 ? " (rate limited)" : ""}${reason ? `: ${reason}` : ""}`, { status: res.status, body });
    }
  }
  function apiReason(body = "") {
    let msg = "";
    try {
      const b = JSON.parse(body);
      msg = b?.message || b?.errMsg || b?.error || "";
    } catch {
      msg = /<html/i.test(body) ? body.match(/<title>([^<]*)<\/title>/i)?.[1] || "" : body;
    }
    return String(msg).replace(/\s+/g, " ").trim().split(/\. /)[0].replace(/\.$/, "").slice(0, 120);
  }
  async function getJson(url, opts) {
    const text2 = await getText(url, opts);
    try {
      return JSON.parse(text2);
    } catch {
      throw new SourceError("Invalid JSON response");
    }
  }
  function buildUrl(base, params) {
    const u = new URL(base);
    for (const [k, v] of Object.entries(params)) {
      if (v !== void 0 && v !== null && v !== "") u.searchParams.set(k, String(v));
    }
    return u.toString();
  }

  // src/lib/query.js
  var QueryError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "QueryError";
    }
  };
  var OPS = /* @__PURE__ */ new Set(["AND", "OR", "NOT"]);
  function tokenize(input) {
    const tokens = [];
    const s = String(input ?? "");
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (c === "(" || c === ")") {
        tokens.push({ t: c });
        i++;
        continue;
      }
      if (c === '"' || c === "\u201C" || c === "\u201D") {
        let j2 = i + 1;
        while (j2 < s.length && s[j2] !== '"' && s[j2] !== "\u201C" && s[j2] !== "\u201D") j2++;
        if (j2 >= s.length) throw new QueryError("Unclosed quotation mark.");
        const phrase = s.slice(i + 1, j2).trim().replace(/\s+/g, " ");
        if (phrase) tokens.push({ t: "phrase", v: phrase });
        i = j2 + 1;
        continue;
      }
      let j = i;
      while (j < s.length && !/\s/.test(s[j]) && !'()"\u201C\u201D'.includes(s[j])) j++;
      const word = s.slice(i, j);
      tokens.push(OPS.has(word) ? { t: word } : { t: "term", v: word });
      i = j;
    }
    return tokens;
  }
  function parseQuery(input) {
    const tokens = tokenize(input);
    if (!tokens.length) throw new QueryError("The query is empty.");
    let pos = 0;
    let depth = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    function parseOr() {
      const children = [parseAnd()];
      while (peek()?.t === "OR") {
        next();
        children.push(parseAnd());
      }
      for (const c of children) {
        if (c.type === "not") throw new QueryError('NOT must be combined with AND, e.g. "a NOT b".');
      }
      return children.length === 1 ? children[0] : { type: "or", children };
    }
    function parseAnd() {
      const children = [parseUnary()];
      for (; ; ) {
        const tk = peek();
        if (!tk || tk.t === ")" || tk.t === "OR") break;
        if (tk.t === "AND") {
          next();
          if (!peek() || peek().t === ")" || peek().t === "OR" || peek().t === "AND") {
            throw new QueryError("AND must be followed by a term.");
          }
        }
        children.push(parseUnary());
      }
      if (children.length === 1) return children[0];
      if (children.every((c) => c.type === "not")) {
        throw new QueryError("The query needs at least one term that is not negated.");
      }
      return { type: "and", children };
    }
    function parseUnary() {
      const tk = next();
      if (!tk) throw new QueryError(depth ? "Missing closing parenthesis." : "The query ends unexpectedly.");
      if (tk.t === "NOT") return { type: "not", child: parseUnary() };
      if (tk.t === "(") {
        if (peek()?.t === ")") throw new QueryError("Empty parentheses.");
        depth++;
        const inner = parseOr();
        if (next()?.t !== ")") throw new QueryError("Missing closing parenthesis.");
        depth--;
        return inner;
      }
      if (tk.t === "term") return { type: "term", value: tk.v };
      if (tk.t === "phrase") return { type: "term", value: tk.v, phrase: true };
      if (tk.t === ")") throw new QueryError("Unexpected closing parenthesis.");
      throw new QueryError(`Unexpected operator ${tk.t}.`);
    }
    const ast = parseOr();
    if (pos < tokens.length) {
      throw new QueryError(tokens[pos].t === ")" ? "Unexpected closing parenthesis." : "Could not read the whole query.");
    }
    if (ast.type === "not") throw new QueryError("The query needs at least one term that is not negated.");
    return ast;
  }
  function validateQuery(input) {
    return parseQuery(input);
  }
  var cleanTerm = (v) => v.replace(/"/g, "");
  var STANDARD = {
    term: (v) => cleanTerm(v),
    phrase: (v) => `"${cleanTerm(v)}"`,
    andNot: "NOT"
  };
  var ARXIV = {
    term: (v) => `all:${cleanTerm(v)}`,
    phrase: (v) => `all:"${cleanTerm(v)}"`,
    andNot: "ANDNOT"
  };
  function renderQuery(ast, dialect = STANDARD) {
    const r = (node, top) => {
      switch (node.type) {
        case "term":
          return node.phrase ? dialect.phrase(node.value) : dialect.term(node.value);
        case "or": {
          const s = node.children.map((c) => r(c, false)).join(" OR ");
          return top ? s : `(${s})`;
        }
        case "and": {
          const pos = node.children.filter((c) => c.type !== "not");
          const neg = node.children.filter((c) => c.type === "not").map((c) => c.child);
          let s = pos.map((c) => r(c, false)).join(" AND ");
          if (pos.length > 1 && neg.length) s = `(${s})`;
          for (const n of neg) s += ` ${dialect.andNot} ${r(n, false)}`;
          return top ? s : `(${s})`;
        }
        case "not":
          return node.child.type === "not" ? r(node.child.child, top) : `NOT ${r(node.child, false)}`;
        default:
          throw new QueryError("Unknown query node.");
      }
    };
    return r(ast, true);
  }

  // src/lib/dates.js
  var FIRST_RUN_MONTHS = 2;
  var OVERLAP_DAYS = 3;
  var MAX_WINDOW_DAYS = 366;
  var DAY = 24 * 60 * 60 * 1e3;
  function toISODate(d) {
    return new Date(d).toISOString().slice(0, 10);
  }
  function addDays(isoDate, days) {
    return toISODate(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY);
  }
  function subtractMonths(isoDate, months) {
    const d = /* @__PURE__ */ new Date(`${isoDate}T00:00:00Z`);
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - months);
    const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, lastDay));
    return toISODate(d);
  }
  function computeWindow(lastCheckedISO, now = Date.now()) {
    const to = toISODate(now);
    if (!lastCheckedISO) {
      return { from: subtractMonths(to, FIRST_RUN_MONTHS), to, firstRun: true };
    }
    let from = addDays(toISODate(lastCheckedISO), -OVERLAP_DAYS);
    const floor = addDays(to, -MAX_WINDOW_DAYS);
    if (from < floor) from = floor;
    if (from > to) from = to;
    return { from, to, firstRun: false };
  }
  function normalizeDate(input) {
    if (!input) return null;
    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    m = s.match(/^(\d{4})\s+([A-Za-z]{3})[a-z]*\s*(\d{1,2})?/);
    if (m) {
      const mi = months.indexOf(m[2].toLowerCase());
      if (mi >= 0) return `${m[1]}-${String(mi + 1).padStart(2, "0")}-${(m[3] || "1").padStart(2, "0")}`;
    }
    m = s.match(/^(\d{4})$/);
    if (m) return `${m[1]}-01-01`;
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : toISODate(t);
  }

  // src/lib/xml.js
  var ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\xA0" };
  function decodeEntities(s) {
    return String(s ?? "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    });
  }
  function stripTags(s) {
    return String(s ?? "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, "");
  }
  function text(s) {
    return decodeEntities(stripTags(s)).replace(/\s+/g, " ").trim();
  }
  var esc = (tag) => tag.replace(/[:.]/g, (c) => `\\${c}`);
  function elements(xml, tag) {
    const re = new RegExp(`<${esc(tag)}(\\s[^>]*)?(?:/>|>([\\s\\S]*?)</${esc(tag)}>)`, "g");
    const out = [];
    let m;
    while (m = re.exec(xml)) out.push({ attrs: parseAttrs(m[1] || ""), inner: m[2] ?? "" });
    return out;
  }
  function first(xml, tag) {
    return elements(xml, tag)[0] || null;
  }
  function parseAttrs(s) {
    const attrs = {};
    const re = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let m;
    while (m = re.exec(s)) attrs[m[1]] = decodeEntities(m[3] ?? m[4] ?? "");
    return attrs;
  }

  // src/lib/sources/europepmc.js
  var BASE = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
  var limiter = createLimiter(200);
  function buildQuery(query, fromDate, toDate, scope = "preprints") {
    const q = renderQuery(parseQuery(query), STANDARD);
    const src = scope === "all" ? "(SRC:PPR OR SRC:MED)" : "SRC:PPR";
    return `(${q}) AND ${src} AND FIRST_PDATE:[${fromDate} TO ${toDate}]`;
  }
  function mapResult(r) {
    const isPreprint = r.source === "PPR";
    const authors = (r.authorList?.author || []).map((a) => a.fullName || [a.lastName, a.initials].filter(Boolean).join(" ") || a.collectiveName).filter(Boolean);
    const firstAuthor = r.authorList?.author?.[0];
    const journal = r.journalInfo?.journal;
    const relatedPmids = (r.commentCorrectionList?.commentCorrection || []).filter((c) => c.source === "MED" && /preprint of/i.test(c.type || "")).map((c) => c.id);
    return {
      source: "europepmc",
      title: text(r.title).replace(/\.$/, ""),
      authors,
      firstAuthorLast: firstAuthor?.lastName || (authors[0] || "").split(" ")[0] || "",
      date: normalizeDate(r.firstPublicationDate),
      doi: r.doi || null,
      pmid: r.source === "MED" ? r.pmid || r.id : null,
      relatedPmids,
      kind: isPreprint ? "preprint" : "article",
      venue: isPreprint ? r.bookOrReportDetails?.publisher || "Preprint" : journal?.isoabbreviation || journal?.medlineAbbreviation || journal?.title || "Journal article",
      abstract: text(r.abstractText),
      url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${r.source}/${r.id}`
    };
  }
  var europepmc_default = {
    id: "europepmc",
    label: "Europe PMC",
    description: "Preprints (bioRxiv, medRxiv, \u2026); optionally PubMed records too",
    defaultEnabled: true,
    limiter,
    async search(query, fromDate, toDate, ctx = {}) {
      const max = ctx.maxResults ?? 200;
      const out = [];
      let cursor = "*";
      while (out.length < max) {
        const url = buildUrl(BASE, {
          query: buildQuery(query, fromDate, toDate, ctx.settings?.europepmcScope),
          resultType: "core",
          format: "json",
          pageSize: Math.min(100, max),
          sort: "FIRST_PDATE_D desc",
          cursorMark: cursor,
          email: ctx.settings?.email || void 0
        });
        const data = await getJson(url, { fetchImpl: ctx.fetchImpl, limiter });
        const results = data?.resultList?.result || [];
        out.push(...results.map(mapResult));
        if (!results.length || !data.nextCursorMark || data.nextCursorMark === cursor) break;
        cursor = data.nextCursorMark;
      }
      return out.slice(0, max);
    }
  };

  // src/lib/sources/pubmed.js
  var BASE2 = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  var limiter2 = createLimiter(350);
  var slash = (d) => d.replace(/-/g, "/");
  function common(ctx) {
    const key = ctx.settings?.ncbiApiKey?.trim();
    limiter2.intervalMs = key ? 110 : 350;
    return { tool: "new-papers-extension", email: ctx.settings?.email || void 0, api_key: key || void 0 };
  }
  function mapSummary(s) {
    const ids = Object.fromEntries((s.articleids || []).map((a) => [a.idtype, a.value]));
    const entrez = (s.history || []).find((h) => h.pubstatus === "entrez")?.date;
    const authors = (s.authors || []).filter((a) => a.authtype === "Author" || !a.authtype).map((a) => a.name);
    const isPreprint = (s.pubtype || []).some((p) => /preprint/i.test(p));
    return {
      source: "pubmed",
      title: text(s.title).replace(/\.$/, ""),
      authors,
      firstAuthorLast: (authors[0] || "").split(" ").slice(0, -1).join(" ") || (authors[0] || ""),
      date: normalizeDate(entrez) || normalizeDate(s.sortpubdate) || normalizeDate(s.pubdate),
      doi: ids.doi || null,
      pmid: String(s.uid),
      kind: isPreprint ? "preprint" : "article",
      venue: s.source || s.fulljournalname || "PubMed",
      abstract: "",
      url: `https://pubmed.ncbi.nlm.nih.gov/${s.uid}/`
    };
  }
  function parseAbstracts(xml) {
    const out = {};
    for (const art of elements(xml, "PubmedArticle")) {
      const pmid = text(first(art.inner, "PMID")?.inner);
      const parts = elements(art.inner, "AbstractText").map((a) => {
        const body = text(a.inner);
        return a.attrs.Label ? `${a.attrs.Label}: ${body}` : body;
      });
      if (pmid && parts.length) out[pmid] = parts.join("\n");
    }
    return out;
  }
  var pubmed_default = {
    id: "pubmed",
    label: "PubMed",
    description: "NCBI E-utilities, by Entrez date",
    defaultEnabled: true,
    limiter: limiter2,
    async search(query, fromDate, toDate, ctx = {}) {
      const max = ctx.maxResults ?? 200;
      const base = common(ctx);
      const opts = { fetchImpl: ctx.fetchImpl, limiter: limiter2 };
      const es = await getJson(buildUrl(`${BASE2}/esearch.fcgi`, {
        ...base,
        db: "pubmed",
        term: renderQuery(parseQuery(query), STANDARD),
        datetype: "edat",
        mindate: slash(fromDate),
        maxdate: slash(toDate),
        retmode: "json",
        retmax: max,
        sort: "pub_date"
      }), opts);
      if (es?.esearchresult?.ERROR) throw new Error(`PubMed: ${es.esearchresult.ERROR}`);
      const ids = es?.esearchresult?.idlist || [];
      if (!ids.length) return [];
      const sum = await getJson(buildUrl(`${BASE2}/esummary.fcgi`, { ...base, db: "pubmed", id: ids.join(","), retmode: "json" }), opts);
      const result = sum?.result || {};
      const records = (result.uids || ids).map((u) => result[u]).filter((s) => s && !s.error && !(s.pubtype || []).includes("Published Erratum")).map(mapSummary);
      try {
        const xml = await getText(buildUrl(`${BASE2}/efetch.fcgi`, { ...base, db: "pubmed", id: ids.join(","), retmode: "xml" }), { ...opts, retries: 1 });
        const abs = parseAbstracts(xml);
        for (const r of records) r.abstract = abs[r.pmid] || "";
      } catch {
      }
      return records;
    }
  };

  // src/lib/sources/openalex.js
  var BASE3 = "https://api.openalex.org/works";
  var limiter3 = createLimiter(150);
  var TYPES = "article|preprint|review|letter";
  var SELECT = "id,doi,display_name,publication_date,type,authorships,primary_location,locations,abstract_inverted_index,ids";
  function buildFilter(query, fromDate, toDate) {
    const q = renderQuery(parseQuery(query), STANDARD).replace(/[,|]/g, " ");
    return `title_and_abstract.search:${q},from_publication_date:${fromDate},to_publication_date:${toDate},type:${TYPES}`;
  }
  function rebuildAbstract(inv) {
    if (!inv || typeof inv !== "object") return "";
    const words = [];
    for (const [w, positions] of Object.entries(inv)) for (const p of positions) words[p] = w;
    return words.filter((w) => w !== void 0).join(" ");
  }
  function cleanVenue(name) {
    return String(name || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  }
  function mapWork(w) {
    const src = w.primary_location?.source;
    const isPreprint = w.type === "preprint" || src?.type === "repository";
    const authors = (w.authorships || []).map((a) => a.author?.display_name || a.raw_author_name).filter(Boolean);
    const pmid = (w.ids?.pmid || "").match(/(\d+)\/?$/)?.[1] || null;
    const doi = w.doi || null;
    const relatedDois = (w.locations || []).map((l) => l.landing_page_url || "").filter((u) => /doi\.org\/10\./i.test(u) && (!doi || u.toLowerCase() !== doi.toLowerCase()));
    return {
      source: "openalex",
      title: text(w.display_name || w.title).replace(/\.$/, ""),
      authors,
      firstAuthorLast: (authors[0] || "").split(" ").pop() || "",
      date: normalizeDate(w.publication_date),
      doi,
      relatedDois,
      pmid,
      kind: isPreprint ? "preprint" : "article",
      venue: cleanVenue(src?.display_name) || (isPreprint ? "Preprint" : "Journal article"),
      abstract: text(rebuildAbstract(w.abstract_inverted_index)),
      url: doi || w.primary_location?.landing_page_url || w.id
    };
  }
  var openalex_default = {
    id: "openalex",
    label: "OpenAlex",
    description: "Broad DOI-based journal coverage",
    defaultEnabled: true,
    limiter: limiter3,
    async search(query, fromDate, toDate, ctx = {}) {
      const key = ctx.settings?.openalexApiKey?.trim() || void 0;
      try {
        return await searchPages(query, fromDate, toDate, ctx, key);
      } catch (e) {
        if (!key || e?.status !== 401) throw e;
        ctx.warn?.(`OpenAlex rejected the API key (${apiMessage(e) || "HTTP 401"}). Results were fetched without it; fix or clear the key in Options.`);
        return searchPages(query, fromDate, toDate, ctx, void 0);
      }
    }
  };
  function apiMessage(err) {
    try {
      const b = JSON.parse(err?.body || "");
      return String(b.message || b.error || "").split(". ")[0].replace(/\.$/, "");
    } catch {
      return "";
    }
  }
  async function searchPages(query, fromDate, toDate, ctx, apiKey) {
    const max = ctx.maxResults ?? 200;
    const out = [];
    let cursor = "*";
    while (cursor && out.length < max) {
      const url = buildUrl(BASE3, {
        filter: buildFilter(query, fromDate, toDate),
        "per-page": Math.min(100, max),
        cursor,
        select: SELECT,
        sort: "publication_date:desc",
        mailto: ctx.settings?.email || void 0,
        api_key: apiKey
      });
      const data = await getJson(url, { fetchImpl: ctx.fetchImpl, limiter: limiter3 });
      if (data?.error) throw new Error(`OpenAlex: ${data.message || data.error}`);
      const results = data?.results || [];
      out.push(...results.map(mapWork));
      cursor = results.length ? data?.meta?.next_cursor : null;
    }
    return out.slice(0, max);
  }

  // src/lib/sources/arxiv.js
  var BASE4 = "https://export.arxiv.org/api/query";
  var limiter4 = createLimiter(3500);
  var QBIO = ["BM", "CB", "GN", "MN", "NC", "OT", "PE", "QM", "SC", "TO"].map((c) => `cat:q-bio.${c}`);
  function buildQuery2(query, fromDate, toDate) {
    const q = renderQuery(parseQuery(query), ARXIV);
    const d = (s) => s.replace(/-/g, "");
    return `((${q}) AND (${QBIO.join(" OR ")})) AND submittedDate:[${d(fromDate)}0000 TO ${d(toDate)}2359]`;
  }
  function parseFeed(xml) {
    return elements(xml, "entry").map(({ inner }) => {
      const absUrl = text(first(inner, "id")?.inner);
      const arxivId = absUrl.replace(/^https?:\/\/arxiv\.org\/abs\//, "").replace(/v\d+$/, "");
      const authors = elements(inner, "author").map((a) => text(first(a.inner, "name")?.inner)).filter(Boolean);
      const journalDoi = text(first(inner, "arxiv:doi")?.inner);
      return {
        source: "arxiv",
        title: text(first(inner, "title")?.inner),
        authors,
        firstAuthorLast: (authors[0] || "").split(" ").pop() || "",
        date: normalizeDate(text(first(inner, "published")?.inner)),
        doi: `10.48550/arXiv.${arxivId}`,
        relatedDois: journalDoi ? [journalDoi] : [],
        arxivId,
        kind: "preprint",
        venue: "arXiv",
        abstract: text(first(inner, "summary")?.inner),
        url: `https://arxiv.org/abs/${arxivId}`
      };
    });
  }
  var arxiv_default = {
    id: "arxiv",
    label: "arXiv (q-bio)",
    description: "Physics- and computation-adjacent work",
    defaultEnabled: false,
    limiter: limiter4,
    async search(query, fromDate, toDate, ctx = {}) {
      const max = Math.min(ctx.maxResults ?? 200, 200);
      const url = buildUrl(BASE4, {
        search_query: buildQuery2(query, fromDate, toDate),
        start: 0,
        max_results: max,
        sortBy: "submittedDate",
        sortOrder: "descending"
      });
      const xml = await getText(url, { fetchImpl: ctx.fetchImpl, limiter: limiter4, retries: 2, backoffMs: 5e3 });
      return parseFeed(xml);
    }
  };

  // src/lib/sources/index.js
  var SOURCES = [europepmc_default, pubmed_default, openalex_default, arxiv_default];
  var SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s]));

  // src/lib/dedupe.js
  function normalizeDoi(input) {
    if (!input) return null;
    let s = String(input).trim().toLowerCase();
    s = s.replace(/^https?:\/\/(dx\.)?doi\.org\//, "").replace(/^doi:\s*/, "");
    try {
      s = decodeURIComponent(s);
    } catch {
    }
    s = s.replace(/[.\s]+$/, "");
    return /^10\.\d{4,9}\/\S+$/.test(s) ? s : null;
  }
  function normalizeTitle(input) {
    return String(input ?? "").replace(/<[^>]+>/g, " ").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }
  function normalizeName(input) {
    return String(input ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]+/g, "");
  }
  function recordKeys(rec) {
    const keys = [];
    const doi = normalizeDoi(rec.doi);
    if (doi) keys.push(`doi:${doi}`);
    for (const d of rec.relatedDois || []) {
      const n = normalizeDoi(d);
      if (n) keys.push(`doi:${n}`);
    }
    if (rec.pmid) keys.push(`pmid:${String(rec.pmid).trim()}`);
    for (const p of rec.relatedPmids || []) keys.push(`pmid:${String(p).trim()}`);
    if (rec.arxivId) keys.push(`arxiv:${String(rec.arxivId).toLowerCase().replace(/v\d+$/, "")}`);
    const t = normalizeTitle(rec.title);
    if (t.length >= 20) keys.push(`title:${t}|${normalizeName(rec.firstAuthorLast)}`);
    return [...new Set(keys)];
  }
  function versionOf(rec) {
    const doi = normalizeDoi(rec.doi);
    return {
      kind: rec.kind === "preprint" ? "preprint" : "article",
      venue: rec.venue || (rec.kind === "preprint" ? "Preprint" : "Journal article"),
      doi,
      url: doi ? `https://doi.org/${doi}` : rec.url || null,
      date: rec.date || null,
      sources: [rec.source]
    };
  }
  function versionId(v) {
    return v.doi ? `doi:${v.doi}` : `url:${v.url}|${v.venue}`;
  }
  function entryFromRecord(rec, now) {
    const keys = recordKeys(rec);
    return {
      id: keys[0] || `rand:${Math.random().toString(36).slice(2)}`,
      keys,
      title: rec.title || "(untitled)",
      authors: rec.authors || [],
      firstAuthorLast: rec.firstAuthorLast || "",
      date: rec.date || null,
      abstract: rec.abstract || "",
      pmid: rec.pmid || null,
      versions: [versionOf(rec)],
      sources: [rec.source],
      firstSeen: now,
      seen: false
    };
  }
  function mergeEntry(target, other) {
    const takeTitle = !target.versions.some((v) => v.kind === "article") && other.versions.some((v) => v.kind === "article");
    if (takeTitle && other.title) target.title = other.title;
    target.keys = [.../* @__PURE__ */ new Set([...target.keys, ...other.keys])];
    target.sources = [.../* @__PURE__ */ new Set([...target.sources, ...other.sources])];
    if (!target.abstract || other.abstract && other.abstract.length > target.abstract.length * 1.5) {
      target.abstract = other.abstract || target.abstract;
    }
    if (other.authors.length > target.authors.length) target.authors = other.authors;
    if (!target.pmid && other.pmid) target.pmid = other.pmid;
    if (other.date && (!target.date || other.date > target.date)) target.date = other.date;
    for (const v of other.versions) {
      const existing = target.versions.find((x) => versionId(x) === versionId(v));
      if (existing) {
        existing.sources = [.../* @__PURE__ */ new Set([...existing.sources, ...v.sources])];
        if (!existing.date && v.date) existing.date = v.date;
        if (existing.venue === "Preprint" || existing.venue === "Journal article") existing.venue = v.venue;
      } else {
        target.versions.push(v);
      }
    }
    target.versions.sort((a, b) => a.kind === b.kind ? 0 : a.kind === "preprint" ? -1 : 1);
    target.firstSeen = Math.min(target.firstSeen, other.firstSeen);
    target.seen = target.seen && other.seen;
    return target;
  }
  function mergeRecords(entries, records, dismissed = {}, now = Date.now()) {
    const list = entries.map((e) => ({ ...e, keys: [...e.keys], versions: e.versions.map((v) => ({ ...v })) }));
    const index = /* @__PURE__ */ new Map();
    const reindex = (e) => e.keys.forEach((k) => index.set(k, e));
    list.forEach(reindex);
    const newDismissedKeys = [];
    const dismissedSet = new Set(Object.keys(dismissed));
    let added = 0;
    for (const rec of records) {
      const incoming = entryFromRecord(rec, now);
      if (incoming.keys.some((k) => dismissedSet.has(k))) {
        for (const k of incoming.keys) {
          if (!dismissedSet.has(k)) {
            dismissedSet.add(k);
            newDismissedKeys.push(k);
          }
        }
        continue;
      }
      const matches = [...new Set(incoming.keys.map((k) => index.get(k)).filter(Boolean))];
      if (!matches.length) {
        list.push(incoming);
        reindex(incoming);
        added++;
        continue;
      }
      const [target, ...rest] = matches;
      mergeEntry(target, incoming);
      for (const other of rest) {
        mergeEntry(target, other);
        list.splice(list.indexOf(other), 1);
      }
      reindex(target);
    }
    return { entries: list, added, newDismissedKeys };
  }
  function capEntries(entries, max = 300) {
    if (entries.length <= max) return entries;
    return [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.firstSeen - a.firstSeen).slice(0, max);
  }
  var DISMISSED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;
  function pruneDismissed(dismissed, now = Date.now(), ttl = DISMISSED_TTL_MS) {
    const out = {};
    for (const [k, t] of Object.entries(dismissed || {})) if (now - t < ttl) out[k] = t;
    return out;
  }

  // src/lib/settings.js
  var THEMES = [
    { id: "claude-light", name: "Claude Light", mode: "light", badge: "#B5532F", swatch: ["#F0EEE6", "#FAF9F5", "#D97757", "#B5532F"] },
    { id: "slate-light", name: "Slate", mode: "light", badge: "#3B5BDB", swatch: ["#EEF1F5", "#FFFFFF", "#3B5BDB", "#475569"] },
    { id: "forest-light", name: "Forest", mode: "light", badge: "#2B6A45", swatch: ["#E9EFE6", "#FBFCF9", "#2F7A4E", "#46574B"] },
    { id: "hc-light", name: "High Contrast Light", mode: "light", badge: "#0038B8", swatch: ["#FFFFFF", "#F0F0F0", "#0038B8", "#000000"] },
    { id: "claude-dark", name: "Claude Dark", mode: "dark", badge: "#D97757", swatch: ["#1F1E1D", "#262624", "#D97757", "#B7B5A9"] },
    { id: "ocean-dark", name: "Ocean", mode: "dark", badge: "#0E7490", swatch: ["#0B1622", "#102030", "#38BDF8", "#9DB4C6"] },
    { id: "dusk-dark", name: "Dusk", mode: "dark", badge: "#7C5CD6", swatch: ["#17151F", "#201D2A", "#A78BFA", "#ADA5C2"] },
    { id: "hc-dark", name: "High Contrast Dark", mode: "dark", badge: "#FFD400", badgeText: "#000000", swatch: ["#000000", "#141414", "#FFD400", "#FFFFFF"] }
  ];
  var THEME_IDS = THEMES.map((t) => t.id);
  var DEFAULT_SETTINGS = {
    theme: "auto",
    autoLight: "claude-light",
    autoDark: "claude-dark",
    sources: Object.fromEntries(SOURCES.map((s) => [s.id, s.defaultEnabled])),
    europepmcScope: "preprints",
    // 'preprints' | 'all'
    email: "",
    ncbiApiKey: "",
    openalexApiKey: "",
    openOnStartup: "always",
    // 'always' | 'new' | 'never'
    openLinksInBackground: true,
    // keep the popup/results window open when a paper is opened
    maxEntriesPerTopic: 300
  };
  function withDefaults(settings) {
    const s = { ...DEFAULT_SETTINGS, ...settings || {} };
    s.sources = { ...DEFAULT_SETTINGS.sources, ...settings?.sources || {} };
    if (s.theme !== "auto" && !THEME_IDS.includes(s.theme)) s.theme = "auto";
    return s;
  }
  function resolveTheme(settings, prefersDark2) {
    const s = withDefaults(settings);
    if (s.theme !== "auto") return s.theme;
    return prefersDark2 ? s.autoDark : s.autoLight;
  }
  function topicSourceEnabled(topic, settings, sourceId) {
    const o = topic?.sources?.[sourceId] || "default";
    if (o === "on") return true;
    if (o === "off") return false;
    return !!withDefaults(settings).sources[sourceId];
  }

  // src/lib/store.js
  var KEYS = ["topics", "lastChecked", "entries", "dismissed", "toRead", "settings", "meta"];
  async function loadAll(area2) {
    const d = await area2.get(KEYS);
    return {
      topics: Array.isArray(d.topics) ? d.topics : [],
      lastChecked: d.lastChecked || {},
      entries: d.entries || {},
      dismissed: d.dismissed || {},
      toRead: Array.isArray(d.toRead) ? d.toRead : [],
      settings: withDefaults(d.settings),
      meta: d.meta || {}
    };
  }
  function saveParts(area2, parts) {
    return area2.set(parts);
  }
  function createMutex() {
    let chain = Promise.resolve();
    return (fn) => {
      const run = chain.then(fn);
      chain = run.catch(() => {
      });
      return run;
    };
  }

  // src/lib/engine.js
  var HISTORY_RUNS = 10;
  function inToRead(toRead, entry) {
    return toRead.some((t) => t.id === entry.id || t.keys?.some((k) => entry.keys?.includes(k)));
  }
  function unreadCounts(state) {
    const counts = {};
    let total = 0;
    for (const t of state.topics) {
      counts[t.id] = (state.entries[t.id] || []).length;
      total += counts[t.id];
    }
    return { counts, total };
  }
  function createEngine({ area: area2, sources = SOURCES, fetchImpl, now = () => Date.now(), mutex = createMutex() } = {}) {
    let running = null;
    let queued = null;
    async function checkTopic(topic, state, errors, warnings, report) {
      const t = now();
      const prev = state.lastChecked[topic.id];
      const sameQuery = prev && prev.query === topic.query;
      try {
        validateQuery(topic.query);
      } catch (e) {
        errors.push({ topicId: topic.id, topic: topic.name, source: "query", message: e.message });
        report.push({ topicId: topic.id, topic: topic.name, query: topic.query, queryError: e.message, sources: [] });
        return null;
      }
      const enabled = sources.filter((s) => topicSourceEnabled(topic, state.settings, s.id));
      const results = await Promise.all(enabled.map(async (src) => {
        const last = sameQuery ? prev.sources?.[src.id] : null;
        const win = computeWindow(last, t);
        const started = now();
        const srcWarnings = [];
        const line = (extra) => ({ source: src.id, label: src.label, from: win.from, to: win.to, ms: now() - started, warnings: srcWarnings, ...extra });
        try {
          const warn = (message) => {
            srcWarnings.push(message);
            warnings.push({ topicId: topic.id, topic: topic.name, source: src.id, label: src.label, message });
          };
          const records = await src.search(topic.query, win.from, win.to, { settings: state.settings, fetchImpl, warn });
          return { source: src.id, ok: true, records, window: win, line: line({ ok: true, found: records.length }) };
        } catch (e) {
          const message = e.message || String(e);
          errors.push({ topicId: topic.id, topic: topic.name, source: src.id, label: src.label, message, offline: !!e.offline });
          return { source: src.id, ok: false, records: [], window: win, line: line({ ok: false, found: 0, error: message }) };
        }
      }));
      const entry = { topicId: topic.id, topic: topic.name, query: topic.query, added: 0, sources: results.map((r) => r.line) };
      report.push(entry);
      return { topicId: topic.id, query: topic.query, results, at: t, report: entry };
    }
    async function applyResult(res) {
      return mutex(async () => {
        const state = await loadAll(area2);
        const topic = state.topics.find((x) => x.id === res.topicId);
        if (!topic || topic.query !== res.query) return 0;
        const records = res.results.flatMap((r) => r.records);
        const dismissed = { ...state.dismissed[topic.id] || {} };
        const merged = mergeRecords(state.entries[topic.id] || [], records, dismissed, res.at);
        for (const k of merged.newDismissedKeys) dismissed[k] = res.at;
        const prev = state.lastChecked[topic.id];
        const lc = prev && prev.query === topic.query ? { ...prev, sources: { ...prev.sources } } : { query: topic.query, sources: {} };
        const iso = new Date(res.at).toISOString();
        let anyOk = false;
        for (const r of res.results) if (r.ok) {
          lc.sources[r.source] = iso;
          anyOk = true;
        }
        if (anyOk) lc.at = iso;
        state.entries[topic.id] = capEntries(merged.entries, state.settings.maxEntriesPerTopic);
        state.dismissed[topic.id] = dismissed;
        state.lastChecked[topic.id] = lc;
        await saveParts(area2, { entries: state.entries, dismissed: state.dismissed, lastChecked: state.lastChecked });
        return merged.added;
      });
    }
    async function setMeta(patch) {
      return mutex(async () => {
        const { meta } = await loadAll(area2);
        await saveParts(area2, { meta: { ...meta, ...patch } });
      });
    }
    async function prune() {
      return mutex(async () => {
        const state = await loadAll(area2);
        const ids = new Set(state.topics.map((t) => t.id));
        const keep = (obj) => Object.fromEntries(Object.entries(obj).filter(([k]) => ids.has(k)));
        const dismissed = keep(state.dismissed);
        for (const k of Object.keys(dismissed)) dismissed[k] = pruneDismissed(dismissed[k], now());
        await saveParts(area2, { entries: keep(state.entries), lastChecked: keep(state.lastChecked), dismissed });
      });
    }
    async function doCheck({ topicIds, trigger = "manual" } = {}) {
      const startedAt = now();
      await setMeta({ running: true, runStartedAt: startedAt });
      const errors = [];
      const warnings = [];
      const report = [];
      let added = 0;
      try {
        await prune();
        const state2 = await loadAll(area2);
        const topics = state2.topics.filter((t) => !topicIds || topicIds.includes(t.id));
        for (const topic of topics) {
          const res = await checkTopic(topic, state2, errors, warnings, report);
          if (res) {
            res.report.added = await applyResult(res);
            added += res.report.added;
          }
        }
      } finally {
        const offline = errors.length > 0 && errors.every((e) => e.offline);
        const lastRun = { at: startedAt, finishedAt: now(), ok: errors.length === 0, offline, errors, warnings, added, partial: !!topicIds, trigger, report };
        await mutex(async () => {
          const { meta } = await loadAll(area2);
          const history = [lastRun, ...meta.history || []].slice(0, HISTORY_RUNS);
          await saveParts(area2, { meta: { ...meta, running: false, lastRun, history, ...topicIds ? {} : { lastFullRun: lastRun } } });
        });
      }
      const state = await loadAll(area2);
      return { added, errors, warnings, ...unreadCounts(state) };
    }
    return {
      /**
       * Check all topics (or the given ones). A call made while a run is in
       * progress is queued; queued calls are coalesced into one follow-up run.
       */
      check(opts = {}) {
        if (!running) {
          running = doCheck(opts).finally(() => {
            running = null;
          });
          return running;
        }
        const ids = opts.topicIds || null;
        if (!queued) {
          queued = { topicIds: ids, trigger: opts.trigger };
          queued.promise = running.catch(() => {
          }).then(() => {
            const q = queued;
            queued = null;
            return this.check({ topicIds: q.topicIds, trigger: q.trigger });
          });
        } else if (queued.topicIds) {
          queued.topicIds = ids ? [.../* @__PURE__ */ new Set([...queued.topicIds, ...ids])] : null;
        }
        return queued.promise;
      },
      isRunning: () => !!running,
      dismiss(topicId, entryId) {
        return this.dismissMany(topicId, [entryId]).then((n) => n > 0);
      },
      /** Dismiss several entries of one topic; returns how many were removed. */
      dismissMany(topicId, entryIds) {
        return mutex(async () => {
          const state = await loadAll(area2);
          const ids = new Set(entryIds);
          const list = state.entries[topicId] || [];
          const gone = list.filter((e) => ids.has(e.id));
          if (!gone.length) return 0;
          const d = { ...state.dismissed[topicId] || {} };
          for (const e of gone) for (const k of e.keys) d[k] = now();
          state.entries[topicId] = list.filter((e) => !ids.has(e.id));
          state.dismissed[topicId] = d;
          await saveParts(area2, { entries: state.entries, dismissed: state.dismissed });
          return gone.length;
        });
      },
      /** Save copies of entries to the to-read list (newest first); returns how many were added. */
      addToRead(topicId, entryIds) {
        return mutex(async () => {
          const state = await loadAll(area2);
          const topic = state.topics.find((t) => t.id === topicId);
          const ids = new Set(entryIds);
          const added = [];
          for (const e of state.entries[topicId] || []) {
            if (!ids.has(e.id) || inToRead(state.toRead, e) || inToRead(added, e)) continue;
            added.push({ ...e, seen: true, topicId, topicName: topic?.name || "", savedAt: now() });
          }
          if (added.length) await saveParts(area2, { toRead: [...added, ...state.toRead] });
          return added.length;
        });
      },
      /** Remove items from the to-read list by their ids; returns how many were removed. */
      removeToRead(ids) {
        return mutex(async () => {
          const state = await loadAll(area2);
          const drop = new Set(ids);
          const toRead = state.toRead.filter((t) => !drop.has(t.id));
          if (toRead.length !== state.toRead.length) await saveParts(area2, { toRead });
          return state.toRead.length - toRead.length;
        });
      },
      dismissAll(topicId) {
        return mutex(async () => {
          const state = await loadAll(area2);
          const d = { ...state.dismissed[topicId] || {} };
          for (const e of state.entries[topicId] || []) for (const k of e.keys) d[k] = now();
          state.entries[topicId] = [];
          state.dismissed[topicId] = d;
          await saveParts(area2, { entries: state.entries, dismissed: state.dismissed });
        });
      },
      markSeen(topicId) {
        return mutex(async () => {
          const state = await loadAll(area2);
          const list = state.entries[topicId] || [];
          if (!list.some((e) => !e.seen)) return;
          state.entries[topicId] = list.map((e) => ({ ...e, seen: true }));
          await saveParts(area2, { entries: state.entries });
        });
      },
      prune
    };
  }

  // src/background/background.js
  var area = import_webextension_polyfill.default.storage.local;
  var engine = createEngine({ area });
  var STALE_RUN_MS = 5 * 60 * 1e3;
  var prefersDark = () => {
    try {
      return !!globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  };
  async function updateBadge() {
    const state = await loadAll(area);
    const { total } = unreadCounts(state);
    const theme = THEMES.find((t) => t.id === resolveTheme(state.settings, prefersDark())) || THEMES[0];
    await import_webextension_polyfill.default.action.setBadgeText({ text: total ? total > 999 ? "999+" : String(total) : "" });
    await import_webextension_polyfill.default.action.setBadgeBackgroundColor({ color: theme.badge });
    if (import_webextension_polyfill.default.action.setBadgeTextColor) {
      await import_webextension_polyfill.default.action.setBadgeTextColor({ color: theme.badgeText || "#FFFFFF" }).catch(() => {
      });
    }
    await import_webextension_polyfill.default.action.setTitle({ title: total ? `New Papers: ${total} unread` : "New Papers" });
  }
  async function openResultsWindow() {
    await setFlags({ pendingWindow: false });
    const { meta = {} } = await area.get("meta");
    if (meta.windowId != null) {
      try {
        await import_webextension_polyfill.default.windows.get(meta.windowId);
        await import_webextension_polyfill.default.windows.update(meta.windowId, { focused: true });
        return meta.windowId;
      } catch {
      }
    }
    const win = await import_webextension_polyfill.default.windows.create({
      url: import_webextension_polyfill.default.runtime.getURL("popup.html?view=window"),
      type: "popup",
      width: 440,
      height: 720,
      focused: true
    });
    const { meta: m2 = {} } = await area.get("meta");
    await area.set({ meta: { ...m2, windowId: win.id } });
    return win.id;
  }
  async function openUrl(url) {
    if (!/^https?:\/\//i.test(url)) return;
    const { settings } = await loadAll(area);
    const background = settings.openLinksInBackground;
    const wins = await import_webextension_polyfill.default.windows.getAll({ windowTypes: ["normal"] });
    const target = wins.find((w) => w.focused) || wins[wins.length - 1];
    if (!target) {
      await import_webextension_polyfill.default.windows.create({ url, type: "normal", focused: !background });
      return;
    }
    await import_webextension_polyfill.default.tabs.create({ windowId: target.id, url, active: !background });
    if (!background) await import_webextension_polyfill.default.windows.update(target.id, { focused: true });
  }
  async function clearStaleRun() {
    const { meta = {} } = await area.get("meta");
    if (meta.running && (!meta.runStartedAt || Date.now() - meta.runStartedAt > STALE_RUN_MS) && !engine.isRunning()) {
      await area.set({ meta: { ...meta, running: false } });
    }
  }
  var session = import_webextension_polyfill.default.storage.session;
  var getFlags = async () => session ? (await session.get("flags")).flags || {} : {};
  var setFlags = async (patch) => {
    if (session) await session.set({ flags: { ...await getFlags(), ...patch } });
  };
  var normalWindows = () => import_webextension_polyfill.default.windows.getAll({ windowTypes: ["normal"] }).catch(() => []);
  var WINDOW_DELAY_MS = 1500;
  async function showWindowWhenReady() {
    if (!(await normalWindows()).length) {
      await setFlags({ pendingWindow: true });
      return;
    }
    await new Promise((r) => setTimeout(r, WINDOW_DELAY_MS));
    await openResultsWindow().catch((e) => console.warn("window", e));
  }
  async function onBrowserStart(reason) {
    await clearStaleRun();
    await setFlags({ started: true, allClosed: false });
    const state = await loadAll(area);
    if (!state.topics.length) {
      if (reason === "install") await import_webextension_polyfill.default.runtime.openOptionsPage();
      await updateBadge();
      return;
    }
    const mode = state.settings.openOnStartup;
    const opening = mode === "always" ? showWindowWhenReady() : Promise.resolve();
    const res = await engine.check({ trigger: "startup" });
    await opening;
    if (mode === "new" && res.added > 0) await showWindowWhenReady();
    await updateBadge();
  }
  import_webextension_polyfill.default.runtime.onStartup.addListener(() => {
    onBrowserStart("startup");
  });
  import_webextension_polyfill.default.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === "install") onBrowserStart("install");
    else updateBadge();
  });
  import_webextension_polyfill.default.windows.onCreated.addListener(async (win) => {
    if (win.type && win.type !== "normal") return;
    const flags = await getFlags();
    if (flags.pendingWindow) {
      await setFlags({ pendingWindow: false });
      await new Promise((r) => setTimeout(r, WINDOW_DELAY_MS));
      await openResultsWindow().catch((e) => console.warn("window", e));
    } else if (flags.allClosed) {
      await onBrowserStart("resume");
    }
  });
  import_webextension_polyfill.default.windows.onRemoved.addListener(async (id) => {
    const { meta = {} } = await area.get("meta");
    if (meta.windowId === id) await area.set({ meta: { ...meta, windowId: null } });
    if (!(await normalWindows()).length) await setFlags({ allClosed: true });
  });
  var badgeTimer = null;
  import_webextension_polyfill.default.storage.onChanged.addListener((changes, name) => {
    if (name !== "local" || !(changes.entries || changes.settings || changes.topics)) return;
    clearTimeout(badgeTimer);
    badgeTimer = setTimeout(() => updateBadge().catch(() => {
    }), 150);
  });
  import_webextension_polyfill.default.runtime.onMessage.addListener((msg, sender) => {
    if (sender.id !== import_webextension_polyfill.default.runtime.id) return void 0;
    switch (msg?.type) {
      case "refresh":
        return engine.check({ topicIds: msg.topicIds, trigger: "manual" });
      case "dismiss":
        return engine.dismiss(msg.topicId, msg.entryId);
      case "dismissAll":
        return engine.dismissAll(msg.topicId);
      case "dismissMany":
        return engine.dismissMany(msg.topicId, msg.entryIds);
      case "addToRead":
        return engine.addToRead(msg.topicId, msg.entryIds);
      case "removeToRead":
        return engine.removeToRead(msg.ids);
      case "markSeen":
        return engine.markSeen(msg.topicId);
      case "openWindow":
        return openResultsWindow();
      case "openUrl":
        return openUrl(msg.url);
      case "prune":
        return engine.prune();
      case "simulateStartup":
        return onBrowserStart("startup");
      // used by tests and the options page
      default:
        return void 0;
    }
  });
  clearStaleRun().catch(() => {
  });
})();
