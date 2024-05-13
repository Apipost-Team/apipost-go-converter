/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 926:
/***/ ((module) => {

(function (factory) {
  if (true) {
    module.exports = factory();
  } else {}
}(function () {

  var isBuiltIn = (function () {
    var built_ins = [
      Object,
      Function,
      Array,
      String,
      Boolean,
      Number,
      Date,
      RegExp,
      Error
    ];
    var built_ins_length = built_ins.length;

    return function (_constructor) {
      for (var i = 0; i < built_ins_length; i++) {
        if (built_ins[i] === _constructor) {
          return true;
        }
      }
      return false;
    };
  })();

  var stringType = (function () {
    var _toString = ({}).toString;

    return function (obj) {
      // [object Blah] -> Blah
      var stype = _toString.call(obj).slice(8, -1);

      if ((obj === null) || (obj === undefined)) {
        return stype.toLowerCase();
      }

      var ctype = of(obj);

      if (ctype && !isBuiltIn(ctype)) {
        return ctype.name;
      } else {
        return stype;
      }
    };
  })();

  function of (obj) {
    if ((obj === null) || (obj === undefined)) {
      return obj;
    } else {
      return obj.constructor;
    }
  }

  function is (obj, test) {
    var typer = (of(test) === String) ? stringType : of;
    return (typer(obj) === test);
  }

  function instance (obj, test) {
    return (obj instanceof test);
  }

  function extension (_Extension, _Base) {
    return instance(_Extension.prototype, _Base);
  }

  function any (obj, tests) {
    if (!is(tests, Array)) {
      throw ("Second argument to .any() should be array")
    }
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      if (is(obj, test)) {
        return true;
      }
    }
    return false;
  }

  var exports = function (obj, type) {
    if (arguments.length == 1) {
      return of(obj);
    } else {
      if (is(type, Array)) {
        return any(obj, type);
      } else {
        return is(obj, type);
      }
    }
  }

  exports.instance  = instance;
  exports.string    = stringType;
  exports.of        = of;
  exports.is        = is;
  exports.any       = any;
  exports.extension = extension;
  return exports;

}));


/***/ }),

/***/ 352:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const json2Schema_1 = __importDefault(__nccwpck_require__(354));
function Json2Schema(rawData) {
    let dataObj = JSON.parse(rawData);
    let data = (0, json2Schema_1.default)(dataObj);
    return JSON.stringify(data);
}
console.log(Json2Schema(JSON.stringify({ "a": 1 })));
//@ts-ignore
global.Json2Schema = Json2Schema;


/***/ }),

/***/ 354:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Modules
const type_of_is_1 = __importDefault(__nccwpck_require__(926));
// Constants
const DRAFT = 'http://json-schema.org/draft-04/schema#';
function getPropertyFormat(value) {
    const type = type_of_is_1.default.string(value).toLowerCase();
    if (type === 'date')
        return 'date-time';
    return null;
}
function getPropertyType(value) {
    const type = type_of_is_1.default.string(value).toLowerCase();
    if (type === 'number')
        return Number.isInteger(value) ? 'integer' : type;
    if (type === 'date')
        return 'string';
    if (type === 'regexp')
        return 'string';
    if (type === 'function')
        return 'string';
    return type;
}
function getUniqueKeys(a, b, c) {
    a = Object.keys(a);
    b = Object.keys(b);
    c = c || [];
    let value;
    let cIndex;
    let aIndex;
    for (let keyIndex = 0, keyLength = b.length; keyIndex < keyLength; keyIndex++) {
        value = b[keyIndex];
        aIndex = a.indexOf(value);
        cIndex = c.indexOf(value);
        if (aIndex === -1) {
            if (cIndex !== -1) {
                // Value is optional, it doesn't exist in A but exists in B(n)
                c.splice(cIndex, 1);
            }
        }
        else if (cIndex === -1) {
            // Value is required, it exists in both B and A, and is not yet present in C
            c.push(value);
        }
    }
    return c;
}
function processArray(array, output, nested) {
    let format;
    let oneOf;
    let type;
    if (nested && output) {
        output = { items: output };
    }
    else {
        output = output || {};
        output.type = getPropertyType(array);
        output.items = output.items || {};
        type = output.items.type || null;
    }
    // Determine whether each item is different
    for (let arrIndex = 0, arrLength = array.length; arrIndex < arrLength; arrIndex++) {
        const elementType = getPropertyType(array[arrIndex]);
        const elementFormat = getPropertyFormat(array[arrIndex]);
        if (type && elementType !== type) {
            output.items.oneOf = [];
            oneOf = true;
            break;
        }
        else {
            type = elementType;
            format = elementFormat;
        }
    }
    // Setup type otherwise
    if (!oneOf && type) {
        output.items.type = type;
        if (format) {
            output.items.format = format;
        }
    }
    else if (oneOf && type !== 'object') {
        output.items = {
            oneOf: [{ type }],
            required: output.items.required,
        };
    }
    // Process each item depending
    if (typeof output.items.oneOf !== 'undefined' || type === 'object') {
        for (let itemIndex = 0, itemLength = array.length; itemIndex < itemLength; itemIndex++) {
            const value = array[itemIndex];
            const itemType = getPropertyType(value);
            const itemFormat = getPropertyFormat(value);
            let arrayItem;
            if (itemType === 'object') {
                if (output.items.properties) {
                    output.items.required = getUniqueKeys(output.items.properties, value, output.items.required);
                }
                arrayItem = processObject(value, oneOf ? {} : output.items.properties, true);
            }
            else if (itemType === 'array') {
                arrayItem = processArray(value, oneOf ? {} : output.items.properties, true);
            }
            else {
                arrayItem = {};
                arrayItem.type = itemType;
                if (itemFormat) {
                    arrayItem.format = itemFormat;
                }
            }
            if (oneOf) {
                const childType = type_of_is_1.default.string(value).toLowerCase();
                const tempObj = {};
                if (!arrayItem.type && childType === 'object') {
                    tempObj.properties = arrayItem;
                    tempObj.type = 'object';
                    arrayItem = tempObj;
                }
                output.items.oneOf.push(arrayItem);
            }
            else {
                if (output.items.type !== 'object') {
                    continue;
                }
                output.items.properties = arrayItem;
            }
        }
    }
    return nested ? output.items : output;
}
function processObject(object, output, nested) {
    if (nested && output) {
        output = { properties: output };
    }
    else {
        output = output || {};
        output.type = getPropertyType(object);
        output.properties = output.properties || {};
        output.required = Object.keys(object);
    }
    for (const key in object) {
        const value = object[key];
        let type = getPropertyType(value);
        const format = getPropertyFormat(value);
        type = type === 'undefined' ? 'null' : type;
        if (type === 'object') {
            output.properties[key] = processObject(value, output.properties[key]);
            continue;
        }
        if (type === 'array') {
            output.properties[key] = processArray(value, output.properties[key]);
            continue;
        }
        if (output.properties[key]) {
            const entry = output.properties[key];
            const hasTypeArray = Array.isArray(entry.type);
            // When an array already exists, we check the existing
            // type array to see if it contains our current property
            // type, if not, we add it to the array and continue
            if (hasTypeArray && entry.type.indexOf(type) < 0) {
                entry.type.push(type);
            }
            // When multiple fields of differing types occur,
            // json schema states that the field must specify the
            // primitive types the field allows in array format.
            if (!hasTypeArray && entry.type !== type) {
                entry.type = [entry.type, type];
            }
            continue;
        }
        output.properties[key] = {};
        output.properties[key].type = type;
        if (format) {
            output.properties[key].format = format;
        }
    }
    return nested ? output.properties : output;
}
function Process(title, object) {
    let processOutput;
    const output = {
    // $schema: DRAFT,
    };
    // Determine title exists
    if (typeof title !== 'string') {
        object = title;
        title = undefined;
    }
    else {
        output.title = title;
    }
    // Set initial object type
    output.type = type_of_is_1.default.string(object).toLowerCase();
    // Process object
    if (output.type === 'object') {
        processOutput = processObject(object);
        output.type = processOutput.type;
        output.properties = processOutput.properties;
        output.required = Object.keys(object).filter(function (key) {
            return !key.startsWith('$');
        });
    }
    if (output.type === 'array') {
        processOutput = processArray(object);
        output.type = processOutput.type;
        output.items = processOutput.items;
        if (output.title) {
            output.items.title = output.title;
            output.title += ' Set';
        }
    }
    // Output
    return output;
}
exports["default"] = Process;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(352);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;