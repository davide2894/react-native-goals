"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devModeLog = void 0;
var devModeLog = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV === "production") {
        return function () { };
    }
    else {
        console.log.apply(console, args);
    }
};
exports.devModeLog = devModeLog;
