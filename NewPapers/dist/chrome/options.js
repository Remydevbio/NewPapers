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

  // src/ui/common.js
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
  var DAY = 24 * 60 * 60 * 1e3;
  function toISODate(d) {
    return new Date(d).toISOString().slice(0, 10);
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
    const entrez = (s.history || []).find((h2) => h2.pubstatus === "entrez")?.date;
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
  function withDefaults(settings2) {
    const s = { ...DEFAULT_SETTINGS, ...settings2 || {} };
    s.sources = { ...DEFAULT_SETTINGS.sources, ...settings2?.sources || {} };
    if (s.theme !== "auto" && !THEME_IDS.includes(s.theme)) s.theme = "auto";
    return s;
  }
  function resolveTheme(settings2, prefersDark) {
    const s = withDefaults(settings2);
    if (s.theme !== "auto") return s.theme;
    return prefersDark ? s.autoDark : s.autoLight;
  }
  function topicSourceEnabled(topic, settings2, sourceId) {
    const o = topic?.sources?.[sourceId] || "default";
    if (o === "on") return true;
    if (o === "off") return false;
    return !!withDefaults(settings2).sources[sourceId];
  }
  function newTopicId() {
    return `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }
  function makeTopic(name, query, sources = {}) {
    return { id: newTopicId(), name: String(name).trim(), query: String(query).trim(), sources, createdAt: Date.now() };
  }

  // src/ui/common.js
  var ICONS = {
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 16h5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    ext: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    warn: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1-.8-1.4-.8-2.3 0-.9.7-1.7 1.7-1.7H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    box: '<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/>',
    power: '<path d="M12 3v9"/><path d="M6.3 7.3a8 8 0 1 0 11.4 0"/>',
    dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    ul: '<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  function icon(name, cls = "icon") {
    const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${ICONS[name]}</svg>`, "image/svg+xml");
    const svg = document.importNode(doc.documentElement, true);
    if (cls) svg.setAttribute("class", cls);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    return svg;
  }
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === void 0 || v === null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k.startsWith("--")) el.style.setProperty(k, v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c === null || c === void 0 || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  var darkQuery = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  function initTheme() {
    let settings2 = withDefaults();
    try {
      const c = localStorage.getItem("np-settings");
      if (c) settings2 = withDefaults(JSON.parse(c));
    } catch {
    }
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(settings2, !!darkQuery?.matches);
      try {
        localStorage.setItem("np-settings", JSON.stringify({ theme: settings2.theme, autoLight: settings2.autoLight, autoDark: settings2.autoDark }));
      } catch {
      }
    };
    apply();
    darkQuery?.addEventListener?.("change", apply);
    import_webextension_polyfill.default.storage.onChanged.addListener((changes, area2) => {
      if (area2 === "local" && changes.settings) {
        settings2 = withDefaults(changes.settings.newValue);
        apply();
      }
    });
    return import_webextension_polyfill.default.storage.local.get("settings").then((d) => {
      settings2 = withDefaults(d.settings);
      apply();
      return settings2;
    });
  }
  function formatWhen(ms) {
    if (!ms) return "never";
    const d = new Date(ms);
    const today = /* @__PURE__ */ new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    const time = d.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `today, ${time}`;
    if (d.toDateString() === yest.toDateString()) return `yesterday, ${time}`;
    return `${d.toLocaleDateString(void 0, { day: "numeric", month: "short" })}, ${time}`;
  }
  function send(type, payload = {}) {
    return import_webextension_polyfill.default.runtime.sendMessage({ type, ...payload });
  }

  // src/ui/options.js
  var area = import_webextension_polyfill.default.storage.local;
  var $ = (id) => document.getElementById(id);
  var HOSTS = ["https://www.ebi.ac.uk/*", "https://eutils.ncbi.nlm.nih.gov/*", "https://api.openalex.org/*", "https://export.arxiv.org/*"];
  var topics = [];
  var settings = withDefaults();
  var entries = {};
  var lastChecked = {};
  var meta = {};
  var editing = null;
  var confirmDelete = null;
  var toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  async function saveTopics(next, refreshIds = []) {
    topics = next;
    await area.set({ topics });
    renderTopics();
    if (refreshIds.length) send("refresh", { topicIds: refreshIds }).catch(() => {
    });
  }
  async function saveSettings(patch, msg = "Saved") {
    settings = withDefaults({ ...settings, ...patch });
    await area.set({ settings });
    toast(msg);
  }
  function sourceChips(topic) {
    return h("div", { class: "mini-src", "aria-label": "Sources" }, SOURCES.map((s) => {
      const on = topicSourceEnabled(topic, settings, s.id);
      return h("span", { class: on ? "" : "off", title: `${s.label}: ${on ? "on" : "off"}` }, s.label.replace(/ \(.*\)/, ""));
    }));
  }
  function topicRow(topic, i) {
    const n = (entries[topic.id] || []).length;
    const lc = lastChecked[topic.id];
    const checked = lc && lc.query === topic.query && lc.at ? `checked ${formatWhen(Date.parse(lc.at))}` : "not checked yet";
    const row = h(
      "div",
      { class: "trow", draggable: "true", "data-id": topic.id },
      h(
        "div",
        { class: "grip" },
        h("span", { class: "handle", title: "Drag to reorder", "aria-hidden": "true" }, icon("grip")),
        h(
          "span",
          { class: "arrows" },
          h("button", { type: "button", "aria-label": `Move ${topic.name} up`, disabled: i === 0, onclick: () => move(i, -1), "data-focus": `up:${topic.id}` }, icon("up")),
          h("button", { type: "button", "aria-label": `Move ${topic.name} down`, disabled: i === topics.length - 1, onclick: () => move(i, 1), "data-focus": `down:${topic.id}` }, icon("down"))
        )
      ),
      h(
        "div",
        { class: "tinfo" },
        h("strong", {}, topic.name),
        h("code", { title: topic.query }, topic.query),
        h("span", { class: "meta" }, `${n} unread \xB7 ${checked}`),
        sourceChips(topic)
      ),
      confirmDelete === topic.id ? h(
        "span",
        { class: "confirm" },
        `Delete \u201C${topic.name}\u201D?`,
        h("button", { class: "btn btn-sm btn-danger", type: "button", onclick: () => remove(topic.id), "data-focus": `del-yes:${topic.id}` }, "Delete"),
        h("button", { class: "btn btn-sm", type: "button", onclick: () => {
          confirmDelete = null;
          renderTopics(`del:${topic.id}`);
        } }, "Cancel")
      ) : [
        h("button", { class: "btn btn-ghost btn-icon", type: "button", "aria-label": `Edit ${topic.name}`, "aria-expanded": String(editing === topic.id), title: "Edit", onclick: () => {
          editing = editing === topic.id ? null : topic.id;
          renderTopics(editing ? "edit-name" : `edit:${topic.id}`);
        }, "data-focus": `edit:${topic.id}` }, icon("edit")),
        h("button", { class: "btn btn-ghost btn-icon btn-danger", type: "button", "aria-label": `Delete ${topic.name}`, title: "Delete", onclick: () => {
          confirmDelete = topic.id;
          renderTopics(`del-yes:${topic.id}`);
        }, "data-focus": `del:${topic.id}` }, icon("trash"))
      ]
    );
    addDrag(row);
    return row;
  }
  function editForm(topic) {
    const isNew = !topic;
    const draft = topic ? { ...topic, sources: { ...topic.sources || {} } } : { name: "", query: "", sources: {} };
    const err = h("span", { class: "err", id: "q-err", role: "alert" });
    const name = h("input", { class: "input", id: "f-name", value: draft.name, "data-focus": "edit-name", autocomplete: "off", placeholder: "e.g. GPR182" });
    const query = h("input", { class: "input mono", id: "f-query", value: draft.query, autocomplete: "off", spellcheck: "false", "aria-describedby": "q-hint q-err", placeholder: 'GPR182 OR "atypical chemokine receptor"' });
    const check = () => {
      try {
        if (query.value.trim()) validateQuery(query.value);
        err.textContent = "";
        query.removeAttribute("aria-invalid");
        return true;
      } catch (e) {
        err.textContent = e.message;
        query.setAttribute("aria-invalid", "true");
        return false;
      }
    };
    query.addEventListener("input", check);
    const selects = SOURCES.map((s) => {
      const def = settings.sources[s.id] ? "on" : "off";
      const sel = h(
        "select",
        { "aria-label": `${s.label} for this topic`, "data-src": s.id },
        h("option", { value: "default" }, `Default (${def})`),
        h("option", { value: "on" }, "On"),
        h("option", { value: "off" }, "Off")
      );
      sel.value = draft.sources[s.id] || "default";
      return h("span", { class: "src" }, s.label, sel);
    });
    const save = async () => {
      const nm = name.value.trim();
      const q = query.value.trim();
      if (!nm) {
        name.setAttribute("aria-invalid", "true");
        name.focus();
        return;
      }
      if (!q || !check()) {
        if (!q) err.textContent = "Enter a search query.";
        query.focus();
        return;
      }
      const sources = {};
      form.querySelectorAll("select[data-src]").forEach((s) => {
        if (s.value !== "default") sources[s.dataset.src] = s.value;
      });
      if (isNew) {
        const t = makeTopic(nm, q, sources);
        editing = null;
        await saveTopics([...topics, t], [t.id]);
        toast(`Added \u201C${nm}\u201D. Searching the last 2 months\u2026`);
      } else {
        const queryChanged = topic.query !== q;
        const sourcesChanged = JSON.stringify(topic.sources || {}) !== JSON.stringify(sources);
        editing = null;
        await saveTopics(topics.map((t) => t.id === topic.id ? { ...t, name: nm, query: q, sources } : t), queryChanged || sourcesChanged ? [topic.id] : []);
        toast(queryChanged ? "Saved. The new query searches the last 2 months." : "Saved");
      }
    };
    const form = h(
      "form",
      { class: "edit", onsubmit: (e) => {
        e.preventDefault();
        save();
      } },
      h("div", { class: "field" }, h("label", { for: "f-name" }, "Name"), name),
      h(
        "div",
        { class: "field" },
        h("label", { for: "f-query" }, "Search query"),
        query,
        h("span", { class: "hint", id: "q-hint" }, 'Use "quoted phrases", AND, OR, NOT (uppercase) and parentheses. Words next to each other are combined with AND.'),
        err
      ),
      h("div", { class: "field" }, h("span", { class: "lbl" }, "Sources for this topic"), h("div", { class: "tri" }, selects)),
      h(
        "div",
        { class: "edit-actions" },
        h("button", { class: "btn btn-sm", type: "button", onclick: () => {
          editing = null;
          renderTopics(isNew ? null : `edit:${topic.id}`);
        } }, "Cancel"),
        h("button", { class: "btn btn-sm btn-primary", type: "submit" }, isNew ? "Add topic" : "Save")
      )
    );
    form.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        editing = null;
        renderTopics(isNew ? null : `edit:${topic.id}`);
      }
    });
    return form;
  }
  function renderTopics(focusKey) {
    const list = $("topic-list");
    const children = [];
    if (editing === "new") children.push(editForm(null));
    topics.forEach((t, i) => {
      children.push(topicRow(t, i));
      if (editing === t.id) children.push(editForm(t));
    });
    if (!topics.length && editing !== "new") {
      children.push(h("div", { class: "empty-topics" }, "No topics yet. Add one to start following new papers."));
    }
    list.replaceChildren(...children);
    if (focusKey) list.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus();
  }
  async function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= topics.length) return;
    const next = [...topics];
    [next[i], next[j]] = [next[j], next[i]];
    const id = topics[i].id;
    await saveTopics(next);
    renderTopics(`${d < 0 ? "up" : "down"}:${id}`);
    const btn = document.querySelector(`[data-focus="${d < 0 ? "up" : "down"}:${id}"]`);
    if (btn?.disabled) document.querySelector(`[data-focus="${d < 0 ? "down" : "up"}:${id}"]`)?.focus();
  }
  async function remove(id) {
    const t = topics.find((x) => x.id === id);
    confirmDelete = null;
    if (editing === id) editing = null;
    await saveTopics(topics.filter((x) => x.id !== id));
    send("prune").catch(() => {
    });
    toast(`Deleted \u201C${t?.name}\u201D`);
    $("add-topic").focus();
  }
  var dragId = null;
  function addDrag(row) {
    row.addEventListener("dragstart", (e) => {
      dragId = row.dataset.id;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", dragId);
    });
    row.addEventListener("dragend", () => {
      dragId = null;
      document.querySelectorAll(".trow").forEach((r) => r.classList.remove("dragging", "drop-before", "drop-after"));
    });
    row.addEventListener("dragover", (e) => {
      if (!dragId || dragId === row.dataset.id) return;
      e.preventDefault();
      const after = e.offsetY > row.offsetHeight / 2;
      row.classList.toggle("drop-after", after);
      row.classList.toggle("drop-before", !after);
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-before", "drop-after"));
    row.addEventListener("drop", async (e) => {
      e.preventDefault();
      const after = row.classList.contains("drop-after");
      row.classList.remove("drop-before", "drop-after");
      if (!dragId || dragId === row.dataset.id) return;
      const moving = topics.find((t) => t.id === dragId);
      const rest = topics.filter((t) => t.id !== dragId);
      let idx = rest.findIndex((t) => t.id === row.dataset.id);
      if (after) idx++;
      rest.splice(idx, 0, moving);
      await saveTopics(rest);
    });
  }
  function renderSources() {
    $("source-list").replaceChildren(...SOURCES.map((s) => {
      const sw = h("button", { class: "switch", type: "button", role: "switch", "aria-checked": String(!!settings.sources[s.id]), "aria-label": s.label });
      sw.addEventListener("click", async () => {
        const on = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", String(on));
        await saveSettings({ sources: { ...settings.sources, [s.id]: on } }, `${s.label} ${on ? "enabled" : "disabled"}`);
        renderTopics();
      });
      return h("div", { class: "srow" }, h("div", { class: "tinfo" }, h("strong", {}, s.label), h("span", { class: "meta" }, s.description)), sw);
    }));
    $("epmc-scope").value = settings.europepmcScope;
    $("email").value = settings.email;
    $("ncbi-key").value = settings.ncbiApiKey;
    $("openalex-key").value = settings.openalexApiKey;
  }
  function bindSourceFields() {
    $("epmc-scope").addEventListener("change", (e) => saveSettings({ europepmcScope: e.target.value }));
    const text2 = (id, key, validate) => $(id).addEventListener("change", (e) => {
      const v = e.target.value.trim();
      if (validate && v && !validate(v)) {
        e.target.setAttribute("aria-invalid", "true");
        toast("Please check this value");
        return;
      }
      e.target.removeAttribute("aria-invalid");
      saveSettings({ [key]: v });
    });
    text2("email", "email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    text2("ncbi-key", "ncbiApiKey", (v) => /^[A-Za-z0-9]+$/.test(v));
    text2("openalex-key", "openalexApiKey", (v) => /^[A-Za-z0-9_-]+$/.test(v));
  }
  function renderStartup() {
    document.querySelectorAll('input[name="startup"]').forEach((r) => {
      r.checked = r.value === settings.openOnStartup;
    });
    document.querySelectorAll('input[name="links"]').forEach((r) => {
      r.checked = r.value === "background" === settings.openLinksInBackground;
    });
  }
  function renderThemes() {
    const items = [{ id: "auto", name: "Auto (system)" }, ...THEMES];
    const picker = $("theme-picker");
    picker.replaceChildren(...items.map((t) => {
      const checked = settings.theme === t.id;
      const sw = t.id === "auto" ? h("i", { class: "auto", "aria-hidden": "true" }, h("b", {})) : h("i", { "aria-hidden": "true" }, t.swatch.map((c) => h("b", { style: { background: c } })));
      return h("button", {
        class: "tp",
        type: "button",
        role: "radio",
        "aria-checked": String(checked),
        tabindex: checked ? "0" : "-1",
        "data-theme-id": t.id,
        onclick: () => selectTheme(t.id)
      }, sw, t.name);
    }));
    for (const [id, mode, key] of [["auto-light", "light", "autoLight"], ["auto-dark", "dark", "autoDark"]]) {
      const sel = $(id);
      sel.replaceChildren(...THEMES.filter((t) => t.mode === mode).map((t) => h("option", { value: t.id }, t.name)));
      sel.value = settings[key];
    }
  }
  async function selectTheme(id) {
    await saveSettings({ theme: id }, "Theme updated");
    renderThemes();
    $("theme-picker").querySelector(`[data-theme-id="${id}"]`)?.focus();
  }
  $("theme-picker").addEventListener("keydown", (e) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const ids = ["auto", ...THEMES.map((t) => t.id)];
    const i = ids.indexOf(settings.theme);
    const d = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    selectTheme(ids[(i + d + ids.length) % ids.length]);
  });
  $("auto-light").addEventListener("change", (e) => saveSettings({ autoLight: e.target.value }));
  $("auto-dark").addEventListener("change", (e) => saveSettings({ autoDark: e.target.value }));
  document.querySelectorAll('input[name="startup"]').forEach((r) => r.addEventListener("change", () => saveSettings({ openOnStartup: r.value })));
  document.querySelectorAll('input[name="links"]').forEach((r) => r.addEventListener("change", () => saveSettings({ openLinksInBackground: r.value === "background" })));
  function buildExport(topicsIn, settingsIn, includeKeys) {
    const s = { ...settingsIn };
    if (!includeKeys) {
      delete s.ncbiApiKey;
      delete s.openalexApiKey;
    }
    return { format: "new-papers-export", version: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), topics: topicsIn, settings: s };
  }
  function doExport() {
    const data = buildExport(topics, settings, $("export-keys").checked);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: `new-papers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    toast(`Exported ${topics.length} topics`);
  }
  async function doImport(file) {
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      toast("That file is not valid JSON");
      return;
    }
    if (data?.format !== "new-papers-export" || !Array.isArray(data.topics)) {
      toast("Not a New Papers export file");
      return;
    }
    const incoming = [];
    let invalid = 0;
    for (const t of data.topics) {
      if (typeof t?.name !== "string" || typeof t?.query !== "string" || !t.name.trim()) {
        invalid++;
        continue;
      }
      try {
        validateQuery(t.query);
      } catch {
        invalid++;
        continue;
      }
      const sources = {};
      for (const s2 of SOURCES) if (["on", "off"].includes(t.sources?.[s2.id])) sources[s2.id] = t.sources[s2.id];
      incoming.push({ id: typeof t.id === "string" && /^[\w-]{1,64}$/.test(t.id) ? t.id : makeTopic("x", "x").id, name: t.name.trim(), query: t.query.trim(), sources, createdAt: Number(t.createdAt) || Date.now() });
    }
    const byId = new Map(topics.map((t) => [t.id, t]));
    const changed = [];
    for (const t of incoming) {
      const prev = byId.get(t.id);
      if (!prev || prev.query !== t.query) changed.push(t.id);
      byId.set(t.id, t);
    }
    const s = data.settings && typeof data.settings === "object" ? data.settings : {};
    const allowed = Object.keys(withDefaults());
    const patch = Object.fromEntries(Object.entries(s).filter(([k]) => allowed.includes(k)));
    settings = withDefaults({ ...settings, ...patch, sources: { ...settings.sources, ...patch.sources || {} } });
    await area.set({ settings });
    await saveTopics([...byId.values()], changed);
    renderAll();
    toast(`Imported ${incoming.length} topics${invalid ? ` (${invalid} skipped as invalid)` : ""}`);
  }
  $("export").addEventListener("click", doExport);
  $("import").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) doImport(f);
    e.target.value = "";
  });
  $("refresh-all").addEventListener("click", () => {
    send("refresh").catch(() => {
    });
    toast("Checking all topics\u2026");
  });
  $("open-window").addEventListener("click", () => send("openWindow"));
  async function renderUsage() {
    const d = await area.get(["dismissed"]);
    const nEntries = Object.values(entries).reduce((n, l) => n + l.length, 0);
    const nDismissed = Object.values(d.dismissed || {}).reduce((n, o) => n + Object.keys(o).length, 0);
    let bytes = null;
    try {
      bytes = await area.getBytesInUse?.(null);
    } catch {
    }
    $("usage").textContent = `${nEntries} entries \xB7 ${nDismissed} dismissed IDs${bytes != null ? ` \xB7 ${Math.round(bytes / 1024)} KB used` : ""}`;
    const run = meta.lastRun;
    $("last-run").textContent = meta.running ? "Checking now\u2026" : run ? `Last check ${formatWhen(run.finishedAt || run.at)}${run.ok ? "" : ` \xB7 ${run.errors.length} problem${run.errors.length === 1 ? "" : "s"}`}` : "";
  }
  async function renderPermissions() {
    const slot = $("perm-banner");
    slot.replaceChildren();
    let ok = true;
    try {
      ok = await import_webextension_polyfill.default.permissions.contains({ origins: HOSTS });
    } catch {
      ok = true;
    }
    if (ok) return;
    slot.append(h(
      "div",
      { class: "banner", role: "alert" },
      icon("warn"),
      h("p", {}, "New Papers needs access to the literature APIs (Europe PMC, NCBI, OpenAlex, arXiv) to search for papers."),
      h("button", { class: "btn btn-sm btn-primary", type: "button", onclick: async () => {
        if (await import_webextension_polyfill.default.permissions.request({ origins: HOSTS })) {
          renderPermissions();
          send("refresh").catch(() => {
          });
        }
      } }, "Grant access")
    ));
  }
  var navLinks = [...document.querySelectorAll("[data-nav]")];
  var obs = new IntersectionObserver((items) => {
    for (const it of items) {
      if (it.isIntersecting) navLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.nav === it.target.id)));
    }
  }, { rootMargin: "-10% 0px -70% 0px" });
  document.querySelectorAll(".op-sec").forEach((s) => obs.observe(s));
  function renderAll() {
    renderTopics();
    renderSources();
    renderStartup();
    renderThemes();
    renderUsage();
  }
  async function load() {
    const d = await area.get(["topics", "settings", "entries", "lastChecked", "meta"]);
    topics = Array.isArray(d.topics) ? d.topics : [];
    settings = withDefaults(d.settings);
    entries = d.entries || {};
    lastChecked = d.lastChecked || {};
    meta = d.meta || {};
  }
  document.querySelectorAll("[data-icon]").forEach((el) => el.replaceWith(icon(el.dataset.icon)));
  $("logo").append(icon("doc", ""));
  $("add-topic").addEventListener("click", () => {
    editing = "new";
    confirmDelete = null;
    renderTopics("edit-name");
  });
  bindSourceFields();
  import_webextension_polyfill.default.storage.onChanged.addListener(async (changes, name) => {
    if (name !== "local") return;
    if (changes.entries || changes.lastChecked || changes.meta) {
      await load();
      if (!editing) renderTopics();
      renderUsage();
    }
  });
  initTheme().then(load).then(() => {
    renderAll();
    renderPermissions();
    if (location.hash === "#add") $("add-topic").click();
  });
})();
