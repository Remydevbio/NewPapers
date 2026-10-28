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
    constructor(message, { status: status2 = 0, offline = false, body = "" } = {}) {
      super(message);
      this.name = "SourceError";
      this.status = status2;
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
  function withDefaults(settings) {
    const s = { ...DEFAULT_SETTINGS, ...settings || {} };
    s.sources = { ...DEFAULT_SETTINGS.sources, ...settings?.sources || {} };
    if (s.theme !== "auto" && !THEME_IDS.includes(s.theme)) s.theme = "auto";
    return s;
  }
  function resolveTheme(settings, prefersDark) {
    const s = withDefaults(settings);
    if (s.theme !== "auto") return s.theme;
    return prefersDark ? s.autoDark : s.autoLight;
  }
  function topicSourceEnabled(topic, settings, sourceId) {
    const o = topic?.sources?.[sourceId] || "default";
    if (o === "on") return true;
    if (o === "off") return false;
    return !!withDefaults(settings).sources[sourceId];
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
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    bookmark: '<path d="M7 4h10v16l-5-3.5L7 20z"/>',
    select: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
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
    let settings = withDefaults();
    try {
      const c = localStorage.getItem("np-settings");
      if (c) settings = withDefaults(JSON.parse(c));
    } catch {
    }
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(settings, !!darkQuery?.matches);
      try {
        localStorage.setItem("np-settings", JSON.stringify({ theme: settings.theme, autoLight: settings.autoLight, autoDark: settings.autoDark }));
      } catch {
      }
    };
    apply();
    darkQuery?.addEventListener?.("change", apply);
    import_webextension_polyfill.default.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.settings) {
        settings = withDefaults(changes.settings.newValue);
        apply();
      }
    });
    return import_webextension_polyfill.default.storage.local.get("settings").then((d) => {
      settings = withDefaults(d.settings);
      apply();
      return settings;
    });
  }
  function formatDate(iso) {
    if (!iso) return "";
    const d = /* @__PURE__ */ new Date(`${iso}T00:00:00Z`);
    return d.toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
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

  // src/lib/store.js
  var KEYS = ["topics", "lastChecked", "entries", "dismissed", "toRead", "settings", "meta"];
  async function loadAll(area) {
    const d = await area.get(KEYS);
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

  // src/lib/dedupe.js
  var DISMISSED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;
  function sortEntries(entries) {
    return [...entries].sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.firstSeen - a.firstSeen);
  }

  // src/lib/engine.js
  function inToRead(toRead, entry) {
    return toRead.some((t) => t.id === entry.id || t.keys?.some((k) => entry.keys?.includes(k)));
  }

  // src/ui/popup.js
  var isWindow = new URLSearchParams(location.search).get("view") === "window";
  if (isWindow) document.body.classList.add("in-window");
  var $ = (id) => document.getElementById(id);
  var state = null;
  var active = null;
  var expanded = /* @__PURE__ */ new Set();
  var newIds = {};
  var confirmAll = null;
  var TOREAD = "__toread";
  var selecting = null;
  var picked = /* @__PURE__ */ new Set();
  var LS = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {
      }
    }
  };
  function venueColor(v) {
    const n = (v.venue || "").toLowerCase();
    if (n.includes("biorxiv")) return "var(--src-biorxiv)";
    if (n.includes("medrxiv")) return "var(--src-medrxiv)";
    if (n.includes("arxiv")) return "var(--src-arxiv)";
    if (v.kind === "preprint") return "var(--src-openalex)";
    return "var(--src-journal)";
  }
  var badge = (label, color) => h("span", { class: "badge", "--c": color, title: label }, h("span", {}, label));
  function hash(s) {
    let x = 5381;
    for (let i = 0; i < s.length; i++) x = (x << 5) + x + s.charCodeAt(i) | 0;
    return (x >>> 0).toString(36);
  }
  function shortAuthors(authors) {
    if (!authors.length) return "Unknown authors";
    return authors.length > 4 ? `${authors.slice(0, 3).join(", ")}, et al.` : authors.join(", ");
  }
  var opened = new Set(JSON.parse(LS.get("np-opened") || "[]"));
  function markOpened(entryId) {
    if (!entryId || opened.has(entryId)) return;
    opened.add(entryId);
    LS.set("np-opened", JSON.stringify([...opened].slice(-500)));
    document.querySelectorAll(`.entry[data-id="${CSS.escape(entryId)}"]`).forEach((c) => c.classList.add("opened"));
  }
  var statusTimer;
  function status(msg) {
    const el = $("status");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  function link(label, url, extra = {}) {
    const { entryId, noicon, ...attrs } = extra;
    return h("a", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      ...attrs,
      onclick: (e) => {
        markOpened(entryId);
        if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
          e.preventDefault();
          send("openUrl", { url }).catch(() => {
          });
          if (state?.settings.openLinksInBackground) status("Opened in a background tab");
        }
      },
      onauxclick: (e) => {
        if (e.button === 1) markOpened(entryId);
      }
    }, label, noicon ? null : icon("ext"));
  }
  function entryLinks(e) {
    const out = [];
    const multi = e.versions.length > 1;
    for (const v of e.versions) {
      if (!v.url) continue;
      const label = multi ? v.kind === "preprint" ? "Preprint" : "Journal" : v.doi ? "DOI" : "Open";
      out.push(link(label, v.url, { "aria-label": `${label}: ${v.venue}`, entryId: e.id }));
    }
    if (e.pmid) out.push(link("PubMed", `https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/`, { entryId: e.id }));
    return out;
  }
  function savedItems(e) {
    return state.toRead.filter((t) => t.id === e.id || t.keys?.some((k) => e.keys?.includes(k)));
  }
  function renderEntry(e, topicId) {
    const isNew = newIds[topicId]?.has(e.id);
    const inList = topicId === TOREAD;
    const saved = inList || inToRead(state.toRead, e);
    const picking = selecting === topicId;
    const absId = `abs-${hash(e.id)}`;
    const open = expanded.has(e.id);
    const main = e.versions.find((v) => v.kind === "article" && v.url) || e.versions.find((v) => v.url);
    const titleNode = main ? link(e.title, main.url, { noicon: true, entryId: e.id }) : document.createTextNode(e.title);
    const badges = e.versions.map((v) => badge(v.venue, venueColor(v)));
    if (e.sources.includes("pubmed") && !e.versions.some((v) => v.venue === "PubMed")) badges.push(badge("PubMed", "var(--src-pubmed)"));
    const wasOpened = opened.has(e.id);
    const short = e.title.slice(0, 60);
    const card = h(
      "article",
      {
        class: `entry${isNew ? " new" : ""}${wasOpened ? " opened" : ""}${saved && !inList ? " saved" : ""}${picking && picked.has(e.id) ? " picked" : ""}`,
        "data-id": e.id,
        "aria-label": `${isNew ? "New: " : ""}${wasOpened ? "Opened: " : ""}${saved && !inList ? "To read: " : ""}${e.title}`
      },
      h(
        "div",
        { class: "e-top" },
        picking ? h("input", {
          class: "e-pick",
          type: "checkbox",
          "aria-label": `Select \u201C${short}\u201D`,
          "data-focus": `pick:${e.id}`,
          ...picked.has(e.id) ? { checked: "" } : {},
          onchange: (ev) => {
            if (ev.target.checked) picked.add(e.id);
            else picked.delete(e.id);
            card.classList.toggle("picked", ev.target.checked);
            renderTopicBar();
          }
        }) : null,
        h("h3", { class: "e-title" }, titleNode),
        inList || picking ? null : h("button", {
          class: "btn btn-ghost btn-icon e-save",
          type: "button",
          "aria-pressed": String(saved),
          "data-focus": `save:${e.id}`,
          "aria-label": saved ? `Remove \u201C${short}\u201D from To read` : `Add \u201C${short}\u201D to To read`,
          title: saved ? "Remove from To read" : "Add to To read",
          onclick: () => toggleToRead(topicId, e)
        }, icon("bookmark")),
        picking ? null : h("button", {
          class: "btn btn-ghost btn-icon e-dismiss",
          type: "button",
          "data-focus": `dismiss:${e.id}`,
          "aria-label": inList ? `Remove \u201C${short}\u201D from To read` : `Dismiss \u201C${short}\u201D`,
          title: inList ? "Remove from To read" : "Dismiss",
          onclick: () => inList ? removeFromList(e, card) : dismiss(topicId, e.id, card)
        }, icon("x"))
      ),
      h("p", { class: "e-authors", title: e.authors.join(", ") }, shortAuthors(e.authors)),
      h(
        "div",
        { class: "e-meta" },
        h("span", {}, formatDate(e.date)),
        badges,
        h("span", { class: "toread-tag", title: "In your To read list" }, icon("bookmark"), "To read"),
        h("span", { class: "opened-tag", title: "You opened this paper" }, "\u2713 Opened"),
        inList && e.topicName ? h("span", { class: "e-from" }, `from ${e.topicName}`) : null,
        h("span", { class: "e-links" }, entryLinks(e))
      )
    );
    if (e.abstract) {
      const panel = h("div", { class: `abs${open ? " open" : ""}`, id: absId }, h("div", {}, h("p", {}, e.abstract)));
      const toggle = h("button", {
        class: "abs-toggle",
        type: "button",
        "aria-expanded": String(open),
        "aria-controls": absId,
        "data-focus": `abs:${e.id}`,
        onclick: () => {
          const now = !expanded.has(e.id);
          if (now) expanded.add(e.id);
          else expanded.delete(e.id);
          toggle.setAttribute("aria-expanded", String(now));
          panel.classList.toggle("open", now);
        }
      }, "Abstract", icon("chev"));
      card.append(toggle, panel);
    }
    return card;
  }
  async function dismiss(topicId, entryId, card) {
    const next = card.nextElementSibling || card.previousElementSibling;
    const focusKey = next?.dataset.id ? `dismiss:${next.dataset.id}` : `tab:${topicId}`;
    card.classList.add("leaving");
    await new Promise((r) => setTimeout(r, 160));
    pendingFocus = focusKey;
    await send("dismiss", { topicId, entryId });
  }
  async function toggleToRead(topicId, e) {
    const items = savedItems(e);
    pendingFocus = `save:${e.id}`;
    if (items.length) {
      await send("removeToRead", { ids: items.map((t) => t.id) });
      status("Removed from To read");
    } else {
      await send("addToRead", { topicId, entryIds: [e.id] });
      status("Added to To read");
    }
  }
  async function removeFromList(e, card) {
    const next = card.nextElementSibling || card.previousElementSibling;
    card.classList.add("leaving");
    await new Promise((r) => setTimeout(r, 160));
    pendingFocus = next?.dataset.id ? `dismiss:${next.dataset.id}` : `tab:${TOREAD}`;
    await send("removeToRead", { ids: [e.id] });
  }
  function setSelecting(listId) {
    selecting = listId;
    picked.clear();
    confirmAll = null;
    pendingFocus = listId ? "sel-all" : `select:${active}`;
    lastSig = null;
    render();
  }
  async function bulk(action) {
    const ids = [...picked];
    if (!ids.length) return;
    const listId = selecting;
    let msg = "";
    if (action === "dismiss") {
      const n = await send("dismissMany", { topicId: listId, entryIds: ids });
      msg = `Dismissed ${n} paper${n === 1 ? "" : "s"}`;
    } else if (action === "save") {
      const n = await send("addToRead", { topicId: listId, entryIds: ids });
      msg = n ? `Added ${n} to To read` : "Already in To read";
    } else if (action === "unsave") {
      const n = await send("removeToRead", { ids });
      msg = `Removed ${n} from To read`;
    }
    selecting = null;
    picked.clear();
    pendingFocus = `select:${listId}`;
    lastSig = null;
    render();
    status(msg);
  }
  var pendingFocus = null;
  function shortReason(m = "") {
    if (/timeout/i.test(m)) return "timed out";
    if (/network|fetch/i.test(m)) return "network error";
    if (/429/.test(m)) return "rate limited";
    if (/HTTP 40[13]/.test(m)) return "access refused, see History";
    const code = m.match(/HTTP (\d{3})/);
    if (code) return Number(code[1]) >= 500 ? `server error ${code[1]}` : `error ${code[1]}`;
    return m.slice(0, 60);
  }
  function renderBanner() {
    const slot = $("banner-slot");
    slot.replaceChildren();
    const run = state.meta.lastRun;
    const warnings = [...new Set((run?.warnings || []).map((w) => w.message))];
    if (!run || !run.errors?.length && !warnings.length || LS.get("np-banner-hidden") === String(run.at)) return;
    const bySource = /* @__PURE__ */ new Map();
    const queryErrors = [];
    for (const e of run.errors) {
      if (e.source === "query") {
        queryErrors.push(`the query of \u201C${e.topic}\u201D is invalid (${e.message})`);
        continue;
      }
      const name = e.label || e.source;
      if (!bySource.has(name)) bySource.set(name, shortReason(e.message));
    }
    const parts = [];
    if (bySource.size) parts.push(`Couldn't update from ${[...bySource].map(([n, r]) => `${n} (${r})`).join(", ")}. Showing saved results; it will be retried on the next start.`);
    if (queryErrors.length) parts.push(`Note: ${queryErrors.join("; ")}.`);
    parts.push(...warnings);
    const msg = run.offline ? "You appear to be offline. Showing saved results; sources will be retried on the next start." : parts.join(" ");
    slot.append(h(
      "div",
      { class: "banner", role: "status" },
      icon("warn"),
      h("p", {}, msg),
      h("button", { class: "link", type: "button", onclick: () => {
        LS.set("np-banner-hidden", String(run.at));
        renderBanner();
      } }, "Hide")
    ));
  }
  var fmtStamp = (ms) => new Date(ms).toLocaleString(void 0, { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  var fmtDuration = (ms) => ms < 1e3 ? `${Math.max(0, Math.round(ms))} ms` : `${(ms / 1e3).toFixed(ms < 1e4 ? 1 : 0)} s`;
  var plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  var TRIGGERS = { startup: "Browser start", manual: "Refresh now" };
  function historyRuns() {
    const m = state.meta;
    const runs = m.history?.length ? m.history : m.lastRun ? [m.lastRun] : [];
    return runs;
  }
  function runSummary(run) {
    const lines = (run.report || []).flatMap((t) => t.sources);
    const failed = lines.filter((l) => !l.ok).length + (run.report || []).filter((t) => t.queryError).length;
    const warned = lines.filter((l) => l.ok && l.warnings?.length).length;
    const parts = [plural(run.added || 0, "new paper")];
    if (run.report) parts.push(failed ? plural(failed, "problem") : warned ? plural(warned, "warning") : "all sources OK");
    else if (!run.ok) parts.push(plural(run.errors?.length || 0, "problem"));
    return { text: parts.join(" \xB7 "), level: failed || !run.report && !run.ok ? "err" : warned ? "warn" : "ok" };
  }
  function renderSourceLine(l) {
    const level = !l.ok ? "err" : l.warnings?.length ? "warn" : "ok";
    const msgs = [l.error, ...l.warnings || []].filter(Boolean);
    return h(
      "li",
      { class: `hi-src ${level}` },
      h("span", { class: "hi-mark" }, icon(level === "ok" ? "check" : level === "warn" ? "warn" : "x"), h("span", { class: "sr-only" }, level === "ok" ? "OK" : level === "warn" ? "Warning" : "Failed")),
      h("span", { class: "hi-name" }, l.label || l.source),
      h("span", { class: "hi-res" }, l.ok ? `${plural(l.found, "result")}` : "failed"),
      h("span", { class: "hi-win" }, `${formatDate(l.from)} \u2013 ${formatDate(l.to)} \xB7 ${fmtDuration(l.ms)}`),
      ...msgs.map((m) => h("span", { class: "hi-msg" }, m))
    );
  }
  function renderRun(run, open) {
    const sum = runSummary(run);
    const body = run.report ? run.report.length ? run.report.map((t) => h(
      "div",
      { class: "hi-topic" },
      h("div", { class: "hi-topic-head" }, h("strong", {}, t.topic), t.queryError ? "" : h("span", {}, `+${t.added} new`)),
      t.queryError ? h("p", { class: "hi-msg err" }, `Query not run: ${t.queryError}`) : h("ul", { class: "hi-srcs" }, ...t.sources.map(renderSourceLine))
    )) : [h("p", { class: "hi-note" }, "No topics were checked.")] : [
      h("p", { class: "hi-note" }, "Recorded before per-source details were kept."),
      ...(run.errors || []).map((e) => h("p", { class: "hi-msg err" }, `${e.label || e.source}${e.topic ? ` (${e.topic})` : ""}: ${e.message}`))
    ];
    return h(
      "details",
      { class: `hi-run ${sum.level}`, "data-at": String(run.at), open },
      h(
        "summary",
        {},
        h("span", { class: "hi-when" }, fmtStamp(run.at)),
        h("span", { class: "hi-sum" }, [TRIGGERS[run.trigger], run.partial ? "some topics" : "", run.finishedAt ? fmtDuration(run.finishedAt - run.at) : "", sum.text].filter(Boolean).join(" \xB7 "))
      ),
      ...body
    );
  }
  function renderHistory() {
    const panel = $("history");
    if (panel.hidden) return;
    const runs = historyRuns();
    const running = !!state.meta.running;
    const shown = new Map([...$("history-body").querySelectorAll("details[data-at]")].map((d) => [d.dataset.at, d.open]));
    $("history-body").replaceChildren(
      ...running ? [h("p", { class: "hi-note" }, "A check is running now; it will appear here when it finishes.")] : [],
      ...runs.length ? runs.map((r, i) => renderRun(r, shown.get(String(r.at)) ?? i === 0)) : [h("p", { class: "hi-note" }, "No checks yet. Use Refresh now.")]
    );
  }
  function toggleHistory(show = $("history").hidden) {
    $("history").hidden = !show;
    $("history-btn").setAttribute("aria-expanded", String(show));
    if (show) {
      renderHistory();
      $("history-close").focus();
    } else {
      $("history-btn").focus();
    }
  }
  function renderHeader() {
    const running = !!state.meta.running && Date.now() - (state.meta.runStartedAt || 0) < 5 * 60 * 1e3;
    const last = state.meta.lastRun?.finishedAt || state.meta.lastRun?.at;
    $("checked").textContent = running ? "Checking for new papers\u2026" : `Checked ${formatWhen(last)}`;
    const r = $("refresh");
    r.replaceChildren(icon("refresh", running ? "icon spin" : "icon"), running ? "Checking\u2026" : "Refresh now");
    r.disabled = running;
  }
  function renderTabs() {
    const tabs = $("tabs");
    tabs.replaceChildren(...state.topics.map((t) => {
      const n = (state.entries[t.id] || []).length;
      return h("button", {
        class: "tab",
        role: "tab",
        type: "button",
        id: `tab-${t.id}`,
        "aria-selected": String(t.id === active),
        "aria-controls": "list",
        tabindex: t.id === active ? "0" : "-1",
        "data-focus": `tab:${t.id}`,
        onclick: () => selectTopic(t.id)
      }, t.name, h("span", { class: "count", "aria-label": `${n} unread` }, String(n)));
    }), h("button", {
      class: "tab toread",
      role: "tab",
      type: "button",
      id: `tab-${TOREAD}`,
      "aria-selected": String(active === TOREAD),
      "aria-controls": "list",
      tabindex: active === TOREAD ? "0" : "-1",
      "data-focus": `tab:${TOREAD}`,
      onclick: () => selectTopic(TOREAD)
    }, icon("bookmark"), "To read", h("span", { class: "count", "aria-label": `${state.toRead.length} saved` }, String(state.toRead.length))));
    $("list").setAttribute("aria-labelledby", `tab-${active}`);
  }
  function currentEntries() {
    return active === TOREAD ? state.toRead : sortEntries(state.entries[active] || []);
  }
  function renderTopicBar() {
    const bar = $("topic-bar");
    const topic = state.topics.find((t) => t.id === active);
    const entries = currentEntries();
    if (!topic && active !== TOREAD) {
      bar.replaceChildren();
      return;
    }
    if (selecting === active) {
      const ids = new Set(entries.map((e) => e.id));
      for (const id of [...picked]) if (!ids.has(id)) picked.delete(id);
      const n = picked.size;
      const all = h("input", { type: "checkbox", "data-focus": "sel-all", "aria-label": "Select all", ...n && n === entries.length ? { checked: "" } : {} });
      all.indeterminate = n > 0 && n < entries.length;
      all.addEventListener("change", () => {
        picked.clear();
        if (all.checked) for (const e of entries) picked.add(e.id);
        pendingFocus = "sel-all";
        lastSig = null;
        render();
      });
      const act = (label, action, ico, extra = "") => h("button", { class: `btn btn-sm ${extra}`, type: "button", "data-focus": `bulk:${action}`, disabled: n === 0, onclick: () => bulk(action) }, icon(ico), label);
      bar.replaceChildren(
        h("label", { class: "sel-all" }, all, "All"),
        h("span", { class: "sel-count", "aria-live": "polite" }, `${n} selected`),
        ...active === TOREAD ? [act("Remove", "unsave", "x")] : [act("To read", "save", "bookmark"), act("Dismiss", "dismiss", "x")],
        h("button", { class: "btn btn-sm btn-ghost", type: "button", "data-focus": "sel-done", onclick: () => setSelecting(null) }, "Done")
      );
      return;
    }
    bar.replaceChildren(active === TOREAD ? h("span", { class: "q plain" }, "Kept even after you dismiss them from a topic.") : h("span", { class: "q", title: topic.query }, topic.query));
    if (entries.length) {
      bar.append(h("button", { class: "btn btn-sm btn-ghost", type: "button", "data-focus": `select:${active}`, title: "Select several papers", onclick: () => setSelecting(active) }, icon("select"), "Select"));
    }
    if (entries.length && topic) {
      const btn = h(
        "button",
        { class: "btn btn-sm btn-ghost", type: "button", "data-focus": `all:${topic.id}` },
        icon("x"),
        confirmAll === topic.id ? `Confirm: dismiss ${entries.length}` : "Dismiss all"
      );
      btn.addEventListener("click", async () => {
        if (confirmAll !== topic.id) {
          confirmAll = topic.id;
          pendingFocus = `all:${topic.id}`;
          render();
          setTimeout(() => {
            if (confirmAll === topic.id) {
              confirmAll = null;
              render();
            }
          }, 4e3);
          return;
        }
        confirmAll = null;
        pendingFocus = `tab:${topic.id}`;
        await send("dismissAll", { topicId: topic.id });
      });
      bar.append(btn);
    }
  }
  function renderList() {
    const list = $("list");
    const topic = state.topics.find((t) => t.id === active);
    renderTopicBar();
    if (active === TOREAD) {
      list.replaceChildren(...state.toRead.length ? state.toRead.map((e) => renderEntry(e, TOREAD)) : [h(
        "div",
        { class: "empty" },
        h("strong", {}, "Nothing to read yet"),
        "Use the bookmark button on a paper to keep it here, even after you dismiss it from its topic."
      )]);
      return;
    }
    if (!topic) {
      list.replaceChildren(h(
        "div",
        { class: "empty" },
        h("strong", {}, "No topics yet"),
        "Add a topic with a search query to start following new papers.",
        h("div", {}, h("button", { class: "btn btn-primary", type: "button", onclick: () => import_webextension_polyfill.default.runtime.openOptionsPage() }, icon("plus"), "Add a topic"))
      ));
      return;
    }
    const entries = sortEntries(state.entries[topic.id] || []);
    const lc = state.lastChecked[topic.id]?.at;
    list.replaceChildren(...entries.length ? entries.map((e) => renderEntry(e, topic.id)) : [h(
      "div",
      { class: "empty" },
      h("strong", {}, "You\u2019re all caught up"),
      lc ? `No new papers for \u201C${topic.name}\u201D since the last check.` : `\u201C${topic.name}\u201D has not been checked yet. Use Refresh now.`
    )]);
  }
  function renderFooter() {
    const total = state.topics.reduce((n, t) => n + (state.entries[t.id] || []).length, 0);
    $("foot-count").textContent = `${total} unread across ${state.topics.length} topic${state.topics.length === 1 ? "" : "s"}`;
    const topic = state.topics.find((t) => t.id === active);
    if (active === TOREAD) {
      $("foot-sources").textContent = `${state.toRead.length} to read`;
      return;
    }
    $("foot-sources").textContent = topic ? SOURCES.filter((s) => topicSourceEnabled(topic, state.settings, s.id)).map((s) => s.label.replace(/ \(.*\)/, "")).join(" \xB7 ") : "";
  }
  function render() {
    const focusKey = pendingFocus || document.activeElement?.dataset?.focus;
    pendingFocus = null;
    renderHeader();
    renderHistory();
    renderBanner();
    renderTabs();
    renderList();
    renderFooter();
    if (focusKey) document.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus();
  }
  function markNew(topicId) {
    if (topicId === TOREAD || newIds[topicId]) return;
    const unseen = (state.entries[topicId] || []).filter((e) => !e.seen);
    newIds[topicId] = new Set(unseen.map((e) => e.id));
    if (unseen.length) send("markSeen", { topicId }).catch(() => {
    });
  }
  function selectTopic(id) {
    active = id;
    confirmAll = null;
    selecting = null;
    picked.clear();
    LS.set("np-active-topic", id);
    markNew(id);
    pendingFocus = `tab:${id}`;
    lastSig = null;
    render();
  }
  var lastSig = null;
  function signature(s) {
    return JSON.stringify([
      s.topics,
      s.settings.sources,
      s.meta.running,
      s.meta.lastRun?.at,
      s.meta.lastRun?.finishedAt,
      s.toRead.map((t) => t.id),
      Object.fromEntries(Object.entries(s.entries).map(([k, l]) => [k, l.map((e) => [e.id, e.versions.length, e.abstract.length])])),
      Object.fromEntries(Object.entries(s.lastChecked).map(([k, v]) => [k, v.at]))
    ]);
  }
  async function reload() {
    state = await loadAll(import_webextension_polyfill.default.storage.local);
    if (active !== TOREAD && !state.topics.some((t) => t.id === active)) {
      const saved = LS.get("np-active-topic");
      active = saved === TOREAD || state.topics.some((t) => t.id === saved) ? saved : state.topics[0]?.id ?? null;
    }
    if (active) markNew(active);
    for (const t of state.topics) {
      if (!newIds[t.id]) continue;
      for (const e of state.entries[t.id] || []) if (!e.seen) newIds[t.id].add(e.id);
    }
    const sig = signature(state) + active;
    if (sig === lastSig) return;
    lastSig = sig;
    render();
  }
  $("tabs").addEventListener("keydown", (ev) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) return;
    const ids = [...state.topics.map((t) => t.id), TOREAD];
    let i = ids.indexOf(active);
    i = ev.key === "Home" ? 0 : ev.key === "End" ? ids.length - 1 : (i + (ev.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
    ev.preventDefault();
    selectTopic(ids[i]);
  });
  $("logo").append(icon("doc", ""));
  $("settings").append(icon("gear"));
  $("settings").addEventListener("click", () => import_webextension_polyfill.default.runtime.openOptionsPage());
  $("refresh").addEventListener("click", () => {
    send("refresh").catch(() => {
    });
  });
  $("history-btn").append(icon("clock"), "History");
  $("history-btn").addEventListener("click", () => toggleHistory());
  $("history-close").append(icon("x"));
  $("history-close").addEventListener("click", () => toggleHistory(false));
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !$("history").hidden) {
      ev.preventDefault();
      toggleHistory(false);
      return;
    }
    if (ev.key === "Escape" && selecting) {
      ev.preventDefault();
      setSelecting(null);
    }
  });
  var reloadTimer = null;
  import_webextension_polyfill.default.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reload, 60);
  });
  setInterval(() => state && renderHeader(), 60 * 1e3);
  initTheme().then(reload);
})();
