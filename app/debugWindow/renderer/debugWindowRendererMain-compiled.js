/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omitInheritedProperties = exports.identity = exports.handleRendererWindowError = exports.getInitialSettingsFromMainProcess = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _electron = __webpack_require__(0);

/**
* When we get the remote.getGlobal, it has inherited stuff on it like getters and setters, so we cant
* just use an object spread, we need to "sanitize" it with omitInheritedProperties.
*/
function getInitialSettingsFromMainProcess() {
  return _extends({
    activeTab: 'statusTab',
    devicesCanSee: [],
    userDebug: false
  }, omitInheritedProperties(_electron.remote.getGlobal('settingsWindowRendererInitialSettings')));
}

/**
* https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
* https://stackoverflow.com/a/43911292/2785644
*/
function handleRendererWindowError(messageOrEvent, source, lineNumber, columnNumber, error) {
  _electron.ipcRenderer.send('settings-renderer:error-sent', { messageOrEvent, source, lineNumber, columnNumber, error: omitInheritedProperties(error) });
}function omitInheritedProperties(obj) {
  if (!isObject(obj)) return {};
  return Object.getOwnPropertyNames(obj).reduce(function (prev, propName) {
    if (isObject(obj[propName])) {
      return _extends({}, prev, { [propName]: omitInheritedProperties(obj[propName]) });
    }return _extends({}, prev, { [propName]: obj[propName] });
  }, {});
}function identity(param) {
  return param;
}function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj) && !isFunction(obj);
}function isFunction(value) {
  return typeof value === 'function';
}exports.getInitialSettingsFromMainProcess = getInitialSettingsFromMainProcess;
exports.handleRendererWindowError = handleRendererWindowError;
exports.identity = identity;
exports.omitInheritedProperties = omitInheritedProperties;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("is-empty");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("add-line-numbers");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("stringify-object");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(0);

var _stringifyObject = __webpack_require__(4);

var _stringifyObject2 = _interopRequireDefault(_stringifyObject);

var _addLineNumbers = __webpack_require__(3);

var _addLineNumbers2 = _interopRequireDefault(_addLineNumbers);

var _isEmpty = __webpack_require__(2);

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const preElem = document.querySelector('#debugOutput');
const { lanLostEnabled } = (0, _utils.omitInheritedProperties)(_electron.remote.getGlobal('settingsWindowRendererInitialSettings'));
let loggingTextSansLineNumbers = '';

_electron.ipcRenderer.on('mainprocess:debug-info-sent', function (event, { msg = '', meta }) {
  loggingTextSansLineNumbers = createLoggingSansLineNumbers(msg, meta);
  preElem.textContent = (0, _addLineNumbers2.default)(loggingTextSansLineNumbers);
});

function createMetaObjForLogging(meta) {
  if ((0, _isEmpty2.default)(meta)) return '';
  if (meta.stack) meta.stack = meta.stack.split(/\r\n?|\n/);
  return (0, _stringifyObject2.default)(meta).replace(/'/g, '');
}function createLoggingSansLineNumbers(msg, meta) {
  const metaObj = createMetaObjForLogging(meta);
  let logString = `${loggingTextSansLineNumbers}${msg + metaObj}\n`;
  if (isDebugWindowOpeningMessage(msg)) {
    logString = lanLostEnabled ? `${logString}Please Wait...\n` : void 0;
  }return logString;
}function isDebugWindowOpeningMessage(msg) {
  return msg === 'Current LANLost settings:';
}function handleRendererWindowError(messageOrEvent, source, lineNumber, columnNumber, error) {
  _electron.ipcRenderer.send('debug-window-renderer:error-sent', { messageOrEvent, source, lineNumber, columnNumber, error: (0, _utils.omitInheritedProperties)(error) });
}window.onerror = handleRendererWindowError;
window.onunhandledrejection = handleRendererWindowError;

/***/ })
/******/ ]);