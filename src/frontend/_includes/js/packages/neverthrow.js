(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NT = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var defaultErrorConfig = {
    withStackTrace: false,
};
// Custom error object
// Context / discussion: https://github.com/supermacro/neverthrow/pull/215
var createNeverThrowError = function (message, result, config) {
    if (config === void 0) { config = defaultErrorConfig; }
    var data = result.isOk()
        ? { type: 'Ok', value: result.value }
        : { type: 'Err', value: result.error };
    var maybeStack = config.withStackTrace ? new Error().stack : undefined;
    return {
        data: data,
        message: message,
        stack: maybeStack,
    };
};

(function (Result) {
    /**
     * Wraps a function with a try catch, creating a new function with the same
     * arguments but returning `Ok` if successful, `Err` if the function throws
     *
     * @param fn function to wrap with ok on success or err on failure
     * @param errorFn when an error is thrown, this will wrap the error result if provided
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fromThrowable(fn, errorFn) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                var result = fn.apply(void 0, __spread(args));
                return ok(result);
            }
            catch (e) {
                return err(errorFn ? errorFn(e) : e);
            }
        };
    }
    Result.fromThrowable = fromThrowable;
})(exports.Result || (exports.Result = {}));
var ok = function (value) { return new Ok(value); };
var err = function (err) { return new Err(err); };
var Ok = /** @class */ (function () {
    function Ok(value) {
        this.value = value;
    }
    Ok.prototype.isOk = function () {
        return true;
    };
    Ok.prototype.isErr = function () {
        return !this.isOk();
    };
    Ok.prototype.map = function (f) {
        return ok(f(this.value));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Ok.prototype.mapErr = function (_f) {
        return ok(this.value);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Ok.prototype.andThen = function (f) {
        return f(this.value);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Ok.prototype.orElse = function (_f) {
        return ok(this.value);
    };
    Ok.prototype.asyncAndThen = function (f) {
        return f(this.value);
    };
    Ok.prototype.asyncMap = function (f) {
        return ResultAsync.fromSafePromise(f(this.value));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Ok.prototype.unwrapOr = function (_v) {
        return this.value;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Ok.prototype.match = function (ok, _err) {
        return ok(this.value);
    };
    Ok.prototype._unsafeUnwrap = function (_) {
        return this.value;
    };
    Ok.prototype._unsafeUnwrapErr = function (config) {
        throw createNeverThrowError('Called `_unsafeUnwrapErr` on an Ok', this, config);
    };
    return Ok;
}());
var Err = /** @class */ (function () {
    function Err(error) {
        this.error = error;
    }
    Err.prototype.isOk = function () {
        return false;
    };
    Err.prototype.isErr = function () {
        return !this.isOk();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Err.prototype.map = function (_f) {
        return err(this.error);
    };
    Err.prototype.mapErr = function (f) {
        return err(f(this.error));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Err.prototype.andThen = function (_f) {
        return err(this.error);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Err.prototype.orElse = function (f) {
        return f(this.error);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Err.prototype.asyncAndThen = function (_f) {
        return errAsync(this.error);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Err.prototype.asyncMap = function (_f) {
        return errAsync(this.error);
    };
    Err.prototype.unwrapOr = function (v) {
        return v;
    };
    Err.prototype.match = function (_ok, err) {
        return err(this.error);
    };
    Err.prototype._unsafeUnwrap = function (config) {
        throw createNeverThrowError('Called `_unsafeUnwrap` on an Err', this, config);
    };
    Err.prototype._unsafeUnwrapErr = function (_) {
        return this.error;
    };
    return Err;
}());
var fromThrowable = exports.Result.fromThrowable;

var ResultAsync = /** @class */ (function () {
    function ResultAsync(res) {
        this._promise = res;
    }
    ResultAsync.fromSafePromise = function (promise) {
        var newPromise = promise.then(function (value) { return new Ok(value); });
        return new ResultAsync(newPromise);
    };
    ResultAsync.fromPromise = function (promise, errorFn) {
        var newPromise = promise
            .then(function (value) { return new Ok(value); })["catch"](function (e) { return new Err(errorFn(e)); });
        return new ResultAsync(newPromise);
    };
    ResultAsync.prototype.map = function (f) {
        var _this = this;
        return new ResultAsync(this._promise.then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (res.isErr()) {
                            return [2 /*return*/, new Err(res.error)];
                        }
                        _a = Ok.bind;
                        return [4 /*yield*/, f(res.value)];
                    case 1: return [2 /*return*/, new (_a.apply(Ok, [void 0, _b.sent()]))()];
                }
            });
        }); }));
    };
    ResultAsync.prototype.mapErr = function (f) {
        var _this = this;
        return new ResultAsync(this._promise.then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (res.isOk()) {
                            return [2 /*return*/, new Ok(res.value)];
                        }
                        _a = Err.bind;
                        return [4 /*yield*/, f(res.error)];
                    case 1: return [2 /*return*/, new (_a.apply(Err, [void 0, _b.sent()]))()];
                }
            });
        }); }));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    ResultAsync.prototype.andThen = function (f) {
        return new ResultAsync(this._promise.then(function (res) {
            if (res.isErr()) {
                return new Err(res.error);
            }
            var newValue = f(res.value);
            return newValue instanceof ResultAsync ? newValue._promise : newValue;
        }));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    ResultAsync.prototype.orElse = function (f) {
        var _this = this;
        return new ResultAsync(this._promise.then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (res.isErr()) {
                    return [2 /*return*/, f(res.error)];
                }
                return [2 /*return*/, new Ok(res.value)];
            });
        }); }));
    };
    ResultAsync.prototype.match = function (ok, _err) {
        return this._promise.then(function (res) { return res.match(ok, _err); });
    };
    ResultAsync.prototype.unwrapOr = function (t) {
        return this._promise.then(function (res) { return res.unwrapOr(t); });
    };
    // Makes ResultAsync implement PromiseLike<Result>
    ResultAsync.prototype.then = function (successCallback, failureCallback) {
        return this._promise.then(successCallback, failureCallback);
    };
    return ResultAsync;
}());
var okAsync = function (value) {
    return new ResultAsync(Promise.resolve(new Ok(value)));
};
var errAsync = function (err) {
    return new ResultAsync(Promise.resolve(new Err(err)));
};
var fromPromise = ResultAsync.fromPromise;
var fromSafePromise = ResultAsync.fromSafePromise;

var appendValueToEndOfList = function (value) { return function (list) { return __spread(list, [value]); }; };
/**
 * Short circuits on the FIRST Err value that we find
 */
var combineResultList = function (resultList) {
    return resultList.reduce(function (acc, result) {
        return acc.isOk()
            ? result.isErr()
                ? err(result.error)
                : acc.map(appendValueToEndOfList(result.value))
            : acc;
    }, ok([]));
};
/* This is the typesafe version of Promise.all
 *
 * Takes a list of ResultAsync<T, E> and success if all inner results are Ok values
 * or fails if one (or more) of the inner results are Err values
 */
var combineResultAsyncList = function (asyncResultList) {
    return ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultList);
};
// eslint-disable-next-line
function combine(list) {
    if (list[0] instanceof ResultAsync) {
        return combineResultAsyncList(list);
    }
    else {
        return combineResultList(list);
    }
}
/**
 * Give a list of all the errors we find
 */
var combineResultListWithAllErrors = function (resultList) {
    return resultList.reduce(function (acc, result) {
        return result.isErr()
            ? acc.isErr()
                ? err(__spread(acc.error, [result.error]))
                : err([result.error])
            : acc.isErr()
                ? acc
                : ok(__spread(acc.value, [result.value]));
    }, ok([]));
};
var combineResultAsyncListWithAllErrors = function (asyncResultList) {
    return ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultListWithAllErrors);
};
// eslint-disable-next-line
function combineWithAllErrors(list) {
    if (list[0] instanceof ResultAsync) {
        return combineResultAsyncListWithAllErrors(list);
    }
    else {
        return combineResultListWithAllErrors(list);
    }
}

exports.Err = Err;
exports.Ok = Ok;
exports.ResultAsync = ResultAsync;
exports.combine = combine;
exports.combineWithAllErrors = combineWithAllErrors;
exports.err = err;
exports.errAsync = errAsync;
exports.fromPromise = fromPromise;
exports.fromSafePromise = fromSafePromise;
exports.fromThrowable = fromThrowable;
exports.ok = ok;
exports.okAsync = okAsync;

},{}]},{},[1])(1)
});
