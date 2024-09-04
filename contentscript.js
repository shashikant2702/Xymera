!function e(t, r, n) {
    function o(s, a) {
        if (!r[s]) {
            if (!t[s]) {
                var l = "function" == typeof require && require;
                if (!a && l)
                    return l(s, !0);
                if (i)
                    return i(s, !0);
                var c = new Error("Cannot find module '" + s + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            var u = r[s] = {
                exports: {}
            };
            t[s][0].call(u.exports, (function(e) {
                return o(t[s][1][e] || e)
            }
            ), u, u.exports, e, t, r, n)
        }
        return r[s].exports
    }
    for (var i = "function" == typeof require && require, s = 0; s < n.length; s++)
        o(n[s]);
    return o
}({
    1: [function(e, t, r) {
        "use strict";
        var n = e("@metamask/post-message-stream")
          , o = f(e("extension-port-stream"))
          , i = f(e("@metamask/object-multiplex"))
          , s = e("readable-stream")
          , a = f(e("webextension-polyfill"))
          , l = e("../../shared/constants/app")
          , c = e("../../shared/modules/browser-runtime.utils")
          , u = e("../../shared/modules/mv3.utils")
          , d = f(e("../../shared/modules/provider-injection"));
        function f(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        const h = "metamask-contentscript"
          , p = "metamask-inpage"
          , g = "metamask-phishing-warning-page"
          , m = "metamask-phishing-safelist"
          , b = "metamask-provider"
          , y = "provider"
          , v = "publicConfig";
        let w, _, E, S, A, R, M;
        const x = new URL("https://metamask.github.io/phishing-warning/v3.0.3/");
        let O, T, I, k, N, P, C, L, j, F, B, $, D;
        const U = () => {
            I = a.default.runtime.connect({
                name: h
            }),
            k = new o.default(I),
            T = new i.default,
            T.setMaxListeners(25),
            (0,
            s.pipeline)(T, k, T, (e => {
                K("MetaMask Background Multiplex", e),
                window.postMessage({
                    target: g,
                    data: {
                        name: m,
                        data: {
                            jsonrpc: "2.0",
                            method: "METAMASK_STREAM_FAILURE"
                        }
                    }
                }, window.location.origin)
            }
            )),
            O = T.createStream(m),
            (0,
            s.pipeline)(N, O, N, (e => console.debug(`MetaMask: Muxed traffic for channel "${m}" failed.`, e))),
            I.onDisconnect.addListener(W)
        }
          , W = () => {
            const e = (0,
            c.checkForLastError)();
            I.onDisconnect.removeListener(W),
            N.removeAllListeners(),
            T.removeAllListeners(),
            T.destroy(),
            O.removeAllListeners(),
            O.destroy(),
            k = null,
            e && (console.warn(`${e} Resetting the phishing streams.`),
            setTimeout(U, 1e3))
        }
          , V = e => {
            if (e.name === l.EXTENSION_MESSAGES.READY)
                return k || U(),
                Promise.resolve(`MetaMask: handled "${l.EXTENSION_MESSAGES.READY}" for phishing streams`)
        }
          , H = () => {
            !function() {
                const e = new n.WindowPostMessageStream({
                    name: h,
                    target: g
                });
                P = new i.default,
                P.setMaxListeners(25),
                (0,
                s.pipeline)(P, e, P, (e => K("MetaMask Inpage Multiplex", e))),
                N = P.createStream(m)
            }(),
            U(),
            a.default.runtime.onMessage.addListener(V)
        }
        ;
        let G = !1;
        const J = () => {
            G = !0,
            j = a.default.runtime.connect({
                name: h
            }),
            B = new o.default(j),
            B.on("data", Z),
            C = new i.default,
            C.setMaxListeners(25),
            C.ignoreStream(v),
            (0,
            s.pipeline)(C, B, C, (e => {
                K("MetaMask Background Multiplex", e),
                Q()
            }
            )),
            L = C.createStream(b),
            (0,
            s.pipeline)(D, L, D, (e => console.debug(`MetaMask: Muxed traffic for channel "${b}" failed.`, e))),
            F = C.createStream("phishing"),
            F.once("data", ee),
            j.onDisconnect.addListener(Y)
        }
          , z = () => {
            w = new i.default,
            w.setMaxListeners(25),
            M = new s.Transform({
                highWaterMark: 16,
                objectMode: !0,
                transform: (e, t, r) => {
                    var n;
                    (null == e ? void 0 : e.name) === b && "metamask_accountsChanged" === (null === (n = e.data) || void 0 === n ? void 0 : n.method) && (e.data.method = "wallet_accountsChanged",
                    e.data.result = e.data.params,
                    delete e.data.params),
                    r(null, e)
                }
            }),
            (0,
            s.pipeline)(w, B, M, w, (e => {
                K("MetaMask Background Legacy Multiplex", e),
                Q()
            }
            )),
            _ = w.createStream(b),
            (0,
            s.pipeline)(A, _, A, (e => console.debug(`MetaMask: Muxed traffic between channels "${y}" and "${b}" failed.`, e))),
            E = w.createStream(v),
            (0,
            s.pipeline)(R, E, R, (e => console.debug(`MetaMask: Muxed traffic for channel "${v}" failed.`, e)))
        }
          , q = e => {
            if (e.name === l.EXTENSION_MESSAGES.READY)
                return B || (J(),
                z()),
                Promise.resolve(`MetaMask: handled ${l.EXTENSION_MESSAGES.READY}`)
        }
          , Y = e => {
            const t = e || (0,
            c.checkForLastError)();
            j.onDisconnect.removeListener(Y),
            D.removeAllListeners(),
            C.removeAllListeners(),
            C.destroy(),
            L.removeAllListeners(),
            L.destroy(),
            B = null,
            A.removeAllListeners(),
            R.removeAllListeners(),
            w.removeAllListeners(),
            w.destroy(),
            _.removeAllListeners(),
            _.destroy(),
            E.removeAllListeners(),
            E.destroy(),
            t && (console.warn(`${t} Resetting the streams.`),
            setTimeout(J, 1e3))
        }
          , X = () => {
            ( () => {
                const e = new n.WindowPostMessageStream({
                    name: h,
                    target: p
                });
                $ = new i.default,
                $.setMaxListeners(25),
                (0,
                s.pipeline)($, e, $, (e => K("MetaMask Inpage Multiplex", e))),
                D = $.createStream(b)
            }
            )(),
            ( () => {
                const e = new n.WindowPostMessageStream({
                    name: "contentscript",
                    target: "inpage"
                });
                S = new i.default,
                S.setMaxListeners(25),
                (0,
                s.pipeline)(S, e, S, (e => K("MetaMask Legacy Inpage Multiplex", e))),
                A = S.createStream(y),
                R = S.createStream(v)
            }
            )(),
            J(),
            z(),
            a.default.runtime.onMessage.addListener(q)
        }
        ;
        function K(e, t) {
            console.debug(`MetaMask: Content script lost connection to "${e}".`, t)
        }
        function Z(e) {
            G && u.isManifestV3 && "metamask_chainChanged" === e.data.method && (G = !1,
            window.postMessage({
                target: p,
                data: {
                    name: b,
                    data: {
                        jsonrpc: "2.0",
                        method: "METAMASK_EXTENSION_CONNECT_CAN_RETRY"
                    }
                }
            }, window.location.origin))
        }
        function Q() {
            window.postMessage({
                target: p,
                data: {
                    name: b,
                    data: {
                        jsonrpc: "2.0",
                        method: "METAMASK_STREAM_FAILURE"
                    }
                }
            }, window.location.origin)
        }
        function ee() {
            console.debug("MetaMask: Routing to Phishing Warning page.");
            const {hostname: e, href: t} = window.location
              , r = new URLSearchParams({
                hostname: e,
                href: t
            });
            for (window.location.href = `https://metamask.github.io/phishing-warning/v3.0.3/#${r}`; ; )
                console.log("MetaMask: Locking js execution, redirection will complete shortly")
        }
        window.location.origin === x.origin && window.location.pathname === x.pathname ? H() : (0,
        d.default)() && (X(),
        document.prerendering && (0,
        c.getIsBrowserPrerenderBroken)() && document.addEventListener("prerenderingchange", ( () => {
            Y(new Error("Prerendered page has become active."))
        }
        )))
    }
    , {
        "../../shared/constants/app": 155,
        "../../shared/modules/browser-runtime.utils": 158,
        "../../shared/modules/mv3.utils": 159,
        "../../shared/modules/provider-injection": 160,
        "@metamask/object-multiplex": 4,
        "@metamask/post-message-stream": 8,
        "extension-port-stream": 55,
        "readable-stream": 103,
        "webextension-polyfill": 153
    }],
    2: [function(e, t, r) {
        "use strict";
        var n = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.ObjectMultiplex = void 0;
        const o = e("readable-stream")
          , i = n(e("once"))
          , s = e("./Substream")
          , a = Symbol("IGNORE_SUBSTREAM");
        class l extends o.Duplex {
            constructor(e={}) {
                super(Object.assign(Object.assign({}, e), {
                    objectMode: !0
                })),
                this._substreams = {}
            }
            createStream(e) {
                if (this.destroyed)
                    throw new Error(`ObjectMultiplex - parent stream for name "${e}" already destroyed`);
                if (this._readableState.ended || this._writableState.ended)
                    throw new Error(`ObjectMultiplex - parent stream for name "${e}" already ended`);
                if (!e)
                    throw new Error("ObjectMultiplex - name must not be empty");
                if (this._substreams[e])
                    throw new Error(`ObjectMultiplex - Substream for name "${e}" already exists`);
                const t = new s.Substream({
                    parent: this,
                    name: e
                });
                return this._substreams[e] = t,
                function(e, t) {
                    const r = (0,
                    i.default)(t);
                    (0,
                    o.finished)(e, {
                        readable: !1
                    }, r),
                    (0,
                    o.finished)(e, {
                        writable: !1
                    }, r)
                }(this, (e => t.destroy(e || void 0))),
                t
            }
            ignoreStream(e) {
                if (!e)
                    throw new Error("ObjectMultiplex - name must not be empty");
                if (this._substreams[e])
                    throw new Error(`ObjectMultiplex - Substream for name "${e}" already exists`);
                this._substreams[e] = a
            }
            _read() {}
            _write(e, t, r) {
                const {name: n, data: o} = e;
                if (!n)
                    return console.warn(`ObjectMultiplex - malformed chunk without name "${e}"`),
                    r();
                const i = this._substreams[n];
                return i ? (i !== a && i.push(o),
                r()) : (console.warn(`ObjectMultiplex - orphaned data for stream "${n}"`),
                r())
            }
        }
        r.ObjectMultiplex = l
    }
    , {
        "./Substream": 3,
        once: 84,
        "readable-stream": 103
    }],
    3: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.Substream = void 0;
        const n = e("readable-stream");
        class o extends n.Duplex {
            constructor({parent: e, name: t}) {
                super({
                    objectMode: !0
                }),
                this._parent = e,
                this._name = t
            }
            _read() {}
            _write(e, t, r) {
                this._parent.push({
                    name: this._name,
                    data: e
                }),
                r()
            }
        }
        r.Substream = o
    }
    , {
        "readable-stream": 103
    }],
    4: [function(e, t, r) {
        "use strict";
        const n = e("./ObjectMultiplex");
        t.exports = n.ObjectMultiplex
    }
    , {
        "./ObjectMultiplex": 2
    }],
    5: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.BasePostMessageStream = void 0;
        const n = e("readable-stream")
          , o = () => {}
          , i = "SYN"
          , s = "ACK";
        class a extends n.Duplex {
            constructor(e) {
                super(Object.assign({
                    objectMode: !0
                }, e)),
                this._init = !1,
                this._haveSyn = !1,
                this._log = () => null
            }
            _handshake() {
                this._write(i, null, o),
                this.cork()
            }
            _onData(e) {
                if (this._init)
                    try {
                        this.push(e),
                        this._log(e, !1)
                    } catch (e) {
                        this.emit("error", e)
                    }
                else
                    e === i ? (this._haveSyn = !0,
                    this._write(s, null, o)) : e === s && (this._init = !0,
                    this._haveSyn || this._write(s, null, o),
                    this.uncork())
            }
            _read() {}
            _write(e, t, r) {
                e !== s && e !== i && this._log(e, !0),
                this._postMessage(e),
                r()
            }
            _setLogger(e) {
                this._log = e
            }
        }
        r.BasePostMessageStream = a
    }
    , {
        "readable-stream": 103
    }],
    6: [function(e, t, r) {
        "use strict";
        var n = this && this.__rest || function(e, t) {
            var r = {};
            for (var n in e)
                Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
            if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                var o = 0;
                for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
                    t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]])
            }
            return r
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WebWorkerParentPostMessageStream = void 0;
        const o = e("../BasePostMessageStream")
          , i = e("../utils");
        class s extends o.BasePostMessageStream {
            constructor(e) {
                var {worker: t} = e;
                super(n(e, ["worker"])),
                this._target = i.DEDICATED_WORKER_NAME,
                this._worker = t,
                this._worker.onmessage = this._onMessage.bind(this),
                this._handshake()
            }
            _postMessage(e) {
                this._worker.postMessage({
                    target: this._target,
                    data: e
                })
            }
            _onMessage(e) {
                const t = e.data;
                (0,
                i.isValidStreamMessage)(t) && this._onData(t.data)
            }
            _destroy() {
                this._worker.onmessage = null,
                this._worker = null
            }
        }
        r.WebWorkerParentPostMessageStream = s
    }
    , {
        "../BasePostMessageStream": 5,
        "../utils": 10
    }],
    7: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WebWorkerPostMessageStream = void 0;
        const n = e("../BasePostMessageStream")
          , o = e("../utils");
        class i extends n.BasePostMessageStream {
            constructor(e={}) {
                if ("undefined" == typeof self || "undefined" == typeof WorkerGlobalScope)
                    throw new Error("WorkerGlobalScope not found. This class should only be instantiated in a WebWorker.");
                super(e),
                this._name = o.DEDICATED_WORKER_NAME,
                self.addEventListener("message", this._onMessage.bind(this)),
                this._handshake()
            }
            _postMessage(e) {
                self.postMessage({
                    data: e
                })
            }
            _onMessage(e) {
                const t = e.data;
                (0,
                o.isValidStreamMessage)(t) && t.target === this._name && this._onData(t.data)
            }
            _destroy() {}
        }
        r.WebWorkerPostMessageStream = i
    }
    , {
        "../BasePostMessageStream": 5,
        "../utils": 10
    }],
    8: [function(e, t, r) {
        "use strict";
        var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
            void 0 === n && (n = r),
            Object.defineProperty(e, n, {
                enumerable: !0,
                get: function() {
                    return t[r]
                }
            })
        }
        : function(e, t, r, n) {
            void 0 === n && (n = r),
            e[n] = t[r]
        }
        )
          , o = this && this.__exportStar || function(e, t) {
            for (var r in e)
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        o(e("./window/WindowPostMessageStream"), r),
        o(e("./WebWorker/WebWorkerPostMessageStream"), r),
        o(e("./WebWorker/WebWorkerParentPostMessageStream"), r),
        o(e("./runtime/BrowserRuntimePostMessageStream"), r),
        o(e("./BasePostMessageStream"), r)
    }
    , {
        "./BasePostMessageStream": 5,
        "./WebWorker/WebWorkerParentPostMessageStream": 6,
        "./WebWorker/WebWorkerPostMessageStream": 7,
        "./runtime/BrowserRuntimePostMessageStream": 9,
        "./window/WindowPostMessageStream": 11
    }],
    9: [function(e, t, r) {
        "use strict";
        var n, o, i = this && this.__classPrivateFieldSet || function(e, t, r, n, o) {
            if ("m" === n)
                throw new TypeError("Private method is not writable");
            if ("a" === n && !o)
                throw new TypeError("Private accessor was defined without a setter");
            if ("function" == typeof t ? e !== t || !o : !t.has(e))
                throw new TypeError("Cannot write private member to an object whose class did not declare it");
            return "a" === n ? o.call(e, r) : o ? o.value = r : t.set(e, r),
            r
        }
        , s = this && this.__classPrivateFieldGet || function(e, t, r, n) {
            if ("a" === r && !n)
                throw new TypeError("Private accessor was defined without a getter");
            if ("function" == typeof t ? e !== t || !n : !t.has(e))
                throw new TypeError("Cannot read private member from an object whose class did not declare it");
            return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e)
        }
        , a = this && this.__rest || function(e, t) {
            var r = {};
            for (var n in e)
                Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
            if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                var o = 0;
                for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
                    t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]])
            }
            return r
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.BrowserRuntimePostMessageStream = void 0;
        const l = e("../BasePostMessageStream")
          , c = e("../utils");
        class u extends l.BasePostMessageStream {
            constructor(e) {
                var {name: t, target: r} = e;
                super(a(e, ["name", "target"])),
                n.set(this, void 0),
                o.set(this, void 0),
                i(this, n, t, "f"),
                i(this, o, r, "f"),
                this._onMessage = this._onMessage.bind(this),
                this._getRuntime().onMessage.addListener(this._onMessage),
                this._handshake()
            }
            _postMessage(e) {
                this._getRuntime().sendMessage({
                    target: s(this, o, "f"),
                    data: e
                })
            }
            _onMessage(e) {
                (0,
                c.isValidStreamMessage)(e) && e.target === s(this, n, "f") && this._onData(e.data)
            }
            _getRuntime() {
                var e, t;
                if ("chrome"in globalThis && "function" == typeof (null === (e = null === chrome || void 0 === chrome ? void 0 : chrome.runtime) || void 0 === e ? void 0 : e.sendMessage))
                    return chrome.runtime;
                if ("browser"in globalThis && "function" == typeof (null === (t = null === browser || void 0 === browser ? void 0 : browser.runtime) || void 0 === t ? void 0 : t.sendMessage))
                    return browser.runtime;
                throw new Error("browser.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.")
            }
            _destroy() {
                this._getRuntime().onMessage.removeListener(this._onMessage)
            }
        }
        r.BrowserRuntimePostMessageStream = u,
        n = new WeakMap,
        o = new WeakMap
    }
    , {
        "../BasePostMessageStream": 5,
        "../utils": 10
    }],
    10: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.isValidStreamMessage = r.DEDICATED_WORKER_NAME = void 0;
        const n = e("@metamask/utils");
        r.DEDICATED_WORKER_NAME = "dedicatedWorker",
        r.isValidStreamMessage = function(e) {
            return (0,
            n.isObject)(e) && Boolean(e.data) && ("number" == typeof e.data || "object" == typeof e.data || "string" == typeof e.data)
        }
    }
    , {
        "@metamask/utils": 39
    }],
    11: [function(e, t, r) {
        "use strict";
        var n, o, i = this && this.__rest || function(e, t) {
            var r = {};
            for (var n in e)
                Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
            if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                var o = 0;
                for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
                    t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]])
            }
            return r
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WindowPostMessageStream = void 0;
        const s = e("@metamask/utils")
          , a = e("../BasePostMessageStream")
          , l = e("../utils")
          , c = null === (n = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "source")) || void 0 === n ? void 0 : n.get;
        (0,
        s.assert)(c, "MessageEvent.prototype.source getter is not defined.");
        const u = null === (o = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "origin")) || void 0 === o ? void 0 : o.get;
        (0,
        s.assert)(u, "MessageEvent.prototype.origin getter is not defined.");
        class d extends a.BasePostMessageStream {
            constructor(e) {
                var {name: t, target: r, targetOrigin: n=location.origin, targetWindow: o=window} = e;
                if (super(i(e, ["name", "target", "targetOrigin", "targetWindow"])),
                "undefined" == typeof window || "function" != typeof window.postMessage)
                    throw new Error("window.postMessage is not a function. This class should only be instantiated in a Window.");
                this._name = t,
                this._target = r,
                this._targetOrigin = n,
                this._targetWindow = o,
                this._onMessage = this._onMessage.bind(this),
                window.addEventListener("message", this._onMessage, !1),
                this._handshake()
            }
            _postMessage(e) {
                this._targetWindow.postMessage({
                    target: this._target,
                    data: e
                }, this._targetOrigin)
            }
            _onMessage(e) {
                const t = e.data;
                "*" !== this._targetOrigin && u.call(e) !== this._targetOrigin || c.call(e) !== this._targetWindow || !(0,
                l.isValidStreamMessage)(t) || t.target !== this._name || this._onData(t.data)
            }
            _destroy() {
                window.removeEventListener("message", this._onMessage, !1)
            }
        }
        r.WindowPostMessageStream = d
    }
    , {
        "../BasePostMessageStream": 5,
        "../utils": 10,
        "@metamask/utils": 39
    }],
    12: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, o = e("./chunk-LIUXO4DW.js"), i = e("@metamask/utils"), s = e("fast-safe-stringify"), a = (n = s) && n.__esModule ? n : {
            default: n
        }, l = class extends Error {
            constructor(e, t, r) {
                if (!Number.isInteger(e))
                    throw new Error('"code" must be an integer.');
                if (!t || "string" != typeof t)
                    throw new Error('"message" must be a non-empty string.');
                super(t),
                this.code = e,
                void 0 !== r && (this.data = r)
            }
            serialize() {
                const e = {
                    code: this.code,
                    message: this.message
                };
                return void 0 !== this.data && (e.data = this.data,
                i.isPlainObject.call(void 0, this.data) && (e.data.cause = o.serializeCause.call(void 0, this.data.cause))),
                this.stack && (e.stack = this.stack),
                e
            }
            toString() {
                return a.default.call(void 0, this.serialize(), c, 2)
            }
        }
        ;
        function c(e, t) {
            if ("[Circular]" !== t)
                return t
        }
        r.JsonRpcError = l,
        r.EthereumProviderError = class extends l {
            constructor(e, t, r) {
                if (!function(e) {
                    return Number.isInteger(e) && e >= 1e3 && e <= 4999
                }(e))
                    throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
                super(e, t, r)
            }
        }
    }
    , {
        "./chunk-LIUXO4DW.js": 15,
        "@metamask/utils": 39,
        "fast-safe-stringify": 80
    }],
    13: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        r.errorCodes = {
            rpc: {
                invalidInput: -32e3,
                resourceNotFound: -32001,
                resourceUnavailable: -32002,
                transactionRejected: -32003,
                methodNotSupported: -32004,
                limitExceeded: -32005,
                parse: -32700,
                invalidRequest: -32600,
                methodNotFound: -32601,
                invalidParams: -32602,
                internal: -32603
            },
            provider: {
                userRejectedRequest: 4001,
                unauthorized: 4100,
                unsupportedMethod: 4200,
                disconnected: 4900,
                chainDisconnected: 4901
            }
        },
        r.errorValues = {
            "-32700": {
                standard: "JSON RPC 2.0",
                message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
            },
            "-32600": {
                standard: "JSON RPC 2.0",
                message: "The JSON sent is not a valid Request object."
            },
            "-32601": {
                standard: "JSON RPC 2.0",
                message: "The method does not exist / is not available."
            },
            "-32602": {
                standard: "JSON RPC 2.0",
                message: "Invalid method parameter(s)."
            },
            "-32603": {
                standard: "JSON RPC 2.0",
                message: "Internal JSON-RPC error."
            },
            "-32000": {
                standard: "EIP-1474",
                message: "Invalid input."
            },
            "-32001": {
                standard: "EIP-1474",
                message: "Resource not found."
            },
            "-32002": {
                standard: "EIP-1474",
                message: "Resource unavailable."
            },
            "-32003": {
                standard: "EIP-1474",
                message: "Transaction rejected."
            },
            "-32004": {
                standard: "EIP-1474",
                message: "Method not supported."
            },
            "-32005": {
                standard: "EIP-1474",
                message: "Request limit exceeded."
            },
            4001: {
                standard: "EIP-1193",
                message: "User rejected the request."
            },
            4100: {
                standard: "EIP-1193",
                message: "The requested account and/or method has not been authorized by the user."
            },
            4200: {
                standard: "EIP-1193",
                message: "The requested method is not supported by this Ethereum provider."
            },
            4900: {
                standard: "EIP-1193",
                message: "The provider is disconnected from all chains."
            },
            4901: {
                standard: "EIP-1193",
                message: "The provider is disconnected from the specified chain."
            }
        }
    }
    , {}],
    14: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return null != e ? e : t()
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var o = e("./chunk-77LIU62I.js")
          , i = e("./chunk-LIUXO4DW.js")
          , s = e("./chunk-FBHPY3A4.js")
          , a = {
            parse: e => c(s.errorCodes.rpc.parse, e),
            invalidRequest: e => c(s.errorCodes.rpc.invalidRequest, e),
            invalidParams: e => c(s.errorCodes.rpc.invalidParams, e),
            methodNotFound: e => c(s.errorCodes.rpc.methodNotFound, e),
            internal: e => c(s.errorCodes.rpc.internal, e),
            server: e => {
                if (!e || "object" != typeof e || Array.isArray(e))
                    throw new Error("Ethereum RPC Server errors must provide single object argument.");
                const {code: t} = e;
                if (!Number.isInteger(t) || t > -32005 || t < -32099)
                    throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
                return c(t, e)
            }
            ,
            invalidInput: e => c(s.errorCodes.rpc.invalidInput, e),
            resourceNotFound: e => c(s.errorCodes.rpc.resourceNotFound, e),
            resourceUnavailable: e => c(s.errorCodes.rpc.resourceUnavailable, e),
            transactionRejected: e => c(s.errorCodes.rpc.transactionRejected, e),
            methodNotSupported: e => c(s.errorCodes.rpc.methodNotSupported, e),
            limitExceeded: e => c(s.errorCodes.rpc.limitExceeded, e)
        }
          , l = {
            userRejectedRequest: e => u(s.errorCodes.provider.userRejectedRequest, e),
            unauthorized: e => u(s.errorCodes.provider.unauthorized, e),
            unsupportedMethod: e => u(s.errorCodes.provider.unsupportedMethod, e),
            disconnected: e => u(s.errorCodes.provider.disconnected, e),
            chainDisconnected: e => u(s.errorCodes.provider.chainDisconnected, e),
            custom: e => {
                if (!e || "object" != typeof e || Array.isArray(e))
                    throw new Error("Ethereum Provider custom errors must provide single object argument.");
                const {code: t, message: r, data: n} = e;
                if (!r || "string" != typeof r)
                    throw new Error('"message" must be a nonempty string');
                return new (0,
                o.EthereumProviderError)(t,r,n)
            }
        };
        function c(e, t) {
            const [r,s] = d(t);
            return new (0,
            o.JsonRpcError)(e,n(r, ( () => i.getMessageFromCode.call(void 0, e))),s)
        }
        function u(e, t) {
            const [r,s] = d(t);
            return new (0,
            o.EthereumProviderError)(e,n(r, ( () => i.getMessageFromCode.call(void 0, e))),s)
        }
        function d(e) {
            if (e) {
                if ("string" == typeof e)
                    return [e];
                if ("object" == typeof e && !Array.isArray(e)) {
                    const {message: t, data: r} = e;
                    if (t && "string" != typeof t)
                        throw new Error("Must specify string message.");
                    return [n(t, ( () => {}
                    )), r]
                }
            }
            return []
        }
        r.rpcErrors = a,
        r.providerErrors = l
    }
    , {
        "./chunk-77LIU62I.js": 12,
        "./chunk-FBHPY3A4.js": 13,
        "./chunk-LIUXO4DW.js": 15
    }],
    15: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-FBHPY3A4.js")
          , o = e("@metamask/utils")
          , i = n.errorCodes.rpc.internal
          , s = {
            code: i,
            message: l(i)
        }
          , a = "Unspecified server error.";
        function l(e, t="Unspecified error message. This is a bug, please report it.") {
            if (c(e)) {
                const t = e.toString();
                if (o.hasProperty.call(void 0, n.errorValues, t))
                    return n.errorValues[t].message;
                if (function(e) {
                    return e >= -32099 && e <= -32e3
                }(e))
                    return a
            }
            return t
        }
        function c(e) {
            return Number.isInteger(e)
        }
        function u(e) {
            return Array.isArray(e) ? e.map((e => o.isValidJson.call(void 0, e) ? e : o.isObject.call(void 0, e) ? d(e) : null)) : o.isObject.call(void 0, e) ? d(e) : o.isValidJson.call(void 0, e) ? e : null
        }
        function d(e) {
            return Object.getOwnPropertyNames(e).reduce(( (t, r) => {
                const n = e[r];
                return o.isValidJson.call(void 0, n) && (t[r] = n),
                t
            }
            ), {})
        }
        r.JSON_RPC_SERVER_ERROR_MESSAGE = a,
        r.getMessageFromCode = l,
        r.isValidCode = c,
        r.serializeError = function(e, {fallbackError: t=s, shouldIncludeStack: r=!0}={}) {
            if (!o.isJsonRpcError.call(void 0, t))
                throw new Error("Must provide fallback error with integer number code and string message.");
            const n = function(e, t) {
                if (e && "object" == typeof e && "serialize"in e && "function" == typeof e.serialize)
                    return e.serialize();
                if (o.isJsonRpcError.call(void 0, e))
                    return e;
                const r = u(e)
                  , n = {
                    ...t,
                    data: {
                        cause: r
                    }
                };
                return n
            }(e, t);
            return r || delete n.stack,
            n
        }
        ,
        r.serializeCause = u
    }
    , {
        "./chunk-FBHPY3A4.js": 13,
        "@metamask/utils": 39
    }],
    16: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-I3KUC4QQ.js")
          , o = e("./chunk-77LIU62I.js")
          , i = e("./chunk-LIUXO4DW.js")
          , s = e("./chunk-FBHPY3A4.js");
        r.EthereumProviderError = o.EthereumProviderError,
        r.JsonRpcError = o.JsonRpcError,
        r.errorCodes = s.errorCodes,
        r.getMessageFromCode = i.getMessageFromCode,
        r.providerErrors = n.providerErrors,
        r.rpcErrors = n.rpcErrors,
        r.serializeCause = i.serializeCause,
        r.serializeError = i.serializeError
    }
    , {
        "./chunk-77LIU62I.js": 12,
        "./chunk-FBHPY3A4.js": 13,
        "./chunk-I3KUC4QQ.js": 14,
        "./chunk-LIUXO4DW.js": 15
    }],
    17: [function(e, t, r) {
        "use strict";
        var n, o, i, s, a, l = Object.defineProperty, c = Object.getOwnPropertyDescriptor, u = Object.getOwnPropertyNames, d = Object.prototype.hasOwnProperty, f = (e, t, r) => {
            if (!t.has(e))
                throw TypeError("Cannot " + r)
        }
        , h = (e, t, r) => (f(e, t, "read from private field"),
        r ? r.call(e) : t.get(e)), p = (e, t, r) => {
            if (t.has(e))
                throw TypeError("Cannot add the same private member more than once");
            t instanceof WeakSet ? t.add(e) : t.set(e, r)
        }
        , g = (e, t, r, n) => (f(e, t, "write to private field"),
        n ? n.call(e, r) : t.set(e, r),
        r), m = {};
        ( (e, t) => {
            for (var r in t)
                l(e, r, {
                    get: t[r],
                    enumerable: !0
                })
        }
        )(m, {
            AddressStruct: () => ie,
            AuxiliaryFileEncoding: () => ct,
            ButtonClickEventStruct: () => ot,
            ButtonStruct: () => Se,
            ButtonType: () => Ee,
            ButtonVariant: () => _e,
            ChainDisconnectedError: () => G,
            ComponentOrElementStruct: () => Ht,
            ComponentStruct: () => ze,
            CopyableStruct: () => le,
            DialogType: () => lt,
            DisconnectedError: () => J,
            DividerStruct: () => de,
            FormComponentStruct: () => Ie,
            FormStateStruct: () => Wt,
            FormStruct: () => ke,
            FormSubmitEventStruct: () => it,
            GenericEventStruct: () => nt,
            HeadingStruct: () => pe,
            ImageStruct: () => be,
            InputChangeEventStruct: () => st,
            InputStruct: () => Oe,
            InputType: () => xe,
            InterfaceContextStruct: () => Gt,
            InterfaceStateStruct: () => Vt,
            InternalError: () => C,
            InvalidInputError: () => L,
            InvalidParamsError: () => j,
            InvalidRequestError: () => F,
            LimitExceededError: () => B,
            ManageStateOperation: () => ut,
            MethodNotFoundError: () => $,
            MethodNotSupportedError: () => D,
            NodeType: () => re,
            NotificationType: () => dt,
            PanelStruct: () => Ge,
            ParseError: () => U,
            ResourceNotFoundError: () => W,
            ResourceUnavailableError: () => V,
            RowStruct: () => $e,
            RowVariant: () => Fe,
            SNAP_ERROR_CODE: () => w,
            SNAP_ERROR_MESSAGE: () => _,
            SeverityLevel: () => et,
            SnapError: () => b,
            SpinnerStruct: () => We,
            TextStruct: () => Le,
            TransactionRejected: () => H,
            UnauthorizedError: () => z,
            UnsupportedMethodError: () => q,
            UserInputEventStruct: () => at,
            UserInputEventType: () => rt,
            UserRejectedRequestError: () => Y,
            address: () => se,
            assert: () => N.assert,
            assertIsComponent: () => Ke,
            button: () => Ae,
            copyable: () => ce,
            divider: () => fe,
            enumValue: () => O,
            form: () => Ne,
            getErrorData: () => A,
            getErrorMessage: () => E,
            getErrorStack: () => S,
            getImageComponent: () => Qe,
            getImageData: () => Ze,
            heading: () => ge,
            image: () => ye,
            input: () => Te,
            isComponent: () => Xe,
            literal: () => M,
            panel: () => Je,
            row: () => De,
            spinner: () => Ve,
            text: () => je,
            union: () => x
        }),
        t.exports = (n = m,
        ( (e, t, r, n) => {
            if (t && "object" == typeof t || "function" == typeof t)
                for (let o of u(t))
                    d.call(e, o) || o === r || l(e, o, {
                        get: () => t[o],
                        enumerable: !(n = c(t, o)) || n.enumerable
                    });
            return e
        }
        )(l({}, "__esModule", {
            value: !0
        }), n));
        var b = class extends Error {
            constructor(e, t={}) {
                const r = E(e);
                super(r),
                p(this, o, void 0),
                p(this, i, void 0),
                p(this, s, void 0),
                p(this, a, void 0),
                g(this, i, r),
                g(this, o, function(e) {
                    if ((0,
                    v.isObject)(e) && (0,
                    v.hasProperty)(e, "code") && "number" == typeof e.code && Number.isInteger(e.code))
                        return e.code;
                    return -32603
                }(e));
                const n = {
                    ...A(e),
                    ...t
                };
                Object.keys(n).length > 0 && g(this, s, n),
                g(this, a, super.stack)
            }
            get name() {
                return "SnapError"
            }
            get code() {
                return h(this, o)
            }
            get message() {
                return h(this, i)
            }
            get data() {
                return h(this, s)
            }
            get stack() {
                return h(this, a)
            }
            toJSON() {
                return {
                    code: w,
                    message: _,
                    data: {
                        cause: {
                            code: this.code,
                            message: this.message,
                            stack: this.stack,
                            ...this.data ? {
                                data: this.data
                            } : {}
                        }
                    }
                }
            }
            serialize() {
                return this.toJSON()
            }
        }
        ;
        function y(e) {
            return class extends b {
                constructor(t, r) {
                    if ("object" == typeof t) {
                        const r = e();
                        return void super({
                            code: r.code,
                            message: r.message,
                            data: t
                        })
                    }
                    const n = e(t);
                    super({
                        code: n.code,
                        message: n.message,
                        data: r
                    })
                }
            }
        }
        o = new WeakMap,
        i = new WeakMap,
        s = new WeakMap,
        a = new WeakMap;
        var v = e("@metamask/utils")
          , w = -31002
          , _ = "Snap Error";
        function E(e) {
            return (0,
            v.isObject)(e) && (0,
            v.hasProperty)(e, "message") && "string" == typeof e.message ? e.message : String(e)
        }
        function S(e) {
            if ((0,
            v.isObject)(e) && (0,
            v.hasProperty)(e, "stack") && "string" == typeof e.stack)
                return e.stack
        }
        function A(e) {
            return (0,
            v.isObject)(e) && (0,
            v.hasProperty)(e, "data") && "object" == typeof e.data && null !== e.data && (0,
            v.isValidJson)(e.data) && !Array.isArray(e.data) ? e.data : {}
        }
        var R = e("superstruct");
        function M(e) {
            return (0,
            R.define)(JSON.stringify(e), (0,
            R.literal)(e).validator)
        }
        function x([e,...t]) {
            const r = (0,
            R.union)([e, ...t]);
            return new R.Struct({
                ...r,
                schema: [e, ...t]
            })
        }
        function O(e) {
            return M(e)
        }
        function T(e) {
            return x(e)
        }
        var I = e("superstruct");
        function k() {
            return (0,
            I.refine)((0,
            I.string)(), "SVG", (e => !!e.includes("<svg") || "Value is not a valid SVG."))
        }
        var N = e("@metamask/utils")
          , P = e("@metamask/rpc-errors")
          , C = y(P.rpcErrors.internal)
          , L = y(P.rpcErrors.invalidInput)
          , j = y(P.rpcErrors.invalidParams)
          , F = y(P.rpcErrors.invalidRequest)
          , B = y(P.rpcErrors.limitExceeded)
          , $ = y(P.rpcErrors.methodNotFound)
          , D = y(P.rpcErrors.methodNotSupported)
          , U = y(P.rpcErrors.parse)
          , W = y(P.rpcErrors.resourceNotFound)
          , V = y(P.rpcErrors.resourceUnavailable)
          , H = y(P.rpcErrors.transactionRejected)
          , G = y(P.providerErrors.chainDisconnected)
          , J = y(P.providerErrors.disconnected)
          , z = y(P.providerErrors.unauthorized)
          , q = y(P.providerErrors.unsupportedMethod)
          , Y = y(P.providerErrors.userRejectedRequest)
          , X = e("@metamask/utils")
          , K = e("@metamask/utils")
          , Z = e("superstruct")
          , Q = e("@metamask/utils");
        function ee(e, t, r=[]) {
            return (...n) => {
                if (1 === n.length && (0,
                Q.isPlainObject)(n[0])) {
                    const r = {
                        ...n[0],
                        type: e
                    };
                    return (0,
                    Q.assertStruct)(r, t, `Invalid ${e} component`),
                    r
                }
                const o = r.reduce(( (e, t, r) => void 0 !== n[r] ? {
                    ...e,
                    [t]: n[r]
                } : e), {
                    type: e
                });
                return (0,
                Q.assertStruct)(o, t, `Invalid ${e} component`),
                o
            }
        }
        var te = e("superstruct")
          , re = (e => (e.Copyable = "copyable",
        e.Divider = "divider",
        e.Heading = "heading",
        e.Panel = "panel",
        e.Spinner = "spinner",
        e.Text = "text",
        e.Image = "image",
        e.Row = "row",
        e.Address = "address",
        e.Button = "button",
        e.Input = "input",
        e.Form = "form",
        e))(re || {})
          , ne = (0,
        te.object)({
            type: (0,
            te.string)()
        })
          , oe = (0,
        te.assign)(ne, (0,
        te.object)({
            value: (0,
            te.unknown)()
        }))
          , ie = (0,
        Z.assign)(oe, (0,
        Z.object)({
            type: (0,
            Z.literal)("address"),
            value: K.HexChecksumAddressStruct
        }))
          , se = ee("address", ie, ["value"])
          , ae = e("superstruct")
          , le = (0,
        ae.assign)(oe, (0,
        ae.object)({
            type: (0,
            ae.literal)("copyable"),
            value: (0,
            ae.string)(),
            sensitive: (0,
            ae.optional)((0,
            ae.boolean)())
        }))
          , ce = ee("copyable", le, ["value", "sensitive"])
          , ue = e("superstruct")
          , de = (0,
        ue.assign)(ne, (0,
        ue.object)({
            type: (0,
            ue.literal)("divider")
        }))
          , fe = ee("divider", de)
          , he = e("superstruct")
          , pe = (0,
        he.assign)(oe, (0,
        he.object)({
            type: (0,
            he.literal)("heading"),
            value: (0,
            he.string)()
        }))
          , ge = ee("heading", pe, ["value"])
          , me = e("superstruct")
          , be = (0,
        me.assign)(ne, (0,
        me.object)({
            type: (0,
            me.literal)("image"),
            value: k()
        }))
          , ye = ee("image", be, ["value"])
          , ve = e("superstruct")
          , we = e("superstruct")
          , _e = (e => (e.Primary = "primary",
        e.Secondary = "secondary",
        e))(_e || {})
          , Ee = (e => (e.Button = "button",
        e.Submit = "submit",
        e))(Ee || {})
          , Se = (0,
        we.assign)(oe, (0,
        we.object)({
            type: (0,
            we.literal)("button"),
            value: (0,
            we.string)(),
            variant: (0,
            we.optional)((0,
            we.union)([O("primary"), O("secondary")])),
            buttonType: (0,
            we.optional)((0,
            we.union)([O("button"), O("submit")])),
            name: (0,
            we.optional)((0,
            we.string)())
        }))
          , Ae = ee("button", Se, ["value", "buttonType", "name", "variant"])
          , Re = e("superstruct")
          , Me = e("superstruct")
          , xe = (e => (e.Text = "text",
        e.Number = "number",
        e.Password = "password",
        e))(xe || {})
          , Oe = (0,
        Me.assign)(oe, (0,
        Me.object)({
            type: (0,
            Me.literal)("input"),
            value: (0,
            Me.optional)((0,
            Me.string)()),
            name: (0,
            Me.string)(),
            inputType: (0,
            Me.optional)((0,
            Me.union)([O("text"), O("password"), O("number")])),
            placeholder: (0,
            Me.optional)((0,
            Me.string)()),
            label: (0,
            Me.optional)((0,
            Me.string)()),
            error: (0,
            Me.optional)((0,
            Me.string)())
        }))
          , Te = ee("input", Oe, ["name", "inputType", "placeholder", "value", "label"])
          , Ie = (0,
        Re.union)([Oe, Se])
          , ke = (0,
        Re.assign)(ne, (0,
        Re.object)({
            type: (0,
            Re.literal)("form"),
            children: (0,
            Re.array)(Ie),
            name: (0,
            Re.string)()
        }))
          , Ne = ee("form", ke, ["name", "children"])
          , Pe = e("superstruct")
          , Ce = e("superstruct")
          , Le = (0,
        Ce.assign)(oe, (0,
        Ce.object)({
            type: (0,
            Ce.literal)("text"),
            value: (0,
            Ce.string)(),
            markdown: (0,
            Ce.optional)((0,
            Ce.boolean)())
        }))
          , je = ee("text", Le, ["value", "markdown"])
          , Fe = (e => (e.Default = "default",
        e.Critical = "critical",
        e.Warning = "warning",
        e))(Fe || {})
          , Be = (0,
        Pe.union)([be, Le, ie])
          , $e = (0,
        Pe.assign)(oe, (0,
        Pe.object)({
            type: (0,
            Pe.literal)("row"),
            variant: (0,
            Pe.optional)((0,
            Pe.union)([O("default"), O("critical"), O("warning")])),
            label: (0,
            Pe.string)(),
            value: Be
        }))
          , De = ee("row", $e, ["label", "value", "variant"])
          , Ue = e("superstruct")
          , We = (0,
        Ue.assign)(ne, (0,
        Ue.object)({
            type: (0,
            Ue.literal)("spinner")
        }))
          , Ve = ee("spinner", We)
          , He = (0,
        ve.assign)(ne, (0,
        ve.object)({
            children: (0,
            ve.array)((0,
            ve.lazy)(( () => ze)))
        }))
          , Ge = (0,
        ve.assign)(He, (0,
        ve.object)({
            type: (0,
            ve.literal)("panel")
        }))
          , Je = ee("panel", Ge, ["children"])
          , ze = (0,
        ve.union)([le, de, pe, be, Ge, We, Le, $e, ie, Oe, ke, Se])
          , qe = e("@metamask/utils")
          , Ye = e("superstruct");
        function Xe(e) {
            return (0,
            Ye.is)(e, ze)
        }
        function Ke(e) {
            (0,
            qe.assertStruct)(e, ze, "Invalid component")
        }
        async function Ze(e, t) {
            const r = await async function(e, t) {
                if ("function" != typeof fetch)
                    throw new Error(`Failed to fetch image data from "${e}": Using this function requires the "endowment:network-access" permission.`);
                return fetch(e, t).then((async t => {
                    if (!t.ok)
                        throw new Error(`Failed to fetch image data from "${e}": ${t.status} ${t.statusText}`);
                    const r = await t.blob();
                    return (0,
                    X.assert)("image/jpeg" === r.type || "image/png" === r.type, "Expected image data to be a JPEG or PNG image."),
                    r
                }
                ))
            }(e, t)
              , n = new Uint8Array(await r.arrayBuffer());
            return `data:${r.type};base64,${(0,
            X.bytesToBase64)(n)}`
        }
        async function Qe(e, {width: t, height: r=t, request: n}) {
            (0,
            X.assert)("number" == typeof t && t > 0, "Expected width to be a number greater than 0."),
            (0,
            X.assert)("number" == typeof r && r > 0, "Expected height to be a number greater than 0.");
            const o = await Ze(e, n)
              , i = `width="${t}" height="${r}"`;
            return ye(`<svg ${i.trim()} xmlns="http://www.w3.org/2000/svg"><image ${i.trim()} href="${o}" /></svg>`)
        }
        var et = (e => (e.Critical = "critical",
        e))(et || {})
          , tt = e("superstruct")
          , rt = (e => (e.ButtonClickEvent = "ButtonClickEvent",
        e.FormSubmitEvent = "FormSubmitEvent",
        e.InputChangeEvent = "InputChangeEvent",
        e))(rt || {})
          , nt = (0,
        tt.object)({
            type: (0,
            tt.string)(),
            name: (0,
            tt.optional)((0,
            tt.string)())
        })
          , ot = (0,
        tt.assign)(nt, (0,
        tt.object)({
            type: (0,
            tt.literal)("ButtonClickEvent"),
            name: (0,
            tt.optional)((0,
            tt.string)())
        }))
          , it = (0,
        tt.assign)(nt, (0,
        tt.object)({
            type: (0,
            tt.literal)("FormSubmitEvent"),
            value: (0,
            tt.record)((0,
            tt.string)(), (0,
            tt.nullable)((0,
            tt.string)())),
            name: (0,
            tt.string)()
        }))
          , st = (0,
        tt.assign)(nt, (0,
        tt.object)({
            type: (0,
            tt.literal)("InputChangeEvent"),
            name: (0,
            tt.string)(),
            value: (0,
            tt.string)()
        }))
          , at = (0,
        tt.union)([ot, it, st])
          , lt = (e => (e.Alert = "alert",
        e.Confirmation = "confirmation",
        e.Prompt = "prompt",
        e))(lt || {})
          , ct = (e => (e.Base64 = "base64",
        e.Hex = "hex",
        e.Utf8 = "utf8",
        e))(ct || {})
          , ut = (e => (e.ClearState = "clear",
        e.GetState = "get",
        e.UpdateState = "update",
        e))(ut || {})
          , dt = (e => (e.InApp = "inApp",
        e.Native = "native",
        e))(dt || {})
          , ft = e("@metamask/utils")
          , ht = e("superstruct")
          , pt = e("@metamask/utils")
          , gt = e("superstruct")
          , mt = T([(0,
        gt.string)(), (0,
        gt.number)()])
          , bt = yt((0,
        gt.string)());
        (0,
        gt.object)({
            type: (0,
            gt.string)(),
            props: (0,
            gt.record)((0,
            gt.string)(), pt.JsonStruct),
            key: (0,
            gt.nullable)(mt)
        });
        function yt(e) {
            return function(e) {
                const t = T([e, (0,
                gt.array)((0,
                gt.lazy)(( () => t)))]);
                return t
            }(e)
        }
        function vt(e, t={}) {
            return (0,
            gt.object)({
                type: M(e),
                props: (0,
                gt.object)(t),
                key: (0,
                gt.nullable)(mt)
            })
        }
        var wt = vt("Button", {
            children: bt,
            name: (0,
            gt.optional)((0,
            gt.string)()),
            type: (0,
            gt.optional)(T([M("button"), M("submit")])),
            variant: (0,
            gt.optional)(T([M("primary"), M("destructive")])),
            disabled: (0,
            gt.optional)((0,
            gt.boolean)())
        })
          , _t = vt("Input", {
            name: (0,
            gt.string)(),
            type: (0,
            gt.optional)(T([M("text"), M("password"), M("number")])),
            value: (0,
            gt.optional)((0,
            gt.string)()),
            placeholder: (0,
            gt.optional)((0,
            gt.string)())
        })
          , Et = vt("Option", {
            value: (0,
            gt.string)(),
            children: (0,
            gt.string)()
        })
          , St = vt("Dropdown", {
            name: (0,
            gt.string)(),
            value: (0,
            gt.optional)((0,
            gt.string)()),
            children: yt(Et)
        })
          , At = vt("Field", {
            label: (0,
            gt.optional)((0,
            gt.string)()),
            error: (0,
            gt.optional)((0,
            gt.string)()),
            children: T([(0,
            gt.tuple)([_t, wt]), _t, St])
        })
          , Rt = vt("Form", {
            children: yt(T([At, wt])),
            name: (0,
            gt.string)()
        })
          , Mt = vt("Bold", {
            children: yt((0,
            gt.nullable)(T([(0,
            gt.string)(), (0,
            gt.lazy)(( () => xt))])))
        })
          , xt = vt("Italic", {
            children: yt((0,
            gt.nullable)(T([(0,
            gt.string)(), (0,
            gt.lazy)(( () => Mt))])))
        })
          , Ot = T([Mt, xt])
          , Tt = vt("Address", {
            address: pt.HexChecksumAddressStruct
        })
          , It = vt("Box", {
            children: yt((0,
            gt.nullable)((0,
            gt.lazy)(( () => Dt)))),
            direction: (0,
            gt.optional)(T([M("horizontal"), M("vertical")])),
            alignment: (0,
            gt.optional)(T([M("start"), M("center"), M("end"), M("space-between"), M("space-around")]))
        })
          , kt = vt("Copyable", {
            value: (0,
            gt.string)(),
            sensitive: (0,
            gt.optional)((0,
            gt.boolean)())
        })
          , Nt = vt("Divider")
          , Pt = vt("Value", {
            value: (0,
            gt.string)(),
            extra: (0,
            gt.string)()
        })
          , Ct = vt("Heading", {
            children: bt
        })
          , Lt = vt("Image", {
            src: k(),
            alt: (0,
            gt.optional)((0,
            gt.string)())
        })
          , jt = vt("Link", {
            href: (0,
            gt.string)(),
            children: yt((0,
            gt.nullable)(T([Ot, (0,
            gt.string)()])))
        })
          , Ft = vt("Text", {
            children: yt((0,
            gt.nullable)(T([(0,
            gt.string)(), Mt, xt, jt])))
        })
          , Bt = vt("Row", {
            label: (0,
            gt.string)(),
            children: T([Tt, Lt, Ft, Pt]),
            variant: (0,
            gt.optional)(T([M("default"), M("warning"), M("critical")])),
            tooltip: (0,
            gt.optional)((0,
            gt.string)())
        })
          , $t = vt("Spinner")
          , Dt = T([wt, _t, Rt, Mt, xt, Tt, It, kt, Nt, Ct, Lt, jt, Bt, $t, Ft, St])
          , Ut = Dt
          , Wt = (T([wt, _t, At, Rt, Mt, xt, Tt, It, kt, Nt, Ct, Lt, jt, Bt, $t, Ft, St, Et, Pt]),
        (0,
        ht.record)((0,
        ht.string)(), (0,
        ht.nullable)((0,
        ht.string)())))
          , Vt = (0,
        ht.record)((0,
        ht.string)(), (0,
        ht.union)([Wt, (0,
        ht.nullable)((0,
        ht.string)())]))
          , Ht = (0,
        ht.union)([ze, Ut])
          , Gt = (0,
        ht.record)((0,
        ht.string)(), ft.JsonStruct)
    }
    , {
        "@metamask/rpc-errors": 16,
        "@metamask/utils": 39,
        superstruct: 151
    }],
    18: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, o = e("debug"), i = ((n = o) && n.__esModule ? n : {
            default: n
        }).default.call(void 0, "metamask");
        r.createProjectLogger = function(e) {
            return i.extend(e)
        }
        ,
        r.createModuleLogger = function(e, t) {
            return e.extend(t)
        }
    }
    , {
        debug: 52
    }],
    19: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e, t, r) => {
            if (!t.has(e))
                throw TypeError("Cannot " + r)
        }
        ;
        r.__privateGet = (e, t, r) => (n(e, t, "read from private field"),
        r ? r.call(e) : t.get(e)),
        r.__privateAdd = (e, t, r) => {
            if (t.has(e))
                throw TypeError("Cannot add the same private member more than once");
            t instanceof WeakSet ? t.add(e) : t.set(e, r)
        }
        ,
        r.__privateSet = (e, t, r, o) => (n(e, t, "write to private field"),
        o ? o.call(e, r) : t.set(e, r),
        r)
    }
    , {}],
    20: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6ZDHSOUV.js")
          , o = e("semver")
          , i = e("superstruct")
          , s = i.refine.call(void 0, i.string.call(void 0), "Version", (e => null !== o.valid.call(void 0, e) || `Expected SemVer version, got "${e}"`))
          , a = i.refine.call(void 0, i.string.call(void 0), "Version range", (e => null !== o.validRange.call(void 0, e) || `Expected SemVer range, got "${e}"`));
        r.VersionStruct = s,
        r.VersionRangeStruct = a,
        r.isValidSemVerVersion = function(e) {
            return i.is.call(void 0, e, s)
        }
        ,
        r.isValidSemVerRange = function(e) {
            return i.is.call(void 0, e, a)
        }
        ,
        r.assertIsSemVerVersion = function(e) {
            n.assertStruct.call(void 0, e, s)
        }
        ,
        r.assertIsSemVerRange = function(e) {
            n.assertStruct.call(void 0, e, a)
        }
        ,
        r.gtVersion = function(e, t) {
            return o.gt.call(void 0, e, t)
        }
        ,
        r.gtRange = function(e, t) {
            return o.gtr.call(void 0, e, t)
        }
        ,
        r.satisfiesVersionRange = function(e, t) {
            return o.satisfies.call(void 0, e, t, {
                includePrerelease: !0
            })
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        semver: 132,
        superstruct: 151
    }],
    21: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e => (e[e.Millisecond = 1] = "Millisecond",
        e[e.Second = 1e3] = "Second",
        e[e.Minute = 6e4] = "Minute",
        e[e.Hour = 36e5] = "Hour",
        e[e.Day = 864e5] = "Day",
        e[e.Week = 6048e5] = "Week",
        e[e.Year = 31536e6] = "Year",
        e))(n || {})
          , o = (e, t) => {
            if (!(e => Number.isInteger(e) && e >= 0)(e))
                throw new Error(`"${t}" must be a non-negative integer. Received: "${e}".`)
        }
        ;
        r.Duration = n,
        r.inMilliseconds = function(e, t) {
            return o(e, "count"),
            e * t
        }
        ,
        r.timeSince = function(e) {
            return o(e, "timestamp"),
            Date.now() - e
        }
    }
    , {}],
    22: [function(e, t, r) {}
    , {}],
    23: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return null != e ? e : t()
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var o = e("./chunk-6ZDHSOUV.js")
          , i = e("superstruct");
        r.base64 = (e, t={}) => {
            const r = n(t.paddingRequired, ( () => !1))
              , s = n(t.characterSet, ( () => "base64"));
            let a, l;
            return "base64" === s ? a = String.raw`[A-Za-z0-9+\/]` : (o.assert.call(void 0, "base64url" === s),
            a = String.raw`[-_A-Za-z0-9]`),
            l = r ? new RegExp(`^(?:${a}{4})*(?:${a}{3}=|${a}{2}==)?$`,"u") : new RegExp(`^(?:${a}{4})*(?:${a}{2,3}|${a}{3}=|${a}{2}==)?$`,"u"),
            i.pattern.call(void 0, e, l)
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        superstruct: 151
    }],
    24: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-IZC266HS.js")
          , o = e("superstruct");
        function i(e, t) {
            return Boolean("string" == typeof function(e) {
                let t, r = e[0], n = 1;
                for (; n < e.length; ) {
                    const o = e[n]
                      , i = e[n + 1];
                    if (n += 2,
                    ("optionalAccess" === o || "optionalCall" === o) && null == r)
                        return;
                    "access" === o || "optionalAccess" === o ? (t = r,
                    r = i(r)) : "call" !== o && "optionalCall" !== o || (r = i(( (...e) => r.call(t, ...e))),
                    t = void 0)
                }
                return r
            }([e, "optionalAccess", e => e.prototype, "optionalAccess", e => e.constructor, "optionalAccess", e => e.name])) ? new e({
                message: t
            }) : e({
                message: t
            })
        }
        var s = class extends Error {
            constructor(e) {
                super(e.message),
                this.code = "ERR_ASSERTION"
            }
        }
        ;
        r.AssertionError = s,
        r.assert = function(e, t="Assertion failed.", r=s) {
            if (!e) {
                if (t instanceof Error)
                    throw t;
                throw i(r, t)
            }
        }
        ,
        r.assertStruct = function(e, t, r="Assertion failed", a=s) {
            try {
                o.assert.call(void 0, e, t)
            } catch (e) {
                throw i(a, `${r}: ${function(e) {
                    return n.getErrorMessage.call(void 0, e).replace(/\.$/u, "")
                }(e)}.`)
            }
        }
        ,
        r.assertExhaustive = function(e) {
            throw new Error("Invalid branch reached. Should be detected during compilation.")
        }
    }
    , {
        "./chunk-IZC266HS.js": 29,
        superstruct: 151
    }],
    25: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.createDeferredPromise = function({suppressUnhandledRejection: e=!1}={}) {
            let t, r;
            const n = new Promise(( (e, n) => {
                t = e,
                r = n
            }
            ));
            return e && n.catch((e => {}
            )),
            {
                promise: n,
                resolve: t,
                reject: r
            }
        }
    }
    , {}],
    26: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QEPVHEP7.js")
          , o = e("./chunk-6ZDHSOUV.js")
          , i = e("superstruct")
          , s = i.union.call(void 0, [i.number.call(void 0), i.bigint.call(void 0), i.string.call(void 0), n.StrictHexStruct])
          , a = i.coerce.call(void 0, i.number.call(void 0), s, Number)
          , l = i.coerce.call(void 0, i.bigint.call(void 0), s, BigInt)
          , c = (i.union.call(void 0, [n.StrictHexStruct, i.instance.call(void 0, Uint8Array)]),
        i.coerce.call(void 0, i.instance.call(void 0, Uint8Array), i.union.call(void 0, [n.StrictHexStruct]), n.hexToBytes))
          , u = i.coerce.call(void 0, n.StrictHexStruct, i.instance.call(void 0, Uint8Array), n.bytesToHex);
        r.createNumber = function(e) {
            try {
                const t = i.create.call(void 0, e, a);
                return o.assert.call(void 0, Number.isFinite(t), `Expected a number-like value, got "${e}".`),
                t
            } catch (t) {
                if (t instanceof i.StructError)
                    throw new Error(`Expected a number-like value, got "${e}".`);
                throw t
            }
        }
        ,
        r.createBigInt = function(e) {
            try {
                return i.create.call(void 0, e, l)
            } catch (e) {
                if (e instanceof i.StructError)
                    throw new Error(`Expected a number-like value, got "${String(e.value)}".`);
                throw e
            }
        }
        ,
        r.createBytes = function(e) {
            if ("string" == typeof e && "0x" === e.toLowerCase())
                return new Uint8Array;
            try {
                return i.create.call(void 0, e, c)
            } catch (e) {
                if (e instanceof i.StructError)
                    throw new Error(`Expected a bytes-like value, got "${String(e.value)}".`);
                throw e
            }
        }
        ,
        r.createHex = function(e) {
            if (e instanceof Uint8Array && 0 === e.length || "string" == typeof e && "0x" === e.toLowerCase())
                return "0x";
            try {
                return i.create.call(void 0, e, u)
            } catch (e) {
                if (e instanceof i.StructError)
                    throw new Error(`Expected a bytes-like value, got "${String(e.value)}".`);
                throw e
            }
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        "./chunk-QEPVHEP7.js": 32,
        superstruct: 151
    }],
    27: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6NZW4WK4.js")
          , o = e("superstruct")
          , i = o.size.call(void 0, n.base64.call(void 0, o.string.call(void 0), {
            paddingRequired: !0
        }), 44, 44);
        r.ChecksumStruct = i
    }
    , {
        "./chunk-6NZW4WK4.js": 23,
        superstruct: 151
    }],
    28: [function(e, t, r) {}
    , {}],
    29: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QVEKZRZ2.js")
          , o = e("pony-cause");
        function i(e) {
            return "object" == typeof e && null !== e && "code"in e
        }
        function s(e) {
            return "object" == typeof e && null !== e && "message"in e
        }
        r.isErrorWithCode = i,
        r.isErrorWithMessage = s,
        r.isErrorWithStack = function(e) {
            return "object" == typeof e && null !== e && "stack"in e
        }
        ,
        r.getErrorMessage = function(e) {
            return s(e) && "string" == typeof e.message ? e.message : n.isNullOrUndefined.call(void 0, e) ? "" : String(e)
        }
        ,
        r.wrapError = function(e, t) {
            if ((r = e)instanceof Error || n.isObject.call(void 0, r) && "Error" === r.constructor.name) {
                let r;
                return r = 2 === Error.length ? new Error(t,{
                    cause: e
                }) : new (0,
                o.ErrorWithCause)(t,{
                    cause: e
                }),
                i(e) && (r.code = e.code),
                r
            }
            var r;
            return t.length > 0 ? new Error(`${String(e)}: ${t}`) : new Error(String(e))
        }
    }
    , {
        "./chunk-QVEKZRZ2.js": 33,
        "pony-cause": 85
    }],
    30: [function(e, t, r) {}
    , {}],
    31: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6ZDHSOUV.js")
          , o = e("./chunk-QVEKZRZ2.js")
          , i = e("superstruct")
          , s = e => i.object.call(void 0, e);
        function a({path: e, branch: t}) {
            const r = e[e.length - 1];
            return o.hasProperty.call(void 0, t[t.length - 2], r)
        }
        function l(e) {
            return new (0,
            i.Struct)({
                ...e,
                type: `optional ${e.type}`,
                validator: (t, r) => !a(r) || e.validator(t, r),
                refiner: (t, r) => !a(r) || e.refiner(t, r)
            })
        }
        var c = i.union.call(void 0, [i.literal.call(void 0, null), i.boolean.call(void 0), i.define.call(void 0, "finite number", (e => i.is.call(void 0, e, i.number.call(void 0)) && Number.isFinite(e))), i.string.call(void 0), i.array.call(void 0, i.lazy.call(void 0, ( () => c))), i.record.call(void 0, i.string.call(void 0), i.lazy.call(void 0, ( () => c)))])
          , u = i.coerce.call(void 0, c, i.any.call(void 0), (e => (n.assertStruct.call(void 0, e, c),
        JSON.parse(JSON.stringify(e, ( (e, t) => {
            if ("__proto__" !== e && "constructor" !== e)
                return t
        }
        ))))));
        function d(e) {
            return i.create.call(void 0, e, u)
        }
        var f = i.literal.call(void 0, "2.0")
          , h = i.nullable.call(void 0, i.union.call(void 0, [i.number.call(void 0), i.string.call(void 0)]))
          , p = s({
            code: i.integer.call(void 0),
            message: i.string.call(void 0),
            data: l(u),
            stack: l(i.string.call(void 0))
        })
          , g = i.union.call(void 0, [i.record.call(void 0, i.string.call(void 0), u), i.array.call(void 0, u)])
          , m = s({
            id: h,
            jsonrpc: f,
            method: i.string.call(void 0),
            params: l(g)
        })
          , b = s({
            jsonrpc: f,
            method: i.string.call(void 0),
            params: l(g)
        });
        var y = i.object.call(void 0, {
            id: h,
            jsonrpc: f,
            result: i.optional.call(void 0, i.unknown.call(void 0)),
            error: i.optional.call(void 0, p)
        })
          , v = s({
            id: h,
            jsonrpc: f,
            result: u
        })
          , w = s({
            id: h,
            jsonrpc: f,
            error: p
        })
          , _ = i.union.call(void 0, [v, w]);
        r.object = s,
        r.exactOptional = l,
        r.UnsafeJsonStruct = c,
        r.JsonStruct = u,
        r.isValidJson = function(e) {
            try {
                return d(e),
                !0
            } catch (e) {
                return !1
            }
        }
        ,
        r.getSafeJson = d,
        r.getJsonSize = function(e) {
            n.assertStruct.call(void 0, e, u, "Invalid JSON value");
            const t = JSON.stringify(e);
            return (new TextEncoder).encode(t).byteLength
        }
        ,
        r.jsonrpc2 = "2.0",
        r.JsonRpcVersionStruct = f,
        r.JsonRpcIdStruct = h,
        r.JsonRpcErrorStruct = p,
        r.JsonRpcParamsStruct = g,
        r.JsonRpcRequestStruct = m,
        r.JsonRpcNotificationStruct = b,
        r.isJsonRpcNotification = function(e) {
            return i.is.call(void 0, e, b)
        }
        ,
        r.assertIsJsonRpcNotification = function(e, t) {
            n.assertStruct.call(void 0, e, b, "Invalid JSON-RPC notification", t)
        }
        ,
        r.isJsonRpcRequest = function(e) {
            return i.is.call(void 0, e, m)
        }
        ,
        r.assertIsJsonRpcRequest = function(e, t) {
            n.assertStruct.call(void 0, e, m, "Invalid JSON-RPC request", t)
        }
        ,
        r.PendingJsonRpcResponseStruct = y,
        r.JsonRpcSuccessStruct = v,
        r.JsonRpcFailureStruct = w,
        r.JsonRpcResponseStruct = _,
        r.isPendingJsonRpcResponse = function(e) {
            return i.is.call(void 0, e, y)
        }
        ,
        r.assertIsPendingJsonRpcResponse = function(e, t) {
            n.assertStruct.call(void 0, e, y, "Invalid pending JSON-RPC response", t)
        }
        ,
        r.isJsonRpcResponse = function(e) {
            return i.is.call(void 0, e, _)
        }
        ,
        r.assertIsJsonRpcResponse = function(e, t) {
            n.assertStruct.call(void 0, e, _, "Invalid JSON-RPC response", t)
        }
        ,
        r.isJsonRpcSuccess = function(e) {
            return i.is.call(void 0, e, v)
        }
        ,
        r.assertIsJsonRpcSuccess = function(e, t) {
            n.assertStruct.call(void 0, e, v, "Invalid JSON-RPC success response", t)
        }
        ,
        r.isJsonRpcFailure = function(e) {
            return i.is.call(void 0, e, w)
        }
        ,
        r.assertIsJsonRpcFailure = function(e, t) {
            n.assertStruct.call(void 0, e, w, "Invalid JSON-RPC failure response", t)
        }
        ,
        r.isJsonRpcError = function(e) {
            return i.is.call(void 0, e, p)
        }
        ,
        r.assertIsJsonRpcError = function(e, t) {
            n.assertStruct.call(void 0, e, p, "Invalid JSON-RPC error", t)
        }
        ,
        r.getJsonRpcIdValidator = function(e) {
            const {permitEmptyString: t, permitFractions: r, permitNull: n} = {
                permitEmptyString: !0,
                permitFractions: !1,
                permitNull: !0,
                ...e
            };
            return e => Boolean("number" == typeof e && (r || Number.isInteger(e)) || "string" == typeof e && (t || e.length > 0) || n && null === e)
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        "./chunk-QVEKZRZ2.js": 33,
        superstruct: 151
    }],
    32: [function(e, t, r) {
        (function(t) {
            (function() {
                "use strict";
                Object.defineProperty(r, "__esModule", {
                    value: !0
                });
                var n = e("./chunk-6ZDHSOUV.js")
                  , o = e("@noble/hashes/sha3")
                  , i = e("superstruct")
                  , s = e("@scure/base")
                  , a = 48
                  , l = 58
                  , c = 87;
                var u = function() {
                    const e = [];
                    return () => {
                        if (0 === e.length)
                            for (let t = 0; t < 256; t++)
                                e.push(t.toString(16).padStart(2, "0"));
                        return e
                    }
                }();
                function d(e) {
                    return e instanceof Uint8Array
                }
                function f(e) {
                    n.assert.call(void 0, d(e), "Value must be a Uint8Array.")
                }
                function h(e) {
                    if (f(e),
                    0 === e.length)
                        return "0x";
                    const t = u()
                      , r = new Array(e.length);
                    for (let n = 0; n < e.length; n++)
                        r[n] = t[e[n]];
                    return T(r.join(""))
                }
                function p(e) {
                    f(e);
                    const t = h(e);
                    return BigInt(t)
                }
                function g(e) {
                    if ("0x" === function(e) {
                        let t, r = e[0], n = 1;
                        for (; n < e.length; ) {
                            const o = e[n]
                              , i = e[n + 1];
                            if (n += 2,
                            ("optionalAccess" === o || "optionalCall" === o) && null == r)
                                return;
                            "access" === o || "optionalAccess" === o ? (t = r,
                            r = i(r)) : "call" !== o && "optionalCall" !== o || (r = i(( (...e) => r.call(t, ...e))),
                            t = void 0)
                        }
                        return r
                    }([e, "optionalAccess", e => e.toLowerCase, "optionalCall", e => e()]))
                        return new Uint8Array;
                    M(e);
                    const t = I(e).toLowerCase()
                      , r = t.length % 2 == 0 ? t : `0${t}`
                      , n = new Uint8Array(r.length / 2);
                    for (let e = 0; e < n.length; e++) {
                        const t = r.charCodeAt(2 * e)
                          , o = r.charCodeAt(2 * e + 1)
                          , i = t - (t < l ? a : c)
                          , s = o - (o < l ? a : c);
                        n[e] = 16 * i + s
                    }
                    return n
                }
                function m(e) {
                    n.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
                    n.assert.call(void 0, e >= BigInt(0), "Value must be a non-negative bigint.");
                    return g(e.toString(16))
                }
                function b(e) {
                    n.assert.call(void 0, "number" == typeof e, "Value must be a number."),
                    n.assert.call(void 0, e >= 0, "Value must be a non-negative number."),
                    n.assert.call(void 0, Number.isSafeInteger(e), "Value is not a safe integer. Use `bigIntToBytes` instead.");
                    return g(e.toString(16))
                }
                function y(e) {
                    return n.assert.call(void 0, "string" == typeof e, "Value must be a string."),
                    (new TextEncoder).encode(e)
                }
                function v(e) {
                    if ("bigint" == typeof e)
                        return m(e);
                    if ("number" == typeof e)
                        return b(e);
                    if ("string" == typeof e)
                        return e.startsWith("0x") ? g(e) : y(e);
                    if (d(e))
                        return e;
                    throw new TypeError(`Unsupported value type: "${typeof e}".`)
                }
                var w = i.pattern.call(void 0, i.string.call(void 0), /^(?:0x)?[0-9a-f]+$/iu)
                  , _ = i.pattern.call(void 0, i.string.call(void 0), /^0x[0-9a-f]+$/iu)
                  , E = i.pattern.call(void 0, i.string.call(void 0), /^0x[0-9a-f]{40}$/u)
                  , S = i.pattern.call(void 0, i.string.call(void 0), /^0x[0-9a-fA-F]{40}$/u);
                function A(e) {
                    return i.is.call(void 0, e, w)
                }
                function R(e) {
                    return i.is.call(void 0, e, _)
                }
                function M(e) {
                    n.assert.call(void 0, A(e), "Value must be a hexadecimal string.")
                }
                function x(e) {
                    n.assert.call(void 0, i.is.call(void 0, e, S), "Invalid hex address.");
                    const t = I(e.toLowerCase())
                      , r = I(h(o.keccak_256.call(void 0, t)));
                    return `0x${t.split("").map(( (e, t) => {
                        const o = r[t];
                        return n.assert.call(void 0, i.is.call(void 0, o, i.string.call(void 0)), "Hash shorter than address."),
                        parseInt(o, 16) > 7 ? e.toUpperCase() : e
                    }
                    )).join("")}`
                }
                function O(e) {
                    return !!i.is.call(void 0, e, S) && x(e) === e
                }
                function T(e) {
                    return e.startsWith("0x") ? e : e.startsWith("0X") ? `0x${e.substring(2)}` : `0x${e}`
                }
                function I(e) {
                    return e.startsWith("0x") || e.startsWith("0X") ? e.substring(2) : e
                }
                r.HexStruct = w,
                r.StrictHexStruct = _,
                r.HexAddressStruct = E,
                r.HexChecksumAddressStruct = S,
                r.isHexString = A,
                r.isStrictHexString = R,
                r.assertIsHexString = M,
                r.assertIsStrictHexString = function(e) {
                    n.assert.call(void 0, R(e), 'Value must be a hexadecimal string, starting with "0x".')
                }
                ,
                r.isValidHexAddress = function(e) {
                    return i.is.call(void 0, e, E) || O(e)
                }
                ,
                r.getChecksumAddress = x,
                r.isValidChecksumAddress = O,
                r.add0x = T,
                r.remove0x = I,
                r.isBytes = d,
                r.assertIsBytes = f,
                r.bytesToHex = h,
                r.bytesToBigInt = p,
                r.bytesToSignedBigInt = function(e) {
                    f(e);
                    let t = BigInt(0);
                    for (const r of e)
                        t = (t << BigInt(8)) + BigInt(r);
                    return BigInt.asIntN(8 * e.length, t)
                }
                ,
                r.bytesToNumber = function(e) {
                    f(e);
                    const t = p(e);
                    return n.assert.call(void 0, t <= BigInt(Number.MAX_SAFE_INTEGER), "Number is not a safe integer. Use `bytesToBigInt` instead."),
                    Number(t)
                }
                ,
                r.bytesToString = function(e) {
                    return f(e),
                    (new TextDecoder).decode(e)
                }
                ,
                r.bytesToBase64 = function(e) {
                    return f(e),
                    s.base64.encode(e)
                }
                ,
                r.hexToBytes = g,
                r.bigIntToBytes = m,
                r.signedBigIntToBytes = function(e, t) {
                    n.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
                    n.assert.call(void 0, "number" == typeof t, "Byte length must be a number."),
                    n.assert.call(void 0, t > 0, "Byte length must be greater than 0."),
                    n.assert.call(void 0, function(e, t) {
                        n.assert.call(void 0, t > 0);
                        const r = e >> BigInt(31);
                        return !((~e & r) + (e & ~r) >> BigInt(8 * t - 1))
                    }(e, t), "Byte length is too small to represent the given value.");
                    let r = e;
                    const o = new Uint8Array(t);
                    for (let e = 0; e < o.length; e++)
                        o[e] = Number(BigInt.asUintN(8, r)),
                        r >>= BigInt(8);
                    return o.reverse()
                }
                ,
                r.numberToBytes = b,
                r.stringToBytes = y,
                r.base64ToBytes = function(e) {
                    return n.assert.call(void 0, "string" == typeof e, "Value must be a string."),
                    s.base64.decode(e)
                }
                ,
                r.valueToBytes = v,
                r.concatBytes = function(e) {
                    const t = new Array(e.length);
                    let r = 0;
                    for (let n = 0; n < e.length; n++) {
                        const o = v(e[n]);
                        t[n] = o,
                        r += o.length
                    }
                    const n = new Uint8Array(r);
                    for (let e = 0, r = 0; e < t.length; e++)
                        n.set(t[e], r),
                        r += t[e].length;
                    return n
                }
                ,
                r.createDataView = function(e) {
                    if (void 0 !== t && e instanceof t) {
                        const t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
                        return new DataView(t)
                    }
                    return new DataView(e.buffer,e.byteOffset,e.byteLength)
                }
            }
            ).call(this)
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        "@noble/hashes/sha3": 43,
        "@scure/base": 45,
        buffer: 50,
        superstruct: 151
    }],
    33: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e => (e[e.Null = 4] = "Null",
        e[e.Comma = 1] = "Comma",
        e[e.Wrapper = 1] = "Wrapper",
        e[e.True = 4] = "True",
        e[e.False = 5] = "False",
        e[e.Quote = 1] = "Quote",
        e[e.Colon = 1] = "Colon",
        e[e.Date = 24] = "Date",
        e))(n || {})
          , o = /"|\\|\n|\r|\t/gu;
        function i(e) {
            return e.charCodeAt(0) <= 127
        }
        r.isNonEmptyArray = function(e) {
            return Array.isArray(e) && e.length > 0
        }
        ,
        r.isNullOrUndefined = function(e) {
            return null == e
        }
        ,
        r.isObject = function(e) {
            return Boolean(e) && "object" == typeof e && !Array.isArray(e)
        }
        ,
        r.hasProperty = (e, t) => Object.hasOwnProperty.call(e, t),
        r.getKnownPropertyNames = function(e) {
            return Object.getOwnPropertyNames(e)
        }
        ,
        r.JsonSize = n,
        r.ESCAPE_CHARACTERS_REGEXP = o,
        r.isPlainObject = function(e) {
            if ("object" != typeof e || null === e)
                return !1;
            try {
                let t = e;
                for (; null !== Object.getPrototypeOf(t); )
                    t = Object.getPrototypeOf(t);
                return Object.getPrototypeOf(e) === t
            } catch (e) {
                return !1
            }
        }
        ,
        r.isASCII = i,
        r.calculateStringSize = function(e) {
            return e.split("").reduce(( (e, t) => i(t) ? e + 1 : e + 2), 0) + (t = e.match(o),
            r = () => [],
            null != t ? t : r()).length;
            var t, r
        }
        ,
        r.calculateNumberSize = function(e) {
            return e.toString().length
        }
    }
    , {}],
    34: [function(e, t, r) {}
    , {}],
    35: [function(e, t, r) {}
    , {}],
    36: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QEPVHEP7.js")
          , o = e("./chunk-6ZDHSOUV.js");
        r.numberToHex = e => (o.assert.call(void 0, "number" == typeof e, "Value must be a number."),
        o.assert.call(void 0, e >= 0, "Value must be a non-negative number."),
        o.assert.call(void 0, Number.isSafeInteger(e), "Value is not a safe integer. Use `bigIntToHex` instead."),
        n.add0x.call(void 0, e.toString(16))),
        r.bigIntToHex = e => (o.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
        o.assert.call(void 0, e >= 0, "Value must be a non-negative bigint."),
        n.add0x.call(void 0, e.toString(16))),
        r.hexToNumber = e => {
            n.assertIsHexString.call(void 0, e);
            const t = parseInt(e, 16);
            return o.assert.call(void 0, Number.isSafeInteger(t), "Value is not a safe integer. Use `hexToBigInt` instead."),
            t
        }
        ,
        r.hexToBigInt = e => (n.assertIsHexString.call(void 0, e),
        BigInt(n.add0x.call(void 0, e)))
    }
    , {
        "./chunk-6ZDHSOUV.js": 24,
        "./chunk-QEPVHEP7.js": 32
    }],
    37: [function(e, t, r) {
        "use strict";
        function n(e) {
            let t, r = e[0], n = 1;
            for (; n < e.length; ) {
                const o = e[n]
                  , i = e[n + 1];
                if (n += 2,
                ("optionalAccess" === o || "optionalCall" === o) && null == r)
                    return;
                "access" === o || "optionalAccess" === o ? (t = r,
                r = i(r)) : "call" !== o && "optionalCall" !== o || (r = i(( (...e) => r.call(t, ...e))),
                t = void 0)
            }
            return r
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var o = e("superstruct")
          , i = /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})$/u
          , s = /^[-a-z0-9]{3,8}$/u
          , a = /^[-_a-zA-Z0-9]{1,32}$/u
          , l = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u
          , c = /^[-.%a-zA-Z0-9]{1,128}$/u
          , u = o.pattern.call(void 0, o.string.call(void 0), i)
          , d = o.pattern.call(void 0, o.string.call(void 0), s)
          , f = o.pattern.call(void 0, o.string.call(void 0), a)
          , h = o.pattern.call(void 0, o.string.call(void 0), l)
          , p = o.pattern.call(void 0, o.string.call(void 0), c)
          , g = (e => (e.Eip155 = "eip155",
        e))(g || {});
        function m(e) {
            return o.is.call(void 0, e, d)
        }
        function b(e) {
            return o.is.call(void 0, e, f)
        }
        r.CAIP_CHAIN_ID_REGEX = i,
        r.CAIP_NAMESPACE_REGEX = s,
        r.CAIP_REFERENCE_REGEX = a,
        r.CAIP_ACCOUNT_ID_REGEX = l,
        r.CAIP_ACCOUNT_ADDRESS_REGEX = c,
        r.CaipChainIdStruct = u,
        r.CaipNamespaceStruct = d,
        r.CaipReferenceStruct = f,
        r.CaipAccountIdStruct = h,
        r.CaipAccountAddressStruct = p,
        r.KnownCaipNamespace = g,
        r.isCaipChainId = function(e) {
            return o.is.call(void 0, e, u)
        }
        ,
        r.isCaipNamespace = m,
        r.isCaipReference = b,
        r.isCaipAccountId = function(e) {
            return o.is.call(void 0, e, h)
        }
        ,
        r.isCaipAccountAddress = function(e) {
            return o.is.call(void 0, e, p)
        }
        ,
        r.parseCaipChainId = function(e) {
            const t = i.exec(e);
            if (!n([t, "optionalAccess", e => e.groups]))
                throw new Error("Invalid CAIP chain ID.");
            return {
                namespace: t.groups.namespace,
                reference: t.groups.reference
            }
        }
        ,
        r.parseCaipAccountId = function(e) {
            const t = l.exec(e);
            if (!n([t, "optionalAccess", e => e.groups]))
                throw new Error("Invalid CAIP account ID.");
            return {
                address: t.groups.accountAddress,
                chainId: t.groups.chainId,
                chain: {
                    namespace: t.groups.namespace,
                    reference: t.groups.reference
                }
            }
        }
        ,
        r.toCaipChainId = function(e, t) {
            if (!m(e))
                throw new Error(`Invalid "namespace", must match: ${s.toString()}`);
            if (!b(t))
                throw new Error(`Invalid "reference", must match: ${a.toString()}`);
            return `${e}:${t}`
        }
    }
    , {
        superstruct: 151
    }],
    38: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, o, i = e("./chunk-3W5G4CYI.js"), s = class {
            constructor(e) {
                i.__privateAdd.call(void 0, this, n, void 0),
                i.__privateSet.call(void 0, this, n, new Map(e)),
                Object.freeze(this)
            }
            get size() {
                return i.__privateGet.call(void 0, this, n).size
            }
            [Symbol.iterator]() {
                return i.__privateGet.call(void 0, this, n)[Symbol.iterator]()
            }
            entries() {
                return i.__privateGet.call(void 0, this, n).entries()
            }
            forEach(e, t) {
                return i.__privateGet.call(void 0, this, n).forEach(( (r, n, o) => e.call(t, r, n, this)))
            }
            get(e) {
                return i.__privateGet.call(void 0, this, n).get(e)
            }
            has(e) {
                return i.__privateGet.call(void 0, this, n).has(e)
            }
            keys() {
                return i.__privateGet.call(void 0, this, n).keys()
            }
            values() {
                return i.__privateGet.call(void 0, this, n).values()
            }
            toString() {
                return `FrozenMap(${this.size}) {${this.size > 0 ? ` ${[...this.entries()].map(( ([e,t]) => `${String(e)} => ${String(t)}`)).join(", ")} ` : ""}}`
            }
        }
        ;
        n = new WeakMap;
        var a = class {
            constructor(e) {
                i.__privateAdd.call(void 0, this, o, void 0),
                i.__privateSet.call(void 0, this, o, new Set(e)),
                Object.freeze(this)
            }
            get size() {
                return i.__privateGet.call(void 0, this, o).size
            }
            [Symbol.iterator]() {
                return i.__privateGet.call(void 0, this, o)[Symbol.iterator]()
            }
            entries() {
                return i.__privateGet.call(void 0, this, o).entries()
            }
            forEach(e, t) {
                return i.__privateGet.call(void 0, this, o).forEach(( (r, n, o) => e.call(t, r, n, this)))
            }
            has(e) {
                return i.__privateGet.call(void 0, this, o).has(e)
            }
            keys() {
                return i.__privateGet.call(void 0, this, o).keys()
            }
            values() {
                return i.__privateGet.call(void 0, this, o).values()
            }
            toString() {
                return `FrozenSet(${this.size}) {${this.size > 0 ? ` ${[...this.values()].map((e => String(e))).join(", ")} ` : ""}}`
            }
        }
        ;
        o = new WeakMap,
        Object.freeze(s),
        Object.freeze(s.prototype),
        Object.freeze(a),
        Object.freeze(a.prototype),
        r.FrozenMap = s,
        r.FrozenSet = a
    }
    , {
        "./chunk-3W5G4CYI.js": 19
    }],
    39: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        e("./chunk-5AVWINSB.js");
        var n = e("./chunk-VFXTVNXN.js");
        e("./chunk-LC2CRSWD.js");
        var o = e("./chunk-C6HGFEYL.js")
          , i = e("./chunk-4RMX5YWE.js");
        e("./chunk-UOTVU7OQ.js");
        var s = e("./chunk-4D6XQBHA.js")
          , a = e("./chunk-OLLG4H35.js");
        e("./chunk-RKRGAFXY.js");
        var l = e("./chunk-2LBGT4GH.js")
          , c = e("./chunk-YWAID473.js")
          , u = e("./chunk-E4C7EW4R.js")
          , d = e("./chunk-6NZW4WK4.js")
          , f = e("./chunk-DHVKFDHQ.js")
          , h = e("./chunk-QEPVHEP7.js")
          , p = e("./chunk-6ZDHSOUV.js")
          , g = e("./chunk-IZC266HS.js")
          , m = e("./chunk-QVEKZRZ2.js")
          , b = e("./chunk-Z2RGWDD7.js");
        e("./chunk-3W5G4CYI.js"),
        e("./chunk-EQMZL4XU.js"),
        r.AssertionError = p.AssertionError,
        r.CAIP_ACCOUNT_ADDRESS_REGEX = c.CAIP_ACCOUNT_ADDRESS_REGEX,
        r.CAIP_ACCOUNT_ID_REGEX = c.CAIP_ACCOUNT_ID_REGEX,
        r.CAIP_CHAIN_ID_REGEX = c.CAIP_CHAIN_ID_REGEX,
        r.CAIP_NAMESPACE_REGEX = c.CAIP_NAMESPACE_REGEX,
        r.CAIP_REFERENCE_REGEX = c.CAIP_REFERENCE_REGEX,
        r.CaipAccountAddressStruct = c.CaipAccountAddressStruct,
        r.CaipAccountIdStruct = c.CaipAccountIdStruct,
        r.CaipChainIdStruct = c.CaipChainIdStruct,
        r.CaipNamespaceStruct = c.CaipNamespaceStruct,
        r.CaipReferenceStruct = c.CaipReferenceStruct,
        r.ChecksumStruct = u.ChecksumStruct,
        r.Duration = i.Duration,
        r.ESCAPE_CHARACTERS_REGEXP = m.ESCAPE_CHARACTERS_REGEXP,
        r.FrozenMap = b.FrozenMap,
        r.FrozenSet = b.FrozenSet,
        r.HexAddressStruct = h.HexAddressStruct,
        r.HexChecksumAddressStruct = h.HexChecksumAddressStruct,
        r.HexStruct = h.HexStruct,
        r.JsonRpcErrorStruct = a.JsonRpcErrorStruct,
        r.JsonRpcFailureStruct = a.JsonRpcFailureStruct,
        r.JsonRpcIdStruct = a.JsonRpcIdStruct,
        r.JsonRpcNotificationStruct = a.JsonRpcNotificationStruct,
        r.JsonRpcParamsStruct = a.JsonRpcParamsStruct,
        r.JsonRpcRequestStruct = a.JsonRpcRequestStruct,
        r.JsonRpcResponseStruct = a.JsonRpcResponseStruct,
        r.JsonRpcSuccessStruct = a.JsonRpcSuccessStruct,
        r.JsonRpcVersionStruct = a.JsonRpcVersionStruct,
        r.JsonSize = m.JsonSize,
        r.JsonStruct = a.JsonStruct,
        r.KnownCaipNamespace = c.KnownCaipNamespace,
        r.PendingJsonRpcResponseStruct = a.PendingJsonRpcResponseStruct,
        r.StrictHexStruct = h.StrictHexStruct,
        r.UnsafeJsonStruct = a.UnsafeJsonStruct,
        r.VersionRangeStruct = s.VersionRangeStruct,
        r.VersionStruct = s.VersionStruct,
        r.add0x = h.add0x,
        r.assert = p.assert,
        r.assertExhaustive = p.assertExhaustive,
        r.assertIsBytes = h.assertIsBytes,
        r.assertIsHexString = h.assertIsHexString,
        r.assertIsJsonRpcError = a.assertIsJsonRpcError,
        r.assertIsJsonRpcFailure = a.assertIsJsonRpcFailure,
        r.assertIsJsonRpcNotification = a.assertIsJsonRpcNotification,
        r.assertIsJsonRpcRequest = a.assertIsJsonRpcRequest,
        r.assertIsJsonRpcResponse = a.assertIsJsonRpcResponse,
        r.assertIsJsonRpcSuccess = a.assertIsJsonRpcSuccess,
        r.assertIsPendingJsonRpcResponse = a.assertIsPendingJsonRpcResponse,
        r.assertIsSemVerRange = s.assertIsSemVerRange,
        r.assertIsSemVerVersion = s.assertIsSemVerVersion,
        r.assertIsStrictHexString = h.assertIsStrictHexString,
        r.assertStruct = p.assertStruct,
        r.base64 = d.base64,
        r.base64ToBytes = h.base64ToBytes,
        r.bigIntToBytes = h.bigIntToBytes,
        r.bigIntToHex = n.bigIntToHex,
        r.bytesToBase64 = h.bytesToBase64,
        r.bytesToBigInt = h.bytesToBigInt,
        r.bytesToHex = h.bytesToHex,
        r.bytesToNumber = h.bytesToNumber,
        r.bytesToSignedBigInt = h.bytesToSignedBigInt,
        r.bytesToString = h.bytesToString,
        r.calculateNumberSize = m.calculateNumberSize,
        r.calculateStringSize = m.calculateStringSize,
        r.concatBytes = h.concatBytes,
        r.createBigInt = f.createBigInt,
        r.createBytes = f.createBytes,
        r.createDataView = h.createDataView,
        r.createDeferredPromise = o.createDeferredPromise,
        r.createHex = f.createHex,
        r.createModuleLogger = l.createModuleLogger,
        r.createNumber = f.createNumber,
        r.createProjectLogger = l.createProjectLogger,
        r.exactOptional = a.exactOptional,
        r.getChecksumAddress = h.getChecksumAddress,
        r.getErrorMessage = g.getErrorMessage,
        r.getJsonRpcIdValidator = a.getJsonRpcIdValidator,
        r.getJsonSize = a.getJsonSize,
        r.getKnownPropertyNames = m.getKnownPropertyNames,
        r.getSafeJson = a.getSafeJson,
        r.gtRange = s.gtRange,
        r.gtVersion = s.gtVersion,
        r.hasProperty = m.hasProperty,
        r.hexToBigInt = n.hexToBigInt,
        r.hexToBytes = h.hexToBytes,
        r.hexToNumber = n.hexToNumber,
        r.inMilliseconds = i.inMilliseconds,
        r.isASCII = m.isASCII,
        r.isBytes = h.isBytes,
        r.isCaipAccountAddress = c.isCaipAccountAddress,
        r.isCaipAccountId = c.isCaipAccountId,
        r.isCaipChainId = c.isCaipChainId,
        r.isCaipNamespace = c.isCaipNamespace,
        r.isCaipReference = c.isCaipReference,
        r.isErrorWithCode = g.isErrorWithCode,
        r.isErrorWithMessage = g.isErrorWithMessage,
        r.isErrorWithStack = g.isErrorWithStack,
        r.isHexString = h.isHexString,
        r.isJsonRpcError = a.isJsonRpcError,
        r.isJsonRpcFailure = a.isJsonRpcFailure,
        r.isJsonRpcNotification = a.isJsonRpcNotification,
        r.isJsonRpcRequest = a.isJsonRpcRequest,
        r.isJsonRpcResponse = a.isJsonRpcResponse,
        r.isJsonRpcSuccess = a.isJsonRpcSuccess,
        r.isNonEmptyArray = m.isNonEmptyArray,
        r.isNullOrUndefined = m.isNullOrUndefined,
        r.isObject = m.isObject,
        r.isPendingJsonRpcResponse = a.isPendingJsonRpcResponse,
        r.isPlainObject = m.isPlainObject,
        r.isStrictHexString = h.isStrictHexString,
        r.isValidChecksumAddress = h.isValidChecksumAddress,
        r.isValidHexAddress = h.isValidHexAddress,
        r.isValidJson = a.isValidJson,
        r.isValidSemVerRange = s.isValidSemVerRange,
        r.isValidSemVerVersion = s.isValidSemVerVersion,
        r.jsonrpc2 = a.jsonrpc2,
        r.numberToBytes = h.numberToBytes,
        r.numberToHex = n.numberToHex,
        r.object = a.object,
        r.parseCaipAccountId = c.parseCaipAccountId,
        r.parseCaipChainId = c.parseCaipChainId,
        r.remove0x = h.remove0x,
        r.satisfiesVersionRange = s.satisfiesVersionRange,
        r.signedBigIntToBytes = h.signedBigIntToBytes,
        r.stringToBytes = h.stringToBytes,
        r.timeSince = i.timeSince,
        r.toCaipChainId = c.toCaipChainId,
        r.valueToBytes = h.valueToBytes,
        r.wrapError = g.wrapError
    }
    , {
        "./chunk-2LBGT4GH.js": 18,
        "./chunk-3W5G4CYI.js": 19,
        "./chunk-4D6XQBHA.js": 20,
        "./chunk-4RMX5YWE.js": 21,
        "./chunk-5AVWINSB.js": 22,
        "./chunk-6NZW4WK4.js": 23,
        "./chunk-6ZDHSOUV.js": 24,
        "./chunk-C6HGFEYL.js": 25,
        "./chunk-DHVKFDHQ.js": 26,
        "./chunk-E4C7EW4R.js": 27,
        "./chunk-EQMZL4XU.js": 28,
        "./chunk-IZC266HS.js": 29,
        "./chunk-LC2CRSWD.js": 30,
        "./chunk-OLLG4H35.js": 31,
        "./chunk-QEPVHEP7.js": 32,
        "./chunk-QVEKZRZ2.js": 33,
        "./chunk-RKRGAFXY.js": 34,
        "./chunk-UOTVU7OQ.js": 35,
        "./chunk-VFXTVNXN.js": 36,
        "./chunk-YWAID473.js": 37,
        "./chunk-Z2RGWDD7.js": 38
    }],
    40: [function(e, t, r) {
        "use strict";
        function n(e) {
            if (!Number.isSafeInteger(e) || e < 0)
                throw new Error(`positive integer expected, not ${e}`)
        }
        function o(e) {
            if ("boolean" != typeof e)
                throw new Error(`boolean expected, not ${e}`)
        }
        function i(e) {
            return e instanceof Uint8Array || null != e && "object" == typeof e && "Uint8Array" === e.constructor.name
        }
        function s(e, ...t) {
            if (!i(e))
                throw new Error("Uint8Array expected");
            if (t.length > 0 && !t.includes(e.length))
                throw new Error(`Uint8Array expected of length ${t}, not of length=${e.length}`)
        }
        function a(e) {
            if ("function" != typeof e || "function" != typeof e.create)
                throw new Error("Hash should be wrapped by utils.wrapConstructor");
            n(e.outputLen),
            n(e.blockLen)
        }
        function l(e, t=!0) {
            if (e.destroyed)
                throw new Error("Hash instance has been destroyed");
            if (t && e.finished)
                throw new Error("Hash#digest() has already been called")
        }
        function c(e, t) {
            s(e);
            const r = t.outputLen;
            if (e.length < r)
                throw new Error(`digestInto() expects output buffer of length at least ${r}`)
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.output = r.exists = r.hash = r.bytes = r.bool = r.number = r.isBytes = void 0,
        r.number = n,
        r.bool = o,
        r.isBytes = i,
        r.bytes = s,
        r.hash = a,
        r.exists = l,
        r.output = c;
        const u = {
            number: n,
            bool: o,
            bytes: s,
            hash: a,
            exists: l,
            output: c
        };
        r.default = u
    }
    , {}],
    41: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.add5L = r.add5H = r.add4H = r.add4L = r.add3H = r.add3L = r.add = r.rotlBL = r.rotlBH = r.rotlSL = r.rotlSH = r.rotr32L = r.rotr32H = r.rotrBL = r.rotrBH = r.rotrSL = r.rotrSH = r.shrSL = r.shrSH = r.toBig = r.split = r.fromBig = void 0;
        const n = BigInt(2 ** 32 - 1)
          , o = BigInt(32);
        function i(e, t=!1) {
            return t ? {
                h: Number(e & n),
                l: Number(e >> o & n)
            } : {
                h: 0 | Number(e >> o & n),
                l: 0 | Number(e & n)
            }
        }
        function s(e, t=!1) {
            let r = new Uint32Array(e.length)
              , n = new Uint32Array(e.length);
            for (let o = 0; o < e.length; o++) {
                const {h: s, l: a} = i(e[o], t);
                [r[o],n[o]] = [s, a]
            }
            return [r, n]
        }
        r.fromBig = i,
        r.split = s;
        const a = (e, t) => BigInt(e >>> 0) << o | BigInt(t >>> 0);
        r.toBig = a;
        const l = (e, t, r) => e >>> r;
        r.shrSH = l;
        const c = (e, t, r) => e << 32 - r | t >>> r;
        r.shrSL = c;
        const u = (e, t, r) => e >>> r | t << 32 - r;
        r.rotrSH = u;
        const d = (e, t, r) => e << 32 - r | t >>> r;
        r.rotrSL = d;
        const f = (e, t, r) => e << 64 - r | t >>> r - 32;
        r.rotrBH = f;
        const h = (e, t, r) => e >>> r - 32 | t << 64 - r;
        r.rotrBL = h;
        const p = (e, t) => t;
        r.rotr32H = p;
        const g = (e, t) => e;
        r.rotr32L = g;
        const m = (e, t, r) => e << r | t >>> 32 - r;
        r.rotlSH = m;
        const b = (e, t, r) => t << r | e >>> 32 - r;
        r.rotlSL = b;
        const y = (e, t, r) => t << r - 32 | e >>> 64 - r;
        r.rotlBH = y;
        const v = (e, t, r) => e << r - 32 | t >>> 64 - r;
        function w(e, t, r, n) {
            const o = (t >>> 0) + (n >>> 0);
            return {
                h: e + r + (o / 2 ** 32 | 0) | 0,
                l: 0 | o
            }
        }
        r.rotlBL = v,
        r.add = w;
        const _ = (e, t, r) => (e >>> 0) + (t >>> 0) + (r >>> 0);
        r.add3L = _;
        const E = (e, t, r, n) => t + r + n + (e / 2 ** 32 | 0) | 0;
        r.add3H = E;
        const S = (e, t, r, n) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0);
        r.add4L = S;
        const A = (e, t, r, n, o) => t + r + n + o + (e / 2 ** 32 | 0) | 0;
        r.add4H = A;
        const R = (e, t, r, n, o) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (o >>> 0);
        r.add5L = R;
        const M = (e, t, r, n, o, i) => t + r + n + o + i + (e / 2 ** 32 | 0) | 0;
        r.add5H = M;
        const x = {
            fromBig: i,
            split: s,
            toBig: a,
            shrSH: l,
            shrSL: c,
            rotrSH: u,
            rotrSL: d,
            rotrBH: f,
            rotrBL: h,
            rotr32H: p,
            rotr32L: g,
            rotlSH: m,
            rotlSL: b,
            rotlBH: y,
            rotlBL: v,
            add: w,
            add3L: _,
            add3H: E,
            add4L: S,
            add4H: A,
            add5H: M,
            add5L: R
        };
        r.default = x
    }
    , {}],
    42: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.crypto = void 0,
        r.crypto = "object" == typeof globalThis && "crypto"in globalThis ? globalThis.crypto : void 0
    }
    , {}],
    43: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.shake256 = r.shake128 = r.keccak_512 = r.keccak_384 = r.keccak_256 = r.keccak_224 = r.sha3_512 = r.sha3_384 = r.sha3_256 = r.sha3_224 = r.Keccak = r.keccakP = void 0;
        const n = e("./_assert.js")
          , o = e("./_u64.js")
          , i = e("./utils.js")
          , s = []
          , a = []
          , l = []
          , c = BigInt(0)
          , u = BigInt(1)
          , d = BigInt(2)
          , f = BigInt(7)
          , h = BigInt(256)
          , p = BigInt(113);
        for (let e = 0, t = u, r = 1, n = 0; e < 24; e++) {
            [r,n] = [n, (2 * r + 3 * n) % 5],
            s.push(2 * (5 * n + r)),
            a.push((e + 1) * (e + 2) / 2 % 64);
            let o = c;
            for (let e = 0; e < 7; e++)
                t = (t << u ^ (t >> f) * p) % h,
                t & d && (o ^= u << (u << BigInt(e)) - u);
            l.push(o)
        }
        const [g,m] = (0,
        o.split)(l, !0)
          , b = (e, t, r) => r > 32 ? (0,
        o.rotlBH)(e, t, r) : (0,
        o.rotlSH)(e, t, r)
          , y = (e, t, r) => r > 32 ? (0,
        o.rotlBL)(e, t, r) : (0,
        o.rotlSL)(e, t, r);
        function v(e, t=24) {
            const r = new Uint32Array(10);
            for (let n = 24 - t; n < 24; n++) {
                for (let t = 0; t < 10; t++)
                    r[t] = e[t] ^ e[t + 10] ^ e[t + 20] ^ e[t + 30] ^ e[t + 40];
                for (let t = 0; t < 10; t += 2) {
                    const n = (t + 8) % 10
                      , o = (t + 2) % 10
                      , i = r[o]
                      , s = r[o + 1]
                      , a = b(i, s, 1) ^ r[n]
                      , l = y(i, s, 1) ^ r[n + 1];
                    for (let r = 0; r < 50; r += 10)
                        e[t + r] ^= a,
                        e[t + r + 1] ^= l
                }
                let t = e[2]
                  , o = e[3];
                for (let r = 0; r < 24; r++) {
                    const n = a[r]
                      , i = b(t, o, n)
                      , l = y(t, o, n)
                      , c = s[r];
                    t = e[c],
                    o = e[c + 1],
                    e[c] = i,
                    e[c + 1] = l
                }
                for (let t = 0; t < 50; t += 10) {
                    for (let n = 0; n < 10; n++)
                        r[n] = e[t + n];
                    for (let n = 0; n < 10; n++)
                        e[t + n] ^= ~r[(n + 2) % 10] & r[(n + 4) % 10]
                }
                e[0] ^= g[n],
                e[1] ^= m[n]
            }
            r.fill(0)
        }
        r.keccakP = v;
        class w extends i.Hash {
            constructor(e, t, r, o=!1, s=24) {
                if (super(),
                this.blockLen = e,
                this.suffix = t,
                this.outputLen = r,
                this.enableXOF = o,
                this.rounds = s,
                this.pos = 0,
                this.posOut = 0,
                this.finished = !1,
                this.destroyed = !1,
                (0,
                n.number)(r),
                0 >= this.blockLen || this.blockLen >= 200)
                    throw new Error("Sha3 supports only keccak-f1600 function");
                this.state = new Uint8Array(200),
                this.state32 = (0,
                i.u32)(this.state)
            }
            keccak() {
                i.isLE || (0,
                i.byteSwap32)(this.state32),
                v(this.state32, this.rounds),
                i.isLE || (0,
                i.byteSwap32)(this.state32),
                this.posOut = 0,
                this.pos = 0
            }
            update(e) {
                (0,
                n.exists)(this);
                const {blockLen: t, state: r} = this
                  , o = (e = (0,
                i.toBytes)(e)).length;
                for (let n = 0; n < o; ) {
                    const i = Math.min(t - this.pos, o - n);
                    for (let t = 0; t < i; t++)
                        r[this.pos++] ^= e[n++];
                    this.pos === t && this.keccak()
                }
                return this
            }
            finish() {
                if (this.finished)
                    return;
                this.finished = !0;
                const {state: e, suffix: t, pos: r, blockLen: n} = this;
                e[r] ^= t,
                128 & t && r === n - 1 && this.keccak(),
                e[n - 1] ^= 128,
                this.keccak()
            }
            writeInto(e) {
                (0,
                n.exists)(this, !1),
                (0,
                n.bytes)(e),
                this.finish();
                const t = this.state
                  , {blockLen: r} = this;
                for (let n = 0, o = e.length; n < o; ) {
                    this.posOut >= r && this.keccak();
                    const i = Math.min(r - this.posOut, o - n);
                    e.set(t.subarray(this.posOut, this.posOut + i), n),
                    this.posOut += i,
                    n += i
                }
                return e
            }
            xofInto(e) {
                if (!this.enableXOF)
                    throw new Error("XOF is not possible for this instance");
                return this.writeInto(e)
            }
            xof(e) {
                return (0,
                n.number)(e),
                this.xofInto(new Uint8Array(e))
            }
            digestInto(e) {
                if ((0,
                n.output)(e, this),
                this.finished)
                    throw new Error("digest() was already called");
                return this.writeInto(e),
                this.destroy(),
                e
            }
            digest() {
                return this.digestInto(new Uint8Array(this.outputLen))
            }
            destroy() {
                this.destroyed = !0,
                this.state.fill(0)
            }
            _cloneInto(e) {
                const {blockLen: t, suffix: r, outputLen: n, rounds: o, enableXOF: i} = this;
                return e || (e = new w(t,r,n,i,o)),
                e.state32.set(this.state32),
                e.pos = this.pos,
                e.posOut = this.posOut,
                e.finished = this.finished,
                e.rounds = o,
                e.suffix = r,
                e.outputLen = n,
                e.enableXOF = i,
                e.destroyed = this.destroyed,
                e
            }
        }
        r.Keccak = w;
        const _ = (e, t, r) => (0,
        i.wrapConstructor)(( () => new w(t,e,r)));
        r.sha3_224 = _(6, 144, 28),
        r.sha3_256 = _(6, 136, 32),
        r.sha3_384 = _(6, 104, 48),
        r.sha3_512 = _(6, 72, 64),
        r.keccak_224 = _(1, 144, 28),
        r.keccak_256 = _(1, 136, 32),
        r.keccak_384 = _(1, 104, 48),
        r.keccak_512 = _(1, 72, 64);
        const E = (e, t, r) => (0,
        i.wrapXOFConstructorWithOpts)(( (n={}) => new w(t,e,void 0 === n.dkLen ? r : n.dkLen,!0)));
        r.shake128 = E(31, 168, 16),
        r.shake256 = E(31, 136, 32)
    }
    , {
        "./_assert.js": 40,
        "./_u64.js": 41,
        "./utils.js": 44
    }],
    44: [function(e, t, r) {
        "use strict";
        /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.randomBytes = r.wrapXOFConstructorWithOpts = r.wrapConstructorWithOpts = r.wrapConstructor = r.checkOpts = r.Hash = r.concatBytes = r.toBytes = r.utf8ToBytes = r.asyncLoop = r.nextTick = r.hexToBytes = r.bytesToHex = r.byteSwap32 = r.byteSwapIfBE = r.byteSwap = r.isLE = r.rotl = r.rotr = r.createView = r.u32 = r.u8 = r.isBytes = void 0;
        const n = e("@noble/hashes/crypto")
          , o = e("./_assert.js");
        r.isBytes = function(e) {
            return e instanceof Uint8Array || null != e && "object" == typeof e && "Uint8Array" === e.constructor.name
        }
        ;
        r.u8 = e => new Uint8Array(e.buffer,e.byteOffset,e.byteLength);
        r.u32 = e => new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength / 4));
        r.createView = e => new DataView(e.buffer,e.byteOffset,e.byteLength);
        r.rotr = (e, t) => e << 32 - t | e >>> t;
        r.rotl = (e, t) => e << t | e >>> 32 - t >>> 0,
        r.isLE = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0];
        r.byteSwap = e => e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255,
        r.byteSwapIfBE = r.isLE ? e => e : e => (0,
        r.byteSwap)(e),
        r.byteSwap32 = function(e) {
            for (let t = 0; t < e.length; t++)
                e[t] = (0,
                r.byteSwap)(e[t])
        }
        ;
        const i = Array.from({
            length: 256
        }, ( (e, t) => t.toString(16).padStart(2, "0")));
        r.bytesToHex = function(e) {
            (0,
            o.bytes)(e);
            let t = "";
            for (let r = 0; r < e.length; r++)
                t += i[e[r]];
            return t
        }
        ;
        const s = {
            _0: 48,
            _9: 57,
            _A: 65,
            _F: 70,
            _a: 97,
            _f: 102
        };
        function a(e) {
            return e >= s._0 && e <= s._9 ? e - s._0 : e >= s._A && e <= s._F ? e - (s._A - 10) : e >= s._a && e <= s._f ? e - (s._a - 10) : void 0
        }
        r.hexToBytes = function(e) {
            if ("string" != typeof e)
                throw new Error("hex string expected, got " + typeof e);
            const t = e.length
              , r = t / 2;
            if (t % 2)
                throw new Error("padded hex string expected, got unpadded hex of length " + t);
            const n = new Uint8Array(r);
            for (let t = 0, o = 0; t < r; t++,
            o += 2) {
                const r = a(e.charCodeAt(o))
                  , i = a(e.charCodeAt(o + 1));
                if (void 0 === r || void 0 === i) {
                    const t = e[o] + e[o + 1];
                    throw new Error('hex string expected, got non-hex character "' + t + '" at index ' + o)
                }
                n[t] = 16 * r + i
            }
            return n
        }
        ;
        function l(e) {
            if ("string" != typeof e)
                throw new Error("utf8ToBytes expected string, got " + typeof e);
            return new Uint8Array((new TextEncoder).encode(e))
        }
        function c(e) {
            return "string" == typeof e && (e = l(e)),
            (0,
            o.bytes)(e),
            e
        }
        r.nextTick = async () => {}
        ,
        r.asyncLoop = async function(e, t, n) {
            let o = Date.now();
            for (let i = 0; i < e; i++) {
                n(i);
                const e = Date.now() - o;
                e >= 0 && e < t || (await (0,
                r.nextTick)(),
                o += e)
            }
        }
        ,
        r.utf8ToBytes = l,
        r.toBytes = c,
        r.concatBytes = function(...e) {
            let t = 0;
            for (let r = 0; r < e.length; r++) {
                const n = e[r];
                (0,
                o.bytes)(n),
                t += n.length
            }
            const r = new Uint8Array(t);
            for (let t = 0, n = 0; t < e.length; t++) {
                const o = e[t];
                r.set(o, n),
                n += o.length
            }
            return r
        }
        ;
        r.Hash = class {
            clone() {
                return this._cloneInto()
            }
        }
        ;
        const u = {}.toString;
        r.checkOpts = function(e, t) {
            if (void 0 !== t && "[object Object]" !== u.call(t))
                throw new Error("Options should be object or undefined");
            return Object.assign(e, t)
        }
        ,
        r.wrapConstructor = function(e) {
            const t = t => e().update(c(t)).digest()
              , r = e();
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = () => e(),
            t
        }
        ,
        r.wrapConstructorWithOpts = function(e) {
            const t = (t, r) => e(r).update(c(t)).digest()
              , r = e({});
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = t => e(t),
            t
        }
        ,
        r.wrapXOFConstructorWithOpts = function(e) {
            const t = (t, r) => e(r).update(c(t)).digest()
              , r = e({});
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = t => e(t),
            t
        }
        ,
        r.randomBytes = function(e=32) {
            if (n.crypto && "function" == typeof n.crypto.getRandomValues)
                return n.crypto.getRandomValues(new Uint8Array(e));
            throw new Error("crypto.getRandomValues must be defined")
        }
    }
    , {
        "./_assert.js": 40,
        "@noble/hashes/crypto": 42
    }],
    45: [function(e, t, r) {
        "use strict";
        /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
        function n(e) {
            if (!Number.isSafeInteger(e))
                throw new Error(`Wrong integer: ${e}`)
        }
        function o(e) {
            return e instanceof Uint8Array || null != e && "object" == typeof e && "Uint8Array" === e.constructor.name
        }
        function i(...e) {
            const t = e => e
              , r = (e, t) => r => e(t(r));
            return {
                encode: e.map((e => e.encode)).reduceRight(r, t),
                decode: e.map((e => e.decode)).reduce(r, t)
            }
        }
        function s(e) {
            return {
                encode: t => {
                    if (!Array.isArray(t) || t.length && "number" != typeof t[0])
                        throw new Error("alphabet.encode input should be an array of numbers");
                    return t.map((t => {
                        if (n(t),
                        t < 0 || t >= e.length)
                            throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
                        return e[t]
                    }
                    ))
                }
                ,
                decode: t => {
                    if (!Array.isArray(t) || t.length && "string" != typeof t[0])
                        throw new Error("alphabet.decode input should be array of strings");
                    return t.map((t => {
                        if ("string" != typeof t)
                            throw new Error(`alphabet.decode: not string element=${t}`);
                        const r = e.indexOf(t);
                        if (-1 === r)
                            throw new Error(`Unknown letter: "${t}". Allowed: ${e}`);
                        return r
                    }
                    ))
                }
            }
        }
        function a(e="") {
            if ("string" != typeof e)
                throw new Error("join separator should be string");
            return {
                encode: t => {
                    if (!Array.isArray(t) || t.length && "string" != typeof t[0])
                        throw new Error("join.encode input should be array of strings");
                    for (let e of t)
                        if ("string" != typeof e)
                            throw new Error(`join.encode: non-string input=${e}`);
                    return t.join(e)
                }
                ,
                decode: t => {
                    if ("string" != typeof t)
                        throw new Error("join.decode input should be string");
                    return t.split(e)
                }
            }
        }
        function l(e, t="=") {
            if (n(e),
            "string" != typeof t)
                throw new Error("padding chr should be string");
            return {
                encode(r) {
                    if (!Array.isArray(r) || r.length && "string" != typeof r[0])
                        throw new Error("padding.encode input should be array of strings");
                    for (let e of r)
                        if ("string" != typeof e)
                            throw new Error(`padding.encode: non-string input=${e}`);
                    for (; r.length * e % 8; )
                        r.push(t);
                    return r
                },
                decode(r) {
                    if (!Array.isArray(r) || r.length && "string" != typeof r[0])
                        throw new Error("padding.encode input should be array of strings");
                    for (let e of r)
                        if ("string" != typeof e)
                            throw new Error(`padding.decode: non-string input=${e}`);
                    let n = r.length;
                    if (n * e % 8)
                        throw new Error("Invalid padding: string should have whole number of bytes");
                    for (; n > 0 && r[n - 1] === t; n--)
                        if (!((n - 1) * e % 8))
                            throw new Error("Invalid padding: string has too much padding");
                    return r.slice(0, n)
                }
            }
        }
        function c(e) {
            if ("function" != typeof e)
                throw new Error("normalize fn should be function");
            return {
                encode: e => e,
                decode: t => e(t)
            }
        }
        function u(e, t, r) {
            if (t < 2)
                throw new Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
            if (r < 2)
                throw new Error(`convertRadix: wrong to=${r}, base cannot be less than 2`);
            if (!Array.isArray(e))
                throw new Error("convertRadix: data should be array");
            if (!e.length)
                return [];
            let o = 0;
            const i = []
              , s = Array.from(e);
            for (s.forEach((e => {
                if (n(e),
                e < 0 || e >= t)
                    throw new Error(`Wrong integer: ${e}`)
            }
            )); ; ) {
                let e = 0
                  , n = !0;
                for (let i = o; i < s.length; i++) {
                    const a = s[i]
                      , l = t * e + a;
                    if (!Number.isSafeInteger(l) || t * e / t !== e || l - a != t * e)
                        throw new Error("convertRadix: carry overflow");
                    e = l % r;
                    const c = Math.floor(l / r);
                    if (s[i] = c,
                    !Number.isSafeInteger(c) || c * r + e !== l)
                        throw new Error("convertRadix: carry overflow");
                    n && (c ? n = !1 : o = i)
                }
                if (i.push(e),
                n)
                    break
            }
            for (let t = 0; t < e.length - 1 && 0 === e[t]; t++)
                i.push(0);
            return i.reverse()
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.bytes = r.stringToBytes = r.str = r.bytesToString = r.hex = r.utf8 = r.bech32m = r.bech32 = r.base58check = r.createBase58check = r.base58xmr = r.base58xrp = r.base58flickr = r.base58 = r.base64urlnopad = r.base64url = r.base64nopad = r.base64 = r.base32crockford = r.base32hex = r.base32 = r.base16 = r.utils = r.assertNumber = void 0,
        r.assertNumber = n;
        const d = (e, t) => t ? d(t, e % t) : e
          , f = (e, t) => e + (t - d(e, t));
        function h(e, t, r, o) {
            if (!Array.isArray(e))
                throw new Error("convertRadix2: data should be array");
            if (t <= 0 || t > 32)
                throw new Error(`convertRadix2: wrong from=${t}`);
            if (r <= 0 || r > 32)
                throw new Error(`convertRadix2: wrong to=${r}`);
            if (f(t, r) > 32)
                throw new Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${f(t, r)}`);
            let i = 0
              , s = 0;
            const a = 2 ** r - 1
              , l = [];
            for (const o of e) {
                if (n(o),
                o >= 2 ** t)
                    throw new Error(`convertRadix2: invalid data word=${o} from=${t}`);
                if (i = i << t | o,
                s + t > 32)
                    throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);
                for (s += t; s >= r; s -= r)
                    l.push((i >> s - r & a) >>> 0);
                i &= 2 ** s - 1
            }
            if (i = i << r - s & a,
            !o && s >= t)
                throw new Error("Excess padding");
            if (!o && i)
                throw new Error(`Non-zero padding: ${i}`);
            return o && s > 0 && l.push(i >>> 0),
            l
        }
        function p(e) {
            return n(e),
            {
                encode: t => {
                    if (!o(t))
                        throw new Error("radix.encode input should be Uint8Array");
                    return u(Array.from(t), 256, e)
                }
                ,
                decode: t => {
                    if (!Array.isArray(t) || t.length && "number" != typeof t[0])
                        throw new Error("radix.decode input should be array of numbers");
                    return Uint8Array.from(u(t, e, 256))
                }
            }
        }
        function g(e, t=!1) {
            if (n(e),
            e <= 0 || e > 32)
                throw new Error("radix2: bits should be in (0..32]");
            if (f(8, e) > 32 || f(e, 8) > 32)
                throw new Error("radix2: carry overflow");
            return {
                encode: r => {
                    if (!o(r))
                        throw new Error("radix2.encode input should be Uint8Array");
                    return h(Array.from(r), 8, e, !t)
                }
                ,
                decode: r => {
                    if (!Array.isArray(r) || r.length && "number" != typeof r[0])
                        throw new Error("radix2.decode input should be array of numbers");
                    return Uint8Array.from(h(r, e, 8, t))
                }
            }
        }
        function m(e) {
            if ("function" != typeof e)
                throw new Error("unsafeWrapper fn should be function");
            return function(...t) {
                try {
                    return e.apply(null, t)
                } catch (e) {}
            }
        }
        function b(e, t) {
            if (n(e),
            "function" != typeof t)
                throw new Error("checksum fn should be function");
            return {
                encode(r) {
                    if (!o(r))
                        throw new Error("checksum.encode: input should be Uint8Array");
                    const n = t(r).slice(0, e)
                      , i = new Uint8Array(r.length + e);
                    return i.set(r),
                    i.set(n, r.length),
                    i
                },
                decode(r) {
                    if (!o(r))
                        throw new Error("checksum.decode: input should be Uint8Array");
                    const n = r.slice(0, -e)
                      , i = t(n).slice(0, e)
                      , s = r.slice(-e);
                    for (let t = 0; t < e; t++)
                        if (i[t] !== s[t])
                            throw new Error("Invalid checksum");
                    return n
                }
            }
        }
        r.utils = {
            alphabet: s,
            chain: i,
            checksum: b,
            convertRadix: u,
            convertRadix2: h,
            radix: p,
            radix2: g,
            join: a,
            padding: l
        },
        r.base16 = i(g(4), s("0123456789ABCDEF"), a("")),
        r.base32 = i(g(5), s("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), l(5), a("")),
        r.base32hex = i(g(5), s("0123456789ABCDEFGHIJKLMNOPQRSTUV"), l(5), a("")),
        r.base32crockford = i(g(5), s("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), a(""), c((e => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))),
        r.base64 = i(g(6), s("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), l(6), a("")),
        r.base64nopad = i(g(6), s("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), a("")),
        r.base64url = i(g(6), s("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), l(6), a("")),
        r.base64urlnopad = i(g(6), s("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), a(""));
        const y = e => i(p(58), s(e), a(""));
        r.base58 = y("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),
        r.base58flickr = y("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),
        r.base58xrp = y("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
        const v = [0, 2, 3, 5, 6, 7, 9, 10, 11];
        r.base58xmr = {
            encode(e) {
                let t = "";
                for (let n = 0; n < e.length; n += 8) {
                    const o = e.subarray(n, n + 8);
                    t += r.base58.encode(o).padStart(v[o.length], "1")
                }
                return t
            },
            decode(e) {
                let t = [];
                for (let n = 0; n < e.length; n += 11) {
                    const o = e.slice(n, n + 11)
                      , i = v.indexOf(o.length)
                      , s = r.base58.decode(o);
                    for (let e = 0; e < s.length - i; e++)
                        if (0 !== s[e])
                            throw new Error("base58xmr: wrong padding");
                    t = t.concat(Array.from(s.slice(s.length - i)))
                }
                return Uint8Array.from(t)
            }
        };
        r.createBase58check = e => i(b(4, (t => e(e(t)))), r.base58),
        r.base58check = r.createBase58check;
        const w = i(s("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), a(""))
          , _ = [996825010, 642813549, 513874426, 1027748829, 705979059];
        function E(e) {
            const t = e >> 25;
            let r = (33554431 & e) << 5;
            for (let e = 0; e < _.length; e++)
                1 == (t >> e & 1) && (r ^= _[e]);
            return r
        }
        function S(e, t, r=1) {
            const n = e.length;
            let o = 1;
            for (let t = 0; t < n; t++) {
                const r = e.charCodeAt(t);
                if (r < 33 || r > 126)
                    throw new Error(`Invalid prefix (${e})`);
                o = E(o) ^ r >> 5
            }
            o = E(o);
            for (let t = 0; t < n; t++)
                o = E(o) ^ 31 & e.charCodeAt(t);
            for (let e of t)
                o = E(o) ^ e;
            for (let e = 0; e < 6; e++)
                o = E(o);
            return o ^= r,
            w.encode(h([o % 2 ** 30], 30, 5, !1))
        }
        function A(e) {
            const t = "bech32" === e ? 1 : 734539939
              , r = g(5)
              , n = r.decode
              , o = r.encode
              , i = m(n);
            function s(e, r=90) {
                if ("string" != typeof e)
                    throw new Error("bech32.decode input should be string, not " + typeof e);
                if (e.length < 8 || !1 !== r && e.length > r)
                    throw new TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${r})`);
                const n = e.toLowerCase();
                if (e !== n && e !== e.toUpperCase())
                    throw new Error("String must be lowercase or uppercase");
                const o = n.lastIndexOf("1");
                if (0 === o || -1 === o)
                    throw new Error('Letter "1" must be present between prefix and data only');
                const i = n.slice(0, o)
                  , s = n.slice(o + 1);
                if (s.length < 6)
                    throw new Error("Data must be at least 6 characters long");
                const a = w.decode(s).slice(0, -6)
                  , l = S(i, a, t);
                if (!s.endsWith(l))
                    throw new Error(`Invalid checksum in ${e}: expected "${l}"`);
                return {
                    prefix: i,
                    words: a
                }
            }
            return {
                encode: function(e, r, n=90) {
                    if ("string" != typeof e)
                        throw new Error("bech32.encode prefix should be string, not " + typeof e);
                    if (!Array.isArray(r) || r.length && "number" != typeof r[0])
                        throw new Error("bech32.encode words should be array of numbers, not " + typeof r);
                    if (0 === e.length)
                        throw new TypeError(`Invalid prefix length ${e.length}`);
                    const o = e.length + 7 + r.length;
                    if (!1 !== n && o > n)
                        throw new TypeError(`Length ${o} exceeds limit ${n}`);
                    const i = e.toLowerCase()
                      , s = S(i, r, t);
                    return `${i}1${w.encode(r)}${s}`
                },
                decode: s,
                decodeToBytes: function(e) {
                    const {prefix: t, words: r} = s(e, !1);
                    return {
                        prefix: t,
                        words: r,
                        bytes: n(r)
                    }
                },
                decodeUnsafe: m(s),
                fromWords: n,
                fromWordsUnsafe: i,
                toWords: o
            }
        }
        r.bech32 = A("bech32"),
        r.bech32m = A("bech32m"),
        r.utf8 = {
            encode: e => (new TextDecoder).decode(e),
            decode: e => (new TextEncoder).encode(e)
        },
        r.hex = i(g(4), s("0123456789abcdef"), a(""), c((e => {
            if ("string" != typeof e || e.length % 2)
                throw new TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
            return e.toLowerCase()
        }
        )));
        const R = {
            utf8: r.utf8,
            hex: r.hex,
            base16: r.base16,
            base32: r.base32,
            base64: r.base64,
            base64url: r.base64url,
            base58: r.base58,
            base58xmr: r.base58xmr
        }
          , M = "Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr";
        r.bytesToString = (e, t) => {
            if ("string" != typeof e || !R.hasOwnProperty(e))
                throw new TypeError(M);
            if (!o(t))
                throw new TypeError("bytesToString() expects Uint8Array");
            return R[e].encode(t)
        }
        ,
        r.str = r.bytesToString;
        r.stringToBytes = (e, t) => {
            if (!R.hasOwnProperty(e))
                throw new TypeError(M);
            if ("string" != typeof t)
                throw new TypeError("stringToBytes() expects string");
            return R[e].decode(t)
        }
        ,
        r.bytes = r.stringToBytes
    }
    , {}],
    46: [function(e, t, r) {
        "use strict";
        const {AbortController: n} = globalThis;
        t.exports = {
            AbortController: n
        }
    }
    , {}],
    47: [function(e, t, r) {
        "use strict";
        r.byteLength = function(e) {
            var t = l(e)
              , r = t[0]
              , n = t[1];
            return 3 * (r + n) / 4 - n
        }
        ,
        r.toByteArray = function(e) {
            var t, r, n = l(e), s = n[0], a = n[1], c = new i(function(e, t, r) {
                return 3 * (t + r) / 4 - r
            }(0, s, a)), u = 0, d = a > 0 ? s - 4 : s;
            for (r = 0; r < d; r += 4)
                t = o[e.charCodeAt(r)] << 18 | o[e.charCodeAt(r + 1)] << 12 | o[e.charCodeAt(r + 2)] << 6 | o[e.charCodeAt(r + 3)],
                c[u++] = t >> 16 & 255,
                c[u++] = t >> 8 & 255,
                c[u++] = 255 & t;
            2 === a && (t = o[e.charCodeAt(r)] << 2 | o[e.charCodeAt(r + 1)] >> 4,
            c[u++] = 255 & t);
            1 === a && (t = o[e.charCodeAt(r)] << 10 | o[e.charCodeAt(r + 1)] << 4 | o[e.charCodeAt(r + 2)] >> 2,
            c[u++] = t >> 8 & 255,
            c[u++] = 255 & t);
            return c
        }
        ,
        r.fromByteArray = function(e) {
            for (var t, r = e.length, o = r % 3, i = [], s = 16383, a = 0, l = r - o; a < l; a += s)
                i.push(c(e, a, a + s > l ? l : a + s));
            1 === o ? (t = e[r - 1],
            i.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === o && (t = (e[r - 2] << 8) + e[r - 1],
            i.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
            return i.join("")
        }
        ;
        for (var n = [], o = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0; a < 64; ++a)
            n[a] = s[a],
            o[s.charCodeAt(a)] = a;
        function l(e) {
            var t = e.length;
            if (t % 4 > 0)
                throw new Error("Invalid string. Length must be a multiple of 4");
            var r = e.indexOf("=");
            return -1 === r && (r = t),
            [r, r === t ? 0 : 4 - r % 4]
        }
        function c(e, t, r) {
            for (var o, i, s = [], a = t; a < r; a += 3)
                o = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]),
                s.push(n[(i = o) >> 18 & 63] + n[i >> 12 & 63] + n[i >> 6 & 63] + n[63 & i]);
            return s.join("")
        }
        o["-".charCodeAt(0)] = 62,
        o["_".charCodeAt(0)] = 63
    }
    , {}],
    48: [function(e, t, r) {
        var n, o;
        n = this,
        o = function() {
            return function(e) {
                var t = {};
                function r(n) {
                    if (t[n])
                        return t[n].exports;
                    var o = t[n] = {
                        i: n,
                        l: !1,
                        exports: {}
                    };
                    return e[n].call(o.exports, o, o.exports, r),
                    o.l = !0,
                    o.exports
                }
                return r.m = e,
                r.c = t,
                r.d = function(e, t, n) {
                    r.o(e, t) || Object.defineProperty(e, t, {
                        enumerable: !0,
                        get: n
                    })
                }
                ,
                r.r = function(e) {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }),
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
                }
                ,
                r.t = function(e, t) {
                    if (1 & t && (e = r(e)),
                    8 & t)
                        return e;
                    if (4 & t && "object" == typeof e && e && e.__esModule)
                        return e;
                    var n = Object.create(null);
                    if (r.r(n),
                    Object.defineProperty(n, "default", {
                        enumerable: !0,
                        value: e
                    }),
                    2 & t && "string" != typeof e)
                        for (var o in e)
                            r.d(n, o, function(t) {
                                return e[t]
                            }
                            .bind(null, o));
                    return n
                }
                ,
                r.n = function(e) {
                    var t = e && e.__esModule ? function() {
                        return e.default
                    }
                    : function() {
                        return e
                    }
                    ;
                    return r.d(t, "a", t),
                    t
                }
                ,
                r.o = function(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }
                ,
                r.p = "",
                r(r.s = 90)
            }({
                17: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n = r(18)
                      , o = function() {
                        function e() {}
                        return e.getFirstMatch = function(e, t) {
                            var r = t.match(e);
                            return r && r.length > 0 && r[1] || ""
                        }
                        ,
                        e.getSecondMatch = function(e, t) {
                            var r = t.match(e);
                            return r && r.length > 1 && r[2] || ""
                        }
                        ,
                        e.matchAndReturnConst = function(e, t, r) {
                            if (e.test(t))
                                return r
                        }
                        ,
                        e.getWindowsVersionName = function(e) {
                            switch (e) {
                            case "NT":
                                return "NT";
                            case "XP":
                            case "NT 5.1":
                                return "XP";
                            case "NT 5.0":
                                return "2000";
                            case "NT 5.2":
                                return "2003";
                            case "NT 6.0":
                                return "Vista";
                            case "NT 6.1":
                                return "7";
                            case "NT 6.2":
                                return "8";
                            case "NT 6.3":
                                return "8.1";
                            case "NT 10.0":
                                return "10";
                            default:
                                return
                            }
                        }
                        ,
                        e.getMacOSVersionName = function(e) {
                            var t = e.split(".").splice(0, 2).map((function(e) {
                                return parseInt(e, 10) || 0
                            }
                            ));
                            if (t.push(0),
                            10 === t[0])
                                switch (t[1]) {
                                case 5:
                                    return "Leopard";
                                case 6:
                                    return "Snow Leopard";
                                case 7:
                                    return "Lion";
                                case 8:
                                    return "Mountain Lion";
                                case 9:
                                    return "Mavericks";
                                case 10:
                                    return "Yosemite";
                                case 11:
                                    return "El Capitan";
                                case 12:
                                    return "Sierra";
                                case 13:
                                    return "High Sierra";
                                case 14:
                                    return "Mojave";
                                case 15:
                                    return "Catalina";
                                default:
                                    return
                                }
                        }
                        ,
                        e.getAndroidVersionName = function(e) {
                            var t = e.split(".").splice(0, 2).map((function(e) {
                                return parseInt(e, 10) || 0
                            }
                            ));
                            if (t.push(0),
                            !(1 === t[0] && t[1] < 5))
                                return 1 === t[0] && t[1] < 6 ? "Cupcake" : 1 === t[0] && t[1] >= 6 ? "Donut" : 2 === t[0] && t[1] < 2 ? "Eclair" : 2 === t[0] && 2 === t[1] ? "Froyo" : 2 === t[0] && t[1] > 2 ? "Gingerbread" : 3 === t[0] ? "Honeycomb" : 4 === t[0] && t[1] < 1 ? "Ice Cream Sandwich" : 4 === t[0] && t[1] < 4 ? "Jelly Bean" : 4 === t[0] && t[1] >= 4 ? "KitKat" : 5 === t[0] ? "Lollipop" : 6 === t[0] ? "Marshmallow" : 7 === t[0] ? "Nougat" : 8 === t[0] ? "Oreo" : 9 === t[0] ? "Pie" : void 0
                        }
                        ,
                        e.getVersionPrecision = function(e) {
                            return e.split(".").length
                        }
                        ,
                        e.compareVersions = function(t, r, n) {
                            void 0 === n && (n = !1);
                            var o = e.getVersionPrecision(t)
                              , i = e.getVersionPrecision(r)
                              , s = Math.max(o, i)
                              , a = 0
                              , l = e.map([t, r], (function(t) {
                                var r = s - e.getVersionPrecision(t)
                                  , n = t + new Array(r + 1).join(".0");
                                return e.map(n.split("."), (function(e) {
                                    return new Array(20 - e.length).join("0") + e
                                }
                                )).reverse()
                            }
                            ));
                            for (n && (a = s - Math.min(o, i)),
                            s -= 1; s >= a; ) {
                                if (l[0][s] > l[1][s])
                                    return 1;
                                if (l[0][s] === l[1][s]) {
                                    if (s === a)
                                        return 0;
                                    s -= 1
                                } else if (l[0][s] < l[1][s])
                                    return -1
                            }
                        }
                        ,
                        e.map = function(e, t) {
                            var r, n = [];
                            if (Array.prototype.map)
                                return Array.prototype.map.call(e, t);
                            for (r = 0; r < e.length; r += 1)
                                n.push(t(e[r]));
                            return n
                        }
                        ,
                        e.find = function(e, t) {
                            var r, n;
                            if (Array.prototype.find)
                                return Array.prototype.find.call(e, t);
                            for (r = 0,
                            n = e.length; r < n; r += 1) {
                                var o = e[r];
                                if (t(o, r))
                                    return o
                            }
                        }
                        ,
                        e.assign = function(e) {
                            for (var t, r, n = e, o = arguments.length, i = new Array(o > 1 ? o - 1 : 0), s = 1; s < o; s++)
                                i[s - 1] = arguments[s];
                            if (Object.assign)
                                return Object.assign.apply(Object, [e].concat(i));
                            var a = function() {
                                var e = i[t];
                                "object" == typeof e && null !== e && Object.keys(e).forEach((function(t) {
                                    n[t] = e[t]
                                }
                                ))
                            };
                            for (t = 0,
                            r = i.length; t < r; t += 1)
                                a();
                            return e
                        }
                        ,
                        e.getBrowserAlias = function(e) {
                            return n.BROWSER_ALIASES_MAP[e]
                        }
                        ,
                        e.getBrowserTypeByAlias = function(e) {
                            return n.BROWSER_MAP[e] || ""
                        }
                        ,
                        e
                    }();
                    t.default = o,
                    e.exports = t.default
                },
                18: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.ENGINE_MAP = t.OS_MAP = t.PLATFORMS_MAP = t.BROWSER_MAP = t.BROWSER_ALIASES_MAP = void 0,
                    t.BROWSER_ALIASES_MAP = {
                        "Amazon Silk": "amazon_silk",
                        "Android Browser": "android",
                        Bada: "bada",
                        BlackBerry: "blackberry",
                        Chrome: "chrome",
                        Chromium: "chromium",
                        Electron: "electron",
                        Epiphany: "epiphany",
                        Firefox: "firefox",
                        Focus: "focus",
                        Generic: "generic",
                        "Google Search": "google_search",
                        Googlebot: "googlebot",
                        "Internet Explorer": "ie",
                        "K-Meleon": "k_meleon",
                        Maxthon: "maxthon",
                        "Microsoft Edge": "edge",
                        "MZ Browser": "mz",
                        "NAVER Whale Browser": "naver",
                        Opera: "opera",
                        "Opera Coast": "opera_coast",
                        PhantomJS: "phantomjs",
                        Puffin: "puffin",
                        QupZilla: "qupzilla",
                        QQ: "qq",
                        QQLite: "qqlite",
                        Safari: "safari",
                        Sailfish: "sailfish",
                        "Samsung Internet for Android": "samsung_internet",
                        SeaMonkey: "seamonkey",
                        Sleipnir: "sleipnir",
                        Swing: "swing",
                        Tizen: "tizen",
                        "UC Browser": "uc",
                        Vivaldi: "vivaldi",
                        "WebOS Browser": "webos",
                        WeChat: "wechat",
                        "Yandex Browser": "yandex",
                        Roku: "roku"
                    },
                    t.BROWSER_MAP = {
                        amazon_silk: "Amazon Silk",
                        android: "Android Browser",
                        bada: "Bada",
                        blackberry: "BlackBerry",
                        chrome: "Chrome",
                        chromium: "Chromium",
                        electron: "Electron",
                        epiphany: "Epiphany",
                        firefox: "Firefox",
                        focus: "Focus",
                        generic: "Generic",
                        googlebot: "Googlebot",
                        google_search: "Google Search",
                        ie: "Internet Explorer",
                        k_meleon: "K-Meleon",
                        maxthon: "Maxthon",
                        edge: "Microsoft Edge",
                        mz: "MZ Browser",
                        naver: "NAVER Whale Browser",
                        opera: "Opera",
                        opera_coast: "Opera Coast",
                        phantomjs: "PhantomJS",
                        puffin: "Puffin",
                        qupzilla: "QupZilla",
                        qq: "QQ Browser",
                        qqlite: "QQ Browser Lite",
                        safari: "Safari",
                        sailfish: "Sailfish",
                        samsung_internet: "Samsung Internet for Android",
                        seamonkey: "SeaMonkey",
                        sleipnir: "Sleipnir",
                        swing: "Swing",
                        tizen: "Tizen",
                        uc: "UC Browser",
                        vivaldi: "Vivaldi",
                        webos: "WebOS Browser",
                        wechat: "WeChat",
                        yandex: "Yandex Browser"
                    },
                    t.PLATFORMS_MAP = {
                        tablet: "tablet",
                        mobile: "mobile",
                        desktop: "desktop",
                        tv: "tv"
                    },
                    t.OS_MAP = {
                        WindowsPhone: "Windows Phone",
                        Windows: "Windows",
                        MacOS: "macOS",
                        iOS: "iOS",
                        Android: "Android",
                        WebOS: "WebOS",
                        BlackBerry: "BlackBerry",
                        Bada: "Bada",
                        Tizen: "Tizen",
                        Linux: "Linux",
                        ChromeOS: "Chrome OS",
                        PlayStation4: "PlayStation 4",
                        Roku: "Roku"
                    },
                    t.ENGINE_MAP = {
                        EdgeHTML: "EdgeHTML",
                        Blink: "Blink",
                        Trident: "Trident",
                        Presto: "Presto",
                        Gecko: "Gecko",
                        WebKit: "WebKit"
                    }
                },
                90: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n, o = (n = r(91)) && n.__esModule ? n : {
                        default: n
                    }, i = r(18);
                    function s(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var n = t[r];
                            n.enumerable = n.enumerable || !1,
                            n.configurable = !0,
                            "value"in n && (n.writable = !0),
                            Object.defineProperty(e, n.key, n)
                        }
                    }
                    var a = function() {
                        function e() {}
                        var t, r;
                        return e.getParser = function(e, t) {
                            if (void 0 === t && (t = !1),
                            "string" != typeof e)
                                throw new Error("UserAgent should be a string");
                            return new o.default(e,t)
                        }
                        ,
                        e.parse = function(e) {
                            return new o.default(e).getResult()
                        }
                        ,
                        t = e,
                        (r = [{
                            key: "BROWSER_MAP",
                            get: function() {
                                return i.BROWSER_MAP
                            }
                        }, {
                            key: "ENGINE_MAP",
                            get: function() {
                                return i.ENGINE_MAP
                            }
                        }, {
                            key: "OS_MAP",
                            get: function() {
                                return i.OS_MAP
                            }
                        }, {
                            key: "PLATFORMS_MAP",
                            get: function() {
                                return i.PLATFORMS_MAP
                            }
                        }]) && s(t, r),
                        e
                    }();
                    t.default = a,
                    e.exports = t.default
                },
                91: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n = l(r(92))
                      , o = l(r(93))
                      , i = l(r(94))
                      , s = l(r(95))
                      , a = l(r(17));
                    function l(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    }
                    var c = function() {
                        function e(e, t) {
                            if (void 0 === t && (t = !1),
                            null == e || "" === e)
                                throw new Error("UserAgent parameter can't be empty");
                            this._ua = e,
                            this.parsedResult = {},
                            !0 !== t && this.parse()
                        }
                        var t = e.prototype;
                        return t.getUA = function() {
                            return this._ua
                        }
                        ,
                        t.test = function(e) {
                            return e.test(this._ua)
                        }
                        ,
                        t.parseBrowser = function() {
                            var e = this;
                            this.parsedResult.browser = {};
                            var t = a.default.find(n.default, (function(t) {
                                if ("function" == typeof t.test)
                                    return t.test(e);
                                if (t.test instanceof Array)
                                    return t.test.some((function(t) {
                                        return e.test(t)
                                    }
                                    ));
                                throw new Error("Browser's test function is not valid")
                            }
                            ));
                            return t && (this.parsedResult.browser = t.describe(this.getUA())),
                            this.parsedResult.browser
                        }
                        ,
                        t.getBrowser = function() {
                            return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser()
                        }
                        ,
                        t.getBrowserName = function(e) {
                            return e ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || ""
                        }
                        ,
                        t.getBrowserVersion = function() {
                            return this.getBrowser().version
                        }
                        ,
                        t.getOS = function() {
                            return this.parsedResult.os ? this.parsedResult.os : this.parseOS()
                        }
                        ,
                        t.parseOS = function() {
                            var e = this;
                            this.parsedResult.os = {};
                            var t = a.default.find(o.default, (function(t) {
                                if ("function" == typeof t.test)
                                    return t.test(e);
                                if (t.test instanceof Array)
                                    return t.test.some((function(t) {
                                        return e.test(t)
                                    }
                                    ));
                                throw new Error("Browser's test function is not valid")
                            }
                            ));
                            return t && (this.parsedResult.os = t.describe(this.getUA())),
                            this.parsedResult.os
                        }
                        ,
                        t.getOSName = function(e) {
                            var t = this.getOS().name;
                            return e ? String(t).toLowerCase() || "" : t || ""
                        }
                        ,
                        t.getOSVersion = function() {
                            return this.getOS().version
                        }
                        ,
                        t.getPlatform = function() {
                            return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform()
                        }
                        ,
                        t.getPlatformType = function(e) {
                            void 0 === e && (e = !1);
                            var t = this.getPlatform().type;
                            return e ? String(t).toLowerCase() || "" : t || ""
                        }
                        ,
                        t.parsePlatform = function() {
                            var e = this;
                            this.parsedResult.platform = {};
                            var t = a.default.find(i.default, (function(t) {
                                if ("function" == typeof t.test)
                                    return t.test(e);
                                if (t.test instanceof Array)
                                    return t.test.some((function(t) {
                                        return e.test(t)
                                    }
                                    ));
                                throw new Error("Browser's test function is not valid")
                            }
                            ));
                            return t && (this.parsedResult.platform = t.describe(this.getUA())),
                            this.parsedResult.platform
                        }
                        ,
                        t.getEngine = function() {
                            return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine()
                        }
                        ,
                        t.getEngineName = function(e) {
                            return e ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || ""
                        }
                        ,
                        t.parseEngine = function() {
                            var e = this;
                            this.parsedResult.engine = {};
                            var t = a.default.find(s.default, (function(t) {
                                if ("function" == typeof t.test)
                                    return t.test(e);
                                if (t.test instanceof Array)
                                    return t.test.some((function(t) {
                                        return e.test(t)
                                    }
                                    ));
                                throw new Error("Browser's test function is not valid")
                            }
                            ));
                            return t && (this.parsedResult.engine = t.describe(this.getUA())),
                            this.parsedResult.engine
                        }
                        ,
                        t.parse = function() {
                            return this.parseBrowser(),
                            this.parseOS(),
                            this.parsePlatform(),
                            this.parseEngine(),
                            this
                        }
                        ,
                        t.getResult = function() {
                            return a.default.assign({}, this.parsedResult)
                        }
                        ,
                        t.satisfies = function(e) {
                            var t = this
                              , r = {}
                              , n = 0
                              , o = {}
                              , i = 0;
                            if (Object.keys(e).forEach((function(t) {
                                var s = e[t];
                                "string" == typeof s ? (o[t] = s,
                                i += 1) : "object" == typeof s && (r[t] = s,
                                n += 1)
                            }
                            )),
                            n > 0) {
                                var s = Object.keys(r)
                                  , l = a.default.find(s, (function(e) {
                                    return t.isOS(e)
                                }
                                ));
                                if (l) {
                                    var c = this.satisfies(r[l]);
                                    if (void 0 !== c)
                                        return c
                                }
                                var u = a.default.find(s, (function(e) {
                                    return t.isPlatform(e)
                                }
                                ));
                                if (u) {
                                    var d = this.satisfies(r[u]);
                                    if (void 0 !== d)
                                        return d
                                }
                            }
                            if (i > 0) {
                                var f = Object.keys(o)
                                  , h = a.default.find(f, (function(e) {
                                    return t.isBrowser(e, !0)
                                }
                                ));
                                if (void 0 !== h)
                                    return this.compareVersion(o[h])
                            }
                        }
                        ,
                        t.isBrowser = function(e, t) {
                            void 0 === t && (t = !1);
                            var r = this.getBrowserName().toLowerCase()
                              , n = e.toLowerCase()
                              , o = a.default.getBrowserTypeByAlias(n);
                            return t && o && (n = o.toLowerCase()),
                            n === r
                        }
                        ,
                        t.compareVersion = function(e) {
                            var t = [0]
                              , r = e
                              , n = !1
                              , o = this.getBrowserVersion();
                            if ("string" == typeof o)
                                return ">" === e[0] || "<" === e[0] ? (r = e.substr(1),
                                "=" === e[1] ? (n = !0,
                                r = e.substr(2)) : t = [],
                                ">" === e[0] ? t.push(1) : t.push(-1)) : "=" === e[0] ? r = e.substr(1) : "~" === e[0] && (n = !0,
                                r = e.substr(1)),
                                t.indexOf(a.default.compareVersions(o, r, n)) > -1
                        }
                        ,
                        t.isOS = function(e) {
                            return this.getOSName(!0) === String(e).toLowerCase()
                        }
                        ,
                        t.isPlatform = function(e) {
                            return this.getPlatformType(!0) === String(e).toLowerCase()
                        }
                        ,
                        t.isEngine = function(e) {
                            return this.getEngineName(!0) === String(e).toLowerCase()
                        }
                        ,
                        t.is = function(e, t) {
                            return void 0 === t && (t = !1),
                            this.isBrowser(e, t) || this.isOS(e) || this.isPlatform(e)
                        }
                        ,
                        t.some = function(e) {
                            var t = this;
                            return void 0 === e && (e = []),
                            e.some((function(e) {
                                return t.is(e)
                            }
                            ))
                        }
                        ,
                        e
                    }();
                    t.default = c,
                    e.exports = t.default
                },
                92: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n, o = (n = r(17)) && n.__esModule ? n : {
                        default: n
                    }, i = /version\/(\d+(\.?_?\d+)+)/i, s = [{
                        test: [/googlebot/i],
                        describe: function(e) {
                            var t = {
                                name: "Googlebot"
                            }
                              , r = o.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/opera/i],
                        describe: function(e) {
                            var t = {
                                name: "Opera"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/opr\/|opios/i],
                        describe: function(e) {
                            var t = {
                                name: "Opera"
                            }
                              , r = o.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/SamsungBrowser/i],
                        describe: function(e) {
                            var t = {
                                name: "Samsung Internet for Android"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/Whale/i],
                        describe: function(e) {
                            var t = {
                                name: "NAVER Whale Browser"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/MZBrowser/i],
                        describe: function(e) {
                            var t = {
                                name: "MZ Browser"
                            }
                              , r = o.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/focus/i],
                        describe: function(e) {
                            var t = {
                                name: "Focus"
                            }
                              , r = o.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/swing/i],
                        describe: function(e) {
                            var t = {
                                name: "Swing"
                            }
                              , r = o.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/coast/i],
                        describe: function(e) {
                            var t = {
                                name: "Opera Coast"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/opt\/\d+(?:.?_?\d+)+/i],
                        describe: function(e) {
                            var t = {
                                name: "Opera Touch"
                            }
                              , r = o.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/yabrowser/i],
                        describe: function(e) {
                            var t = {
                                name: "Yandex Browser"
                            }
                              , r = o.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/ucbrowser/i],
                        describe: function(e) {
                            var t = {
                                name: "UC Browser"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/Maxthon|mxios/i],
                        describe: function(e) {
                            var t = {
                                name: "Maxthon"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/epiphany/i],
                        describe: function(e) {
                            var t = {
                                name: "Epiphany"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/puffin/i],
                        describe: function(e) {
                            var t = {
                                name: "Puffin"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/sleipnir/i],
                        describe: function(e) {
                            var t = {
                                name: "Sleipnir"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/k-meleon/i],
                        describe: function(e) {
                            var t = {
                                name: "K-Meleon"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/micromessenger/i],
                        describe: function(e) {
                            var t = {
                                name: "WeChat"
                            }
                              , r = o.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/qqbrowser/i],
                        describe: function(e) {
                            var t = {
                                name: /qqbrowserlite/i.test(e) ? "QQ Browser Lite" : "QQ Browser"
                            }
                              , r = o.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/msie|trident/i],
                        describe: function(e) {
                            var t = {
                                name: "Internet Explorer"
                            }
                              , r = o.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/\sedg\//i],
                        describe: function(e) {
                            var t = {
                                name: "Microsoft Edge"
                            }
                              , r = o.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/edg([ea]|ios)/i],
                        describe: function(e) {
                            var t = {
                                name: "Microsoft Edge"
                            }
                              , r = o.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/vivaldi/i],
                        describe: function(e) {
                            var t = {
                                name: "Vivaldi"
                            }
                              , r = o.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/seamonkey/i],
                        describe: function(e) {
                            var t = {
                                name: "SeaMonkey"
                            }
                              , r = o.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/sailfish/i],
                        describe: function(e) {
                            var t = {
                                name: "Sailfish"
                            }
                              , r = o.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/silk/i],
                        describe: function(e) {
                            var t = {
                                name: "Amazon Silk"
                            }
                              , r = o.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/phantom/i],
                        describe: function(e) {
                            var t = {
                                name: "PhantomJS"
                            }
                              , r = o.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/slimerjs/i],
                        describe: function(e) {
                            var t = {
                                name: "SlimerJS"
                            }
                              , r = o.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
                        describe: function(e) {
                            var t = {
                                name: "BlackBerry"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/(web|hpw)[o0]s/i],
                        describe: function(e) {
                            var t = {
                                name: "WebOS Browser"
                            }
                              , r = o.default.getFirstMatch(i, e) || o.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/bada/i],
                        describe: function(e) {
                            var t = {
                                name: "Bada"
                            }
                              , r = o.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/tizen/i],
                        describe: function(e) {
                            var t = {
                                name: "Tizen"
                            }
                              , r = o.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/qupzilla/i],
                        describe: function(e) {
                            var t = {
                                name: "QupZilla"
                            }
                              , r = o.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/firefox|iceweasel|fxios/i],
                        describe: function(e) {
                            var t = {
                                name: "Firefox"
                            }
                              , r = o.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/electron/i],
                        describe: function(e) {
                            var t = {
                                name: "Electron"
                            }
                              , r = o.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/MiuiBrowser/i],
                        describe: function(e) {
                            var t = {
                                name: "Miui"
                            }
                              , r = o.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/chromium/i],
                        describe: function(e) {
                            var t = {
                                name: "Chromium"
                            }
                              , r = o.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, e) || o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/chrome|crios|crmo/i],
                        describe: function(e) {
                            var t = {
                                name: "Chrome"
                            }
                              , r = o.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/GSA/i],
                        describe: function(e) {
                            var t = {
                                name: "Google Search"
                            }
                              , r = o.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: function(e) {
                            var t = !e.test(/like android/i)
                              , r = e.test(/android/i);
                            return t && r
                        },
                        describe: function(e) {
                            var t = {
                                name: "Android Browser"
                            }
                              , r = o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/playstation 4/i],
                        describe: function(e) {
                            var t = {
                                name: "PlayStation 4"
                            }
                              , r = o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/safari|applewebkit/i],
                        describe: function(e) {
                            var t = {
                                name: "Safari"
                            }
                              , r = o.default.getFirstMatch(i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/.*/i],
                        describe: function(e) {
                            var t = -1 !== e.search("\\(") ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
                            return {
                                name: o.default.getFirstMatch(t, e),
                                version: o.default.getSecondMatch(t, e)
                            }
                        }
                    }];
                    t.default = s,
                    e.exports = t.default
                },
                93: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n, o = (n = r(17)) && n.__esModule ? n : {
                        default: n
                    }, i = r(18), s = [{
                        test: [/Roku\/DVP/],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, e);
                            return {
                                name: i.OS_MAP.Roku,
                                version: t
                            }
                        }
                    }, {
                        test: [/windows phone/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, e);
                            return {
                                name: i.OS_MAP.WindowsPhone,
                                version: t
                            }
                        }
                    }, {
                        test: [/windows /i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, e)
                              , r = o.default.getWindowsVersionName(t);
                            return {
                                name: i.OS_MAP.Windows,
                                version: t,
                                versionName: r
                            }
                        }
                    }, {
                        test: [/Macintosh(.*?) FxiOS(.*?)\//],
                        describe: function(e) {
                            var t = {
                                name: i.OS_MAP.iOS
                            }
                              , r = o.default.getSecondMatch(/(Version\/)(\d[\d.]+)/, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/macintosh/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, e).replace(/[_\s]/g, ".")
                              , r = o.default.getMacOSVersionName(t)
                              , n = {
                                name: i.OS_MAP.MacOS,
                                version: t
                            };
                            return r && (n.versionName = r),
                            n
                        }
                    }, {
                        test: [/(ipod|iphone|ipad)/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, e).replace(/[_\s]/g, ".");
                            return {
                                name: i.OS_MAP.iOS,
                                version: t
                            }
                        }
                    }, {
                        test: function(e) {
                            var t = !e.test(/like android/i)
                              , r = e.test(/android/i);
                            return t && r
                        },
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, e)
                              , r = o.default.getAndroidVersionName(t)
                              , n = {
                                name: i.OS_MAP.Android,
                                version: t
                            };
                            return r && (n.versionName = r),
                            n
                        }
                    }, {
                        test: [/(web|hpw)[o0]s/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, e)
                              , r = {
                                name: i.OS_MAP.WebOS
                            };
                            return t && t.length && (r.version = t),
                            r
                        }
                    }, {
                        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, e) || o.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, e) || o.default.getFirstMatch(/\bbb(\d+)/i, e);
                            return {
                                name: i.OS_MAP.BlackBerry,
                                version: t
                            }
                        }
                    }, {
                        test: [/bada/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, e);
                            return {
                                name: i.OS_MAP.Bada,
                                version: t
                            }
                        }
                    }, {
                        test: [/tizen/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, e);
                            return {
                                name: i.OS_MAP.Tizen,
                                version: t
                            }
                        }
                    }, {
                        test: [/linux/i],
                        describe: function() {
                            return {
                                name: i.OS_MAP.Linux
                            }
                        }
                    }, {
                        test: [/CrOS/],
                        describe: function() {
                            return {
                                name: i.OS_MAP.ChromeOS
                            }
                        }
                    }, {
                        test: [/PlayStation 4/],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, e);
                            return {
                                name: i.OS_MAP.PlayStation4,
                                version: t
                            }
                        }
                    }];
                    t.default = s,
                    e.exports = t.default
                },
                94: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n, o = (n = r(17)) && n.__esModule ? n : {
                        default: n
                    }, i = r(18), s = [{
                        test: [/googlebot/i],
                        describe: function() {
                            return {
                                type: "bot",
                                vendor: "Google"
                            }
                        }
                    }, {
                        test: [/huawei/i],
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/(can-l01)/i, e) && "Nova"
                              , r = {
                                type: i.PLATFORMS_MAP.mobile,
                                vendor: "Huawei"
                            };
                            return t && (r.model = t),
                            r
                        }
                    }, {
                        test: [/nexus\s*(?:7|8|9|10).*/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet,
                                vendor: "Nexus"
                            }
                        }
                    }, {
                        test: [/ipad/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet,
                                vendor: "Apple",
                                model: "iPad"
                            }
                        }
                    }, {
                        test: [/Macintosh(.*?) FxiOS(.*?)\//],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet,
                                vendor: "Apple",
                                model: "iPad"
                            }
                        }
                    }, {
                        test: [/kftt build/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet,
                                vendor: "Amazon",
                                model: "Kindle Fire HD 7"
                            }
                        }
                    }, {
                        test: [/silk/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet,
                                vendor: "Amazon"
                            }
                        }
                    }, {
                        test: [/tablet(?! pc)/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet
                            }
                        }
                    }, {
                        test: function(e) {
                            var t = e.test(/ipod|iphone/i)
                              , r = e.test(/like (ipod|iphone)/i);
                            return t && !r
                        },
                        describe: function(e) {
                            var t = o.default.getFirstMatch(/(ipod|iphone)/i, e);
                            return {
                                type: i.PLATFORMS_MAP.mobile,
                                vendor: "Apple",
                                model: t
                            }
                        }
                    }, {
                        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile,
                                vendor: "Nexus"
                            }
                        }
                    }, {
                        test: [/[^-]mobi/i],
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile
                            }
                        }
                    }, {
                        test: function(e) {
                            return "blackberry" === e.getBrowserName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile,
                                vendor: "BlackBerry"
                            }
                        }
                    }, {
                        test: function(e) {
                            return "bada" === e.getBrowserName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile
                            }
                        }
                    }, {
                        test: function(e) {
                            return "windows phone" === e.getBrowserName()
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile,
                                vendor: "Microsoft"
                            }
                        }
                    }, {
                        test: function(e) {
                            var t = Number(String(e.getOSVersion()).split(".")[0]);
                            return "android" === e.getOSName(!0) && t >= 3
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tablet
                            }
                        }
                    }, {
                        test: function(e) {
                            return "android" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.mobile
                            }
                        }
                    }, {
                        test: function(e) {
                            return "macos" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.desktop,
                                vendor: "Apple"
                            }
                        }
                    }, {
                        test: function(e) {
                            return "windows" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.desktop
                            }
                        }
                    }, {
                        test: function(e) {
                            return "linux" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.desktop
                            }
                        }
                    }, {
                        test: function(e) {
                            return "playstation 4" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tv
                            }
                        }
                    }, {
                        test: function(e) {
                            return "roku" === e.getOSName(!0)
                        },
                        describe: function() {
                            return {
                                type: i.PLATFORMS_MAP.tv
                            }
                        }
                    }];
                    t.default = s,
                    e.exports = t.default
                },
                95: function(e, t, r) {
                    "use strict";
                    t.__esModule = !0,
                    t.default = void 0;
                    var n, o = (n = r(17)) && n.__esModule ? n : {
                        default: n
                    }, i = r(18), s = [{
                        test: function(e) {
                            return "microsoft edge" === e.getBrowserName(!0)
                        },
                        describe: function(e) {
                            if (/\sedg\//i.test(e))
                                return {
                                    name: i.ENGINE_MAP.Blink
                                };
                            var t = o.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, e);
                            return {
                                name: i.ENGINE_MAP.EdgeHTML,
                                version: t
                            }
                        }
                    }, {
                        test: [/trident/i],
                        describe: function(e) {
                            var t = {
                                name: i.ENGINE_MAP.Trident
                            }
                              , r = o.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: function(e) {
                            return e.test(/presto/i)
                        },
                        describe: function(e) {
                            var t = {
                                name: i.ENGINE_MAP.Presto
                            }
                              , r = o.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: function(e) {
                            var t = e.test(/gecko/i)
                              , r = e.test(/like gecko/i);
                            return t && !r
                        },
                        describe: function(e) {
                            var t = {
                                name: i.ENGINE_MAP.Gecko
                            }
                              , r = o.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }, {
                        test: [/(apple)?webkit\/537\.36/i],
                        describe: function() {
                            return {
                                name: i.ENGINE_MAP.Blink
                            }
                        }
                    }, {
                        test: [/(apple)?webkit/i],
                        describe: function(e) {
                            var t = {
                                name: i.ENGINE_MAP.WebKit
                            }
                              , r = o.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, e);
                            return r && (t.version = r),
                            t
                        }
                    }];
                    t.default = s,
                    e.exports = t.default
                }
            })
        }
        ,
        "object" == typeof r && "object" == typeof t ? t.exports = o() : "function" == typeof define && define.amd ? define([], o) : "object" == typeof r ? r.bowser = o() : n.bowser = o()
    }
    , {}],
    49: [function(e, t, r) {}
    , {}],
    50: [function(e, t, r) {
        /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
        "use strict";
        var n = e("base64-js")
          , o = e("ieee754");
        r.Buffer = a,
        r.SlowBuffer = function(e) {
            +e != e && (e = 0);
            return a.alloc(+e)
        }
        ,
        r.INSPECT_MAX_BYTES = 50;
        var i = 2147483647;
        function s(e) {
            if (e > i)
                throw new RangeError('The value "' + e + '" is invalid for option "size"');
            var t = new Uint8Array(e);
            return t.__proto__ = a.prototype,
            t
        }
        function a(e, t, r) {
            if ("number" == typeof e) {
                if ("string" == typeof t)
                    throw new TypeError('The "string" argument must be of type string. Received type number');
                return u(e)
            }
            return l(e, t, r)
        }
        function l(e, t, r) {
            if ("string" == typeof e)
                return function(e, t) {
                    "string" == typeof t && "" !== t || (t = "utf8");
                    if (!a.isEncoding(t))
                        throw new TypeError("Unknown encoding: " + t);
                    var r = 0 | h(e, t)
                      , n = s(r)
                      , o = n.write(e, t);
                    o !== r && (n = n.slice(0, o));
                    return n
                }(e, t);
            if (ArrayBuffer.isView(e))
                return d(e);
            if (null == e)
                throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
            if (U(e, ArrayBuffer) || e && U(e.buffer, ArrayBuffer))
                return function(e, t, r) {
                    if (t < 0 || e.byteLength < t)
                        throw new RangeError('"offset" is outside of buffer bounds');
                    if (e.byteLength < t + (r || 0))
                        throw new RangeError('"length" is outside of buffer bounds');
                    var n;
                    n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e,t) : new Uint8Array(e,t,r);
                    return n.__proto__ = a.prototype,
                    n
                }(e, t, r);
            if ("number" == typeof e)
                throw new TypeError('The "value" argument must not be of type number. Received type number');
            var n = e.valueOf && e.valueOf();
            if (null != n && n !== e)
                return a.from(n, t, r);
            var o = function(e) {
                if (a.isBuffer(e)) {
                    var t = 0 | f(e.length)
                      , r = s(t);
                    return 0 === r.length || e.copy(r, 0, 0, t),
                    r
                }
                if (void 0 !== e.length)
                    return "number" != typeof e.length || W(e.length) ? s(0) : d(e);
                if ("Buffer" === e.type && Array.isArray(e.data))
                    return d(e.data)
            }(e);
            if (o)
                return o;
            if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive])
                return a.from(e[Symbol.toPrimitive]("string"), t, r);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
        }
        function c(e) {
            if ("number" != typeof e)
                throw new TypeError('"size" argument must be of type number');
            if (e < 0)
                throw new RangeError('The value "' + e + '" is invalid for option "size"')
        }
        function u(e) {
            return c(e),
            s(e < 0 ? 0 : 0 | f(e))
        }
        function d(e) {
            for (var t = e.length < 0 ? 0 : 0 | f(e.length), r = s(t), n = 0; n < t; n += 1)
                r[n] = 255 & e[n];
            return r
        }
        function f(e) {
            if (e >= i)
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
            return 0 | e
        }
        function h(e, t) {
            if (a.isBuffer(e))
                return e.length;
            if (ArrayBuffer.isView(e) || U(e, ArrayBuffer))
                return e.byteLength;
            if ("string" != typeof e)
                throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
            var r = e.length
              , n = arguments.length > 2 && !0 === arguments[2];
            if (!n && 0 === r)
                return 0;
            for (var o = !1; ; )
                switch (t) {
                case "ascii":
                case "latin1":
                case "binary":
                    return r;
                case "utf8":
                case "utf-8":
                    return B(e).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * r;
                case "hex":
                    return r >>> 1;
                case "base64":
                    return $(e).length;
                default:
                    if (o)
                        return n ? -1 : B(e).length;
                    t = ("" + t).toLowerCase(),
                    o = !0
                }
        }
        function p(e, t, r) {
            var n = !1;
            if ((void 0 === t || t < 0) && (t = 0),
            t > this.length)
                return "";
            if ((void 0 === r || r > this.length) && (r = this.length),
            r <= 0)
                return "";
            if ((r >>>= 0) <= (t >>>= 0))
                return "";
            for (e || (e = "utf8"); ; )
                switch (e) {
                case "hex":
                    return T(this, t, r);
                case "utf8":
                case "utf-8":
                    return R(this, t, r);
                case "ascii":
                    return x(this, t, r);
                case "latin1":
                case "binary":
                    return O(this, t, r);
                case "base64":
                    return A(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return I(this, t, r);
                default:
                    if (n)
                        throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(),
                    n = !0
                }
        }
        function g(e, t, r) {
            var n = e[t];
            e[t] = e[r],
            e[r] = n
        }
        function m(e, t, r, n, o) {
            if (0 === e.length)
                return -1;
            if ("string" == typeof r ? (n = r,
            r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648),
            W(r = +r) && (r = o ? 0 : e.length - 1),
            r < 0 && (r = e.length + r),
            r >= e.length) {
                if (o)
                    return -1;
                r = e.length - 1
            } else if (r < 0) {
                if (!o)
                    return -1;
                r = 0
            }
            if ("string" == typeof t && (t = a.from(t, n)),
            a.isBuffer(t))
                return 0 === t.length ? -1 : b(e, t, r, n, o);
            if ("number" == typeof t)
                return t &= 255,
                "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : b(e, [t], r, n, o);
            throw new TypeError("val must be string, number or Buffer")
        }
        function b(e, t, r, n, o) {
            var i, s = 1, a = e.length, l = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                if (e.length < 2 || t.length < 2)
                    return -1;
                s = 2,
                a /= 2,
                l /= 2,
                r /= 2
            }
            function c(e, t) {
                return 1 === s ? e[t] : e.readUInt16BE(t * s)
            }
            if (o) {
                var u = -1;
                for (i = r; i < a; i++)
                    if (c(e, i) === c(t, -1 === u ? 0 : i - u)) {
                        if (-1 === u && (u = i),
                        i - u + 1 === l)
                            return u * s
                    } else
                        -1 !== u && (i -= i - u),
                        u = -1
            } else
                for (r + l > a && (r = a - l),
                i = r; i >= 0; i--) {
                    for (var d = !0, f = 0; f < l; f++)
                        if (c(e, i + f) !== c(t, f)) {
                            d = !1;
                            break
                        }
                    if (d)
                        return i
                }
            return -1
        }
        function y(e, t, r, n) {
            r = Number(r) || 0;
            var o = e.length - r;
            n ? (n = Number(n)) > o && (n = o) : n = o;
            var i = t.length;
            n > i / 2 && (n = i / 2);
            for (var s = 0; s < n; ++s) {
                var a = parseInt(t.substr(2 * s, 2), 16);
                if (W(a))
                    return s;
                e[r + s] = a
            }
            return s
        }
        function v(e, t, r, n) {
            return D(B(t, e.length - r), e, r, n)
        }
        function w(e, t, r, n) {
            return D(function(e) {
                for (var t = [], r = 0; r < e.length; ++r)
                    t.push(255 & e.charCodeAt(r));
                return t
            }(t), e, r, n)
        }
        function _(e, t, r, n) {
            return w(e, t, r, n)
        }
        function E(e, t, r, n) {
            return D($(t), e, r, n)
        }
        function S(e, t, r, n) {
            return D(function(e, t) {
                for (var r, n, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s)
                    n = (r = e.charCodeAt(s)) >> 8,
                    o = r % 256,
                    i.push(o),
                    i.push(n);
                return i
            }(t, e.length - r), e, r, n)
        }
        function A(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
        }
        function R(e, t, r) {
            r = Math.min(e.length, r);
            for (var n = [], o = t; o < r; ) {
                var i, s, a, l, c = e[o], u = null, d = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                if (o + d <= r)
                    switch (d) {
                    case 1:
                        c < 128 && (u = c);
                        break;
                    case 2:
                        128 == (192 & (i = e[o + 1])) && (l = (31 & c) << 6 | 63 & i) > 127 && (u = l);
                        break;
                    case 3:
                        i = e[o + 1],
                        s = e[o + 2],
                        128 == (192 & i) && 128 == (192 & s) && (l = (15 & c) << 12 | (63 & i) << 6 | 63 & s) > 2047 && (l < 55296 || l > 57343) && (u = l);
                        break;
                    case 4:
                        i = e[o + 1],
                        s = e[o + 2],
                        a = e[o + 3],
                        128 == (192 & i) && 128 == (192 & s) && 128 == (192 & a) && (l = (15 & c) << 18 | (63 & i) << 12 | (63 & s) << 6 | 63 & a) > 65535 && l < 1114112 && (u = l)
                    }
                null === u ? (u = 65533,
                d = 1) : u > 65535 && (u -= 65536,
                n.push(u >>> 10 & 1023 | 55296),
                u = 56320 | 1023 & u),
                n.push(u),
                o += d
            }
            return function(e) {
                var t = e.length;
                if (t <= M)
                    return String.fromCharCode.apply(String, e);
                var r = ""
                  , n = 0;
                for (; n < t; )
                    r += String.fromCharCode.apply(String, e.slice(n, n += M));
                return r
            }(n)
        }
        r.kMaxLength = i,
        a.TYPED_ARRAY_SUPPORT = function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42
                    }
                },
                42 === e.foo()
            } catch (e) {
                return !1
            }
        }(),
        a.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
        Object.defineProperty(a.prototype, "parent", {
            enumerable: !0,
            get: function() {
                if (a.isBuffer(this))
                    return this.buffer
            }
        }),
        Object.defineProperty(a.prototype, "offset", {
            enumerable: !0,
            get: function() {
                if (a.isBuffer(this))
                    return this.byteOffset
            }
        }),
        "undefined" != typeof Symbol && null != Symbol.species && a[Symbol.species] === a && Object.defineProperty(a, Symbol.species, {
            value: null,
            configurable: !0,
            enumerable: !1,
            writable: !1
        }),
        a.poolSize = 8192,
        a.from = function(e, t, r) {
            return l(e, t, r)
        }
        ,
        a.prototype.__proto__ = Uint8Array.prototype,
        a.__proto__ = Uint8Array,
        a.alloc = function(e, t, r) {
            return function(e, t, r) {
                return c(e),
                e <= 0 ? s(e) : void 0 !== t ? "string" == typeof r ? s(e).fill(t, r) : s(e).fill(t) : s(e)
            }(e, t, r)
        }
        ,
        a.allocUnsafe = function(e) {
            return u(e)
        }
        ,
        a.allocUnsafeSlow = function(e) {
            return u(e)
        }
        ,
        a.isBuffer = function(e) {
            return null != e && !0 === e._isBuffer && e !== a.prototype
        }
        ,
        a.compare = function(e, t) {
            if (U(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
            U(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
            !a.isBuffer(e) || !a.isBuffer(t))
                throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e === t)
                return 0;
            for (var r = e.length, n = t.length, o = 0, i = Math.min(r, n); o < i; ++o)
                if (e[o] !== t[o]) {
                    r = e[o],
                    n = t[o];
                    break
                }
            return r < n ? -1 : n < r ? 1 : 0
        }
        ,
        a.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1
            }
        }
        ,
        a.concat = function(e, t) {
            if (!Array.isArray(e))
                throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length)
                return a.alloc(0);
            var r;
            if (void 0 === t)
                for (t = 0,
                r = 0; r < e.length; ++r)
                    t += e[r].length;
            var n = a.allocUnsafe(t)
              , o = 0;
            for (r = 0; r < e.length; ++r) {
                var i = e[r];
                if (U(i, Uint8Array) && (i = a.from(i)),
                !a.isBuffer(i))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                i.copy(n, o),
                o += i.length
            }
            return n
        }
        ,
        a.byteLength = h,
        a.prototype._isBuffer = !0,
        a.prototype.swap16 = function() {
            var e = this.length;
            if (e % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2)
                g(this, t, t + 1);
            return this
        }
        ,
        a.prototype.swap32 = function() {
            var e = this.length;
            if (e % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4)
                g(this, t, t + 3),
                g(this, t + 1, t + 2);
            return this
        }
        ,
        a.prototype.swap64 = function() {
            var e = this.length;
            if (e % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8)
                g(this, t, t + 7),
                g(this, t + 1, t + 6),
                g(this, t + 2, t + 5),
                g(this, t + 3, t + 4);
            return this
        }
        ,
        a.prototype.toString = function() {
            var e = this.length;
            return 0 === e ? "" : 0 === arguments.length ? R(this, 0, e) : p.apply(this, arguments)
        }
        ,
        a.prototype.toLocaleString = a.prototype.toString,
        a.prototype.equals = function(e) {
            if (!a.isBuffer(e))
                throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === a.compare(this, e)
        }
        ,
        a.prototype.inspect = function() {
            var e = ""
              , t = r.INSPECT_MAX_BYTES;
            return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(),
            this.length > t && (e += " ... "),
            "<Buffer " + e + ">"
        }
        ,
        a.prototype.compare = function(e, t, r, n, o) {
            if (U(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
            !a.isBuffer(e))
                throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
            if (void 0 === t && (t = 0),
            void 0 === r && (r = e ? e.length : 0),
            void 0 === n && (n = 0),
            void 0 === o && (o = this.length),
            t < 0 || r > e.length || n < 0 || o > this.length)
                throw new RangeError("out of range index");
            if (n >= o && t >= r)
                return 0;
            if (n >= o)
                return -1;
            if (t >= r)
                return 1;
            if (this === e)
                return 0;
            for (var i = (o >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (t >>>= 0), l = Math.min(i, s), c = this.slice(n, o), u = e.slice(t, r), d = 0; d < l; ++d)
                if (c[d] !== u[d]) {
                    i = c[d],
                    s = u[d];
                    break
                }
            return i < s ? -1 : s < i ? 1 : 0
        }
        ,
        a.prototype.includes = function(e, t, r) {
            return -1 !== this.indexOf(e, t, r)
        }
        ,
        a.prototype.indexOf = function(e, t, r) {
            return m(this, e, t, r, !0)
        }
        ,
        a.prototype.lastIndexOf = function(e, t, r) {
            return m(this, e, t, r, !1)
        }
        ,
        a.prototype.write = function(e, t, r, n) {
            if (void 0 === t)
                n = "utf8",
                r = this.length,
                t = 0;
            else if (void 0 === r && "string" == typeof t)
                n = t,
                r = this.length,
                t = 0;
            else {
                if (!isFinite(t))
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t >>>= 0,
                isFinite(r) ? (r >>>= 0,
                void 0 === n && (n = "utf8")) : (n = r,
                r = void 0)
            }
            var o = this.length - t;
            if ((void 0 === r || r > o) && (r = o),
            e.length > 0 && (r < 0 || t < 0) || t > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var i = !1; ; )
                switch (n) {
                case "hex":
                    return y(this, e, t, r);
                case "utf8":
                case "utf-8":
                    return v(this, e, t, r);
                case "ascii":
                    return w(this, e, t, r);
                case "latin1":
                case "binary":
                    return _(this, e, t, r);
                case "base64":
                    return E(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return S(this, e, t, r);
                default:
                    if (i)
                        throw new TypeError("Unknown encoding: " + n);
                    n = ("" + n).toLowerCase(),
                    i = !0
                }
        }
        ,
        a.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        }
        ;
        var M = 4096;
        function x(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var o = t; o < r; ++o)
                n += String.fromCharCode(127 & e[o]);
            return n
        }
        function O(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var o = t; o < r; ++o)
                n += String.fromCharCode(e[o]);
            return n
        }
        function T(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0),
            (!r || r < 0 || r > n) && (r = n);
            for (var o = "", i = t; i < r; ++i)
                o += F(e[i]);
            return o
        }
        function I(e, t, r) {
            for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2)
                o += String.fromCharCode(n[i] + 256 * n[i + 1]);
            return o
        }
        function k(e, t, r) {
            if (e % 1 != 0 || e < 0)
                throw new RangeError("offset is not uint");
            if (e + t > r)
                throw new RangeError("Trying to access beyond buffer length")
        }
        function N(e, t, r, n, o, i) {
            if (!a.isBuffer(e))
                throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > o || t < i)
                throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length)
                throw new RangeError("Index out of range")
        }
        function P(e, t, r, n, o, i) {
            if (r + n > e.length)
                throw new RangeError("Index out of range");
            if (r < 0)
                throw new RangeError("Index out of range")
        }
        function C(e, t, r, n, i) {
            return t = +t,
            r >>>= 0,
            i || P(e, 0, r, 4),
            o.write(e, t, r, n, 23, 4),
            r + 4
        }
        function L(e, t, r, n, i) {
            return t = +t,
            r >>>= 0,
            i || P(e, 0, r, 8),
            o.write(e, t, r, n, 52, 8),
            r + 8
        }
        a.prototype.slice = function(e, t) {
            var r = this.length;
            (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
            (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
            t < e && (t = e);
            var n = this.subarray(e, t);
            return n.__proto__ = a.prototype,
            n
        }
        ,
        a.prototype.readUIntLE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || k(e, t, this.length);
            for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256); )
                n += this[e + i] * o;
            return n
        }
        ,
        a.prototype.readUIntBE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || k(e, t, this.length);
            for (var n = this[e + --t], o = 1; t > 0 && (o *= 256); )
                n += this[e + --t] * o;
            return n
        }
        ,
        a.prototype.readUInt8 = function(e, t) {
            return e >>>= 0,
            t || k(e, 1, this.length),
            this[e]
        }
        ,
        a.prototype.readUInt16LE = function(e, t) {
            return e >>>= 0,
            t || k(e, 2, this.length),
            this[e] | this[e + 1] << 8
        }
        ,
        a.prototype.readUInt16BE = function(e, t) {
            return e >>>= 0,
            t || k(e, 2, this.length),
            this[e] << 8 | this[e + 1]
        }
        ,
        a.prototype.readUInt32LE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }
        ,
        a.prototype.readUInt32BE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }
        ,
        a.prototype.readIntLE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || k(e, t, this.length);
            for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256); )
                n += this[e + i] * o;
            return n >= (o *= 128) && (n -= Math.pow(2, 8 * t)),
            n
        }
        ,
        a.prototype.readIntBE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || k(e, t, this.length);
            for (var n = t, o = 1, i = this[e + --n]; n > 0 && (o *= 256); )
                i += this[e + --n] * o;
            return i >= (o *= 128) && (i -= Math.pow(2, 8 * t)),
            i
        }
        ,
        a.prototype.readInt8 = function(e, t) {
            return e >>>= 0,
            t || k(e, 1, this.length),
            128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }
        ,
        a.prototype.readInt16LE = function(e, t) {
            e >>>= 0,
            t || k(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r
        }
        ,
        a.prototype.readInt16BE = function(e, t) {
            e >>>= 0,
            t || k(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r
        }
        ,
        a.prototype.readInt32LE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }
        ,
        a.prototype.readInt32BE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }
        ,
        a.prototype.readFloatLE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            o.read(this, e, !0, 23, 4)
        }
        ,
        a.prototype.readFloatBE = function(e, t) {
            return e >>>= 0,
            t || k(e, 4, this.length),
            o.read(this, e, !1, 23, 4)
        }
        ,
        a.prototype.readDoubleLE = function(e, t) {
            return e >>>= 0,
            t || k(e, 8, this.length),
            o.read(this, e, !0, 52, 8)
        }
        ,
        a.prototype.readDoubleBE = function(e, t) {
            return e >>>= 0,
            t || k(e, 8, this.length),
            o.read(this, e, !1, 52, 8)
        }
        ,
        a.prototype.writeUIntLE = function(e, t, r, n) {
            (e = +e,
            t >>>= 0,
            r >>>= 0,
            n) || N(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = 1
              , i = 0;
            for (this[t] = 255 & e; ++i < r && (o *= 256); )
                this[t + i] = e / o & 255;
            return t + r
        }
        ,
        a.prototype.writeUIntBE = function(e, t, r, n) {
            (e = +e,
            t >>>= 0,
            r >>>= 0,
            n) || N(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var o = r - 1
              , i = 1;
            for (this[t + o] = 255 & e; --o >= 0 && (i *= 256); )
                this[t + o] = e / i & 255;
            return t + r
        }
        ,
        a.prototype.writeUInt8 = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 1, 255, 0),
            this[t] = 255 & e,
            t + 1
        }
        ,
        a.prototype.writeUInt16LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 2, 65535, 0),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            t + 2
        }
        ,
        a.prototype.writeUInt16BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 2, 65535, 0),
            this[t] = e >>> 8,
            this[t + 1] = 255 & e,
            t + 2
        }
        ,
        a.prototype.writeUInt32LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 4, 4294967295, 0),
            this[t + 3] = e >>> 24,
            this[t + 2] = e >>> 16,
            this[t + 1] = e >>> 8,
            this[t] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeUInt32BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 4, 4294967295, 0),
            this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeIntLE = function(e, t, r, n) {
            if (e = +e,
            t >>>= 0,
            !n) {
                var o = Math.pow(2, 8 * r - 1);
                N(this, e, t, r, o - 1, -o)
            }
            var i = 0
              , s = 1
              , a = 0;
            for (this[t] = 255 & e; ++i < r && (s *= 256); )
                e < 0 && 0 === a && 0 !== this[t + i - 1] && (a = 1),
                this[t + i] = (e / s | 0) - a & 255;
            return t + r
        }
        ,
        a.prototype.writeIntBE = function(e, t, r, n) {
            if (e = +e,
            t >>>= 0,
            !n) {
                var o = Math.pow(2, 8 * r - 1);
                N(this, e, t, r, o - 1, -o)
            }
            var i = r - 1
              , s = 1
              , a = 0;
            for (this[t + i] = 255 & e; --i >= 0 && (s *= 256); )
                e < 0 && 0 === a && 0 !== this[t + i + 1] && (a = 1),
                this[t + i] = (e / s | 0) - a & 255;
            return t + r
        }
        ,
        a.prototype.writeInt8 = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 1, 127, -128),
            e < 0 && (e = 255 + e + 1),
            this[t] = 255 & e,
            t + 1
        }
        ,
        a.prototype.writeInt16LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 2, 32767, -32768),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            t + 2
        }
        ,
        a.prototype.writeInt16BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 2, 32767, -32768),
            this[t] = e >>> 8,
            this[t + 1] = 255 & e,
            t + 2
        }
        ,
        a.prototype.writeInt32LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 4, 2147483647, -2147483648),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            this[t + 2] = e >>> 16,
            this[t + 3] = e >>> 24,
            t + 4
        }
        ,
        a.prototype.writeInt32BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || N(this, e, t, 4, 2147483647, -2147483648),
            e < 0 && (e = 4294967295 + e + 1),
            this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeFloatLE = function(e, t, r) {
            return C(this, e, t, !0, r)
        }
        ,
        a.prototype.writeFloatBE = function(e, t, r) {
            return C(this, e, t, !1, r)
        }
        ,
        a.prototype.writeDoubleLE = function(e, t, r) {
            return L(this, e, t, !0, r)
        }
        ,
        a.prototype.writeDoubleBE = function(e, t, r) {
            return L(this, e, t, !1, r)
        }
        ,
        a.prototype.copy = function(e, t, r, n) {
            if (!a.isBuffer(e))
                throw new TypeError("argument should be a Buffer");
            if (r || (r = 0),
            n || 0 === n || (n = this.length),
            t >= e.length && (t = e.length),
            t || (t = 0),
            n > 0 && n < r && (n = r),
            n === r)
                return 0;
            if (0 === e.length || 0 === this.length)
                return 0;
            if (t < 0)
                throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length)
                throw new RangeError("Index out of range");
            if (n < 0)
                throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length),
            e.length - t < n - r && (n = e.length - t + r);
            var o = n - r;
            if (this === e && "function" == typeof Uint8Array.prototype.copyWithin)
                this.copyWithin(t, r, n);
            else if (this === e && r < t && t < n)
                for (var i = o - 1; i >= 0; --i)
                    e[i + t] = this[i + r];
            else
                Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
            return o
        }
        ,
        a.prototype.fill = function(e, t, r, n) {
            if ("string" == typeof e) {
                if ("string" == typeof t ? (n = t,
                t = 0,
                r = this.length) : "string" == typeof r && (n = r,
                r = this.length),
                void 0 !== n && "string" != typeof n)
                    throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !a.isEncoding(n))
                    throw new TypeError("Unknown encoding: " + n);
                if (1 === e.length) {
                    var o = e.charCodeAt(0);
                    ("utf8" === n && o < 128 || "latin1" === n) && (e = o)
                }
            } else
                "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r)
                throw new RangeError("Out of range index");
            if (r <= t)
                return this;
            var i;
            if (t >>>= 0,
            r = void 0 === r ? this.length : r >>> 0,
            e || (e = 0),
            "number" == typeof e)
                for (i = t; i < r; ++i)
                    this[i] = e;
            else {
                var s = a.isBuffer(e) ? e : a.from(e, n)
                  , l = s.length;
                if (0 === l)
                    throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                for (i = 0; i < r - t; ++i)
                    this[i + t] = s[i % l]
            }
            return this
        }
        ;
        var j = /[^+/0-9A-Za-z-_]/g;
        function F(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
        }
        function B(e, t) {
            var r;
            t = t || 1 / 0;
            for (var n = e.length, o = null, i = [], s = 0; s < n; ++s) {
                if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                    if (!o) {
                        if (r > 56319) {
                            (t -= 3) > -1 && i.push(239, 191, 189);
                            continue
                        }
                        if (s + 1 === n) {
                            (t -= 3) > -1 && i.push(239, 191, 189);
                            continue
                        }
                        o = r;
                        continue
                    }
                    if (r < 56320) {
                        (t -= 3) > -1 && i.push(239, 191, 189),
                        o = r;
                        continue
                    }
                    r = 65536 + (o - 55296 << 10 | r - 56320)
                } else
                    o && (t -= 3) > -1 && i.push(239, 191, 189);
                if (o = null,
                r < 128) {
                    if ((t -= 1) < 0)
                        break;
                    i.push(r)
                } else if (r < 2048) {
                    if ((t -= 2) < 0)
                        break;
                    i.push(r >> 6 | 192, 63 & r | 128)
                } else if (r < 65536) {
                    if ((t -= 3) < 0)
                        break;
                    i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                } else {
                    if (!(r < 1114112))
                        throw new Error("Invalid code point");
                    if ((t -= 4) < 0)
                        break;
                    i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                }
            }
            return i
        }
        function $(e) {
            return n.toByteArray(function(e) {
                if ((e = (e = e.split("=")[0]).trim().replace(j, "")).length < 2)
                    return "";
                for (; e.length % 4 != 0; )
                    e += "=";
                return e
            }(e))
        }
        function D(e, t, r, n) {
            for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o)
                t[o + r] = e[o];
            return o
        }
        function U(e, t) {
            return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
        }
        function W(e) {
            return e != e
        }
    }
    , {
        "base64-js": 47,
        ieee754: 81
    }],
    51: [function(e, t, r) {
        var n = 1e3
          , o = 60 * n
          , i = 60 * o
          , s = 24 * i
          , a = 7 * s
          , l = 365.25 * s;
        function c(e, t, r, n) {
            var o = t >= 1.5 * r;
            return Math.round(e / r) + " " + n + (o ? "s" : "")
        }
        t.exports = function(e, t) {
            t = t || {};
            var r = typeof e;
            if ("string" === r && e.length > 0)
                return function(e) {
                    if ((e = String(e)).length > 100)
                        return;
                    var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
                    if (!t)
                        return;
                    var r = parseFloat(t[1]);
                    switch ((t[2] || "ms").toLowerCase()) {
                    case "years":
                    case "year":
                    case "yrs":
                    case "yr":
                    case "y":
                        return r * l;
                    case "weeks":
                    case "week":
                    case "w":
                        return r * a;
                    case "days":
                    case "day":
                    case "d":
                        return r * s;
                    case "hours":
                    case "hour":
                    case "hrs":
                    case "hr":
                    case "h":
                        return r * i;
                    case "minutes":
                    case "minute":
                    case "mins":
                    case "min":
                    case "m":
                        return r * o;
                    case "seconds":
                    case "second":
                    case "secs":
                    case "sec":
                    case "s":
                        return r * n;
                    case "milliseconds":
                    case "millisecond":
                    case "msecs":
                    case "msec":
                    case "ms":
                        return r;
                    default:
                        return
                    }
                }(e);
            if ("number" === r && isFinite(e))
                return t.long ? function(e) {
                    var t = Math.abs(e);
                    if (t >= s)
                        return c(e, t, s, "day");
                    if (t >= i)
                        return c(e, t, i, "hour");
                    if (t >= o)
                        return c(e, t, o, "minute");
                    if (t >= n)
                        return c(e, t, n, "second");
                    return e + " ms"
                }(e) : function(e) {
                    var t = Math.abs(e);
                    if (t >= s)
                        return Math.round(e / s) + "d";
                    if (t >= i)
                        return Math.round(e / i) + "h";
                    if (t >= o)
                        return Math.round(e / o) + "m";
                    if (t >= n)
                        return Math.round(e / n) + "s";
                    return e + "ms"
                }(e);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
        }
    }
    , {}],
    52: [function(e, t, r) {
        (function(n) {
            (function() {
                r.formatArgs = function(e) {
                    if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff),
                    !this.useColors)
                        return;
                    const r = "color: " + this.color;
                    e.splice(1, 0, r, "color: inherit");
                    let n = 0
                      , o = 0;
                    e[0].replace(/%[a-zA-Z%]/g, (e => {
                        "%%" !== e && (n++,
                        "%c" === e && (o = n))
                    }
                    )),
                    e.splice(o, 0, r)
                }
                ,
                r.save = function(e) {
                    try {
                        e ? r.storage.setItem("debug", e) : r.storage.removeItem("debug")
                    } catch (e) {}
                }
                ,
                r.load = function() {
                    let e;
                    try {
                        e = r.storage.getItem("debug")
                    } catch (e) {}
                    !e && void 0 !== n && "env"in n && (e = n.env.DEBUG);
                    return e
                }
                ,
                r.useColors = function() {
                    if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs))
                        return !0;
                    if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
                        return !1;
                    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
                }
                ,
                r.storage = function() {
                    try {
                        return localStorage
                    } catch (e) {}
                }(),
                r.destroy = ( () => {
                    let e = !1;
                    return () => {
                        e || (e = !0,
                        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))
                    }
                }
                )(),
                r.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"],
                r.log = console.debug || console.log || ( () => {}
                ),
                t.exports = e("./common")(r);
                const {formatters: o} = t.exports;
                o.j = function(e) {
                    try {
                        return JSON.stringify(e)
                    } catch (e) {
                        return "[UnexpectedJSONParseError]: " + e.message
                    }
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./common": 53,
        _process: 88
    }],
    53: [function(e, t, r) {
        t.exports = function(t) {
            function r(e) {
                let t, o, i, s = null;
                function a(...e) {
                    if (!a.enabled)
                        return;
                    const n = a
                      , o = Number(new Date)
                      , i = o - (t || o);
                    n.diff = i,
                    n.prev = t,
                    n.curr = o,
                    t = o,
                    e[0] = r.coerce(e[0]),
                    "string" != typeof e[0] && e.unshift("%O");
                    let s = 0;
                    e[0] = e[0].replace(/%([a-zA-Z%])/g, ( (t, o) => {
                        if ("%%" === t)
                            return "%";
                        s++;
                        const i = r.formatters[o];
                        if ("function" == typeof i) {
                            const r = e[s];
                            t = i.call(n, r),
                            e.splice(s, 1),
                            s--
                        }
                        return t
                    }
                    )),
                    r.formatArgs.call(n, e);
                    (n.log || r.log).apply(n, e)
                }
                return a.namespace = e,
                a.useColors = r.useColors(),
                a.color = r.selectColor(e),
                a.extend = n,
                a.destroy = r.destroy,
                Object.defineProperty(a, "enabled", {
                    enumerable: !0,
                    configurable: !1,
                    get: () => null !== s ? s : (o !== r.namespaces && (o = r.namespaces,
                    i = r.enabled(e)),
                    i),
                    set: e => {
                        s = e
                    }
                }),
                "function" == typeof r.init && r.init(a),
                a
            }
            function n(e, t) {
                const n = r(this.namespace + (void 0 === t ? ":" : t) + e);
                return n.log = this.log,
                n
            }
            function o(e) {
                return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*")
            }
            return r.debug = r,
            r.default = r,
            r.coerce = function(e) {
                if (e instanceof Error)
                    return e.stack || e.message;
                return e
            }
            ,
            r.disable = function() {
                const e = [...r.names.map(o), ...r.skips.map(o).map((e => "-" + e))].join(",");
                return r.enable(""),
                e
            }
            ,
            r.enable = function(e) {
                let t;
                r.save(e),
                r.namespaces = e,
                r.names = [],
                r.skips = [];
                const n = ("string" == typeof e ? e : "").split(/[\s,]+/)
                  , o = n.length;
                for (t = 0; t < o; t++)
                    n[t] && ("-" === (e = n[t].replace(/\*/g, ".*?"))[0] ? r.skips.push(new RegExp("^" + e.slice(1) + "$")) : r.names.push(new RegExp("^" + e + "$")))
            }
            ,
            r.enabled = function(e) {
                if ("*" === e[e.length - 1])
                    return !0;
                let t, n;
                for (t = 0,
                n = r.skips.length; t < n; t++)
                    if (r.skips[t].test(e))
                        return !1;
                for (t = 0,
                n = r.names.length; t < n; t++)
                    if (r.names[t].test(e))
                        return !0;
                return !1
            }
            ,
            r.humanize = e("ms"),
            r.destroy = function() {
                console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
            }
            ,
            Object.keys(t).forEach((e => {
                r[e] = t[e]
            }
            )),
            r.names = [],
            r.skips = [],
            r.formatters = {},
            r.selectColor = function(e) {
                let t = 0;
                for (let r = 0; r < e.length; r++)
                    t = (t << 5) - t + e.charCodeAt(r),
                    t |= 0;
                return r.colors[Math.abs(t) % r.colors.length]
            }
            ,
            r.enable(r.load()),
            r
        }
    }
    , {
        ms: 51
    }],
    54: [function(e, t, r) {
        "use strict";
        var n, o = "object" == typeof Reflect ? Reflect : null, i = o && "function" == typeof o.apply ? o.apply : function(e, t, r) {
            return Function.prototype.apply.call(e, t, r)
        }
        ;
        n = o && "function" == typeof o.ownKeys ? o.ownKeys : Object.getOwnPropertySymbols ? function(e) {
            return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
        }
        : function(e) {
            return Object.getOwnPropertyNames(e)
        }
        ;
        var s = Number.isNaN || function(e) {
            return e != e
        }
        ;
        function a() {
            a.init.call(this)
        }
        t.exports = a,
        t.exports.once = function(e, t) {
            return new Promise((function(r, n) {
                function o(r) {
                    e.removeListener(t, i),
                    n(r)
                }
                function i() {
                    "function" == typeof e.removeListener && e.removeListener("error", o),
                    r([].slice.call(arguments))
                }
                b(e, t, i, {
                    once: !0
                }),
                "error" !== t && function(e, t, r) {
                    "function" == typeof e.on && b(e, "error", t, r)
                }(e, o, {
                    once: !0
                })
            }
            ))
        }
        ,
        a.EventEmitter = a,
        a.prototype._events = void 0,
        a.prototype._eventsCount = 0,
        a.prototype._maxListeners = void 0;
        var l = 10;
        function c(e) {
            if ("function" != typeof e)
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
        }
        function u(e) {
            return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners
        }
        function d(e, t, r, n) {
            var o, i, s, a;
            if (c(r),
            void 0 === (i = e._events) ? (i = e._events = Object.create(null),
            e._eventsCount = 0) : (void 0 !== i.newListener && (e.emit("newListener", t, r.listener ? r.listener : r),
            i = e._events),
            s = i[t]),
            void 0 === s)
                s = i[t] = r,
                ++e._eventsCount;
            else if ("function" == typeof s ? s = i[t] = n ? [r, s] : [s, r] : n ? s.unshift(r) : s.push(r),
            (o = u(e)) > 0 && s.length > o && !s.warned) {
                s.warned = !0;
                var l = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                l.name = "MaxListenersExceededWarning",
                l.emitter = e,
                l.type = t,
                l.count = s.length,
                a = l,
                console && console.warn && console.warn(a)
            }
            return e
        }
        function f() {
            if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn),
                this.fired = !0,
                0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
        }
        function h(e, t, r) {
            var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r
            }
              , o = f.bind(n);
            return o.listener = r,
            n.wrapFn = o,
            o
        }
        function p(e, t, r) {
            var n = e._events;
            if (void 0 === n)
                return [];
            var o = n[t];
            return void 0 === o ? [] : "function" == typeof o ? r ? [o.listener || o] : [o] : r ? function(e) {
                for (var t = new Array(e.length), r = 0; r < t.length; ++r)
                    t[r] = e[r].listener || e[r];
                return t
            }(o) : m(o, o.length)
        }
        function g(e) {
            var t = this._events;
            if (void 0 !== t) {
                var r = t[e];
                if ("function" == typeof r)
                    return 1;
                if (void 0 !== r)
                    return r.length
            }
            return 0
        }
        function m(e, t) {
            for (var r = new Array(t), n = 0; n < t; ++n)
                r[n] = e[n];
            return r
        }
        function b(e, t, r, n) {
            if ("function" == typeof e.on)
                n.once ? e.once(t, r) : e.on(t, r);
            else {
                if ("function" != typeof e.addEventListener)
                    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                e.addEventListener(t, (function o(i) {
                    n.once && e.removeEventListener(t, o),
                    r(i)
                }
                ))
            }
        }
        Object.defineProperty(a, "defaultMaxListeners", {
            enumerable: !0,
            get: function() {
                return l
            },
            set: function(e) {
                if ("number" != typeof e || e < 0 || s(e))
                    throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
                l = e
            }
        }),
        a.init = function() {
            void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null),
            this._eventsCount = 0),
            this._maxListeners = this._maxListeners || void 0
        }
        ,
        a.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || e < 0 || s(e))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
            return this._maxListeners = e,
            this
        }
        ,
        a.prototype.getMaxListeners = function() {
            return u(this)
        }
        ,
        a.prototype.emit = function(e) {
            for (var t = [], r = 1; r < arguments.length; r++)
                t.push(arguments[r]);
            var n = "error" === e
              , o = this._events;
            if (void 0 !== o)
                n = n && void 0 === o.error;
            else if (!n)
                return !1;
            if (n) {
                var s;
                if (t.length > 0 && (s = t[0]),
                s instanceof Error)
                    throw s;
                var a = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
                throw a.context = s,
                a
            }
            var l = o[e];
            if (void 0 === l)
                return !1;
            if ("function" == typeof l)
                i(l, this, t);
            else {
                var c = l.length
                  , u = m(l, c);
                for (r = 0; r < c; ++r)
                    i(u[r], this, t)
            }
            return !0
        }
        ,
        a.prototype.addListener = function(e, t) {
            return d(this, e, t, !1)
        }
        ,
        a.prototype.on = a.prototype.addListener,
        a.prototype.prependListener = function(e, t) {
            return d(this, e, t, !0)
        }
        ,
        a.prototype.once = function(e, t) {
            return c(t),
            this.on(e, h(this, e, t)),
            this
        }
        ,
        a.prototype.prependOnceListener = function(e, t) {
            return c(t),
            this.prependListener(e, h(this, e, t)),
            this
        }
        ,
        a.prototype.removeListener = function(e, t) {
            var r, n, o, i, s;
            if (c(t),
            void 0 === (n = this._events))
                return this;
            if (void 0 === (r = n[e]))
                return this;
            if (r === t || r.listener === t)
                0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e],
                n.removeListener && this.emit("removeListener", e, r.listener || t));
            else if ("function" != typeof r) {
                for (o = -1,
                i = r.length - 1; i >= 0; i--)
                    if (r[i] === t || r[i].listener === t) {
                        s = r[i].listener,
                        o = i;
                        break
                    }
                if (o < 0)
                    return this;
                0 === o ? r.shift() : function(e, t) {
                    for (; t + 1 < e.length; t++)
                        e[t] = e[t + 1];
                    e.pop()
                }(r, o),
                1 === r.length && (n[e] = r[0]),
                void 0 !== n.removeListener && this.emit("removeListener", e, s || t)
            }
            return this
        }
        ,
        a.prototype.off = a.prototype.removeListener,
        a.prototype.removeAllListeners = function(e) {
            var t, r, n;
            if (void 0 === (r = this._events))
                return this;
            if (void 0 === r.removeListener)
                return 0 === arguments.length ? (this._events = Object.create(null),
                this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]),
                this;
            if (0 === arguments.length) {
                var o, i = Object.keys(r);
                for (n = 0; n < i.length; ++n)
                    "removeListener" !== (o = i[n]) && this.removeAllListeners(o);
                return this.removeAllListeners("removeListener"),
                this._events = Object.create(null),
                this._eventsCount = 0,
                this
            }
            if ("function" == typeof (t = r[e]))
                this.removeListener(e, t);
            else if (void 0 !== t)
                for (n = t.length - 1; n >= 0; n--)
                    this.removeListener(e, t[n]);
            return this
        }
        ,
        a.prototype.listeners = function(e) {
            return p(this, e, !0)
        }
        ,
        a.prototype.rawListeners = function(e) {
            return p(this, e, !1)
        }
        ,
        a.listenerCount = function(e, t) {
            return "function" == typeof e.listenerCount ? e.listenerCount(t) : g.call(e, t)
        }
        ,
        a.prototype.listenerCount = g,
        a.prototype.eventNames = function() {
            return this._eventsCount > 0 ? n(this._events) : []
        }
    }
    , {}],
    55: [function(e, t, r) {
        (function(t) {
            (function() {
                "use strict";
                Object.defineProperty(r, "__esModule", {
                    value: !0
                });
                const n = e("readable-stream");
                class o extends n.Duplex {
                    constructor(e) {
                        super({
                            objectMode: !0
                        }),
                        this._port = e,
                        this._port.onMessage.addListener((e => this._onMessage(e))),
                        this._port.onDisconnect.addListener(( () => this._onDisconnect())),
                        this._log = () => null
                    }
                    _onMessage(e) {
                        if (t.isBuffer(e)) {
                            const r = t.from(e);
                            this._log(r, !1),
                            this.push(r)
                        } else
                            this._log(e, !1),
                            this.push(e)
                    }
                    _onDisconnect() {
                        this.destroy()
                    }
                    _read() {}
                    _write(e, r, n) {
                        try {
                            if (t.isBuffer(e)) {
                                const t = e.toJSON();
                                t._isBuffer = !0,
                                this._log(t, !0),
                                this._port.postMessage(t)
                            } else
                                this._log(e, !0),
                                this._port.postMessage(e)
                        } catch (e) {
                            return n(new Error("PortDuplexStream - disconnected"))
                        }
                        return n()
                    }
                    _setLogger(e) {
                        this._log = e
                    }
                }
                r.default = o
            }
            ).call(this)
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        buffer: 50,
        "readable-stream": 74
    }],
    56: [function(e, t, r) {
        "use strict";
        const {AbortError: n, codes: o} = e("../../ours/errors")
          , {isNodeStream: i, isWebStream: s, kControllerErrorFunction: a} = e("./utils")
          , l = e("./end-of-stream")
          , {ERR_INVALID_ARG_TYPE: c} = o;
        t.exports.addAbortSignal = function(e, r) {
            if (( (e, t) => {
                if ("object" != typeof e || !("aborted"in e))
                    throw new c(t,"AbortSignal",e)
            }
            )(e, "signal"),
            !i(r) && !s(r))
                throw new c("stream",["ReadableStream", "WritableStream", "Stream"],r);
            return t.exports.addAbortSignalNoValidate(e, r)
        }
        ,
        t.exports.addAbortSignalNoValidate = function(e, t) {
            if ("object" != typeof e || !("aborted"in e))
                return t;
            const r = i(t) ? () => {
                t.destroy(new n(void 0,{
                    cause: e.reason
                }))
            }
            : () => {
                t[a](new n(void 0,{
                    cause: e.reason
                }))
            }
            ;
            return e.aborted ? r() : (e.addEventListener("abort", r),
            l(t, ( () => e.removeEventListener("abort", r)))),
            t
        }
    }
    , {
        "../../ours/errors": 75,
        "./end-of-stream": 62,
        "./utils": 71
    }],
    57: [function(e, t, r) {
        "use strict";
        const {StringPrototypeSlice: n, SymbolIterator: o, TypedArrayPrototypeSet: i, Uint8Array: s} = e("../../ours/primordials")
          , {Buffer: a} = e("buffer")
          , {inspect: l} = e("../../ours/util");
        t.exports = class {
            constructor() {
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            push(e) {
                const t = {
                    data: e,
                    next: null
                };
                this.length > 0 ? this.tail.next = t : this.head = t,
                this.tail = t,
                ++this.length
            }
            unshift(e) {
                const t = {
                    data: e,
                    next: this.head
                };
                0 === this.length && (this.tail = t),
                this.head = t,
                ++this.length
            }
            shift() {
                if (0 === this.length)
                    return;
                const e = this.head.data;
                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                --this.length,
                e
            }
            clear() {
                this.head = this.tail = null,
                this.length = 0
            }
            join(e) {
                if (0 === this.length)
                    return "";
                let t = this.head
                  , r = "" + t.data;
                for (; null !== (t = t.next); )
                    r += e + t.data;
                return r
            }
            concat(e) {
                if (0 === this.length)
                    return a.alloc(0);
                const t = a.allocUnsafe(e >>> 0);
                let r = this.head
                  , n = 0;
                for (; r; )
                    i(t, r.data, n),
                    n += r.data.length,
                    r = r.next;
                return t
            }
            consume(e, t) {
                const r = this.head.data;
                if (e < r.length) {
                    const t = r.slice(0, e);
                    return this.head.data = r.slice(e),
                    t
                }
                return e === r.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e)
            }
            first() {
                return this.head.data
            }
            *[o]() {
                for (let e = this.head; e; e = e.next)
                    yield e.data
            }
            _getString(e) {
                let t = ""
                  , r = this.head
                  , o = 0;
                do {
                    const i = r.data;
                    if (!(e > i.length)) {
                        e === i.length ? (t += i,
                        ++o,
                        r.next ? this.head = r.next : this.head = this.tail = null) : (t += n(i, 0, e),
                        this.head = r,
                        r.data = n(i, e));
                        break
                    }
                    t += i,
                    e -= i.length,
                    ++o
                } while (null !== (r = r.next));
                return this.length -= o,
                t
            }
            _getBuffer(e) {
                const t = a.allocUnsafe(e)
                  , r = e;
                let n = this.head
                  , o = 0;
                do {
                    const a = n.data;
                    if (!(e > a.length)) {
                        e === a.length ? (i(t, a, r - e),
                        ++o,
                        n.next ? this.head = n.next : this.head = this.tail = null) : (i(t, new s(a.buffer,a.byteOffset,e), r - e),
                        this.head = n,
                        n.data = a.slice(e));
                        break
                    }
                    i(t, a, r - e),
                    e -= a.length,
                    ++o
                } while (null !== (n = n.next));
                return this.length -= o,
                t
            }
            [Symbol.for("nodejs.util.inspect.custom")](e, t) {
                return l(this, {
                    ...t,
                    depth: 0,
                    customInspect: !1
                })
            }
        }
    }
    , {
        "../../ours/primordials": 76,
        "../../ours/util": 77,
        buffer: 50
    }],
    58: [function(e, t, r) {
        "use strict";
        const {pipeline: n} = e("./pipeline")
          , o = e("./duplex")
          , {destroyer: i} = e("./destroy")
          , {isNodeStream: s, isReadable: a, isWritable: l, isWebStream: c, isTransformStream: u, isWritableStream: d, isReadableStream: f} = e("./utils")
          , {AbortError: h, codes: {ERR_INVALID_ARG_VALUE: p, ERR_MISSING_ARGS: g}} = e("../../ours/errors")
          , m = e("./end-of-stream");
        t.exports = function(...e) {
            if (0 === e.length)
                throw new g("streams");
            if (1 === e.length)
                return o.from(e[0]);
            const t = [...e];
            if ("function" == typeof e[0] && (e[0] = o.from(e[0])),
            "function" == typeof e[e.length - 1]) {
                const t = e.length - 1;
                e[t] = o.from(e[t])
            }
            for (let r = 0; r < e.length; ++r)
                if (s(e[r]) || c(e[r])) {
                    if (r < e.length - 1 && !(a(e[r]) || f(e[r]) || u(e[r])))
                        throw new p(`streams[${r}]`,t[r],"must be readable");
                    if (r > 0 && !(l(e[r]) || d(e[r]) || u(e[r])))
                        throw new p(`streams[${r}]`,t[r],"must be writable")
                }
            let r, b, y, v, w;
            const _ = e[0]
              , E = n(e, (function(e) {
                const t = v;
                v = null,
                t ? t(e) : e ? w.destroy(e) : A || S || w.destroy()
            }
            ))
              , S = !!(l(_) || d(_) || u(_))
              , A = !!(a(E) || f(E) || u(E));
            if (w = new o({
                writableObjectMode: !(null == _ || !_.writableObjectMode),
                readableObjectMode: !(null == E || !E.writableObjectMode),
                writable: S,
                readable: A
            }),
            S) {
                if (s(_))
                    w._write = function(e, t, n) {
                        _.write(e, t) ? n() : r = n
                    }
                    ,
                    w._final = function(e) {
                        _.end(),
                        b = e
                    }
                    ,
                    _.on("drain", (function() {
                        if (r) {
                            const e = r;
                            r = null,
                            e()
                        }
                    }
                    ));
                else if (c(_)) {
                    const e = (u(_) ? _.writable : _).getWriter();
                    w._write = async function(t, r, n) {
                        try {
                            await e.ready,
                            e.write(t).catch(( () => {}
                            )),
                            n()
                        } catch (e) {
                            n(e)
                        }
                    }
                    ,
                    w._final = async function(t) {
                        try {
                            await e.ready,
                            e.close().catch(( () => {}
                            )),
                            b = t
                        } catch (e) {
                            t(e)
                        }
                    }
                }
                const e = u(E) ? E.readable : E;
                m(e, ( () => {
                    if (b) {
                        const e = b;
                        b = null,
                        e()
                    }
                }
                ))
            }
            if (A)
                if (s(E))
                    E.on("readable", (function() {
                        if (y) {
                            const e = y;
                            y = null,
                            e()
                        }
                    }
                    )),
                    E.on("end", (function() {
                        w.push(null)
                    }
                    )),
                    w._read = function() {
                        for (; ; ) {
                            const e = E.read();
                            if (null === e)
                                return void (y = w._read);
                            if (!w.push(e))
                                return
                        }
                    }
                    ;
                else if (c(E)) {
                    const e = (u(E) ? E.readable : E).getReader();
                    w._read = async function() {
                        for (; ; )
                            try {
                                const {value: t, done: r} = await e.read();
                                if (!w.push(t))
                                    return;
                                if (r)
                                    return void w.push(null)
                            } catch {
                                return
                            }
                    }
                }
            return w._destroy = function(e, t) {
                e || null === v || (e = new h),
                y = null,
                r = null,
                b = null,
                null === v ? t(e) : (v = t,
                s(E) && i(E, e))
            }
            ,
            w
        }
    }
    , {
        "../../ours/errors": 75,
        "./destroy": 59,
        "./duplex": 60,
        "./end-of-stream": 62,
        "./pipeline": 67,
        "./utils": 71
    }],
    59: [function(e, t, r) {
        "use strict";
        const n = e("process/")
          , {aggregateTwoErrors: o, codes: {ERR_MULTIPLE_CALLBACK: i}, AbortError: s} = e("../../ours/errors")
          , {Symbol: a} = e("../../ours/primordials")
          , {kDestroyed: l, isDestroyed: c, isFinished: u, isServerRequest: d} = e("./utils")
          , f = a("kDestroy")
          , h = a("kConstruct");
        function p(e, t, r) {
            e && (e.stack,
            t && !t.errored && (t.errored = e),
            r && !r.errored && (r.errored = e))
        }
        function g(e, t, r) {
            let o = !1;
            function i(t) {
                if (o)
                    return;
                o = !0;
                const i = e._readableState
                  , s = e._writableState;
                p(t, s, i),
                s && (s.closed = !0),
                i && (i.closed = !0),
                "function" == typeof r && r(t),
                t ? n.nextTick(m, e, t) : n.nextTick(b, e)
            }
            try {
                e._destroy(t || null, i)
            } catch (t) {
                i(t)
            }
        }
        function m(e, t) {
            y(e, t),
            b(e)
        }
        function b(e) {
            const t = e._readableState
              , r = e._writableState;
            r && (r.closeEmitted = !0),
            t && (t.closeEmitted = !0),
            (null != r && r.emitClose || null != t && t.emitClose) && e.emit("close")
        }
        function y(e, t) {
            const r = e._readableState
              , n = e._writableState;
            null != n && n.errorEmitted || null != r && r.errorEmitted || (n && (n.errorEmitted = !0),
            r && (r.errorEmitted = !0),
            e.emit("error", t))
        }
        function v(e, t, r) {
            const o = e._readableState
              , i = e._writableState;
            if (null != i && i.destroyed || null != o && o.destroyed)
                return this;
            null != o && o.autoDestroy || null != i && i.autoDestroy ? e.destroy(t) : t && (t.stack,
            i && !i.errored && (i.errored = t),
            o && !o.errored && (o.errored = t),
            r ? n.nextTick(y, e, t) : y(e, t))
        }
        function w(e) {
            let t = !1;
            function r(r) {
                if (t)
                    return void v(e, null != r ? r : new i);
                t = !0;
                const o = e._readableState
                  , s = e._writableState
                  , a = s || o;
                o && (o.constructed = !0),
                s && (s.constructed = !0),
                a.destroyed ? e.emit(f, r) : r ? v(e, r, !0) : n.nextTick(_, e)
            }
            try {
                e._construct((e => {
                    n.nextTick(r, e)
                }
                ))
            } catch (e) {
                n.nextTick(r, e)
            }
        }
        function _(e) {
            e.emit(h)
        }
        function E(e) {
            return (null == e ? void 0 : e.setHeader) && "function" == typeof e.abort
        }
        function S(e) {
            e.emit("close")
        }
        function A(e, t) {
            e.emit("error", t),
            n.nextTick(S, e)
        }
        t.exports = {
            construct: function(e, t) {
                if ("function" != typeof e._construct)
                    return;
                const r = e._readableState
                  , o = e._writableState;
                r && (r.constructed = !1),
                o && (o.constructed = !1),
                e.once(h, t),
                e.listenerCount(h) > 1 || n.nextTick(w, e)
            },
            destroyer: function(e, t) {
                e && !c(e) && (t || u(e) || (t = new s),
                d(e) ? (e.socket = null,
                e.destroy(t)) : E(e) ? e.abort() : E(e.req) ? e.req.abort() : "function" == typeof e.destroy ? e.destroy(t) : "function" == typeof e.close ? e.close() : t ? n.nextTick(A, e, t) : n.nextTick(S, e),
                e.destroyed || (e[l] = !0))
            },
            destroy: function(e, t) {
                const r = this._readableState
                  , n = this._writableState
                  , i = n || r;
                return null != n && n.destroyed || null != r && r.destroyed ? ("function" == typeof t && t(),
                this) : (p(e, n, r),
                n && (n.destroyed = !0),
                r && (r.destroyed = !0),
                i.constructed ? g(this, e, t) : this.once(f, (function(r) {
                    g(this, o(r, e), t)
                }
                )),
                this)
            },
            undestroy: function() {
                const e = this._readableState
                  , t = this._writableState;
                e && (e.constructed = !0,
                e.closed = !1,
                e.closeEmitted = !1,
                e.destroyed = !1,
                e.errored = null,
                e.errorEmitted = !1,
                e.reading = !1,
                e.ended = !1 === e.readable,
                e.endEmitted = !1 === e.readable),
                t && (t.constructed = !0,
                t.destroyed = !1,
                t.closed = !1,
                t.closeEmitted = !1,
                t.errored = null,
                t.errorEmitted = !1,
                t.finalCalled = !1,
                t.prefinished = !1,
                t.ended = !1 === t.writable,
                t.ending = !1 === t.writable,
                t.finished = !1 === t.writable)
            },
            errorOrDestroy: v
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "./utils": 71,
        "process/": 88
    }],
    60: [function(e, t, r) {
        "use strict";
        const {ObjectDefineProperties: n, ObjectGetOwnPropertyDescriptor: o, ObjectKeys: i, ObjectSetPrototypeOf: s} = e("../../ours/primordials");
        t.exports = c;
        const a = e("./readable")
          , l = e("./writable");
        s(c.prototype, a.prototype),
        s(c, a);
        {
            const e = i(l.prototype);
            for (let t = 0; t < e.length; t++) {
                const r = e[t];
                c.prototype[r] || (c.prototype[r] = l.prototype[r])
            }
        }
        function c(e) {
            if (!(this instanceof c))
                return new c(e);
            a.call(this, e),
            l.call(this, e),
            e ? (this.allowHalfOpen = !1 !== e.allowHalfOpen,
            !1 === e.readable && (this._readableState.readable = !1,
            this._readableState.ended = !0,
            this._readableState.endEmitted = !0),
            !1 === e.writable && (this._writableState.writable = !1,
            this._writableState.ending = !0,
            this._writableState.ended = !0,
            this._writableState.finished = !0)) : this.allowHalfOpen = !0
        }
        let u, d;
        function f() {
            return void 0 === u && (u = {}),
            u
        }
        n(c.prototype, {
            writable: {
                __proto__: null,
                ...o(l.prototype, "writable")
            },
            writableHighWaterMark: {
                __proto__: null,
                ...o(l.prototype, "writableHighWaterMark")
            },
            writableObjectMode: {
                __proto__: null,
                ...o(l.prototype, "writableObjectMode")
            },
            writableBuffer: {
                __proto__: null,
                ...o(l.prototype, "writableBuffer")
            },
            writableLength: {
                __proto__: null,
                ...o(l.prototype, "writableLength")
            },
            writableFinished: {
                __proto__: null,
                ...o(l.prototype, "writableFinished")
            },
            writableCorked: {
                __proto__: null,
                ...o(l.prototype, "writableCorked")
            },
            writableEnded: {
                __proto__: null,
                ...o(l.prototype, "writableEnded")
            },
            writableNeedDrain: {
                __proto__: null,
                ...o(l.prototype, "writableNeedDrain")
            },
            destroyed: {
                __proto__: null,
                get() {
                    return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                },
                set(e) {
                    this._readableState && this._writableState && (this._readableState.destroyed = e,
                    this._writableState.destroyed = e)
                }
            }
        }),
        c.fromWeb = function(e, t) {
            return f().newStreamDuplexFromReadableWritablePair(e, t)
        }
        ,
        c.toWeb = function(e) {
            return f().newReadableWritablePairFromDuplex(e)
        }
        ,
        c.from = function(t) {
            return d || (d = e("./duplexify")),
            d(t, "body")
        }
    }
    , {
        "../../ours/primordials": 76,
        "./duplexify": 61,
        "./readable": 68,
        "./writable": 72
    }],
    61: [function(e, t, r) {
        const n = e("process/")
          , o = e("buffer")
          , {isReadable: i, isWritable: s, isIterable: a, isNodeStream: l, isReadableNodeStream: c, isWritableNodeStream: u, isDuplexNodeStream: d} = e("./utils")
          , f = e("./end-of-stream")
          , {AbortError: h, codes: {ERR_INVALID_ARG_TYPE: p, ERR_INVALID_RETURN_VALUE: g}} = e("../../ours/errors")
          , {destroyer: m} = e("./destroy")
          , b = e("./duplex")
          , y = e("./readable")
          , {createDeferredPromise: v} = e("../../ours/util")
          , w = e("./from")
          , _ = globalThis.Blob || o.Blob
          , E = void 0 !== _ ? function(e) {
            return e instanceof _
        }
        : function(e) {
            return !1
        }
          , S = globalThis.AbortController || e("abort-controller").AbortController
          , {FunctionPrototypeCall: A} = e("../../ours/primordials");
        class R extends b {
            constructor(e) {
                super(e),
                !1 === (null == e ? void 0 : e.readable) && (this._readableState.readable = !1,
                this._readableState.ended = !0,
                this._readableState.endEmitted = !0),
                !1 === (null == e ? void 0 : e.writable) && (this._writableState.writable = !1,
                this._writableState.ending = !0,
                this._writableState.ended = !0,
                this._writableState.finished = !0)
            }
        }
        function M(e) {
            const t = e.readable && "function" != typeof e.readable.read ? y.wrap(e.readable) : e.readable
              , r = e.writable;
            let n, o, a, l, c, u = !!i(t), d = !!s(r);
            function p(e) {
                const t = l;
                l = null,
                t ? t(e) : e && c.destroy(e)
            }
            return c = new R({
                readableObjectMode: !(null == t || !t.readableObjectMode),
                writableObjectMode: !(null == r || !r.writableObjectMode),
                readable: u,
                writable: d
            }),
            d && (f(r, (e => {
                d = !1,
                e && m(t, e),
                p(e)
            }
            )),
            c._write = function(e, t, o) {
                r.write(e, t) ? o() : n = o
            }
            ,
            c._final = function(e) {
                r.end(),
                o = e
            }
            ,
            r.on("drain", (function() {
                if (n) {
                    const e = n;
                    n = null,
                    e()
                }
            }
            )),
            r.on("finish", (function() {
                if (o) {
                    const e = o;
                    o = null,
                    e()
                }
            }
            ))),
            u && (f(t, (e => {
                u = !1,
                e && m(t, e),
                p(e)
            }
            )),
            t.on("readable", (function() {
                if (a) {
                    const e = a;
                    a = null,
                    e()
                }
            }
            )),
            t.on("end", (function() {
                c.push(null)
            }
            )),
            c._read = function() {
                for (; ; ) {
                    const e = t.read();
                    if (null === e)
                        return void (a = c._read);
                    if (!c.push(e))
                        return
                }
            }
            ),
            c._destroy = function(e, i) {
                e || null === l || (e = new h),
                a = null,
                n = null,
                o = null,
                null === l ? i(e) : (l = i,
                m(r, e),
                m(t, e))
            }
            ,
            c
        }
        t.exports = function e(t, r) {
            if (d(t))
                return t;
            if (c(t))
                return M({
                    readable: t
                });
            if (u(t))
                return M({
                    writable: t
                });
            if (l(t))
                return M({
                    writable: !1,
                    readable: !1
                });
            if ("function" == typeof t) {
                const {value: e, write: o, final: i, destroy: s} = function(e) {
                    let {promise: t, resolve: r} = v();
                    const o = new S
                      , i = o.signal
                      , s = e(async function*() {
                        for (; ; ) {
                            const e = t;
                            t = null;
                            const {chunk: o, done: s, cb: a} = await e;
                            if (n.nextTick(a),
                            s)
                                return;
                            if (i.aborted)
                                throw new h(void 0,{
                                    cause: i.reason
                                });
                            ({promise: t, resolve: r} = v()),
                            yield o
                        }
                    }(), {
                        signal: i
                    });
                    return {
                        value: s,
                        write(e, t, n) {
                            const o = r;
                            r = null,
                            o({
                                chunk: e,
                                done: !1,
                                cb: n
                            })
                        },
                        final(e) {
                            const t = r;
                            r = null,
                            t({
                                done: !0,
                                cb: e
                            })
                        },
                        destroy(e, t) {
                            o.abort(),
                            t(e)
                        }
                    }
                }(t);
                if (a(e))
                    return w(R, e, {
                        objectMode: !0,
                        write: o,
                        final: i,
                        destroy: s
                    });
                const l = null == e ? void 0 : e.then;
                if ("function" == typeof l) {
                    let t;
                    const r = A(l, e, (e => {
                        if (null != e)
                            throw new g("nully","body",e)
                    }
                    ), (e => {
                        m(t, e)
                    }
                    ));
                    return t = new R({
                        objectMode: !0,
                        readable: !1,
                        write: o,
                        final(e) {
                            i((async () => {
                                try {
                                    await r,
                                    n.nextTick(e, null)
                                } catch (t) {
                                    n.nextTick(e, t)
                                }
                            }
                            ))
                        },
                        destroy: s
                    })
                }
                throw new g("Iterable, AsyncIterable or AsyncFunction",r,e)
            }
            if (E(t))
                return e(t.arrayBuffer());
            if (a(t))
                return w(R, t, {
                    objectMode: !0,
                    writable: !1
                });
            if ("object" == typeof (null == t ? void 0 : t.writable) || "object" == typeof (null == t ? void 0 : t.readable)) {
                return M({
                    readable: null != t && t.readable ? c(null == t ? void 0 : t.readable) ? null == t ? void 0 : t.readable : e(t.readable) : void 0,
                    writable: null != t && t.writable ? u(null == t ? void 0 : t.writable) ? null == t ? void 0 : t.writable : e(t.writable) : void 0
                })
            }
            const o = null == t ? void 0 : t.then;
            if ("function" == typeof o) {
                let e;
                return A(o, t, (t => {
                    null != t && e.push(t),
                    e.push(null)
                }
                ), (t => {
                    m(e, t)
                }
                )),
                e = new R({
                    objectMode: !0,
                    writable: !1,
                    read() {}
                })
            }
            throw new p(r,["Blob", "ReadableStream", "WritableStream", "Stream", "Iterable", "AsyncIterable", "Function", "{ readable, writable } pair", "Promise"],t)
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "../../ours/util": 77,
        "./destroy": 59,
        "./duplex": 60,
        "./end-of-stream": 62,
        "./from": 63,
        "./readable": 68,
        "./utils": 71,
        "abort-controller": 46,
        buffer: 50,
        "process/": 88
    }],
    62: [function(e, t, r) {
        const n = e("process/")
          , {AbortError: o, codes: i} = e("../../ours/errors")
          , {ERR_INVALID_ARG_TYPE: s, ERR_STREAM_PREMATURE_CLOSE: a} = i
          , {kEmptyObject: l, once: c} = e("../../ours/util")
          , {validateAbortSignal: u, validateFunction: d, validateObject: f, validateBoolean: h} = e("../validators")
          , {Promise: p, PromisePrototypeThen: g} = e("../../ours/primordials")
          , {isClosed: m, isReadable: b, isReadableNodeStream: y, isReadableStream: v, isReadableFinished: w, isReadableErrored: _, isWritable: E, isWritableNodeStream: S, isWritableStream: A, isWritableFinished: R, isWritableErrored: M, isNodeStream: x, willEmitClose: O, kIsClosedPromise: T} = e("./utils");
        const I = () => {}
        ;
        function k(e, t, r) {
            var i, h;
            if (2 === arguments.length ? (r = t,
            t = l) : null == t ? t = l : f(t, "options"),
            d(r, "callback"),
            u(t.signal, "options.signal"),
            r = c(r),
            v(e) || A(e))
                return function(e, t, r) {
                    let i = !1
                      , s = I;
                    if (t.signal)
                        if (s = () => {
                            i = !0,
                            r.call(e, new o(void 0,{
                                cause: t.signal.reason
                            }))
                        }
                        ,
                        t.signal.aborted)
                            n.nextTick(s);
                        else {
                            const n = r;
                            r = c(( (...r) => {
                                t.signal.removeEventListener("abort", s),
                                n.apply(e, r)
                            }
                            )),
                            t.signal.addEventListener("abort", s)
                        }
                    const a = (...t) => {
                        i || n.nextTick(( () => r.apply(e, t)))
                    }
                    ;
                    return g(e[T].promise, a, a),
                    I
                }(e, t, r);
            if (!x(e))
                throw new s("stream",["ReadableStream", "WritableStream", "Stream"],e);
            const p = null !== (i = t.readable) && void 0 !== i ? i : y(e)
              , k = null !== (h = t.writable) && void 0 !== h ? h : S(e)
              , N = e._writableState
              , P = e._readableState
              , C = () => {
                e.writable || F()
            }
            ;
            let L = O(e) && y(e) === p && S(e) === k
              , j = R(e, !1);
            const F = () => {
                j = !0,
                e.destroyed && (L = !1),
                (!L || e.readable && !p) && (p && !B || r.call(e))
            }
            ;
            let B = w(e, !1);
            const $ = () => {
                B = !0,
                e.destroyed && (L = !1),
                (!L || e.writable && !k) && (k && !j || r.call(e))
            }
              , D = t => {
                r.call(e, t)
            }
            ;
            let U = m(e);
            const W = () => {
                U = !0;
                const t = M(e) || _(e);
                return t && "boolean" != typeof t ? r.call(e, t) : p && !B && y(e, !0) && !w(e, !1) ? r.call(e, new a) : !k || j || R(e, !1) ? void r.call(e) : r.call(e, new a)
            }
              , V = () => {
                U = !0;
                const t = M(e) || _(e);
                if (t && "boolean" != typeof t)
                    return r.call(e, t);
                r.call(e)
            }
              , H = () => {
                e.req.on("finish", F)
            }
            ;
            !function(e) {
                return e.setHeader && "function" == typeof e.abort
            }(e) ? k && !N && (e.on("end", C),
            e.on("close", C)) : (e.on("complete", F),
            L || e.on("abort", W),
            e.req ? H() : e.on("request", H)),
            L || "boolean" != typeof e.aborted || e.on("aborted", W),
            e.on("end", $),
            e.on("finish", F),
            !1 !== t.error && e.on("error", D),
            e.on("close", W),
            U ? n.nextTick(W) : null != N && N.errorEmitted || null != P && P.errorEmitted ? L || n.nextTick(V) : (p || L && !b(e) || !j && !1 !== E(e)) && (k || L && !E(e) || !B && !1 !== b(e)) ? P && e.req && e.aborted && n.nextTick(V) : n.nextTick(V);
            const G = () => {
                r = I,
                e.removeListener("aborted", W),
                e.removeListener("complete", F),
                e.removeListener("abort", W),
                e.removeListener("request", H),
                e.req && e.req.removeListener("finish", F),
                e.removeListener("end", C),
                e.removeListener("close", C),
                e.removeListener("finish", F),
                e.removeListener("end", $),
                e.removeListener("error", D),
                e.removeListener("close", W)
            }
            ;
            if (t.signal && !U) {
                const i = () => {
                    const n = r;
                    G(),
                    n.call(e, new o(void 0,{
                        cause: t.signal.reason
                    }))
                }
                ;
                if (t.signal.aborted)
                    n.nextTick(i);
                else {
                    const n = r;
                    r = c(( (...r) => {
                        t.signal.removeEventListener("abort", i),
                        n.apply(e, r)
                    }
                    )),
                    t.signal.addEventListener("abort", i)
                }
            }
            return G
        }
        t.exports = k,
        t.exports.finished = function(e, t) {
            var r;
            let n = !1;
            return null === t && (t = l),
            null !== (r = t) && void 0 !== r && r.cleanup && (h(t.cleanup, "cleanup"),
            n = t.cleanup),
            new p(( (r, o) => {
                const i = k(e, t, (e => {
                    n && i(),
                    e ? o(e) : r()
                }
                ))
            }
            ))
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "../../ours/util": 77,
        "../validators": 73,
        "./utils": 71,
        "process/": 88
    }],
    63: [function(e, t, r) {
        "use strict";
        const n = e("process/")
          , {PromisePrototypeThen: o, SymbolAsyncIterator: i, SymbolIterator: s} = e("../../ours/primordials")
          , {Buffer: a} = e("buffer")
          , {ERR_INVALID_ARG_TYPE: l, ERR_STREAM_NULL_VALUES: c} = e("../../ours/errors").codes;
        t.exports = function(e, t, r) {
            let u, d;
            if ("string" == typeof t || t instanceof a)
                return new e({
                    objectMode: !0,
                    ...r,
                    read() {
                        this.push(t),
                        this.push(null)
                    }
                });
            if (t && t[i])
                d = !0,
                u = t[i]();
            else {
                if (!t || !t[s])
                    throw new l("iterable",["Iterable"],t);
                d = !1,
                u = t[s]()
            }
            const f = new e({
                objectMode: !0,
                highWaterMark: 1,
                ...r
            });
            let h = !1;
            return f._read = function() {
                h || (h = !0,
                async function() {
                    for (; ; ) {
                        try {
                            const {value: e, done: t} = d ? await u.next() : u.next();
                            if (t)
                                f.push(null);
                            else {
                                const t = e && "function" == typeof e.then ? await e : e;
                                if (null === t)
                                    throw h = !1,
                                    new c;
                                if (f.push(t))
                                    continue;
                                h = !1
                            }
                        } catch (e) {
                            f.destroy(e)
                        }
                        break
                    }
                }())
            }
            ,
            f._destroy = function(e, t) {
                o(async function(e) {
                    const t = null != e
                      , r = "function" == typeof u.throw;
                    if (t && r) {
                        const {value: t, done: r} = await u.throw(e);
                        if (await t,
                        r)
                            return
                    }
                    if ("function" == typeof u.return) {
                        const {value: e} = await u.return();
                        await e
                    }
                }(e), ( () => n.nextTick(t, e)), (r => n.nextTick(t, r || e)))
            }
            ,
            f
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        buffer: 50,
        "process/": 88
    }],
    64: [function(e, t, r) {
        "use strict";
        const {ArrayIsArray: n, ObjectSetPrototypeOf: o} = e("../../ours/primordials")
          , {EventEmitter: i} = e("events");
        function s(e) {
            i.call(this, e)
        }
        function a(e, t, r) {
            if ("function" == typeof e.prependListener)
                return e.prependListener(t, r);
            e._events && e._events[t] ? n(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
        }
        o(s.prototype, i.prototype),
        o(s, i),
        s.prototype.pipe = function(e, t) {
            const r = this;
            function n(t) {
                e.writable && !1 === e.write(t) && r.pause && r.pause()
            }
            function o() {
                r.readable && r.resume && r.resume()
            }
            r.on("data", n),
            e.on("drain", o),
            e._isStdio || t && !1 === t.end || (r.on("end", l),
            r.on("close", c));
            let s = !1;
            function l() {
                s || (s = !0,
                e.end())
            }
            function c() {
                s || (s = !0,
                "function" == typeof e.destroy && e.destroy())
            }
            function u(e) {
                d(),
                0 === i.listenerCount(this, "error") && this.emit("error", e)
            }
            function d() {
                r.removeListener("data", n),
                e.removeListener("drain", o),
                r.removeListener("end", l),
                r.removeListener("close", c),
                r.removeListener("error", u),
                e.removeListener("error", u),
                r.removeListener("end", d),
                r.removeListener("close", d),
                e.removeListener("close", d)
            }
            return a(r, "error", u),
            a(e, "error", u),
            r.on("end", d),
            r.on("close", d),
            e.on("close", d),
            e.emit("pipe", r),
            e
        }
        ,
        t.exports = {
            Stream: s,
            prependListener: a
        }
    }
    , {
        "../../ours/primordials": 76,
        events: 54
    }],
    65: [function(e, t, r) {
        "use strict";
        const n = globalThis.AbortController || e("abort-controller").AbortController
          , {codes: {ERR_INVALID_ARG_VALUE: o, ERR_INVALID_ARG_TYPE: i, ERR_MISSING_ARGS: s, ERR_OUT_OF_RANGE: a}, AbortError: l} = e("../../ours/errors")
          , {validateAbortSignal: c, validateInteger: u, validateObject: d} = e("../validators")
          , f = e("../../ours/primordials").Symbol("kWeak")
          , {finished: h} = e("./end-of-stream")
          , p = e("./compose")
          , {addAbortSignalNoValidate: g} = e("./add-abort-signal")
          , {isWritable: m, isNodeStream: b} = e("./utils")
          , {ArrayPrototypePush: y, MathFloor: v, Number: w, NumberIsNaN: _, Promise: E, PromiseReject: S, PromisePrototypeThen: A, Symbol: R} = e("../../ours/primordials")
          , M = R("kEmpty")
          , x = R("kEof");
        function O(e, t) {
            if ("function" != typeof e)
                throw new i("fn",["Function", "AsyncFunction"],e);
            null != t && d(t, "options"),
            null != (null == t ? void 0 : t.signal) && c(t.signal, "options.signal");
            let r = 1;
            return null != (null == t ? void 0 : t.concurrency) && (r = v(t.concurrency)),
            u(r, "concurrency", 1),
            async function*() {
                var o, i;
                const s = new n
                  , a = this
                  , c = []
                  , u = s.signal
                  , d = {
                    signal: u
                }
                  , f = () => s.abort();
                let h, p;
                null != t && null !== (o = t.signal) && void 0 !== o && o.aborted && f(),
                null == t || null === (i = t.signal) || void 0 === i || i.addEventListener("abort", f);
                let g = !1;
                function m() {
                    g = !0
                }
                !async function() {
                    try {
                        for await(let t of a) {
                            var n;
                            if (g)
                                return;
                            if (u.aborted)
                                throw new l;
                            try {
                                t = e(t, d)
                            } catch (e) {
                                t = S(e)
                            }
                            t !== M && ("function" == typeof (null === (n = t) || void 0 === n ? void 0 : n.catch) && t.catch(m),
                            c.push(t),
                            h && (h(),
                            h = null),
                            !g && c.length && c.length >= r && await new E((e => {
                                p = e
                            }
                            )))
                        }
                        c.push(x)
                    } catch (e) {
                        const t = S(e);
                        A(t, void 0, m),
                        c.push(t)
                    } finally {
                        var o;
                        g = !0,
                        h && (h(),
                        h = null),
                        null == t || null === (o = t.signal) || void 0 === o || o.removeEventListener("abort", f)
                    }
                }();
                try {
                    for (; ; ) {
                        for (; c.length > 0; ) {
                            const e = await c[0];
                            if (e === x)
                                return;
                            if (u.aborted)
                                throw new l;
                            e !== M && (yield e),
                            c.shift(),
                            p && (p(),
                            p = null)
                        }
                        await new E((e => {
                            h = e
                        }
                        ))
                    }
                } finally {
                    s.abort(),
                    g = !0,
                    p && (p(),
                    p = null)
                }
            }
            .call(this)
        }
        async function T(e, t=void 0) {
            for await(const r of I.call(this, e, t))
                return !0;
            return !1
        }
        function I(e, t) {
            if ("function" != typeof e)
                throw new i("fn",["Function", "AsyncFunction"],e);
            return O.call(this, (async function(t, r) {
                return await e(t, r) ? t : M
            }
            ), t)
        }
        class k extends s {
            constructor() {
                super("reduce"),
                this.message = "Reduce of an empty stream requires an initial value"
            }
        }
        function N(e) {
            if (e = w(e),
            _(e))
                return 0;
            if (e < 0)
                throw new a("number",">= 0",e);
            return e
        }
        t.exports.streamReturningOperators = {
            asIndexedPairs: function(e=void 0) {
                return null != e && d(e, "options"),
                null != (null == e ? void 0 : e.signal) && c(e.signal, "options.signal"),
                async function*() {
                    let t = 0;
                    for await(const n of this) {
                        var r;
                        if (null != e && null !== (r = e.signal) && void 0 !== r && r.aborted)
                            throw new l({
                                cause: e.signal.reason
                            });
                        yield[t++, n]
                    }
                }
                .call(this)
            },
            drop: function(e, t=void 0) {
                return null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && c(t.signal, "options.signal"),
                e = N(e),
                async function*() {
                    var r;
                    if (null != t && null !== (r = t.signal) && void 0 !== r && r.aborted)
                        throw new l;
                    for await(const r of this) {
                        var n;
                        if (null != t && null !== (n = t.signal) && void 0 !== n && n.aborted)
                            throw new l;
                        e-- <= 0 && (yield r)
                    }
                }
                .call(this)
            },
            filter: I,
            flatMap: function(e, t) {
                const r = O.call(this, e, t);
                return async function*() {
                    for await(const e of r)
                        yield*e
                }
                .call(this)
            },
            map: O,
            take: function(e, t=void 0) {
                return null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && c(t.signal, "options.signal"),
                e = N(e),
                async function*() {
                    var r;
                    if (null != t && null !== (r = t.signal) && void 0 !== r && r.aborted)
                        throw new l;
                    for await(const r of this) {
                        var n;
                        if (null != t && null !== (n = t.signal) && void 0 !== n && n.aborted)
                            throw new l;
                        if (!(e-- > 0))
                            return;
                        yield r
                    }
                }
                .call(this)
            },
            compose: function(e, t) {
                if (null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && c(t.signal, "options.signal"),
                b(e) && !m(e))
                    throw new o("stream",e,"must be writable");
                const r = p(this, e);
                return null != t && t.signal && g(t.signal, r),
                r
            }
        },
        t.exports.promiseReturningOperators = {
            every: async function(e, t=void 0) {
                if ("function" != typeof e)
                    throw new i("fn",["Function", "AsyncFunction"],e);
                return !await T.call(this, (async (...t) => !await e(...t)), t)
            },
            forEach: async function(e, t) {
                if ("function" != typeof e)
                    throw new i("fn",["Function", "AsyncFunction"],e);
                for await(const r of O.call(this, (async function(t, r) {
                    return await e(t, r),
                    M
                }
                ), t))
                    ;
            },
            reduce: async function(e, t, r) {
                var o;
                if ("function" != typeof e)
                    throw new i("reducer",["Function", "AsyncFunction"],e);
                null != r && d(r, "options"),
                null != (null == r ? void 0 : r.signal) && c(r.signal, "options.signal");
                let s = arguments.length > 1;
                if (null != r && null !== (o = r.signal) && void 0 !== o && o.aborted) {
                    const e = new l(void 0,{
                        cause: r.signal.reason
                    });
                    throw this.once("error", ( () => {}
                    )),
                    await h(this.destroy(e)),
                    e
                }
                const a = new n
                  , u = a.signal;
                if (null != r && r.signal) {
                    const e = {
                        once: !0,
                        [f]: this
                    };
                    r.signal.addEventListener("abort", ( () => a.abort()), e)
                }
                let p = !1;
                try {
                    for await(const n of this) {
                        var g;
                        if (p = !0,
                        null != r && null !== (g = r.signal) && void 0 !== g && g.aborted)
                            throw new l;
                        s ? t = await e(t, n, {
                            signal: u
                        }) : (t = n,
                        s = !0)
                    }
                    if (!p && !s)
                        throw new k
                } finally {
                    a.abort()
                }
                return t
            },
            toArray: async function(e) {
                null != e && d(e, "options"),
                null != (null == e ? void 0 : e.signal) && c(e.signal, "options.signal");
                const t = [];
                for await(const n of this) {
                    var r;
                    if (null != e && null !== (r = e.signal) && void 0 !== r && r.aborted)
                        throw new l(void 0,{
                            cause: e.signal.reason
                        });
                    y(t, n)
                }
                return t
            },
            some: T,
            find: async function(e, t) {
                for await(const r of I.call(this, e, t))
                    return r
            }
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "../validators": 73,
        "./add-abort-signal": 56,
        "./compose": 58,
        "./end-of-stream": 62,
        "./utils": 71,
        "abort-controller": 46
    }],
    66: [function(e, t, r) {
        "use strict";
        const {ObjectSetPrototypeOf: n} = e("../../ours/primordials");
        t.exports = i;
        const o = e("./transform");
        function i(e) {
            if (!(this instanceof i))
                return new i(e);
            o.call(this, e)
        }
        n(i.prototype, o.prototype),
        n(i, o),
        i.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "../../ours/primordials": 76,
        "./transform": 70
    }],
    67: [function(e, t, r) {
        const n = e("process/")
          , {ArrayIsArray: o, Promise: i, SymbolAsyncIterator: s} = e("../../ours/primordials")
          , a = e("./end-of-stream")
          , {once: l} = e("../../ours/util")
          , c = e("./destroy")
          , u = e("./duplex")
          , {aggregateTwoErrors: d, codes: {ERR_INVALID_ARG_TYPE: f, ERR_INVALID_RETURN_VALUE: h, ERR_MISSING_ARGS: p, ERR_STREAM_DESTROYED: g, ERR_STREAM_PREMATURE_CLOSE: m}, AbortError: b} = e("../../ours/errors")
          , {validateFunction: y, validateAbortSignal: v} = e("../validators")
          , {isIterable: w, isReadable: _, isReadableNodeStream: E, isNodeStream: S, isTransformStream: A, isWebStream: R, isReadableStream: M, isReadableEnded: x} = e("./utils")
          , O = globalThis.AbortController || e("abort-controller").AbortController;
        let T, I;
        function k(e, t, r) {
            let n = !1;
            e.on("close", ( () => {
                n = !0
            }
            ));
            return {
                destroy: t => {
                    n || (n = !0,
                    c.destroyer(e, t || new g("pipe")))
                }
                ,
                cleanup: a(e, {
                    readable: t,
                    writable: r
                }, (e => {
                    n = !e
                }
                ))
            }
        }
        function N(t) {
            if (w(t))
                return t;
            if (E(t))
                return async function*(t) {
                    I || (I = e("./readable"));
                    yield*I.prototype[s].call(t)
                }(t);
            throw new f("val",["Readable", "Iterable", "AsyncIterable"],t)
        }
        async function P(e, t, r, {end: n}) {
            let o, s = null;
            const l = e => {
                if (e && (o = e),
                s) {
                    const e = s;
                    s = null,
                    e()
                }
            }
              , c = () => new i(( (e, t) => {
                o ? t(o) : s = () => {
                    o ? t(o) : e()
                }
            }
            ));
            t.on("drain", l);
            const u = a(t, {
                readable: !1
            }, l);
            try {
                t.writableNeedDrain && await c();
                for await(const r of e)
                    t.write(r) || await c();
                n && t.end(),
                await c(),
                r()
            } catch (e) {
                r(o !== e ? d(o, e) : e)
            } finally {
                u(),
                t.off("drain", l)
            }
        }
        async function C(e, t, r, {end: n}) {
            A(t) && (t = t.writable);
            const o = t.getWriter();
            try {
                for await(const t of e)
                    await o.ready,
                    o.write(t).catch(( () => {}
                    ));
                await o.ready,
                n && await o.close(),
                r()
            } catch (e) {
                try {
                    await o.abort(e),
                    r(e)
                } catch (e) {
                    r(e)
                }
            }
        }
        function L(t, r, i) {
            if (1 === t.length && o(t[0]) && (t = t[0]),
            t.length < 2)
                throw new p("streams");
            const s = new O
              , a = s.signal
              , l = null == i ? void 0 : i.signal
              , c = [];
            function d() {
                F(new b)
            }
            let g, m;
            v(l, "options.signal"),
            null == l || l.addEventListener("abort", d);
            const y = [];
            let x, I = 0;
            function L(e) {
                F(e, 0 == --I)
            }
            function F(e, t) {
                if (!e || g && "ERR_STREAM_PREMATURE_CLOSE" !== g.code || (g = e),
                g || t) {
                    for (; y.length; )
                        y.shift()(g);
                    null == l || l.removeEventListener("abort", d),
                    s.abort(),
                    t && (g || c.forEach((e => e())),
                    n.nextTick(r, g, m))
                }
            }
            for (let U = 0; U < t.length; U++) {
                const W = t[U]
                  , V = U < t.length - 1
                  , H = U > 0
                  , G = V || !1 !== (null == i ? void 0 : i.end)
                  , J = U === t.length - 1;
                if (S(W)) {
                    if (G) {
                        const {destroy: z, cleanup: q} = k(W, V, H);
                        y.push(z),
                        _(W) && J && c.push(q)
                    }
                    function B(e) {
                        e && "AbortError" !== e.name && "ERR_STREAM_PREMATURE_CLOSE" !== e.code && L(e)
                    }
                    W.on("error", B),
                    _(W) && J && c.push(( () => {
                        W.removeListener("error", B)
                    }
                    ))
                }
                if (0 === U)
                    if ("function" == typeof W) {
                        if (x = W({
                            signal: a
                        }),
                        !w(x))
                            throw new h("Iterable, AsyncIterable or Stream","source",x)
                    } else
                        x = w(W) || E(W) || A(W) ? W : u.from(W);
                else if ("function" == typeof W) {
                    var $;
                    if (A(x))
                        x = N(null === ($ = x) || void 0 === $ ? void 0 : $.readable);
                    else
                        x = N(x);
                    if (x = W(x, {
                        signal: a
                    }),
                    V) {
                        if (!w(x, !0))
                            throw new h("AsyncIterable",`transform[${U - 1}]`,x)
                    } else {
                        var D;
                        T || (T = e("./passthrough"));
                        const Y = new T({
                            objectMode: !0
                        })
                          , X = null === (D = x) || void 0 === D ? void 0 : D.then;
                        if ("function" == typeof X)
                            I++,
                            X.call(x, (e => {
                                m = e,
                                null != e && Y.write(e),
                                G && Y.end(),
                                n.nextTick(L)
                            }
                            ), (e => {
                                Y.destroy(e),
                                n.nextTick(L, e)
                            }
                            ));
                        else if (w(x, !0))
                            I++,
                            P(x, Y, L, {
                                end: G
                            });
                        else {
                            if (!M(x) && !A(x))
                                throw new h("AsyncIterable or Promise","destination",x);
                            {
                                const Q = x.readable || x;
                                I++,
                                P(Q, Y, L, {
                                    end: G
                                })
                            }
                        }
                        x = Y;
                        const {destroy: K, cleanup: Z} = k(x, !1, !0);
                        y.push(K),
                        J && c.push(Z)
                    }
                } else if (S(W)) {
                    if (E(x)) {
                        I += 2;
                        const ee = j(x, W, L, {
                            end: G
                        });
                        _(W) && J && c.push(ee)
                    } else if (A(x) || M(x)) {
                        const te = x.readable || x;
                        I++,
                        P(te, W, L, {
                            end: G
                        })
                    } else {
                        if (!w(x))
                            throw new f("val",["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],x);
                        I++,
                        P(x, W, L, {
                            end: G
                        })
                    }
                    x = W
                } else if (R(W)) {
                    if (E(x))
                        I++,
                        C(N(x), W, L, {
                            end: G
                        });
                    else if (M(x) || w(x))
                        I++,
                        C(x, W, L, {
                            end: G
                        });
                    else {
                        if (!A(x))
                            throw new f("val",["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],x);
                        I++,
                        C(x.readable, W, L, {
                            end: G
                        })
                    }
                    x = W
                } else
                    x = u.from(W)
            }
            return (null != a && a.aborted || null != l && l.aborted) && n.nextTick(d),
            x
        }
        function j(e, t, r, {end: o}) {
            let i = !1;
            if (t.on("close", ( () => {
                i || r(new m)
            }
            )),
            e.pipe(t, {
                end: !1
            }),
            o) {
                function s() {
                    i = !0,
                    t.end()
                }
                x(e) ? n.nextTick(s) : e.once("end", s)
            } else
                r();
            return a(e, {
                readable: !0,
                writable: !1
            }, (t => {
                const n = e._readableState;
                t && "ERR_STREAM_PREMATURE_CLOSE" === t.code && n && n.ended && !n.errored && !n.errorEmitted ? e.once("end", r).once("error", r) : r(t)
            }
            )),
            a(t, {
                readable: !1,
                writable: !0
            }, r)
        }
        t.exports = {
            pipelineImpl: L,
            pipeline: function(...e) {
                return L(e, l(function(e) {
                    return y(e[e.length - 1], "streams[stream.length - 1]"),
                    e.pop()
                }(e)))
            }
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "../../ours/util": 77,
        "../validators": 73,
        "./destroy": 59,
        "./duplex": 60,
        "./end-of-stream": 62,
        "./passthrough": 66,
        "./readable": 68,
        "./utils": 71,
        "abort-controller": 46,
        "process/": 88
    }],
    68: [function(e, t, r) {
        const n = e("process/")
          , {ArrayPrototypeIndexOf: o, NumberIsInteger: i, NumberIsNaN: s, NumberParseInt: a, ObjectDefineProperties: l, ObjectKeys: c, ObjectSetPrototypeOf: u, Promise: d, SafeSet: f, SymbolAsyncIterator: h, Symbol: p} = e("../../ours/primordials");
        t.exports = $,
        $.ReadableState = B;
        const {EventEmitter: g} = e("events")
          , {Stream: m, prependListener: b} = e("./legacy")
          , {Buffer: y} = e("buffer")
          , {addAbortSignal: v} = e("./add-abort-signal")
          , w = e("./end-of-stream");
        let _ = e("../../ours/util").debuglog("stream", (e => {
            _ = e
        }
        ));
        const E = e("./buffer_list")
          , S = e("./destroy")
          , {getHighWaterMark: A, getDefaultHighWaterMark: R} = e("./state")
          , {aggregateTwoErrors: M, codes: {ERR_INVALID_ARG_TYPE: x, ERR_METHOD_NOT_IMPLEMENTED: O, ERR_OUT_OF_RANGE: T, ERR_STREAM_PUSH_AFTER_EOF: I, ERR_STREAM_UNSHIFT_AFTER_END_EVENT: k}} = e("../../ours/errors")
          , {validateObject: N} = e("../validators")
          , P = p("kPaused")
          , {StringDecoder: C} = e("string_decoder")
          , L = e("./from");
        u($.prototype, m.prototype),
        u($, m);
        const j = () => {}
          , {errorOrDestroy: F} = S;
        function B(t, r, n) {
            "boolean" != typeof n && (n = r instanceof e("./duplex")),
            this.objectMode = !(!t || !t.objectMode),
            n && (this.objectMode = this.objectMode || !(!t || !t.readableObjectMode)),
            this.highWaterMark = t ? A(this, t, "readableHighWaterMark", n) : R(!1),
            this.buffer = new E,
            this.length = 0,
            this.pipes = [],
            this.flowing = null,
            this.ended = !1,
            this.endEmitted = !1,
            this.reading = !1,
            this.constructed = !0,
            this.sync = !0,
            this.needReadable = !1,
            this.emittedReadable = !1,
            this.readableListening = !1,
            this.resumeScheduled = !1,
            this[P] = null,
            this.errorEmitted = !1,
            this.emitClose = !t || !1 !== t.emitClose,
            this.autoDestroy = !t || !1 !== t.autoDestroy,
            this.destroyed = !1,
            this.errored = null,
            this.closed = !1,
            this.closeEmitted = !1,
            this.defaultEncoding = t && t.defaultEncoding || "utf8",
            this.awaitDrainWriters = null,
            this.multiAwaitDrain = !1,
            this.readingMore = !1,
            this.dataEmitted = !1,
            this.decoder = null,
            this.encoding = null,
            t && t.encoding && (this.decoder = new C(t.encoding),
            this.encoding = t.encoding)
        }
        function $(t) {
            if (!(this instanceof $))
                return new $(t);
            const r = this instanceof e("./duplex");
            this._readableState = new B(t,this,r),
            t && ("function" == typeof t.read && (this._read = t.read),
            "function" == typeof t.destroy && (this._destroy = t.destroy),
            "function" == typeof t.construct && (this._construct = t.construct),
            t.signal && !r && v(t.signal, this)),
            m.call(this, t),
            S.construct(this, ( () => {
                this._readableState.needReadable && G(this, this._readableState)
            }
            ))
        }
        function D(e, t, r, n) {
            _("readableAddChunk", t);
            const o = e._readableState;
            let i;
            if (o.objectMode || ("string" == typeof t ? (r = r || o.defaultEncoding,
            o.encoding !== r && (n && o.encoding ? t = y.from(t, r).toString(o.encoding) : (t = y.from(t, r),
            r = ""))) : t instanceof y ? r = "" : m._isUint8Array(t) ? (t = m._uint8ArrayToBuffer(t),
            r = "") : null != t && (i = new x("chunk",["string", "Buffer", "Uint8Array"],t))),
            i)
                F(e, i);
            else if (null === t)
                o.reading = !1,
                function(e, t) {
                    if (_("onEofChunk"),
                    t.ended)
                        return;
                    if (t.decoder) {
                        const e = t.decoder.end();
                        e && e.length && (t.buffer.push(e),
                        t.length += t.objectMode ? 1 : e.length)
                    }
                    t.ended = !0,
                    t.sync ? V(e) : (t.needReadable = !1,
                    t.emittedReadable = !0,
                    H(e))
                }(e, o);
            else if (o.objectMode || t && t.length > 0)
                if (n)
                    if (o.endEmitted)
                        F(e, new k);
                    else {
                        if (o.destroyed || o.errored)
                            return !1;
                        U(e, o, t, !0)
                    }
                else if (o.ended)
                    F(e, new I);
                else {
                    if (o.destroyed || o.errored)
                        return !1;
                    o.reading = !1,
                    o.decoder && !r ? (t = o.decoder.write(t),
                    o.objectMode || 0 !== t.length ? U(e, o, t, !1) : G(e, o)) : U(e, o, t, !1)
                }
            else
                n || (o.reading = !1,
                G(e, o));
            return !o.ended && (o.length < o.highWaterMark || 0 === o.length)
        }
        function U(e, t, r, n) {
            t.flowing && 0 === t.length && !t.sync && e.listenerCount("data") > 0 ? (t.multiAwaitDrain ? t.awaitDrainWriters.clear() : t.awaitDrainWriters = null,
            t.dataEmitted = !0,
            e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length,
            n ? t.buffer.unshift(r) : t.buffer.push(r),
            t.needReadable && V(e)),
            G(e, t)
        }
        $.prototype.destroy = S.destroy,
        $.prototype._undestroy = S.undestroy,
        $.prototype._destroy = function(e, t) {
            t(e)
        }
        ,
        $.prototype[g.captureRejectionSymbol] = function(e) {
            this.destroy(e)
        }
        ,
        $.prototype.push = function(e, t) {
            return D(this, e, t, !1)
        }
        ,
        $.prototype.unshift = function(e, t) {
            return D(this, e, t, !0)
        }
        ,
        $.prototype.isPaused = function() {
            const e = this._readableState;
            return !0 === e[P] || !1 === e.flowing
        }
        ,
        $.prototype.setEncoding = function(e) {
            const t = new C(e);
            this._readableState.decoder = t,
            this._readableState.encoding = this._readableState.decoder.encoding;
            const r = this._readableState.buffer;
            let n = "";
            for (const e of r)
                n += t.write(e);
            return r.clear(),
            "" !== n && r.push(n),
            this._readableState.length = n.length,
            this
        }
        ;
        function W(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : s(e) ? t.flowing && t.length ? t.buffer.first().length : t.length : e <= t.length ? e : t.ended ? t.length : 0
        }
        function V(e) {
            const t = e._readableState;
            _("emitReadable", t.needReadable, t.emittedReadable),
            t.needReadable = !1,
            t.emittedReadable || (_("emitReadable", t.flowing),
            t.emittedReadable = !0,
            n.nextTick(H, e))
        }
        function H(e) {
            const t = e._readableState;
            _("emitReadable_", t.destroyed, t.length, t.ended),
            t.destroyed || t.errored || !t.length && !t.ended || (e.emit("readable"),
            t.emittedReadable = !1),
            t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark,
            X(e)
        }
        function G(e, t) {
            !t.readingMore && t.constructed && (t.readingMore = !0,
            n.nextTick(J, e, t))
        }
        function J(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length); ) {
                const r = t.length;
                if (_("maybeReadMore read 0"),
                e.read(0),
                r === t.length)
                    break
            }
            t.readingMore = !1
        }
        function z(e) {
            const t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0,
            t.resumeScheduled && !1 === t[P] ? t.flowing = !0 : e.listenerCount("data") > 0 ? e.resume() : t.readableListening || (t.flowing = null)
        }
        function q(e) {
            _("readable nexttick read 0"),
            e.read(0)
        }
        function Y(e, t) {
            _("resume", t.reading),
            t.reading || e.read(0),
            t.resumeScheduled = !1,
            e.emit("resume"),
            X(e),
            t.flowing && !t.reading && e.read(0)
        }
        function X(e) {
            const t = e._readableState;
            for (_("flow", t.flowing); t.flowing && null !== e.read(); )
                ;
        }
        function K(e, t) {
            "function" != typeof e.read && (e = $.wrap(e, {
                objectMode: !0
            }));
            const r = async function*(e, t) {
                let r, n = j;
                function o(t) {
                    this === e ? (n(),
                    n = j) : n = t
                }
                e.on("readable", o);
                const i = w(e, {
                    writable: !1
                }, (e => {
                    r = e ? M(r, e) : null,
                    n(),
                    n = j
                }
                ));
                try {
                    for (; ; ) {
                        const t = e.destroyed ? null : e.read();
                        if (null !== t)
                            yield t;
                        else {
                            if (r)
                                throw r;
                            if (null === r)
                                return;
                            await new d(o)
                        }
                    }
                } catch (e) {
                    throw r = M(r, e),
                    r
                } finally {
                    !r && !1 === (null == t ? void 0 : t.destroyOnReturn) || void 0 !== r && !e._readableState.autoDestroy ? (e.off("readable", o),
                    i()) : S.destroyer(e, null)
                }
            }(e, t);
            return r.stream = e,
            r
        }
        function Z(e, t) {
            if (0 === t.length)
                return null;
            let r;
            return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length),
            t.buffer.clear()) : r = t.buffer.consume(e, t.decoder),
            r
        }
        function Q(e) {
            const t = e._readableState;
            _("endReadable", t.endEmitted),
            t.endEmitted || (t.ended = !0,
            n.nextTick(ee, t, e))
        }
        function ee(e, t) {
            if (_("endReadableNT", e.endEmitted, e.length),
            !e.errored && !e.closeEmitted && !e.endEmitted && 0 === e.length)
                if (e.endEmitted = !0,
                t.emit("end"),
                t.writable && !1 === t.allowHalfOpen)
                    n.nextTick(te, t);
                else if (e.autoDestroy) {
                    const e = t._writableState;
                    (!e || e.autoDestroy && (e.finished || !1 === e.writable)) && t.destroy()
                }
        }
        function te(e) {
            e.writable && !e.writableEnded && !e.destroyed && e.end()
        }
        let re;
        function ne() {
            return void 0 === re && (re = {}),
            re
        }
        $.prototype.read = function(e) {
            _("read", e),
            void 0 === e ? e = NaN : i(e) || (e = a(e, 10));
            const t = this._readableState
              , r = e;
            if (e > t.highWaterMark && (t.highWaterMark = function(e) {
                if (e > 1073741824)
                    throw new T("size","<= 1GiB",e);
                return e--,
                e |= e >>> 1,
                e |= e >>> 2,
                e |= e >>> 4,
                e |= e >>> 8,
                e |= e >>> 16,
                ++e
            }(e)),
            0 !== e && (t.emittedReadable = !1),
            0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                return _("read: emitReadable", t.length, t.ended),
                0 === t.length && t.ended ? Q(this) : V(this),
                null;
            if (0 === (e = W(e, t)) && t.ended)
                return 0 === t.length && Q(this),
                null;
            let n, o = t.needReadable;
            if (_("need readable", o),
            (0 === t.length || t.length - e < t.highWaterMark) && (o = !0,
            _("length less than watermark", o)),
            t.ended || t.reading || t.destroyed || t.errored || !t.constructed)
                o = !1,
                _("reading, ended or constructing", o);
            else if (o) {
                _("do read"),
                t.reading = !0,
                t.sync = !0,
                0 === t.length && (t.needReadable = !0);
                try {
                    this._read(t.highWaterMark)
                } catch (e) {
                    F(this, e)
                }
                t.sync = !1,
                t.reading || (e = W(r, t))
            }
            return n = e > 0 ? Z(e, t) : null,
            null === n ? (t.needReadable = t.length <= t.highWaterMark,
            e = 0) : (t.length -= e,
            t.multiAwaitDrain ? t.awaitDrainWriters.clear() : t.awaitDrainWriters = null),
            0 === t.length && (t.ended || (t.needReadable = !0),
            r !== e && t.ended && Q(this)),
            null === n || t.errorEmitted || t.closeEmitted || (t.dataEmitted = !0,
            this.emit("data", n)),
            n
        }
        ,
        $.prototype._read = function(e) {
            throw new O("_read()")
        }
        ,
        $.prototype.pipe = function(e, t) {
            const r = this
              , o = this._readableState;
            1 === o.pipes.length && (o.multiAwaitDrain || (o.multiAwaitDrain = !0,
            o.awaitDrainWriters = new f(o.awaitDrainWriters ? [o.awaitDrainWriters] : []))),
            o.pipes.push(e),
            _("pipe count=%d opts=%j", o.pipes.length, t);
            const i = (!t || !1 !== t.end) && e !== n.stdout && e !== n.stderr ? a : m;
            function s(t, n) {
                _("onunpipe"),
                t === r && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0,
                function() {
                    _("cleanup"),
                    e.removeListener("close", p),
                    e.removeListener("finish", g),
                    l && e.removeListener("drain", l);
                    e.removeListener("error", h),
                    e.removeListener("unpipe", s),
                    r.removeListener("end", a),
                    r.removeListener("end", m),
                    r.removeListener("data", d),
                    c = !0,
                    l && o.awaitDrainWriters && (!e._writableState || e._writableState.needDrain) && l()
                }())
            }
            function a() {
                _("onend"),
                e.end()
            }
            let l;
            o.endEmitted ? n.nextTick(i) : r.once("end", i),
            e.on("unpipe", s);
            let c = !1;
            function u() {
                c || (1 === o.pipes.length && o.pipes[0] === e ? (_("false write response, pause", 0),
                o.awaitDrainWriters = e,
                o.multiAwaitDrain = !1) : o.pipes.length > 1 && o.pipes.includes(e) && (_("false write response, pause", o.awaitDrainWriters.size),
                o.awaitDrainWriters.add(e)),
                r.pause()),
                l || (l = function(e, t) {
                    return function() {
                        const r = e._readableState;
                        r.awaitDrainWriters === t ? (_("pipeOnDrain", 1),
                        r.awaitDrainWriters = null) : r.multiAwaitDrain && (_("pipeOnDrain", r.awaitDrainWriters.size),
                        r.awaitDrainWriters.delete(t)),
                        r.awaitDrainWriters && 0 !== r.awaitDrainWriters.size || !e.listenerCount("data") || e.resume()
                    }
                }(r, e),
                e.on("drain", l))
            }
            function d(t) {
                _("ondata");
                const r = e.write(t);
                _("dest.write", r),
                !1 === r && u()
            }
            function h(t) {
                if (_("onerror", t),
                m(),
                e.removeListener("error", h),
                0 === e.listenerCount("error")) {
                    const r = e._writableState || e._readableState;
                    r && !r.errorEmitted ? F(e, t) : e.emit("error", t)
                }
            }
            function p() {
                e.removeListener("finish", g),
                m()
            }
            function g() {
                _("onfinish"),
                e.removeListener("close", p),
                m()
            }
            function m() {
                _("unpipe"),
                r.unpipe(e)
            }
            return r.on("data", d),
            b(e, "error", h),
            e.once("close", p),
            e.once("finish", g),
            e.emit("pipe", r),
            !0 === e.writableNeedDrain ? o.flowing && u() : o.flowing || (_("pipe resume"),
            r.resume()),
            e
        }
        ,
        $.prototype.unpipe = function(e) {
            const t = this._readableState;
            if (0 === t.pipes.length)
                return this;
            if (!e) {
                const e = t.pipes;
                t.pipes = [],
                this.pause();
                for (let t = 0; t < e.length; t++)
                    e[t].emit("unpipe", this, {
                        hasUnpiped: !1
                    });
                return this
            }
            const r = o(t.pipes, e);
            return -1 === r || (t.pipes.splice(r, 1),
            0 === t.pipes.length && this.pause(),
            e.emit("unpipe", this, {
                hasUnpiped: !1
            })),
            this
        }
        ,
        $.prototype.on = function(e, t) {
            const r = m.prototype.on.call(this, e, t)
              , o = this._readableState;
            return "data" === e ? (o.readableListening = this.listenerCount("readable") > 0,
            !1 !== o.flowing && this.resume()) : "readable" === e && (o.endEmitted || o.readableListening || (o.readableListening = o.needReadable = !0,
            o.flowing = !1,
            o.emittedReadable = !1,
            _("on readable", o.length, o.reading),
            o.length ? V(this) : o.reading || n.nextTick(q, this))),
            r
        }
        ,
        $.prototype.addListener = $.prototype.on,
        $.prototype.removeListener = function(e, t) {
            const r = m.prototype.removeListener.call(this, e, t);
            return "readable" === e && n.nextTick(z, this),
            r
        }
        ,
        $.prototype.off = $.prototype.removeListener,
        $.prototype.removeAllListeners = function(e) {
            const t = m.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || n.nextTick(z, this),
            t
        }
        ,
        $.prototype.resume = function() {
            const e = this._readableState;
            return e.flowing || (_("resume"),
            e.flowing = !e.readableListening,
            function(e, t) {
                t.resumeScheduled || (t.resumeScheduled = !0,
                n.nextTick(Y, e, t))
            }(this, e)),
            e[P] = !1,
            this
        }
        ,
        $.prototype.pause = function() {
            return _("call pause flowing=%j", this._readableState.flowing),
            !1 !== this._readableState.flowing && (_("pause"),
            this._readableState.flowing = !1,
            this.emit("pause")),
            this._readableState[P] = !0,
            this
        }
        ,
        $.prototype.wrap = function(e) {
            let t = !1;
            e.on("data", (r => {
                !this.push(r) && e.pause && (t = !0,
                e.pause())
            }
            )),
            e.on("end", ( () => {
                this.push(null)
            }
            )),
            e.on("error", (e => {
                F(this, e)
            }
            )),
            e.on("close", ( () => {
                this.destroy()
            }
            )),
            e.on("destroy", ( () => {
                this.destroy()
            }
            )),
            this._read = () => {
                t && e.resume && (t = !1,
                e.resume())
            }
            ;
            const r = c(e);
            for (let t = 1; t < r.length; t++) {
                const n = r[t];
                void 0 === this[n] && "function" == typeof e[n] && (this[n] = e[n].bind(e))
            }
            return this
        }
        ,
        $.prototype[h] = function() {
            return K(this)
        }
        ,
        $.prototype.iterator = function(e) {
            return void 0 !== e && N(e, "options"),
            K(this, e)
        }
        ,
        l($.prototype, {
            readable: {
                __proto__: null,
                get() {
                    const e = this._readableState;
                    return !(!e || !1 === e.readable || e.destroyed || e.errorEmitted || e.endEmitted)
                },
                set(e) {
                    this._readableState && (this._readableState.readable = !!e)
                }
            },
            readableDidRead: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.dataEmitted
                }
            },
            readableAborted: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return !(!1 === this._readableState.readable || !this._readableState.destroyed && !this._readableState.errored || this._readableState.endEmitted)
                }
            },
            readableHighWaterMark: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.highWaterMark
                }
            },
            readableBuffer: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState && this._readableState.buffer
                }
            },
            readableFlowing: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.flowing
                },
                set: function(e) {
                    this._readableState && (this._readableState.flowing = e)
                }
            },
            readableLength: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState.length
                }
            },
            readableObjectMode: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.objectMode
                }
            },
            readableEncoding: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState ? this._readableState.encoding : null
                }
            },
            errored: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState ? this._readableState.errored : null
                }
            },
            closed: {
                __proto__: null,
                get() {
                    return !!this._readableState && this._readableState.closed
                }
            },
            destroyed: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.destroyed
                },
                set(e) {
                    this._readableState && (this._readableState.destroyed = e)
                }
            },
            readableEnded: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.endEmitted
                }
            }
        }),
        l(B.prototype, {
            pipesCount: {
                __proto__: null,
                get() {
                    return this.pipes.length
                }
            },
            paused: {
                __proto__: null,
                get() {
                    return !1 !== this[P]
                },
                set(e) {
                    this[P] = !!e
                }
            }
        }),
        $._fromList = Z,
        $.from = function(e, t) {
            return L($, e, t)
        }
        ,
        $.fromWeb = function(e, t) {
            return ne().newStreamReadableFromReadableStream(e, t)
        }
        ,
        $.toWeb = function(e, t) {
            return ne().newReadableStreamFromStreamReadable(e, t)
        }
        ,
        $.wrap = function(e, t) {
            var r, n;
            return new $({
                objectMode: null === (r = null !== (n = e.readableObjectMode) && void 0 !== n ? n : e.objectMode) || void 0 === r || r,
                ...t,
                destroy(t, r) {
                    S.destroyer(e, t),
                    r(t)
                }
            }).wrap(e)
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "../../ours/util": 77,
        "../validators": 73,
        "./add-abort-signal": 56,
        "./buffer_list": 57,
        "./destroy": 59,
        "./duplex": 60,
        "./end-of-stream": 62,
        "./from": 63,
        "./legacy": 64,
        "./state": 69,
        buffer: 50,
        events: 54,
        "process/": 88,
        string_decoder: 150
    }],
    69: [function(e, t, r) {
        "use strict";
        const {MathFloor: n, NumberIsInteger: o} = e("../../ours/primordials")
          , {ERR_INVALID_ARG_VALUE: i} = e("../../ours/errors").codes;
        function s(e) {
            return e ? 16 : 16384
        }
        t.exports = {
            getHighWaterMark: function(e, t, r, a) {
                const l = function(e, t, r) {
                    return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null
                }(t, a, r);
                if (null != l) {
                    if (!o(l) || l < 0) {
                        throw new i(a ? `options.${r}` : "options.highWaterMark",l)
                    }
                    return n(l)
                }
                return s(e.objectMode)
            },
            getDefaultHighWaterMark: s
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76
    }],
    70: [function(e, t, r) {
        "use strict";
        const {ObjectSetPrototypeOf: n, Symbol: o} = e("../../ours/primordials");
        t.exports = c;
        const {ERR_METHOD_NOT_IMPLEMENTED: i} = e("../../ours/errors").codes
          , s = e("./duplex")
          , {getHighWaterMark: a} = e("./state");
        n(c.prototype, s.prototype),
        n(c, s);
        const l = o("kCallback");
        function c(e) {
            if (!(this instanceof c))
                return new c(e);
            const t = e ? a(this, e, "readableHighWaterMark", !0) : null;
            0 === t && (e = {
                ...e,
                highWaterMark: null,
                readableHighWaterMark: t,
                writableHighWaterMark: e.writableHighWaterMark || 0
            }),
            s.call(this, e),
            this._readableState.sync = !1,
            this[l] = null,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", d)
        }
        function u(e) {
            "function" != typeof this._flush || this.destroyed ? (this.push(null),
            e && e()) : this._flush(( (t, r) => {
                t ? e ? e(t) : this.destroy(t) : (null != r && this.push(r),
                this.push(null),
                e && e())
            }
            ))
        }
        function d() {
            this._final !== u && u.call(this)
        }
        c.prototype._final = u,
        c.prototype._transform = function(e, t, r) {
            throw new i("_transform()")
        }
        ,
        c.prototype._write = function(e, t, r) {
            const n = this._readableState
              , o = this._writableState
              , i = n.length;
            this._transform(e, t, ( (e, t) => {
                e ? r(e) : (null != t && this.push(t),
                o.ended || i === n.length || n.length < n.highWaterMark ? r() : this[l] = r)
            }
            ))
        }
        ,
        c.prototype._read = function() {
            if (this[l]) {
                const e = this[l];
                this[l] = null,
                e()
            }
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "./duplex": 60,
        "./state": 69
    }],
    71: [function(e, t, r) {
        "use strict";
        const {Symbol: n, SymbolAsyncIterator: o, SymbolIterator: i, SymbolFor: s} = e("../../ours/primordials")
          , a = n("kDestroyed")
          , l = n("kIsErrored")
          , c = n("kIsReadable")
          , u = n("kIsDisturbed")
          , d = s("nodejs.webstream.isClosedPromise")
          , f = s("nodejs.webstream.controllerErrorFunction");
        function h(e, t=!1) {
            var r;
            return !(!e || "function" != typeof e.pipe || "function" != typeof e.on || t && ("function" != typeof e.pause || "function" != typeof e.resume) || e._writableState && !1 === (null === (r = e._readableState) || void 0 === r ? void 0 : r.readable) || e._writableState && !e._readableState)
        }
        function p(e) {
            var t;
            return !(!e || "function" != typeof e.write || "function" != typeof e.on || e._readableState && !1 === (null === (t = e._writableState) || void 0 === t ? void 0 : t.writable))
        }
        function g(e) {
            return e && (e._readableState || e._writableState || "function" == typeof e.write && "function" == typeof e.on || "function" == typeof e.pipe && "function" == typeof e.on)
        }
        function m(e) {
            return !(!e || g(e) || "function" != typeof e.pipeThrough || "function" != typeof e.getReader || "function" != typeof e.cancel)
        }
        function b(e) {
            return !(!e || g(e) || "function" != typeof e.getWriter || "function" != typeof e.abort)
        }
        function y(e) {
            return !(!e || g(e) || "object" != typeof e.readable || "object" != typeof e.writable)
        }
        function v(e) {
            if (!g(e))
                return null;
            const t = e._writableState
              , r = e._readableState
              , n = t || r;
            return !!(e.destroyed || e[a] || null != n && n.destroyed)
        }
        function w(e) {
            if (!p(e))
                return null;
            if (!0 === e.writableEnded)
                return !0;
            const t = e._writableState;
            return (null == t || !t.errored) && ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
        }
        function _(e, t) {
            if (!h(e))
                return null;
            const r = e._readableState;
            return (null == r || !r.errored) && ("boolean" != typeof (null == r ? void 0 : r.endEmitted) ? null : !!(r.endEmitted || !1 === t && !0 === r.ended && 0 === r.length))
        }
        function E(e) {
            return e && null != e[c] ? e[c] : "boolean" != typeof (null == e ? void 0 : e.readable) ? null : !v(e) && (h(e) && e.readable && !_(e))
        }
        function S(e) {
            return "boolean" != typeof (null == e ? void 0 : e.writable) ? null : !v(e) && (p(e) && e.writable && !w(e))
        }
        function A(e) {
            return "boolean" == typeof e._closed && "boolean" == typeof e._defaultKeepAlive && "boolean" == typeof e._removedConnection && "boolean" == typeof e._removedContLen
        }
        function R(e) {
            return "boolean" == typeof e._sent100 && A(e)
        }
        t.exports = {
            kDestroyed: a,
            isDisturbed: function(e) {
                var t;
                return !(!e || !(null !== (t = e[u]) && void 0 !== t ? t : e.readableDidRead || e.readableAborted))
            },
            kIsDisturbed: u,
            isErrored: function(e) {
                var t, r, n, o, i, s, a, c, u, d;
                return !(!e || !(null !== (t = null !== (r = null !== (n = null !== (o = null !== (i = null !== (s = e[l]) && void 0 !== s ? s : e.readableErrored) && void 0 !== i ? i : e.writableErrored) && void 0 !== o ? o : null === (a = e._readableState) || void 0 === a ? void 0 : a.errorEmitted) && void 0 !== n ? n : null === (c = e._writableState) || void 0 === c ? void 0 : c.errorEmitted) && void 0 !== r ? r : null === (u = e._readableState) || void 0 === u ? void 0 : u.errored) && void 0 !== t ? t : null === (d = e._writableState) || void 0 === d ? void 0 : d.errored))
            },
            kIsErrored: l,
            isReadable: E,
            kIsReadable: c,
            kIsClosedPromise: d,
            kControllerErrorFunction: f,
            isClosed: function(e) {
                if (!g(e))
                    return null;
                if ("boolean" == typeof e.closed)
                    return e.closed;
                const t = e._writableState
                  , r = e._readableState;
                return "boolean" == typeof (null == t ? void 0 : t.closed) || "boolean" == typeof (null == r ? void 0 : r.closed) ? (null == t ? void 0 : t.closed) || (null == r ? void 0 : r.closed) : "boolean" == typeof e._closed && A(e) ? e._closed : null
            },
            isDestroyed: v,
            isDuplexNodeStream: function(e) {
                return !(!e || "function" != typeof e.pipe || !e._readableState || "function" != typeof e.on || "function" != typeof e.write)
            },
            isFinished: function(e, t) {
                return g(e) ? !!v(e) || (!1 === (null == t ? void 0 : t.readable) || !E(e)) && (!1 === (null == t ? void 0 : t.writable) || !S(e)) : null
            },
            isIterable: function(e, t) {
                return null != e && (!0 === t ? "function" == typeof e[o] : !1 === t ? "function" == typeof e[i] : "function" == typeof e[o] || "function" == typeof e[i])
            },
            isReadableNodeStream: h,
            isReadableStream: m,
            isReadableEnded: function(e) {
                if (!h(e))
                    return null;
                if (!0 === e.readableEnded)
                    return !0;
                const t = e._readableState;
                return !(!t || t.errored) && ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
            },
            isReadableFinished: _,
            isReadableErrored: function(e) {
                var t, r;
                return g(e) ? e.readableErrored ? e.readableErrored : null !== (t = null === (r = e._readableState) || void 0 === r ? void 0 : r.errored) && void 0 !== t ? t : null : null
            },
            isNodeStream: g,
            isWebStream: function(e) {
                return m(e) || b(e) || y(e)
            },
            isWritable: S,
            isWritableNodeStream: p,
            isWritableStream: b,
            isWritableEnded: w,
            isWritableFinished: function(e, t) {
                if (!p(e))
                    return null;
                if (!0 === e.writableFinished)
                    return !0;
                const r = e._writableState;
                return (null == r || !r.errored) && ("boolean" != typeof (null == r ? void 0 : r.finished) ? null : !!(r.finished || !1 === t && !0 === r.ended && 0 === r.length))
            },
            isWritableErrored: function(e) {
                var t, r;
                return g(e) ? e.writableErrored ? e.writableErrored : null !== (t = null === (r = e._writableState) || void 0 === r ? void 0 : r.errored) && void 0 !== t ? t : null : null
            },
            isServerRequest: function(e) {
                var t;
                return "boolean" == typeof e._consuming && "boolean" == typeof e._dumped && void 0 === (null === (t = e.req) || void 0 === t ? void 0 : t.upgradeOrConnect)
            },
            isServerResponse: R,
            willEmitClose: function(e) {
                if (!g(e))
                    return null;
                const t = e._writableState
                  , r = e._readableState
                  , n = t || r;
                return !n && R(e) || !!(n && n.autoDestroy && n.emitClose && !1 === n.closed)
            },
            isTransformStream: y
        }
    }
    , {
        "../../ours/primordials": 76
    }],
    72: [function(e, t, r) {
        const n = e("process/")
          , {ArrayPrototypeSlice: o, Error: i, FunctionPrototypeSymbolHasInstance: s, ObjectDefineProperty: a, ObjectDefineProperties: l, ObjectSetPrototypeOf: c, StringPrototypeToLowerCase: u, Symbol: d, SymbolHasInstance: f} = e("../../ours/primordials");
        t.exports = C,
        C.WritableState = N;
        const {EventEmitter: h} = e("events")
          , p = e("./legacy").Stream
          , {Buffer: g} = e("buffer")
          , m = e("./destroy")
          , {addAbortSignal: b} = e("./add-abort-signal")
          , {getHighWaterMark: y, getDefaultHighWaterMark: v} = e("./state")
          , {ERR_INVALID_ARG_TYPE: w, ERR_METHOD_NOT_IMPLEMENTED: _, ERR_MULTIPLE_CALLBACK: E, ERR_STREAM_CANNOT_PIPE: S, ERR_STREAM_DESTROYED: A, ERR_STREAM_ALREADY_FINISHED: R, ERR_STREAM_NULL_VALUES: M, ERR_STREAM_WRITE_AFTER_END: x, ERR_UNKNOWN_ENCODING: O} = e("../../ours/errors").codes
          , {errorOrDestroy: T} = m;
        function I() {}
        c(C.prototype, p.prototype),
        c(C, p);
        const k = d("kOnFinished");
        function N(t, r, n) {
            "boolean" != typeof n && (n = r instanceof e("./duplex")),
            this.objectMode = !(!t || !t.objectMode),
            n && (this.objectMode = this.objectMode || !(!t || !t.writableObjectMode)),
            this.highWaterMark = t ? y(this, t, "writableHighWaterMark", n) : v(!1),
            this.finalCalled = !1,
            this.needDrain = !1,
            this.ending = !1,
            this.ended = !1,
            this.finished = !1,
            this.destroyed = !1;
            const o = !(!t || !1 !== t.decodeStrings);
            this.decodeStrings = !o,
            this.defaultEncoding = t && t.defaultEncoding || "utf8",
            this.length = 0,
            this.writing = !1,
            this.corked = 0,
            this.sync = !0,
            this.bufferProcessing = !1,
            this.onwrite = B.bind(void 0, r),
            this.writecb = null,
            this.writelen = 0,
            this.afterWriteTickInfo = null,
            P(this),
            this.pendingcb = 0,
            this.constructed = !0,
            this.prefinished = !1,
            this.errorEmitted = !1,
            this.emitClose = !t || !1 !== t.emitClose,
            this.autoDestroy = !t || !1 !== t.autoDestroy,
            this.errored = null,
            this.closed = !1,
            this.closeEmitted = !1,
            this[k] = []
        }
        function P(e) {
            e.buffered = [],
            e.bufferedIndex = 0,
            e.allBuffers = !0,
            e.allNoop = !0
        }
        function C(t) {
            const r = this instanceof e("./duplex");
            if (!r && !s(C, this))
                return new C(t);
            this._writableState = new N(t,this,r),
            t && ("function" == typeof t.write && (this._write = t.write),
            "function" == typeof t.writev && (this._writev = t.writev),
            "function" == typeof t.destroy && (this._destroy = t.destroy),
            "function" == typeof t.final && (this._final = t.final),
            "function" == typeof t.construct && (this._construct = t.construct),
            t.signal && b(t.signal, this)),
            p.call(this, t),
            m.construct(this, ( () => {
                const e = this._writableState;
                e.writing || W(this, e),
                G(this, e)
            }
            ))
        }
        function L(e, t, r, o) {
            const i = e._writableState;
            if ("function" == typeof r)
                o = r,
                r = i.defaultEncoding;
            else {
                if (r) {
                    if ("buffer" !== r && !g.isEncoding(r))
                        throw new O(r)
                } else
                    r = i.defaultEncoding;
                "function" != typeof o && (o = I)
            }
            if (null === t)
                throw new M;
            if (!i.objectMode)
                if ("string" == typeof t)
                    !1 !== i.decodeStrings && (t = g.from(t, r),
                    r = "buffer");
                else if (t instanceof g)
                    r = "buffer";
                else {
                    if (!p._isUint8Array(t))
                        throw new w("chunk",["string", "Buffer", "Uint8Array"],t);
                    t = p._uint8ArrayToBuffer(t),
                    r = "buffer"
                }
            let s;
            return i.ending ? s = new x : i.destroyed && (s = new A("write")),
            s ? (n.nextTick(o, s),
            T(e, s, !0),
            s) : (i.pendingcb++,
            function(e, t, r, n, o) {
                const i = t.objectMode ? 1 : r.length;
                t.length += i;
                const s = t.length < t.highWaterMark;
                s || (t.needDrain = !0);
                t.writing || t.corked || t.errored || !t.constructed ? (t.buffered.push({
                    chunk: r,
                    encoding: n,
                    callback: o
                }),
                t.allBuffers && "buffer" !== n && (t.allBuffers = !1),
                t.allNoop && o !== I && (t.allNoop = !1)) : (t.writelen = i,
                t.writecb = o,
                t.writing = !0,
                t.sync = !0,
                e._write(r, n, t.onwrite),
                t.sync = !1);
                return s && !t.errored && !t.destroyed
            }(e, i, t, r, o))
        }
        function j(e, t, r, n, o, i, s) {
            t.writelen = n,
            t.writecb = s,
            t.writing = !0,
            t.sync = !0,
            t.destroyed ? t.onwrite(new A("write")) : r ? e._writev(o, t.onwrite) : e._write(o, i, t.onwrite),
            t.sync = !1
        }
        function F(e, t, r, n) {
            --t.pendingcb,
            n(r),
            U(t),
            T(e, r)
        }
        function B(e, t) {
            const r = e._writableState
              , o = r.sync
              , i = r.writecb;
            "function" == typeof i ? (r.writing = !1,
            r.writecb = null,
            r.length -= r.writelen,
            r.writelen = 0,
            t ? (t.stack,
            r.errored || (r.errored = t),
            e._readableState && !e._readableState.errored && (e._readableState.errored = t),
            o ? n.nextTick(F, e, r, t, i) : F(e, r, t, i)) : (r.buffered.length > r.bufferedIndex && W(e, r),
            o ? null !== r.afterWriteTickInfo && r.afterWriteTickInfo.cb === i ? r.afterWriteTickInfo.count++ : (r.afterWriteTickInfo = {
                count: 1,
                cb: i,
                stream: e,
                state: r
            },
            n.nextTick($, r.afterWriteTickInfo)) : D(e, r, 1, i))) : T(e, new E)
        }
        function $({stream: e, state: t, count: r, cb: n}) {
            return t.afterWriteTickInfo = null,
            D(e, t, r, n)
        }
        function D(e, t, r, n) {
            for (!t.ending && !e.destroyed && 0 === t.length && t.needDrain && (t.needDrain = !1,
            e.emit("drain")); r-- > 0; )
                t.pendingcb--,
                n();
            t.destroyed && U(t),
            G(e, t)
        }
        function U(e) {
            if (e.writing)
                return;
            for (let r = e.bufferedIndex; r < e.buffered.length; ++r) {
                var t;
                const {chunk: n, callback: o} = e.buffered[r]
                  , i = e.objectMode ? 1 : n.length;
                e.length -= i,
                o(null !== (t = e.errored) && void 0 !== t ? t : new A("write"))
            }
            const r = e[k].splice(0);
            for (let t = 0; t < r.length; t++) {
                var n;
                r[t](null !== (n = e.errored) && void 0 !== n ? n : new A("end"))
            }
            P(e)
        }
        function W(e, t) {
            if (t.corked || t.bufferProcessing || t.destroyed || !t.constructed)
                return;
            const {buffered: r, bufferedIndex: n, objectMode: i} = t
              , s = r.length - n;
            if (!s)
                return;
            let a = n;
            if (t.bufferProcessing = !0,
            s > 1 && e._writev) {
                t.pendingcb -= s - 1;
                const n = t.allNoop ? I : e => {
                    for (let t = a; t < r.length; ++t)
                        r[t].callback(e)
                }
                  , i = t.allNoop && 0 === a ? r : o(r, a);
                i.allBuffers = t.allBuffers,
                j(e, t, !0, t.length, i, "", n),
                P(t)
            } else {
                do {
                    const {chunk: n, encoding: o, callback: s} = r[a];
                    r[a++] = null;
                    j(e, t, !1, i ? 1 : n.length, n, o, s)
                } while (a < r.length && !t.writing);
                a === r.length ? P(t) : a > 256 ? (r.splice(0, a),
                t.bufferedIndex = 0) : t.bufferedIndex = a
            }
            t.bufferProcessing = !1
        }
        function V(e) {
            return e.ending && !e.destroyed && e.constructed && 0 === e.length && !e.errored && 0 === e.buffered.length && !e.finished && !e.writing && !e.errorEmitted && !e.closeEmitted
        }
        function H(e, t) {
            t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0,
            e.emit("prefinish")) : (t.finalCalled = !0,
            function(e, t) {
                let r = !1;
                function o(o) {
                    if (r)
                        T(e, null != o ? o : E());
                    else if (r = !0,
                    t.pendingcb--,
                    o) {
                        const r = t[k].splice(0);
                        for (let e = 0; e < r.length; e++)
                            r[e](o);
                        T(e, o, t.sync)
                    } else
                        V(t) && (t.prefinished = !0,
                        e.emit("prefinish"),
                        t.pendingcb++,
                        n.nextTick(J, e, t))
                }
                t.sync = !0,
                t.pendingcb++;
                try {
                    e._final(o)
                } catch (e) {
                    o(e)
                }
                t.sync = !1
            }(e, t)))
        }
        function G(e, t, r) {
            V(t) && (H(e, t),
            0 === t.pendingcb && (r ? (t.pendingcb++,
            n.nextTick(( (e, t) => {
                V(t) ? J(e, t) : t.pendingcb--
            }
            ), e, t)) : V(t) && (t.pendingcb++,
            J(e, t))))
        }
        function J(e, t) {
            t.pendingcb--,
            t.finished = !0;
            const r = t[k].splice(0);
            for (let e = 0; e < r.length; e++)
                r[e]();
            if (e.emit("finish"),
            t.autoDestroy) {
                const t = e._readableState;
                (!t || t.autoDestroy && (t.endEmitted || !1 === t.readable)) && e.destroy()
            }
        }
        N.prototype.getBuffer = function() {
            return o(this.buffered, this.bufferedIndex)
        }
        ,
        a(N.prototype, "bufferedRequestCount", {
            __proto__: null,
            get() {
                return this.buffered.length - this.bufferedIndex
            }
        }),
        a(C, f, {
            __proto__: null,
            value: function(e) {
                return !!s(this, e) || this === C && (e && e._writableState instanceof N)
            }
        }),
        C.prototype.pipe = function() {
            T(this, new S)
        }
        ,
        C.prototype.write = function(e, t, r) {
            return !0 === L(this, e, t, r)
        }
        ,
        C.prototype.cork = function() {
            this._writableState.corked++
        }
        ,
        C.prototype.uncork = function() {
            const e = this._writableState;
            e.corked && (e.corked--,
            e.writing || W(this, e))
        }
        ,
        C.prototype.setDefaultEncoding = function(e) {
            if ("string" == typeof e && (e = u(e)),
            !g.isEncoding(e))
                throw new O(e);
            return this._writableState.defaultEncoding = e,
            this
        }
        ,
        C.prototype._write = function(e, t, r) {
            if (!this._writev)
                throw new _("_write()");
            this._writev([{
                chunk: e,
                encoding: t
            }], r)
        }
        ,
        C.prototype._writev = null,
        C.prototype.end = function(e, t, r) {
            const o = this._writableState;
            let s;
            if ("function" == typeof e ? (r = e,
            e = null,
            t = null) : "function" == typeof t && (r = t,
            t = null),
            null != e) {
                const r = L(this, e, t);
                r instanceof i && (s = r)
            }
            return o.corked && (o.corked = 1,
            this.uncork()),
            s || (o.errored || o.ending ? o.finished ? s = new R("end") : o.destroyed && (s = new A("end")) : (o.ending = !0,
            G(this, o, !0),
            o.ended = !0)),
            "function" == typeof r && (s || o.finished ? n.nextTick(r, s) : o[k].push(r)),
            this
        }
        ,
        l(C.prototype, {
            closed: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.closed
                }
            },
            destroyed: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.destroyed
                },
                set(e) {
                    this._writableState && (this._writableState.destroyed = e)
                }
            },
            writable: {
                __proto__: null,
                get() {
                    const e = this._writableState;
                    return !(!e || !1 === e.writable || e.destroyed || e.errored || e.ending || e.ended)
                },
                set(e) {
                    this._writableState && (this._writableState.writable = !!e)
                }
            },
            writableFinished: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.finished
                }
            },
            writableObjectMode: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.objectMode
                }
            },
            writableBuffer: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.getBuffer()
                }
            },
            writableEnded: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.ending
                }
            },
            writableNeedDrain: {
                __proto__: null,
                get() {
                    const e = this._writableState;
                    return !!e && (!e.destroyed && !e.ending && e.needDrain)
                }
            },
            writableHighWaterMark: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.highWaterMark
                }
            },
            writableCorked: {
                __proto__: null,
                get() {
                    return this._writableState ? this._writableState.corked : 0
                }
            },
            writableLength: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.length
                }
            },
            errored: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._writableState ? this._writableState.errored : null
                }
            },
            writableAborted: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return !(!1 === this._writableState.writable || !this._writableState.destroyed && !this._writableState.errored || this._writableState.finished)
                }
            }
        });
        const z = m.destroy;
        let q;
        function Y() {
            return void 0 === q && (q = {}),
            q
        }
        C.prototype.destroy = function(e, t) {
            const r = this._writableState;
            return !r.destroyed && (r.bufferedIndex < r.buffered.length || r[k].length) && n.nextTick(U, r),
            z.call(this, e, t),
            this
        }
        ,
        C.prototype._undestroy = m.undestroy,
        C.prototype._destroy = function(e, t) {
            t(e)
        }
        ,
        C.prototype[h.captureRejectionSymbol] = function(e) {
            this.destroy(e)
        }
        ,
        C.fromWeb = function(e, t) {
            return Y().newStreamWritableFromWritableStream(e, t)
        }
        ,
        C.toWeb = function(e) {
            return Y().newWritableStreamFromStreamWritable(e)
        }
    }
    , {
        "../../ours/errors": 75,
        "../../ours/primordials": 76,
        "./add-abort-signal": 56,
        "./destroy": 59,
        "./duplex": 60,
        "./legacy": 64,
        "./state": 69,
        buffer: 50,
        events: 54,
        "process/": 88
    }],
    73: [function(e, t, r) {
        "use strict";
        const {ArrayIsArray: n, ArrayPrototypeIncludes: o, ArrayPrototypeJoin: i, ArrayPrototypeMap: s, NumberIsInteger: a, NumberIsNaN: l, NumberMAX_SAFE_INTEGER: c, NumberMIN_SAFE_INTEGER: u, NumberParseInt: d, ObjectPrototypeHasOwnProperty: f, RegExpPrototypeExec: h, String: p, StringPrototypeToUpperCase: g, StringPrototypeTrim: m} = e("../ours/primordials")
          , {hideStackFrames: b, codes: {ERR_SOCKET_BAD_PORT: y, ERR_INVALID_ARG_TYPE: v, ERR_INVALID_ARG_VALUE: w, ERR_OUT_OF_RANGE: _, ERR_UNKNOWN_SIGNAL: E}} = e("../ours/errors")
          , {normalizeEncoding: S} = e("../ours/util")
          , {isAsyncFunction: A, isArrayBufferView: R} = e("../ours/util").types
          , M = {};
        const x = /^[0-7]+$/;
        const O = b(( (e, t, r=u, n=c) => {
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            if (e < r || e > n)
                throw new _(t,`>= ${r} && <= ${n}`,e)
        }
        ))
          , T = b(( (e, t, r=-2147483648, n=2147483647) => {
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            if (e < r || e > n)
                throw new _(t,`>= ${r} && <= ${n}`,e)
        }
        ))
          , I = b(( (e, t, r=!1) => {
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            const n = r ? 1 : 0
              , o = 4294967295;
            if (e < n || e > o)
                throw new _(t,`>= ${n} && <= ${o}`,e)
        }
        ));
        function k(e, t) {
            if ("string" != typeof e)
                throw new v(t,"string",e)
        }
        const N = b(( (e, t, r) => {
            if (!o(r, e)) {
                const n = i(s(r, (e => "string" == typeof e ? `'${e}'` : p(e))), ", ");
                throw new w(t,e,"must be one of: " + n)
            }
        }
        ));
        function P(e, t) {
            if ("boolean" != typeof e)
                throw new v(t,"boolean",e)
        }
        function C(e, t, r) {
            return null != e && f(e, t) ? e[t] : r
        }
        const L = b(( (e, t, r=null) => {
            const o = C(r, "allowArray", !1)
              , i = C(r, "allowFunction", !1);
            if (!C(r, "nullable", !1) && null === e || !o && n(e) || "object" != typeof e && (!i || "function" != typeof e))
                throw new v(t,"Object",e)
        }
        ))
          , j = b(( (e, t) => {
            if (null != e && "object" != typeof e && "function" != typeof e)
                throw new v(t,"a dictionary",e)
        }
        ))
          , F = b(( (e, t, r=0) => {
            if (!n(e))
                throw new v(t,"Array",e);
            if (e.length < r) {
                throw new w(t,e,`must be longer than ${r}`)
            }
        }
        ));
        const B = b(( (e, t="buffer") => {
            if (!R(e))
                throw new v(t,["Buffer", "TypedArray", "DataView"],e)
        }
        ));
        const $ = b(( (e, t) => {
            if (void 0 !== e && (null === e || "object" != typeof e || !("aborted"in e)))
                throw new v(t,"AbortSignal",e)
        }
        ))
          , D = b(( (e, t) => {
            if ("function" != typeof e)
                throw new v(t,"Function",e)
        }
        ))
          , U = b(( (e, t) => {
            if ("function" != typeof e || A(e))
                throw new v(t,"Function",e)
        }
        ))
          , W = b(( (e, t) => {
            if (void 0 !== e)
                throw new v(t,"undefined",e)
        }
        ));
        const V = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
        function H(e, t) {
            if (void 0 === e || !h(V, e))
                throw new w(t,e,'must be an array or string of format "</styles.css>; rel=preload; as=style"')
        }
        t.exports = {
            isInt32: function(e) {
                return e === (0 | e)
            },
            isUint32: function(e) {
                return e === e >>> 0
            },
            parseFileMode: function(e, t, r) {
                if (void 0 === e && (e = r),
                "string" == typeof e) {
                    if (null === h(x, e))
                        throw new w(t,e,"must be a 32-bit unsigned integer or an octal string");
                    e = d(e, 8)
                }
                return I(e, t),
                e
            },
            validateArray: F,
            validateStringArray: function(e, t) {
                F(e, t);
                for (let r = 0; r < e.length; r++)
                    k(e[r], `${t}[${r}]`)
            },
            validateBooleanArray: function(e, t) {
                F(e, t);
                for (let r = 0; r < e.length; r++)
                    P(e[r], `${t}[${r}]`)
            },
            validateBoolean: P,
            validateBuffer: B,
            validateDictionary: j,
            validateEncoding: function(e, t) {
                const r = S(t)
                  , n = e.length;
                if ("hex" === r && n % 2 != 0)
                    throw new w("encoding",t,`is invalid for data of length ${n}`)
            },
            validateFunction: D,
            validateInt32: T,
            validateInteger: O,
            validateNumber: function(e, t, r=void 0, n) {
                if ("number" != typeof e)
                    throw new v(t,"number",e);
                if (null != r && e < r || null != n && e > n || (null != r || null != n) && l(e))
                    throw new _(t,`${null != r ? `>= ${r}` : ""}${null != r && null != n ? " && " : ""}${null != n ? `<= ${n}` : ""}`,e)
            },
            validateObject: L,
            validateOneOf: N,
            validatePlainFunction: U,
            validatePort: function(e, t="Port", r=!0) {
                if ("number" != typeof e && "string" != typeof e || "string" == typeof e && 0 === m(e).length || +e != +e >>> 0 || e > 65535 || 0 === e && !r)
                    throw new y(t,e,r);
                return 0 | e
            },
            validateSignalName: function(e, t="signal") {
                if (k(e, t),
                void 0 === M[e]) {
                    if (void 0 !== M[g(e)])
                        throw new E(e + " (signals must use all capital letters)");
                    throw new E(e)
                }
            },
            validateString: k,
            validateUint32: I,
            validateUndefined: W,
            validateUnion: function(e, t, r) {
                if (!o(r, e))
                    throw new v(t,`('${i(r, "|")}')`,e)
            },
            validateAbortSignal: $,
            validateLinkHeaderValue: function(e) {
                if ("string" == typeof e)
                    return H(e, "hints"),
                    e;
                if (n(e)) {
                    const t = e.length;
                    let r = "";
                    if (0 === t)
                        return r;
                    for (let n = 0; n < t; n++) {
                        const o = e[n];
                        H(o, "hints"),
                        r += o,
                        n !== t - 1 && (r += ", ")
                    }
                    return r
                }
                throw new w("hints",e,'must be an array or string of format "</styles.css>; rel=preload; as=style"')
            }
        }
    }
    , {
        "../ours/errors": 75,
        "../ours/primordials": 76,
        "../ours/util": 77
    }],
    74: [function(e, t, r) {
        "use strict";
        const n = e("../stream")
          , o = e("../stream/promises")
          , i = n.Readable.destroy;
        t.exports = n.Readable,
        t.exports._uint8ArrayToBuffer = n._uint8ArrayToBuffer,
        t.exports._isUint8Array = n._isUint8Array,
        t.exports.isDisturbed = n.isDisturbed,
        t.exports.isErrored = n.isErrored,
        t.exports.isReadable = n.isReadable,
        t.exports.Readable = n.Readable,
        t.exports.Writable = n.Writable,
        t.exports.Duplex = n.Duplex,
        t.exports.Transform = n.Transform,
        t.exports.PassThrough = n.PassThrough,
        t.exports.addAbortSignal = n.addAbortSignal,
        t.exports.finished = n.finished,
        t.exports.destroy = n.destroy,
        t.exports.destroy = i,
        t.exports.pipeline = n.pipeline,
        t.exports.compose = n.compose,
        Object.defineProperty(n, "promises", {
            configurable: !0,
            enumerable: !0,
            get: () => o
        }),
        t.exports.Stream = n.Stream,
        t.exports.default = t.exports
    }
    , {
        "../stream": 78,
        "../stream/promises": 79
    }],
    75: [function(e, t, r) {
        "use strict";
        const {format: n, inspect: o, AggregateError: i} = e("./util")
          , s = globalThis.AggregateError || i
          , a = Symbol("kIsNodeError")
          , l = ["string", "function", "number", "object", "Function", "Object", "boolean", "bigint", "symbol"]
          , c = /^([A-Z][a-z0-9]*)+$/
          , u = {};
        function d(e, t) {
            if (!e)
                throw new u.ERR_INTERNAL_ASSERTION(t)
        }
        function f(e) {
            let t = ""
              , r = e.length;
            const n = "-" === e[0] ? 1 : 0;
            for (; r >= n + 4; r -= 3)
                t = `_${e.slice(r - 3, r)}${t}`;
            return `${e.slice(0, r)}${t}`
        }
        function h(e, t, r) {
            r || (r = Error);
            class o extends r {
                constructor(...r) {
                    super(function(e, t, r) {
                        if ("function" == typeof t)
                            return d(t.length <= r.length, `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${t.length}).`),
                            t(...r);
                        const o = (t.match(/%[dfijoOs]/g) || []).length;
                        return d(o === r.length, `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${o}).`),
                        0 === r.length ? t : n(t, ...r)
                    }(e, t, r))
                }
                toString() {
                    return `${this.name} [${e}]: ${this.message}`
                }
            }
            Object.defineProperties(o.prototype, {
                name: {
                    value: r.name,
                    writable: !0,
                    enumerable: !1,
                    configurable: !0
                },
                toString: {
                    value() {
                        return `${this.name} [${e}]: ${this.message}`
                    },
                    writable: !0,
                    enumerable: !1,
                    configurable: !0
                }
            }),
            o.prototype.code = e,
            o.prototype[a] = !0,
            u[e] = o
        }
        function p(e) {
            const t = "__node_internal_" + e.name;
            return Object.defineProperty(e, "name", {
                value: t
            }),
            e
        }
        class g extends Error {
            constructor(e="The operation was aborted", t=void 0) {
                if (void 0 !== t && "object" != typeof t)
                    throw new u.ERR_INVALID_ARG_TYPE("options","Object",t);
                super(e, t),
                this.code = "ABORT_ERR",
                this.name = "AbortError"
            }
        }
        h("ERR_ASSERTION", "%s", Error),
        h("ERR_INVALID_ARG_TYPE", ( (e, t, r) => {
            d("string" == typeof e, "'name' must be a string"),
            Array.isArray(t) || (t = [t]);
            let n = "The ";
            e.endsWith(" argument") ? n += `${e} ` : n += `"${e}" ${e.includes(".") ? "property" : "argument"} `,
            n += "must be ";
            const i = []
              , s = []
              , a = [];
            for (const e of t)
                d("string" == typeof e, "All expected entries have to be of type string"),
                l.includes(e) ? i.push(e.toLowerCase()) : c.test(e) ? s.push(e) : (d("object" !== e, 'The value "object" should be written as "Object"'),
                a.push(e));
            if (s.length > 0) {
                const e = i.indexOf("object");
                -1 !== e && (i.splice(i, e, 1),
                s.push("Object"))
            }
            if (i.length > 0) {
                switch (i.length) {
                case 1:
                    n += `of type ${i[0]}`;
                    break;
                case 2:
                    n += `one of type ${i[0]} or ${i[1]}`;
                    break;
                default:
                    {
                        const e = i.pop();
                        n += `one of type ${i.join(", ")}, or ${e}`
                    }
                }
                (s.length > 0 || a.length > 0) && (n += " or ")
            }
            if (s.length > 0) {
                switch (s.length) {
                case 1:
                    n += `an instance of ${s[0]}`;
                    break;
                case 2:
                    n += `an instance of ${s[0]} or ${s[1]}`;
                    break;
                default:
                    {
                        const e = s.pop();
                        n += `an instance of ${s.join(", ")}, or ${e}`
                    }
                }
                a.length > 0 && (n += " or ")
            }
            switch (a.length) {
            case 0:
                break;
            case 1:
                a[0].toLowerCase() !== a[0] && (n += "an "),
                n += `${a[0]}`;
                break;
            case 2:
                n += `one of ${a[0]} or ${a[1]}`;
                break;
            default:
                {
                    const e = a.pop();
                    n += `one of ${a.join(", ")}, or ${e}`
                }
            }
            if (null == r)
                n += `. Received ${r}`;
            else if ("function" == typeof r && r.name)
                n += `. Received function ${r.name}`;
            else if ("object" == typeof r) {
                var u;
                if (null !== (u = r.constructor) && void 0 !== u && u.name)
                    n += `. Received an instance of ${r.constructor.name}`;
                else {
                    n += `. Received ${o(r, {
                        depth: -1
                    })}`
                }
            } else {
                let e = o(r, {
                    colors: !1
                });
                e.length > 25 && (e = `${e.slice(0, 25)}...`),
                n += `. Received type ${typeof r} (${e})`
            }
            return n
        }
        ), TypeError),
        h("ERR_INVALID_ARG_VALUE", ( (e, t, r="is invalid") => {
            let n = o(t);
            n.length > 128 && (n = n.slice(0, 128) + "...");
            return `The ${e.includes(".") ? "property" : "argument"} '${e}' ${r}. Received ${n}`
        }
        ), TypeError),
        h("ERR_INVALID_RETURN_VALUE", ( (e, t, r) => {
            var n;
            return `Expected ${e} to be returned from the "${t}" function but got ${null != r && null !== (n = r.constructor) && void 0 !== n && n.name ? `instance of ${r.constructor.name}` : "type " + typeof r}.`
        }
        ), TypeError),
        h("ERR_MISSING_ARGS", ( (...e) => {
            let t;
            d(e.length > 0, "At least one arg needs to be specified");
            const r = e.length;
            switch (e = (Array.isArray(e) ? e : [e]).map((e => `"${e}"`)).join(" or "),
            r) {
            case 1:
                t += `The ${e[0]} argument`;
                break;
            case 2:
                t += `The ${e[0]} and ${e[1]} arguments`;
                break;
            default:
                {
                    const r = e.pop();
                    t += `The ${e.join(", ")}, and ${r} arguments`
                }
            }
            return `${t} must be specified`
        }
        ), TypeError),
        h("ERR_OUT_OF_RANGE", ( (e, t, r) => {
            let n;
            return d(t, 'Missing "range" argument'),
            Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? n = f(String(r)) : "bigint" == typeof r ? (n = String(r),
            (r > 2n ** 32n || r < -(2n ** 32n)) && (n = f(n)),
            n += "n") : n = o(r),
            `The value of "${e}" is out of range. It must be ${t}. Received ${n}`
        }
        ), RangeError),
        h("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error),
        h("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error),
        h("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error),
        h("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error),
        h("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error),
        h("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError),
        h("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error),
        h("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error),
        h("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error),
        h("ERR_STREAM_WRITE_AFTER_END", "write after end", Error),
        h("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError),
        t.exports = {
            AbortError: g,
            aggregateTwoErrors: p((function(e, t) {
                if (e && t && e !== t) {
                    if (Array.isArray(t.errors))
                        return t.errors.push(e),
                        t;
                    const r = new s([t, e],t.message);
                    return r.code = t.code,
                    r
                }
                return e || t
            }
            )),
            hideStackFrames: p,
            codes: u
        }
    }
    , {
        "./util": 77
    }],
    76: [function(e, t, r) {
        "use strict";
        t.exports = {
            ArrayIsArray: e => Array.isArray(e),
            ArrayPrototypeIncludes: (e, t) => e.includes(t),
            ArrayPrototypeIndexOf: (e, t) => e.indexOf(t),
            ArrayPrototypeJoin: (e, t) => e.join(t),
            ArrayPrototypeMap: (e, t) => e.map(t),
            ArrayPrototypePop: (e, t) => e.pop(t),
            ArrayPrototypePush: (e, t) => e.push(t),
            ArrayPrototypeSlice: (e, t, r) => e.slice(t, r),
            Error: Error,
            FunctionPrototypeCall: (e, t, ...r) => e.call(t, ...r),
            FunctionPrototypeSymbolHasInstance: (e, t) => Function.prototype[Symbol.hasInstance].call(e, t),
            MathFloor: Math.floor,
            Number: Number,
            NumberIsInteger: Number.isInteger,
            NumberIsNaN: Number.isNaN,
            NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
            NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
            NumberParseInt: Number.parseInt,
            ObjectDefineProperties: (e, t) => Object.defineProperties(e, t),
            ObjectDefineProperty: (e, t, r) => Object.defineProperty(e, t, r),
            ObjectGetOwnPropertyDescriptor: (e, t) => Object.getOwnPropertyDescriptor(e, t),
            ObjectKeys: e => Object.keys(e),
            ObjectSetPrototypeOf: (e, t) => Object.setPrototypeOf(e, t),
            Promise: Promise,
            PromisePrototypeCatch: (e, t) => e.catch(t),
            PromisePrototypeThen: (e, t, r) => e.then(t, r),
            PromiseReject: e => Promise.reject(e),
            ReflectApply: Reflect.apply,
            RegExpPrototypeTest: (e, t) => e.test(t),
            SafeSet: Set,
            String: String,
            StringPrototypeSlice: (e, t, r) => e.slice(t, r),
            StringPrototypeToLowerCase: e => e.toLowerCase(),
            StringPrototypeToUpperCase: e => e.toUpperCase(),
            StringPrototypeTrim: e => e.trim(),
            Symbol: Symbol,
            SymbolFor: Symbol.for,
            SymbolAsyncIterator: Symbol.asyncIterator,
            SymbolHasInstance: Symbol.hasInstance,
            SymbolIterator: Symbol.iterator,
            TypedArrayPrototypeSet: (e, t, r) => e.set(t, r),
            Uint8Array: Uint8Array
        }
    }
    , {}],
    77: [function(e, t, r) {
        "use strict";
        const n = e("buffer")
          , o = Object.getPrototypeOf((async function() {}
        )).constructor
          , i = globalThis.Blob || n.Blob
          , s = void 0 !== i ? function(e) {
            return e instanceof i
        }
        : function(e) {
            return !1
        }
        ;
        class a extends Error {
            constructor(e) {
                if (!Array.isArray(e))
                    throw new TypeError("Expected input to be an Array, got " + typeof e);
                let t = "";
                for (let r = 0; r < e.length; r++)
                    t += `    ${e[r].stack}\n`;
                super(t),
                this.name = "AggregateError",
                this.errors = e
            }
        }
        t.exports = {
            AggregateError: a,
            kEmptyObject: Object.freeze({}),
            once(e) {
                let t = !1;
                return function(...r) {
                    t || (t = !0,
                    e.apply(this, r))
                }
            },
            createDeferredPromise: function() {
                let e, t;
                return {
                    promise: new Promise(( (r, n) => {
                        e = r,
                        t = n
                    }
                    )),
                    resolve: e,
                    reject: t
                }
            },
            promisify: e => new Promise(( (t, r) => {
                e(( (e, ...n) => e ? r(e) : t(...n)))
            }
            )),
            debuglog: () => function() {}
            ,
            format: (e, ...t) => e.replace(/%([sdifj])/g, (function(...[e,r]) {
                const n = t.shift();
                if ("f" === r)
                    return n.toFixed(6);
                if ("j" === r)
                    return JSON.stringify(n);
                if ("s" === r && "object" == typeof n) {
                    return `${n.constructor !== Object ? n.constructor.name : ""} {}`.trim()
                }
                return n.toString()
            }
            )),
            inspect(e) {
                switch (typeof e) {
                case "string":
                    if (e.includes("'")) {
                        if (!e.includes('"'))
                            return `"${e}"`;
                        if (!e.includes("`") && !e.includes("${"))
                            return `\`${e}\``
                    }
                    return `'${e}'`;
                case "number":
                    return isNaN(e) ? "NaN" : Object.is(e, -0) ? String(e) : e;
                case "bigint":
                    return `${String(e)}n`;
                case "boolean":
                case "undefined":
                    return String(e);
                case "object":
                    return "{}"
                }
            },
            types: {
                isAsyncFunction: e => e instanceof o,
                isArrayBufferView: e => ArrayBuffer.isView(e)
            },
            isBlob: s
        },
        t.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom")
    }
    , {
        buffer: 50
    }],
    78: [function(e, t, r) {
        const {Buffer: n} = e("buffer")
          , {ObjectDefineProperty: o, ObjectKeys: i, ReflectApply: s} = e("./ours/primordials")
          , {promisify: {custom: a}} = e("./ours/util")
          , {streamReturningOperators: l, promiseReturningOperators: c} = e("./internal/streams/operators")
          , {codes: {ERR_ILLEGAL_CONSTRUCTOR: u}} = e("./ours/errors")
          , d = e("./internal/streams/compose")
          , {pipeline: f} = e("./internal/streams/pipeline")
          , {destroyer: h} = e("./internal/streams/destroy")
          , p = e("./internal/streams/end-of-stream")
          , g = e("./stream/promises")
          , m = e("./internal/streams/utils")
          , b = t.exports = e("./internal/streams/legacy").Stream;
        b.isDisturbed = m.isDisturbed,
        b.isErrored = m.isErrored,
        b.isReadable = m.isReadable,
        b.Readable = e("./internal/streams/readable");
        for (const w of i(l)) {
            const _ = l[w];
            function y(...e) {
                if (new.target)
                    throw u();
                return b.Readable.from(s(_, this, e))
            }
            o(y, "name", {
                __proto__: null,
                value: _.name
            }),
            o(y, "length", {
                __proto__: null,
                value: _.length
            }),
            o(b.Readable.prototype, w, {
                __proto__: null,
                value: y,
                enumerable: !1,
                configurable: !0,
                writable: !0
            })
        }
        for (const E of i(c)) {
            const S = c[E];
            function y(...e) {
                if (new.target)
                    throw u();
                return s(S, this, e)
            }
            o(y, "name", {
                __proto__: null,
                value: S.name
            }),
            o(y, "length", {
                __proto__: null,
                value: S.length
            }),
            o(b.Readable.prototype, E, {
                __proto__: null,
                value: y,
                enumerable: !1,
                configurable: !0,
                writable: !0
            })
        }
        b.Writable = e("./internal/streams/writable"),
        b.Duplex = e("./internal/streams/duplex"),
        b.Transform = e("./internal/streams/transform"),
        b.PassThrough = e("./internal/streams/passthrough"),
        b.pipeline = f;
        const {addAbortSignal: v} = e("./internal/streams/add-abort-signal");
        b.addAbortSignal = v,
        b.finished = p,
        b.destroy = h,
        b.compose = d,
        o(b, "promises", {
            __proto__: null,
            configurable: !0,
            enumerable: !0,
            get: () => g
        }),
        o(f, a, {
            __proto__: null,
            enumerable: !0,
            get: () => g.pipeline
        }),
        o(p, a, {
            __proto__: null,
            enumerable: !0,
            get: () => g.finished
        }),
        b.Stream = b,
        b._isUint8Array = function(e) {
            return e instanceof Uint8Array
        }
        ,
        b._uint8ArrayToBuffer = function(e) {
            return n.from(e.buffer, e.byteOffset, e.byteLength)
        }
    }
    , {
        "./internal/streams/add-abort-signal": 56,
        "./internal/streams/compose": 58,
        "./internal/streams/destroy": 59,
        "./internal/streams/duplex": 60,
        "./internal/streams/end-of-stream": 62,
        "./internal/streams/legacy": 64,
        "./internal/streams/operators": 65,
        "./internal/streams/passthrough": 66,
        "./internal/streams/pipeline": 67,
        "./internal/streams/readable": 68,
        "./internal/streams/transform": 70,
        "./internal/streams/utils": 71,
        "./internal/streams/writable": 72,
        "./ours/errors": 75,
        "./ours/primordials": 76,
        "./ours/util": 77,
        "./stream/promises": 79,
        buffer: 50
    }],
    79: [function(e, t, r) {
        "use strict";
        const {ArrayPrototypePop: n, Promise: o} = e("../ours/primordials")
          , {isIterable: i, isNodeStream: s, isWebStream: a} = e("../internal/streams/utils")
          , {pipelineImpl: l} = e("../internal/streams/pipeline")
          , {finished: c} = e("../internal/streams/end-of-stream");
        e("../../lib/stream.js"),
        t.exports = {
            finished: c,
            pipeline: function(...e) {
                return new o(( (t, r) => {
                    let o, c;
                    const u = e[e.length - 1];
                    if (u && "object" == typeof u && !s(u) && !i(u) && !a(u)) {
                        const t = n(e);
                        o = t.signal,
                        c = t.end
                    }
                    l(e, ( (e, n) => {
                        e ? r(e) : t(n)
                    }
                    ), {
                        signal: o,
                        end: c
                    })
                }
                ))
            }
        }
    }
    , {
        "../../lib/stream.js": 78,
        "../internal/streams/end-of-stream": 62,
        "../internal/streams/pipeline": 67,
        "../internal/streams/utils": 71,
        "../ours/primordials": 76
    }],
    80: [function(e, t, r) {
        t.exports = l,
        l.default = l,
        l.stable = f,
        l.stableStringify = f;
        var n = "[...]"
          , o = "[Circular]"
          , i = []
          , s = [];
        function a() {
            return {
                depthLimit: Number.MAX_SAFE_INTEGER,
                edgesLimit: Number.MAX_SAFE_INTEGER
            }
        }
        function l(e, t, r, n) {
            var o;
            void 0 === n && (n = a()),
            u(e, "", 0, [], void 0, 0, n);
            try {
                o = 0 === s.length ? JSON.stringify(e, t, r) : JSON.stringify(e, p(t), r)
            } catch (e) {
                return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")
            } finally {
                for (; 0 !== i.length; ) {
                    var l = i.pop();
                    4 === l.length ? Object.defineProperty(l[0], l[1], l[3]) : l[0][l[1]] = l[2]
                }
            }
            return o
        }
        function c(e, t, r, n) {
            var o = Object.getOwnPropertyDescriptor(n, r);
            void 0 !== o.get ? o.configurable ? (Object.defineProperty(n, r, {
                value: e
            }),
            i.push([n, r, t, o])) : s.push([t, r, e]) : (n[r] = e,
            i.push([n, r, t]))
        }
        function u(e, t, r, i, s, a, l) {
            var d;
            if (a += 1,
            "object" == typeof e && null !== e) {
                for (d = 0; d < i.length; d++)
                    if (i[d] === e)
                        return void c(o, e, t, s);
                if (void 0 !== l.depthLimit && a > l.depthLimit)
                    return void c(n, e, t, s);
                if (void 0 !== l.edgesLimit && r + 1 > l.edgesLimit)
                    return void c(n, e, t, s);
                if (i.push(e),
                Array.isArray(e))
                    for (d = 0; d < e.length; d++)
                        u(e[d], d, d, i, e, a, l);
                else {
                    var f = Object.keys(e);
                    for (d = 0; d < f.length; d++) {
                        var h = f[d];
                        u(e[h], h, d, i, e, a, l)
                    }
                }
                i.pop()
            }
        }
        function d(e, t) {
            return e < t ? -1 : e > t ? 1 : 0
        }
        function f(e, t, r, n) {
            void 0 === n && (n = a());
            var o, l = h(e, "", 0, [], void 0, 0, n) || e;
            try {
                o = 0 === s.length ? JSON.stringify(l, t, r) : JSON.stringify(l, p(t), r)
            } catch (e) {
                return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")
            } finally {
                for (; 0 !== i.length; ) {
                    var c = i.pop();
                    4 === c.length ? Object.defineProperty(c[0], c[1], c[3]) : c[0][c[1]] = c[2]
                }
            }
            return o
        }
        function h(e, t, r, s, a, l, u) {
            var f;
            if (l += 1,
            "object" == typeof e && null !== e) {
                for (f = 0; f < s.length; f++)
                    if (s[f] === e)
                        return void c(o, e, t, a);
                try {
                    if ("function" == typeof e.toJSON)
                        return
                } catch (e) {
                    return
                }
                if (void 0 !== u.depthLimit && l > u.depthLimit)
                    return void c(n, e, t, a);
                if (void 0 !== u.edgesLimit && r + 1 > u.edgesLimit)
                    return void c(n, e, t, a);
                if (s.push(e),
                Array.isArray(e))
                    for (f = 0; f < e.length; f++)
                        h(e[f], f, f, s, e, l, u);
                else {
                    var p = {}
                      , g = Object.keys(e).sort(d);
                    for (f = 0; f < g.length; f++) {
                        var m = g[f];
                        h(e[m], m, f, s, e, l, u),
                        p[m] = e[m]
                    }
                    if (void 0 === a)
                        return p;
                    i.push([a, t, e]),
                    a[t] = p
                }
                s.pop()
            }
        }
        function p(e) {
            return e = void 0 !== e ? e : function(e, t) {
                return t
            }
            ,
            function(t, r) {
                if (s.length > 0)
                    for (var n = 0; n < s.length; n++) {
                        var o = s[n];
                        if (o[1] === t && o[0] === r) {
                            r = o[2],
                            s.splice(n, 1);
                            break
                        }
                    }
                return e.call(this, t, r)
            }
        }
    }
    , {}],
    81: [function(e, t, r) {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        r.read = function(e, t, r, n, o) {
            var i, s, a = 8 * o - n - 1, l = (1 << a) - 1, c = l >> 1, u = -7, d = r ? o - 1 : 0, f = r ? -1 : 1, h = e[t + d];
            for (d += f,
            i = h & (1 << -u) - 1,
            h >>= -u,
            u += a; u > 0; i = 256 * i + e[t + d],
            d += f,
            u -= 8)
                ;
            for (s = i & (1 << -u) - 1,
            i >>= -u,
            u += n; u > 0; s = 256 * s + e[t + d],
            d += f,
            u -= 8)
                ;
            if (0 === i)
                i = 1 - c;
            else {
                if (i === l)
                    return s ? NaN : 1 / 0 * (h ? -1 : 1);
                s += Math.pow(2, n),
                i -= c
            }
            return (h ? -1 : 1) * s * Math.pow(2, i - n)
        }
        ,
        r.write = function(e, t, r, n, o, i) {
            var s, a, l, c = 8 * i - o - 1, u = (1 << c) - 1, d = u >> 1, f = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = n ? 0 : i - 1, p = n ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t),
            isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0,
            s = u) : (s = Math.floor(Math.log(t) / Math.LN2),
            t * (l = Math.pow(2, -s)) < 1 && (s--,
            l *= 2),
            (t += s + d >= 1 ? f / l : f * Math.pow(2, 1 - d)) * l >= 2 && (s++,
            l /= 2),
            s + d >= u ? (a = 0,
            s = u) : s + d >= 1 ? (a = (t * l - 1) * Math.pow(2, o),
            s += d) : (a = t * Math.pow(2, d - 1) * Math.pow(2, o),
            s = 0)); o >= 8; e[r + h] = 255 & a,
            h += p,
            a /= 256,
            o -= 8)
                ;
            for (s = s << o | a,
            c += o; c > 0; e[r + h] = 255 & s,
            h += p,
            s /= 256,
            c -= 8)
                ;
            e[r + h - p] |= 128 * g
        }
    }
    , {}],
    82: [function(e, t, r) {
        "function" == typeof Object.create ? t.exports = function(e, t) {
            t && (e.super_ = t,
            e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }))
        }
        : t.exports = function(e, t) {
            if (t) {
                e.super_ = t;
                var r = function() {};
                r.prototype = t.prototype,
                e.prototype = new r,
                e.prototype.constructor = e
            }
        }
    }
    , {}],
    83: [function(e, t, r) {
        !function(e, r) {
            "use strict";
            "function" == typeof define && define.amd ? define(r) : "object" == typeof t && t.exports ? t.exports = r() : e.log = r()
        }(this, (function() {
            "use strict";
            var e = function() {}
              , t = "undefined"
              , r = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent)
              , n = ["trace", "debug", "info", "warn", "error"]
              , o = {}
              , i = null;
            function s(e, t) {
                var r = e[t];
                if ("function" == typeof r.bind)
                    return r.bind(e);
                try {
                    return Function.prototype.bind.call(r, e)
                } catch (t) {
                    return function() {
                        return Function.prototype.apply.apply(r, [e, arguments])
                    }
                }
            }
            function a() {
                console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])),
                console.trace && console.trace()
            }
            function l() {
                for (var r = this.getLevel(), o = 0; o < n.length; o++) {
                    var i = n[o];
                    this[i] = o < r ? e : this.methodFactory(i, r, this.name)
                }
                if (this.log = this.debug,
                typeof console === t && r < this.levels.SILENT)
                    return "No console available for logging"
            }
            function c(e) {
                return function() {
                    typeof console !== t && (l.call(this),
                    this[e].apply(this, arguments))
                }
            }
            function u(n, o, i) {
                return function(n) {
                    return "debug" === n && (n = "log"),
                    typeof console !== t && ("trace" === n && r ? a : void 0 !== console[n] ? s(console, n) : void 0 !== console.log ? s(console, "log") : e)
                }(n) || c.apply(this, arguments)
            }
            function d(e, r) {
                var s, a, c, d = this, f = "loglevel";
                function h() {
                    var e;
                    if (typeof window !== t && f) {
                        try {
                            e = window.localStorage[f]
                        } catch (e) {}
                        if (typeof e === t)
                            try {
                                var r = window.document.cookie
                                  , n = encodeURIComponent(f)
                                  , o = r.indexOf(n + "=");
                                -1 !== o && (e = /^([^;]+)/.exec(r.slice(o + n.length + 1))[1])
                            } catch (e) {}
                        return void 0 === d.levels[e] && (e = void 0),
                        e
                    }
                }
                function p(e) {
                    var t = e;
                    if ("string" == typeof t && void 0 !== d.levels[t.toUpperCase()] && (t = d.levels[t.toUpperCase()]),
                    "number" == typeof t && t >= 0 && t <= d.levels.SILENT)
                        return t;
                    throw new TypeError("log.setLevel() called with invalid level: " + e)
                }
                "string" == typeof e ? f += ":" + e : "symbol" == typeof e && (f = void 0),
                d.name = e,
                d.levels = {
                    TRACE: 0,
                    DEBUG: 1,
                    INFO: 2,
                    WARN: 3,
                    ERROR: 4,
                    SILENT: 5
                },
                d.methodFactory = r || u,
                d.getLevel = function() {
                    return null != c ? c : null != a ? a : s
                }
                ,
                d.setLevel = function(e, r) {
                    return c = p(e),
                    !1 !== r && function(e) {
                        var r = (n[e] || "silent").toUpperCase();
                        if (typeof window !== t && f) {
                            try {
                                return void (window.localStorage[f] = r)
                            } catch (e) {}
                            try {
                                window.document.cookie = encodeURIComponent(f) + "=" + r + ";"
                            } catch (e) {}
                        }
                    }(c),
                    l.call(d)
                }
                ,
                d.setDefaultLevel = function(e) {
                    a = p(e),
                    h() || d.setLevel(e, !1)
                }
                ,
                d.resetLevel = function() {
                    c = null,
                    function() {
                        if (typeof window !== t && f) {
                            try {
                                window.localStorage.removeItem(f)
                            } catch (e) {}
                            try {
                                window.document.cookie = encodeURIComponent(f) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
                            } catch (e) {}
                        }
                    }(),
                    l.call(d)
                }
                ,
                d.enableAll = function(e) {
                    d.setLevel(d.levels.TRACE, e)
                }
                ,
                d.disableAll = function(e) {
                    d.setLevel(d.levels.SILENT, e)
                }
                ,
                d.rebuild = function() {
                    if (i !== d && (s = p(i.getLevel())),
                    l.call(d),
                    i === d)
                        for (var e in o)
                            o[e].rebuild()
                }
                ,
                s = p(i ? i.getLevel() : "WARN");
                var g = h();
                null != g && (c = p(g)),
                l.call(d)
            }
            (i = new d).getLogger = function(e) {
                if ("symbol" != typeof e && "string" != typeof e || "" === e)
                    throw new TypeError("You must supply a name when creating a logger.");
                var t = o[e];
                return t || (t = o[e] = new d(e,i.methodFactory)),
                t
            }
            ;
            var f = typeof window !== t ? window.log : void 0;
            return i.noConflict = function() {
                return typeof window !== t && window.log === i && (window.log = f),
                i
            }
            ,
            i.getLoggers = function() {
                return o
            }
            ,
            i.default = i,
            i
        }
        ))
    }
    , {}],
    84: [function(e, t, r) {
        var n = e("wrappy");
        function o(e) {
            var t = function() {
                return t.called ? t.value : (t.called = !0,
                t.value = e.apply(this, arguments))
            };
            return t.called = !1,
            t
        }
        function i(e) {
            var t = function() {
                if (t.called)
                    throw new Error(t.onceError);
                return t.called = !0,
                t.value = e.apply(this, arguments)
            }
              , r = e.name || "Function wrapped with `once`";
            return t.onceError = r + " shouldn't be called more than once",
            t.called = !1,
            t
        }
        t.exports = n(o),
        t.exports.strict = n(i),
        o.proto = o((function() {
            Object.defineProperty(Function.prototype, "once", {
                value: function() {
                    return o(this)
                },
                configurable: !0
            }),
            Object.defineProperty(Function.prototype, "onceStrict", {
                value: function() {
                    return i(this)
                },
                configurable: !0
            })
        }
        ))
    }
    , {
        wrappy: 154
    }],
    85: [function(e, t, r) {
        "use strict";
        const {ErrorWithCause: n} = e("./lib/error-with-cause")
          , {findCauseByReference: o, getErrorCause: i, messageWithCauses: s, stackWithCauses: a} = e("./lib/helpers");
        t.exports = {
            ErrorWithCause: n,
            findCauseByReference: o,
            getErrorCause: i,
            stackWithCauses: a,
            messageWithCauses: s
        }
    }
    , {
        "./lib/error-with-cause": 86,
        "./lib/helpers": 87
    }],
    86: [function(e, t, r) {
        "use strict";
        class n extends Error {
            constructor(e, {cause: t}={}) {
                super(e),
                this.name = n.name,
                t && (this.cause = t),
                this.message = e
            }
        }
        t.exports = {
            ErrorWithCause: n
        }
    }
    , {}],
    87: [function(e, t, r) {
        "use strict";
        const n = e => {
            if (e && "object" == typeof e && "cause"in e) {
                if ("function" == typeof e.cause) {
                    const t = e.cause();
                    return t instanceof Error ? t : void 0
                }
                return e.cause instanceof Error ? e.cause : void 0
            }
        }
          , o = (e, t) => {
            if (!(e instanceof Error))
                return "";
            const r = e.stack || "";
            if (t.has(e))
                return r + "\ncauses have become circular...";
            const i = n(e);
            return i ? (t.add(e),
            r + "\ncaused by: " + o(i, t)) : r
        }
          , i = (e, t, r) => {
            if (!(e instanceof Error))
                return "";
            const o = r ? "" : e.message || "";
            if (t.has(e))
                return o + ": ...";
            const s = n(e);
            if (s) {
                t.add(e);
                const r = "cause"in e && "function" == typeof e.cause;
                return o + (r ? "" : ": ") + i(s, t, r)
            }
            return o
        }
        ;
        t.exports = {
            findCauseByReference: (e, t) => {
                if (!e || !t)
                    return;
                if (!(e instanceof Error))
                    return;
                if (!(t.prototype instanceof Error) && t !== Error)
                    return;
                const r = new Set;
                let o = e;
                for (; o && !r.has(o); ) {
                    if (r.add(o),
                    o instanceof t)
                        return o;
                    o = n(o)
                }
            }
            ,
            getErrorCause: n,
            stackWithCauses: e => o(e, new Set),
            messageWithCauses: e => i(e, new Set)
        }
    }
    , {}],
    88: [function(e, t, r) {
        var n, o, i = t.exports = {};
        function s() {
            throw new Error("setTimeout has not been defined")
        }
        function a() {
            throw new Error("clearTimeout has not been defined")
        }
        function l(e) {
            if (n === setTimeout)
                return setTimeout(e, 0);
            if ((n === s || !n) && setTimeout)
                return n = setTimeout,
                setTimeout(e, 0);
            try {
                return n(e, 0)
            } catch (t) {
                try {
                    return n.call(null, e, 0)
                } catch (t) {
                    return n.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                n = "function" == typeof setTimeout ? setTimeout : s
            } catch (e) {
                n = s
            }
            try {
                o = "function" == typeof clearTimeout ? clearTimeout : a
            } catch (e) {
                o = a
            }
        }();
        var c, u = [], d = !1, f = -1;
        function h() {
            d && c && (d = !1,
            c.length ? u = c.concat(u) : f = -1,
            u.length && p())
        }
        function p() {
            if (!d) {
                var e = l(h);
                d = !0;
                for (var t = u.length; t; ) {
                    for (c = u,
                    u = []; ++f < t; )
                        c && c[f].run();
                    f = -1,
                    t = u.length
                }
                c = null,
                d = !1,
                function(e) {
                    if (o === clearTimeout)
                        return clearTimeout(e);
                    if ((o === a || !o) && clearTimeout)
                        return o = clearTimeout,
                        clearTimeout(e);
                    try {
                        return o(e)
                    } catch (t) {
                        try {
                            return o.call(null, e)
                        } catch (t) {
                            return o.call(this, e)
                        }
                    }
                }(e)
            }
        }
        function g(e, t) {
            this.fun = e,
            this.array = t
        }
        function m() {}
        i.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
            u.push(new g(e,t)),
            1 !== u.length || d || l(p)
        }
        ,
        g.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        i.title = "browser",
        i.browser = !0,
        i.env = {},
        i.argv = [],
        i.version = "",
        i.versions = {},
        i.on = m,
        i.addListener = m,
        i.once = m,
        i.off = m,
        i.removeListener = m,
        i.removeAllListeners = m,
        i.emit = m,
        i.prependListener = m,
        i.prependOnceListener = m,
        i.listeners = function(e) {
            return []
        }
        ,
        i.binding = function(e) {
            throw new Error("process.binding is not supported")
        }
        ,
        i.cwd = function() {
            return "/"
        }
        ,
        i.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }
        ,
        i.umask = function() {
            return 0
        }
    }
    , {}],
    89: [function(e, t, r) {
        "use strict";
        var n = {};
        function o(e, t, r) {
            r || (r = Error);
            var o = function(e) {
                var r, n;
                function o(r, n, o) {
                    return e.call(this, function(e, r, n) {
                        return "string" == typeof t ? t : t(e, r, n)
                    }(r, n, o)) || this
                }
                return n = e,
                (r = o).prototype = Object.create(n.prototype),
                r.prototype.constructor = r,
                r.__proto__ = n,
                o
            }(r);
            o.prototype.name = r.name,
            o.prototype.code = e,
            n[e] = o
        }
        function i(e, t) {
            if (Array.isArray(e)) {
                var r = e.length;
                return e = e.map((function(e) {
                    return String(e)
                }
                )),
                r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0])
            }
            return "of ".concat(t, " ").concat(String(e))
        }
        o("ERR_INVALID_OPT_VALUE", (function(e, t) {
            return 'The value "' + t + '" is invalid for option "' + e + '"'
        }
        ), TypeError),
        o("ERR_INVALID_ARG_TYPE", (function(e, t, r) {
            var n, o, s, a;
            if ("string" == typeof t && (o = "not ",
            t.substr(!s || s < 0 ? 0 : +s, o.length) === o) ? (n = "must not be",
            t = t.replace(/^not /, "")) : n = "must be",
            function(e, t, r) {
                return (void 0 === r || r > e.length) && (r = e.length),
                e.substring(r - t.length, r) === t
            }(e, " argument"))
                a = "The ".concat(e, " ").concat(n, " ").concat(i(t, "type"));
            else {
                var l = function(e, t, r) {
                    return "number" != typeof r && (r = 0),
                    !(r + t.length > e.length) && -1 !== e.indexOf(t, r)
                }(e, ".") ? "property" : "argument";
                a = 'The "'.concat(e, '" ').concat(l, " ").concat(n, " ").concat(i(t, "type"))
            }
            return a += ". Received type ".concat(typeof r)
        }
        ), TypeError),
        o("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"),
        o("ERR_METHOD_NOT_IMPLEMENTED", (function(e) {
            return "The " + e + " method is not implemented"
        }
        )),
        o("ERR_STREAM_PREMATURE_CLOSE", "Premature close"),
        o("ERR_STREAM_DESTROYED", (function(e) {
            return "Cannot call " + e + " after a stream was destroyed"
        }
        )),
        o("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"),
        o("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"),
        o("ERR_STREAM_WRITE_AFTER_END", "write after end"),
        o("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError),
        o("ERR_UNKNOWN_ENCODING", (function(e) {
            return "Unknown encoding: " + e
        }
        ), TypeError),
        o("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"),
        t.exports.codes = n
    }
    , {}],
    90: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n = Object.keys || function(e) {
                    var t = [];
                    for (var r in e)
                        t.push(r);
                    return t
                }
                ;
                t.exports = c;
                var o = e("./_stream_readable")
                  , i = e("./_stream_writable");
                e("inherits")(c, o);
                for (var s = n(i.prototype), a = 0; a < s.length; a++) {
                    var l = s[a];
                    c.prototype[l] || (c.prototype[l] = i.prototype[l])
                }
                function c(e) {
                    if (!(this instanceof c))
                        return new c(e);
                    o.call(this, e),
                    i.call(this, e),
                    this.allowHalfOpen = !0,
                    e && (!1 === e.readable && (this.readable = !1),
                    !1 === e.writable && (this.writable = !1),
                    !1 === e.allowHalfOpen && (this.allowHalfOpen = !1,
                    this.once("end", u)))
                }
                function u() {
                    this._writableState.ended || r.nextTick(d, this)
                }
                function d(e) {
                    e.end()
                }
                Object.defineProperty(c.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                Object.defineProperty(c.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(c.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(c.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                    },
                    set: function(e) {
                        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e,
                        this._writableState.destroyed = e)
                    }
                })
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./_stream_readable": 92,
        "./_stream_writable": 94,
        _process: 88,
        inherits: 82
    }],
    91: [function(e, t, r) {
        "use strict";
        t.exports = o;
        var n = e("./_stream_transform");
        function o(e) {
            if (!(this instanceof o))
                return new o(e);
            n.call(this, e)
        }
        e("inherits")(o, n),
        o.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "./_stream_transform": 93,
        inherits: 82
    }],
    92: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                var o;
                t.exports = R,
                R.ReadableState = A;
                e("events").EventEmitter;
                var i = function(e, t) {
                    return e.listeners(t).length
                }
                  , s = e("./internal/streams/stream")
                  , a = e("buffer").Buffer
                  , l = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var c, u = e("util");
                c = u && u.debuglog ? u.debuglog("stream") : function() {}
                ;
                var d, f, h, p = e("./internal/streams/buffer_list"), g = e("./internal/streams/destroy"), m = e("./internal/streams/state").getHighWaterMark, b = e("../errors").codes, y = b.ERR_INVALID_ARG_TYPE, v = b.ERR_STREAM_PUSH_AFTER_EOF, w = b.ERR_METHOD_NOT_IMPLEMENTED, _ = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
                e("inherits")(R, s);
                var E = g.errorOrDestroy
                  , S = ["error", "close", "destroy", "pause", "resume"];
                function A(t, r, n) {
                    o = o || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof n && (n = r instanceof o),
                    this.objectMode = !!t.objectMode,
                    n && (this.objectMode = this.objectMode || !!t.readableObjectMode),
                    this.highWaterMark = m(this, t, "readableHighWaterMark", n),
                    this.buffer = new p,
                    this.length = 0,
                    this.pipes = null,
                    this.pipesCount = 0,
                    this.flowing = null,
                    this.ended = !1,
                    this.endEmitted = !1,
                    this.reading = !1,
                    this.sync = !0,
                    this.needReadable = !1,
                    this.emittedReadable = !1,
                    this.readableListening = !1,
                    this.resumeScheduled = !1,
                    this.paused = !0,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.destroyed = !1,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.awaitDrain = 0,
                    this.readingMore = !1,
                    this.decoder = null,
                    this.encoding = null,
                    t.encoding && (d || (d = e("string_decoder/").StringDecoder),
                    this.decoder = new d(t.encoding),
                    this.encoding = t.encoding)
                }
                function R(t) {
                    if (o = o || e("./_stream_duplex"),
                    !(this instanceof R))
                        return new R(t);
                    var r = this instanceof o;
                    this._readableState = new A(t,this,r),
                    this.readable = !0,
                    t && ("function" == typeof t.read && (this._read = t.read),
                    "function" == typeof t.destroy && (this._destroy = t.destroy)),
                    s.call(this)
                }
                function M(e, t, r, n, o) {
                    c("readableAddChunk", t);
                    var i, s = e._readableState;
                    if (null === t)
                        s.reading = !1,
                        function(e, t) {
                            if (c("onEofChunk"),
                            t.ended)
                                return;
                            if (t.decoder) {
                                var r = t.decoder.end();
                                r && r.length && (t.buffer.push(r),
                                t.length += t.objectMode ? 1 : r.length)
                            }
                            t.ended = !0,
                            t.sync ? I(e) : (t.needReadable = !1,
                            t.emittedReadable || (t.emittedReadable = !0,
                            k(e)))
                        }(e, s);
                    else if (o || (i = function(e, t) {
                        var r;
                        n = t,
                        a.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new y("chunk",["string", "Buffer", "Uint8Array"],t));
                        var n;
                        return r
                    }(s, t)),
                    i)
                        E(e, i);
                    else if (s.objectMode || t && t.length > 0)
                        if ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === a.prototype || (t = function(e) {
                            return a.from(e)
                        }(t)),
                        n)
                            s.endEmitted ? E(e, new _) : x(e, s, t, !0);
                        else if (s.ended)
                            E(e, new v);
                        else {
                            if (s.destroyed)
                                return !1;
                            s.reading = !1,
                            s.decoder && !r ? (t = s.decoder.write(t),
                            s.objectMode || 0 !== t.length ? x(e, s, t, !1) : N(e, s)) : x(e, s, t, !1)
                        }
                    else
                        n || (s.reading = !1,
                        N(e, s));
                    return !s.ended && (s.length < s.highWaterMark || 0 === s.length)
                }
                function x(e, t, r, n) {
                    t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0,
                    e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length,
                    n ? t.buffer.unshift(r) : t.buffer.push(r),
                    t.needReadable && I(e)),
                    N(e, t)
                }
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = g.destroy,
                R.prototype._undestroy = g.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
                ,
                R.prototype.push = function(e, t) {
                    var r, n = this._readableState;
                    return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = a.from(e, t),
                    t = ""),
                    r = !0),
                    M(this, e, t, !1, r)
                }
                ,
                R.prototype.unshift = function(e) {
                    return M(this, e, null, !0, !1)
                }
                ,
                R.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing
                }
                ,
                R.prototype.setEncoding = function(t) {
                    d || (d = e("string_decoder/").StringDecoder);
                    var r = new d(t);
                    this._readableState.decoder = r,
                    this._readableState.encoding = this._readableState.decoder.encoding;
                    for (var n = this._readableState.buffer.head, o = ""; null !== n; )
                        o += r.write(n.data),
                        n = n.next;
                    return this._readableState.buffer.clear(),
                    "" !== o && this._readableState.buffer.push(o),
                    this._readableState.length = o.length,
                    this
                }
                ;
                var O = 1073741824;
                function T(e, t) {
                    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                        return e >= O ? e = O : (e--,
                        e |= e >>> 1,
                        e |= e >>> 2,
                        e |= e >>> 4,
                        e |= e >>> 8,
                        e |= e >>> 16,
                        e++),
                        e
                    }(e)),
                    e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0,
                    0))
                }
                function I(e) {
                    var t = e._readableState;
                    c("emitReadable", t.needReadable, t.emittedReadable),
                    t.needReadable = !1,
                    t.emittedReadable || (c("emitReadable", t.flowing),
                    t.emittedReadable = !0,
                    r.nextTick(k, e))
                }
                function k(e) {
                    var t = e._readableState;
                    c("emitReadable_", t.destroyed, t.length, t.ended),
                    t.destroyed || !t.length && !t.ended || (e.emit("readable"),
                    t.emittedReadable = !1),
                    t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark,
                    F(e)
                }
                function N(e, t) {
                    t.readingMore || (t.readingMore = !0,
                    r.nextTick(P, e, t))
                }
                function P(e, t) {
                    for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length); ) {
                        var r = t.length;
                        if (c("maybeReadMore read 0"),
                        e.read(0),
                        r === t.length)
                            break
                    }
                    t.readingMore = !1
                }
                function C(e) {
                    var t = e._readableState;
                    t.readableListening = e.listenerCount("readable") > 0,
                    t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume()
                }
                function L(e) {
                    c("readable nexttick read 0"),
                    e.read(0)
                }
                function j(e, t) {
                    c("resume", t.reading),
                    t.reading || e.read(0),
                    t.resumeScheduled = !1,
                    e.emit("resume"),
                    F(e),
                    t.flowing && !t.reading && e.read(0)
                }
                function F(e) {
                    var t = e._readableState;
                    for (c("flow", t.flowing); t.flowing && null !== e.read(); )
                        ;
                }
                function B(e, t) {
                    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length),
                    t.buffer.clear()) : r = t.buffer.consume(e, t.decoder),
                    r);
                    var r
                }
                function $(e) {
                    var t = e._readableState;
                    c("endReadable", t.endEmitted),
                    t.endEmitted || (t.ended = !0,
                    r.nextTick(D, t, e))
                }
                function D(e, t) {
                    if (c("endReadableNT", e.endEmitted, e.length),
                    !e.endEmitted && 0 === e.length && (e.endEmitted = !0,
                    t.readable = !1,
                    t.emit("end"),
                    e.autoDestroy)) {
                        var r = t._writableState;
                        (!r || r.autoDestroy && r.finished) && t.destroy()
                    }
                }
                function U(e, t) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (e[r] === t)
                            return r;
                    return -1
                }
                R.prototype.read = function(e) {
                    c("read", e),
                    e = parseInt(e, 10);
                    var t = this._readableState
                      , r = e;
                    if (0 !== e && (t.emittedReadable = !1),
                    0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                        return c("read: emitReadable", t.length, t.ended),
                        0 === t.length && t.ended ? $(this) : I(this),
                        null;
                    if (0 === (e = T(e, t)) && t.ended)
                        return 0 === t.length && $(this),
                        null;
                    var n, o = t.needReadable;
                    return c("need readable", o),
                    (0 === t.length || t.length - e < t.highWaterMark) && c("length less than watermark", o = !0),
                    t.ended || t.reading ? c("reading or ended", o = !1) : o && (c("do read"),
                    t.reading = !0,
                    t.sync = !0,
                    0 === t.length && (t.needReadable = !0),
                    this._read(t.highWaterMark),
                    t.sync = !1,
                    t.reading || (e = T(r, t))),
                    null === (n = e > 0 ? B(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark,
                    e = 0) : (t.length -= e,
                    t.awaitDrain = 0),
                    0 === t.length && (t.ended || (t.needReadable = !0),
                    r !== e && t.ended && $(this)),
                    null !== n && this.emit("data", n),
                    n
                }
                ,
                R.prototype._read = function(e) {
                    E(this, new w("_read()"))
                }
                ,
                R.prototype.pipe = function(e, t) {
                    var n = this
                      , o = this._readableState;
                    switch (o.pipesCount) {
                    case 0:
                        o.pipes = e;
                        break;
                    case 1:
                        o.pipes = [o.pipes, e];
                        break;
                    default:
                        o.pipes.push(e)
                    }
                    o.pipesCount += 1,
                    c("pipe count=%d opts=%j", o.pipesCount, t);
                    var s = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : m;
                    function a(t, r) {
                        c("onunpipe"),
                        t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0,
                        c("cleanup"),
                        e.removeListener("close", p),
                        e.removeListener("finish", g),
                        e.removeListener("drain", u),
                        e.removeListener("error", h),
                        e.removeListener("unpipe", a),
                        n.removeListener("end", l),
                        n.removeListener("end", m),
                        n.removeListener("data", f),
                        d = !0,
                        !o.awaitDrain || e._writableState && !e._writableState.needDrain || u())
                    }
                    function l() {
                        c("onend"),
                        e.end()
                    }
                    o.endEmitted ? r.nextTick(s) : n.once("end", s),
                    e.on("unpipe", a);
                    var u = function(e) {
                        return function() {
                            var t = e._readableState;
                            c("pipeOnDrain", t.awaitDrain),
                            t.awaitDrain && t.awaitDrain--,
                            0 === t.awaitDrain && i(e, "data") && (t.flowing = !0,
                            F(e))
                        }
                    }(n);
                    e.on("drain", u);
                    var d = !1;
                    function f(t) {
                        c("ondata");
                        var r = e.write(t);
                        c("dest.write", r),
                        !1 === r && ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== U(o.pipes, e)) && !d && (c("false write response, pause", o.awaitDrain),
                        o.awaitDrain++),
                        n.pause())
                    }
                    function h(t) {
                        c("onerror", t),
                        m(),
                        e.removeListener("error", h),
                        0 === i(e, "error") && E(e, t)
                    }
                    function p() {
                        e.removeListener("finish", g),
                        m()
                    }
                    function g() {
                        c("onfinish"),
                        e.removeListener("close", p),
                        m()
                    }
                    function m() {
                        c("unpipe"),
                        n.unpipe(e)
                    }
                    return n.on("data", f),
                    function(e, t, r) {
                        if ("function" == typeof e.prependListener)
                            return e.prependListener(t, r);
                        e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                    }(e, "error", h),
                    e.once("close", p),
                    e.once("finish", g),
                    e.emit("pipe", n),
                    o.flowing || (c("pipe resume"),
                    n.resume()),
                    e
                }
                ,
                R.prototype.unpipe = function(e) {
                    var t = this._readableState
                      , r = {
                        hasUnpiped: !1
                    };
                    if (0 === t.pipesCount)
                        return this;
                    if (1 === t.pipesCount)
                        return e && e !== t.pipes || (e || (e = t.pipes),
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1,
                        e && e.emit("unpipe", this, r)),
                        this;
                    if (!e) {
                        var n = t.pipes
                          , o = t.pipesCount;
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1;
                        for (var i = 0; i < o; i++)
                            n[i].emit("unpipe", this, {
                                hasUnpiped: !1
                            });
                        return this
                    }
                    var s = U(t.pipes, e);
                    return -1 === s || (t.pipes.splice(s, 1),
                    t.pipesCount -= 1,
                    1 === t.pipesCount && (t.pipes = t.pipes[0]),
                    e.emit("unpipe", this, r)),
                    this
                }
                ,
                R.prototype.on = function(e, t) {
                    var n = s.prototype.on.call(this, e, t)
                      , o = this._readableState;
                    return "data" === e ? (o.readableListening = this.listenerCount("readable") > 0,
                    !1 !== o.flowing && this.resume()) : "readable" === e && (o.endEmitted || o.readableListening || (o.readableListening = o.needReadable = !0,
                    o.flowing = !1,
                    o.emittedReadable = !1,
                    c("on readable", o.length, o.reading),
                    o.length ? I(this) : o.reading || r.nextTick(L, this))),
                    n
                }
                ,
                R.prototype.addListener = R.prototype.on,
                R.prototype.removeListener = function(e, t) {
                    var n = s.prototype.removeListener.call(this, e, t);
                    return "readable" === e && r.nextTick(C, this),
                    n
                }
                ,
                R.prototype.removeAllListeners = function(e) {
                    var t = s.prototype.removeAllListeners.apply(this, arguments);
                    return "readable" !== e && void 0 !== e || r.nextTick(C, this),
                    t
                }
                ,
                R.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (c("resume"),
                    e.flowing = !e.readableListening,
                    function(e, t) {
                        t.resumeScheduled || (t.resumeScheduled = !0,
                        r.nextTick(j, e, t))
                    }(this, e)),
                    e.paused = !1,
                    this
                }
                ,
                R.prototype.pause = function() {
                    return c("call pause flowing=%j", this._readableState.flowing),
                    !1 !== this._readableState.flowing && (c("pause"),
                    this._readableState.flowing = !1,
                    this.emit("pause")),
                    this._readableState.paused = !0,
                    this
                }
                ,
                R.prototype.wrap = function(e) {
                    var t = this
                      , r = this._readableState
                      , n = !1;
                    for (var o in e.on("end", (function() {
                        if (c("wrapped end"),
                        r.decoder && !r.ended) {
                            var e = r.decoder.end();
                            e && e.length && t.push(e)
                        }
                        t.push(null)
                    }
                    )),
                    e.on("data", (function(o) {
                        (c("wrapped data"),
                        r.decoder && (o = r.decoder.write(o)),
                        r.objectMode && null == o) || (r.objectMode || o && o.length) && (t.push(o) || (n = !0,
                        e.pause()))
                    }
                    )),
                    e)
                        void 0 === this[o] && "function" == typeof e[o] && (this[o] = function(t) {
                            return function() {
                                return e[t].apply(e, arguments)
                            }
                        }(o));
                    for (var i = 0; i < S.length; i++)
                        e.on(S[i], this.emit.bind(this, S[i]));
                    return this._read = function(t) {
                        c("wrapped _read", t),
                        n && (n = !1,
                        e.resume())
                    }
                    ,
                    this
                }
                ,
                "function" == typeof Symbol && (R.prototype[Symbol.asyncIterator] = function() {
                    return void 0 === f && (f = e("./internal/streams/async_iterator")),
                    f(this)
                }
                ),
                Object.defineProperty(R.prototype, "readableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.highWaterMark
                    }
                }),
                Object.defineProperty(R.prototype, "readableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState && this._readableState.buffer
                    }
                }),
                Object.defineProperty(R.prototype, "readableFlowing", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.flowing
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.flowing = e)
                    }
                }),
                R._fromList = B,
                Object.defineProperty(R.prototype, "readableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.length
                    }
                }),
                "function" == typeof Symbol && (R.from = function(t, r) {
                    return void 0 === h && (h = e("./internal/streams/from")),
                    h(R, t, r)
                }
                )
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 89,
        "./_stream_duplex": 90,
        "./internal/streams/async_iterator": 95,
        "./internal/streams/buffer_list": 96,
        "./internal/streams/destroy": 97,
        "./internal/streams/from": 99,
        "./internal/streams/state": 101,
        "./internal/streams/stream": 102,
        _process: 88,
        buffer: 50,
        events: 54,
        inherits: 82,
        "string_decoder/": 150,
        util: 49
    }],
    93: [function(e, t, r) {
        "use strict";
        t.exports = u;
        var n = e("../errors").codes
          , o = n.ERR_METHOD_NOT_IMPLEMENTED
          , i = n.ERR_MULTIPLE_CALLBACK
          , s = n.ERR_TRANSFORM_ALREADY_TRANSFORMING
          , a = n.ERR_TRANSFORM_WITH_LENGTH_0
          , l = e("./_stream_duplex");
        function c(e, t) {
            var r = this._transformState;
            r.transforming = !1;
            var n = r.writecb;
            if (null === n)
                return this.emit("error", new i);
            r.writechunk = null,
            r.writecb = null,
            null != t && this.push(t),
            n(e);
            var o = this._readableState;
            o.reading = !1,
            (o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark)
        }
        function u(e) {
            if (!(this instanceof u))
                return new u(e);
            l.call(this, e),
            this._transformState = {
                afterTransform: c.bind(this),
                needTransform: !1,
                transforming: !1,
                writecb: null,
                writechunk: null,
                writeencoding: null
            },
            this._readableState.needReadable = !0,
            this._readableState.sync = !1,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", d)
        }
        function d() {
            var e = this;
            "function" != typeof this._flush || this._readableState.destroyed ? f(this, null, null) : this._flush((function(t, r) {
                f(e, t, r)
            }
            ))
        }
        function f(e, t, r) {
            if (t)
                return e.emit("error", t);
            if (null != r && e.push(r),
            e._writableState.length)
                throw new a;
            if (e._transformState.transforming)
                throw new s;
            return e.push(null)
        }
        e("inherits")(u, l),
        u.prototype.push = function(e, t) {
            return this._transformState.needTransform = !1,
            l.prototype.push.call(this, e, t)
        }
        ,
        u.prototype._transform = function(e, t, r) {
            r(new o("_transform()"))
        }
        ,
        u.prototype._write = function(e, t, r) {
            var n = this._transformState;
            if (n.writecb = r,
            n.writechunk = e,
            n.writeencoding = t,
            !n.transforming) {
                var o = this._readableState;
                (n.needTransform || o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark)
            }
        }
        ,
        u.prototype._read = function(e) {
            var t = this._transformState;
            null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0,
            this._transform(t.writechunk, t.writeencoding, t.afterTransform))
        }
        ,
        u.prototype._destroy = function(e, t) {
            l.prototype._destroy.call(this, e, (function(e) {
                t(e)
            }
            ))
        }
    }
    , {
        "../errors": 89,
        "./_stream_duplex": 90,
        inherits: 82
    }],
    94: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                function o(e) {
                    var t = this;
                    this.next = null,
                    this.entry = null,
                    this.finish = function() {
                        !function(e, t, r) {
                            var n = e.entry;
                            e.entry = null;
                            for (; n; ) {
                                var o = n.callback;
                                t.pendingcb--,
                                o(r),
                                n = n.next
                            }
                            t.corkedRequestsFree.next = e
                        }(t, e)
                    }
                }
                var i;
                t.exports = R,
                R.WritableState = A;
                var s = {
                    deprecate: e("util-deprecate")
                }
                  , a = e("./internal/streams/stream")
                  , l = e("buffer").Buffer
                  , c = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var u, d = e("./internal/streams/destroy"), f = e("./internal/streams/state").getHighWaterMark, h = e("../errors").codes, p = h.ERR_INVALID_ARG_TYPE, g = h.ERR_METHOD_NOT_IMPLEMENTED, m = h.ERR_MULTIPLE_CALLBACK, b = h.ERR_STREAM_CANNOT_PIPE, y = h.ERR_STREAM_DESTROYED, v = h.ERR_STREAM_NULL_VALUES, w = h.ERR_STREAM_WRITE_AFTER_END, _ = h.ERR_UNKNOWN_ENCODING, E = d.errorOrDestroy;
                function S() {}
                function A(t, n, s) {
                    i = i || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof s && (s = n instanceof i),
                    this.objectMode = !!t.objectMode,
                    s && (this.objectMode = this.objectMode || !!t.writableObjectMode),
                    this.highWaterMark = f(this, t, "writableHighWaterMark", s),
                    this.finalCalled = !1,
                    this.needDrain = !1,
                    this.ending = !1,
                    this.ended = !1,
                    this.finished = !1,
                    this.destroyed = !1;
                    var a = !1 === t.decodeStrings;
                    this.decodeStrings = !a,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.length = 0,
                    this.writing = !1,
                    this.corked = 0,
                    this.sync = !0,
                    this.bufferProcessing = !1,
                    this.onwrite = function(e) {
                        !function(e, t) {
                            var n = e._writableState
                              , o = n.sync
                              , i = n.writecb;
                            if ("function" != typeof i)
                                throw new m;
                            if (function(e) {
                                e.writing = !1,
                                e.writecb = null,
                                e.length -= e.writelen,
                                e.writelen = 0
                            }(n),
                            t)
                                !function(e, t, n, o, i) {
                                    --t.pendingcb,
                                    n ? (r.nextTick(i, o),
                                    r.nextTick(k, e, t),
                                    e._writableState.errorEmitted = !0,
                                    E(e, o)) : (i(o),
                                    e._writableState.errorEmitted = !0,
                                    E(e, o),
                                    k(e, t))
                                }(e, n, o, t, i);
                            else {
                                var s = T(n) || e.destroyed;
                                s || n.corked || n.bufferProcessing || !n.bufferedRequest || O(e, n),
                                o ? r.nextTick(x, e, n, s, i) : x(e, n, s, i)
                            }
                        }(n, e)
                    }
                    ,
                    this.writecb = null,
                    this.writelen = 0,
                    this.bufferedRequest = null,
                    this.lastBufferedRequest = null,
                    this.pendingcb = 0,
                    this.prefinished = !1,
                    this.errorEmitted = !1,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.bufferedRequestCount = 0,
                    this.corkedRequestsFree = new o(this)
                }
                function R(t) {
                    var r = this instanceof (i = i || e("./_stream_duplex"));
                    if (!r && !u.call(R, this))
                        return new R(t);
                    this._writableState = new A(t,this,r),
                    this.writable = !0,
                    t && ("function" == typeof t.write && (this._write = t.write),
                    "function" == typeof t.writev && (this._writev = t.writev),
                    "function" == typeof t.destroy && (this._destroy = t.destroy),
                    "function" == typeof t.final && (this._final = t.final)),
                    a.call(this)
                }
                function M(e, t, r, n, o, i, s) {
                    t.writelen = n,
                    t.writecb = s,
                    t.writing = !0,
                    t.sync = !0,
                    t.destroyed ? t.onwrite(new y("write")) : r ? e._writev(o, t.onwrite) : e._write(o, i, t.onwrite),
                    t.sync = !1
                }
                function x(e, t, r, n) {
                    r || function(e, t) {
                        0 === t.length && t.needDrain && (t.needDrain = !1,
                        e.emit("drain"))
                    }(e, t),
                    t.pendingcb--,
                    n(),
                    k(e, t)
                }
                function O(e, t) {
                    t.bufferProcessing = !0;
                    var r = t.bufferedRequest;
                    if (e._writev && r && r.next) {
                        var n = t.bufferedRequestCount
                          , i = new Array(n)
                          , s = t.corkedRequestsFree;
                        s.entry = r;
                        for (var a = 0, l = !0; r; )
                            i[a] = r,
                            r.isBuf || (l = !1),
                            r = r.next,
                            a += 1;
                        i.allBuffers = l,
                        M(e, t, !0, t.length, i, "", s.finish),
                        t.pendingcb++,
                        t.lastBufferedRequest = null,
                        s.next ? (t.corkedRequestsFree = s.next,
                        s.next = null) : t.corkedRequestsFree = new o(t),
                        t.bufferedRequestCount = 0
                    } else {
                        for (; r; ) {
                            var c = r.chunk
                              , u = r.encoding
                              , d = r.callback;
                            if (M(e, t, !1, t.objectMode ? 1 : c.length, c, u, d),
                            r = r.next,
                            t.bufferedRequestCount--,
                            t.writing)
                                break
                        }
                        null === r && (t.lastBufferedRequest = null)
                    }
                    t.bufferedRequest = r,
                    t.bufferProcessing = !1
                }
                function T(e) {
                    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
                }
                function I(e, t) {
                    e._final((function(r) {
                        t.pendingcb--,
                        r && E(e, r),
                        t.prefinished = !0,
                        e.emit("prefinish"),
                        k(e, t)
                    }
                    ))
                }
                function k(e, t) {
                    var n = T(t);
                    if (n && (function(e, t) {
                        t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0,
                        e.emit("prefinish")) : (t.pendingcb++,
                        t.finalCalled = !0,
                        r.nextTick(I, e, t)))
                    }(e, t),
                    0 === t.pendingcb && (t.finished = !0,
                    e.emit("finish"),
                    t.autoDestroy))) {
                        var o = e._readableState;
                        (!o || o.autoDestroy && o.endEmitted) && e.destroy()
                    }
                    return n
                }
                e("inherits")(R, a),
                A.prototype.getBuffer = function() {
                    for (var e = this.bufferedRequest, t = []; e; )
                        t.push(e),
                        e = e.next;
                    return t
                }
                ,
                function() {
                    try {
                        Object.defineProperty(A.prototype, "buffer", {
                            get: s.deprecate((function() {
                                return this.getBuffer()
                            }
                            ), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (e) {}
                }(),
                "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (u = Function.prototype[Symbol.hasInstance],
                Object.defineProperty(R, Symbol.hasInstance, {
                    value: function(e) {
                        return !!u.call(this, e) || this === R && (e && e._writableState instanceof A)
                    }
                })) : u = function(e) {
                    return e instanceof this
                }
                ,
                R.prototype.pipe = function() {
                    E(this, new b)
                }
                ,
                R.prototype.write = function(e, t, n) {
                    var o, i = this._writableState, s = !1, a = !i.objectMode && (o = e,
                    l.isBuffer(o) || o instanceof c);
                    return a && !l.isBuffer(e) && (e = function(e) {
                        return l.from(e)
                    }(e)),
                    "function" == typeof t && (n = t,
                    t = null),
                    a ? t = "buffer" : t || (t = i.defaultEncoding),
                    "function" != typeof n && (n = S),
                    i.ending ? function(e, t) {
                        var n = new w;
                        E(e, n),
                        r.nextTick(t, n)
                    }(this, n) : (a || function(e, t, n, o) {
                        var i;
                        return null === n ? i = new v : "string" == typeof n || t.objectMode || (i = new p("chunk",["string", "Buffer"],n)),
                        !i || (E(e, i),
                        r.nextTick(o, i),
                        !1)
                    }(this, i, e, n)) && (i.pendingcb++,
                    s = function(e, t, r, n, o, i) {
                        if (!r) {
                            var s = function(e, t, r) {
                                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = l.from(t, r));
                                return t
                            }(t, n, o);
                            n !== s && (r = !0,
                            o = "buffer",
                            n = s)
                        }
                        var a = t.objectMode ? 1 : n.length;
                        t.length += a;
                        var c = t.length < t.highWaterMark;
                        c || (t.needDrain = !0);
                        if (t.writing || t.corked) {
                            var u = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: n,
                                encoding: o,
                                isBuf: r,
                                callback: i,
                                next: null
                            },
                            u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest,
                            t.bufferedRequestCount += 1
                        } else
                            M(e, t, !1, a, n, o, i);
                        return c
                    }(this, i, a, e, t, n)),
                    s
                }
                ,
                R.prototype.cork = function() {
                    this._writableState.corked++
                }
                ,
                R.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--,
                    e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || O(this, e))
                }
                ,
                R.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()),
                    !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                        throw new _(e);
                    return this._writableState.defaultEncoding = e,
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(R.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                R.prototype._write = function(e, t, r) {
                    r(new g("_write()"))
                }
                ,
                R.prototype._writev = null,
                R.prototype.end = function(e, t, n) {
                    var o = this._writableState;
                    return "function" == typeof e ? (n = e,
                    e = null,
                    t = null) : "function" == typeof t && (n = t,
                    t = null),
                    null != e && this.write(e, t),
                    o.corked && (o.corked = 1,
                    this.uncork()),
                    o.ending || function(e, t, n) {
                        t.ending = !0,
                        k(e, t),
                        n && (t.finished ? r.nextTick(n) : e.once("finish", n));
                        t.ended = !0,
                        e.writable = !1
                    }(this, o, n),
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = d.destroy,
                R.prototype._undestroy = d.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 89,
        "./_stream_duplex": 90,
        "./internal/streams/destroy": 97,
        "./internal/streams/state": 101,
        "./internal/streams/stream": 102,
        _process: 88,
        buffer: 50,
        inherits: 82,
        "util-deprecate": 152
    }],
    95: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n;
                function o(e, t, r) {
                    return (t = function(e) {
                        var t = function(e, t) {
                            if ("object" != typeof e || null === e)
                                return e;
                            var r = e[Symbol.toPrimitive];
                            if (void 0 !== r) {
                                var n = r.call(e, t || "default");
                                if ("object" != typeof n)
                                    return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return ("string" === t ? String : Number)(e)
                        }(e, "string");
                        return "symbol" == typeof t ? t : String(t)
                    }(t))in e ? Object.defineProperty(e, t, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = r,
                    e
                }
                var i = e("./end-of-stream")
                  , s = Symbol("lastResolve")
                  , a = Symbol("lastReject")
                  , l = Symbol("error")
                  , c = Symbol("ended")
                  , u = Symbol("lastPromise")
                  , d = Symbol("handlePromise")
                  , f = Symbol("stream");
                function h(e, t) {
                    return {
                        value: e,
                        done: t
                    }
                }
                function p(e) {
                    var t = e[s];
                    if (null !== t) {
                        var r = e[f].read();
                        null !== r && (e[u] = null,
                        e[s] = null,
                        e[a] = null,
                        t(h(r, !1)))
                    }
                }
                function g(e) {
                    r.nextTick(p, e)
                }
                var m = Object.getPrototypeOf((function() {}
                ))
                  , b = Object.setPrototypeOf((o(n = {
                    get stream() {
                        return this[f]
                    },
                    next: function() {
                        var e = this
                          , t = this[l];
                        if (null !== t)
                            return Promise.reject(t);
                        if (this[c])
                            return Promise.resolve(h(void 0, !0));
                        if (this[f].destroyed)
                            return new Promise((function(t, n) {
                                r.nextTick((function() {
                                    e[l] ? n(e[l]) : t(h(void 0, !0))
                                }
                                ))
                            }
                            ));
                        var n, o = this[u];
                        if (o)
                            n = new Promise(function(e, t) {
                                return function(r, n) {
                                    e.then((function() {
                                        t[c] ? r(h(void 0, !0)) : t[d](r, n)
                                    }
                                    ), n)
                                }
                            }(o, this));
                        else {
                            var i = this[f].read();
                            if (null !== i)
                                return Promise.resolve(h(i, !1));
                            n = new Promise(this[d])
                        }
                        return this[u] = n,
                        n
                    }
                }, Symbol.asyncIterator, (function() {
                    return this
                }
                )),
                o(n, "return", (function() {
                    var e = this;
                    return new Promise((function(t, r) {
                        e[f].destroy(null, (function(e) {
                            e ? r(e) : t(h(void 0, !0))
                        }
                        ))
                    }
                    ))
                }
                )),
                n), m);
                t.exports = function(e) {
                    var t, r = Object.create(b, (o(t = {}, f, {
                        value: e,
                        writable: !0
                    }),
                    o(t, s, {
                        value: null,
                        writable: !0
                    }),
                    o(t, a, {
                        value: null,
                        writable: !0
                    }),
                    o(t, l, {
                        value: null,
                        writable: !0
                    }),
                    o(t, c, {
                        value: e._readableState.endEmitted,
                        writable: !0
                    }),
                    o(t, d, {
                        value: function(e, t) {
                            var n = r[f].read();
                            n ? (r[u] = null,
                            r[s] = null,
                            r[a] = null,
                            e(h(n, !1))) : (r[s] = e,
                            r[a] = t)
                        },
                        writable: !0
                    }),
                    t));
                    return r[u] = null,
                    i(e, (function(e) {
                        if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                            var t = r[a];
                            return null !== t && (r[u] = null,
                            r[s] = null,
                            r[a] = null,
                            t(e)),
                            void (r[l] = e)
                        }
                        var n = r[s];
                        null !== n && (r[u] = null,
                        r[s] = null,
                        r[a] = null,
                        n(h(void 0, !0))),
                        r[c] = !0
                    }
                    )),
                    e.on("readable", g.bind(null, r)),
                    r
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./end-of-stream": 98,
        _process: 88
    }],
    96: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter((function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                }
                ))),
                r.push.apply(r, n)
            }
            return r
        }
        function o(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? n(Object(r), !0).forEach((function(t) {
                    i(e, t, r[t])
                }
                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                }
                ))
            }
            return e
        }
        function i(e, t, r) {
            return (t = a(t))in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r,
            e
        }
        function s(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(e, a(n.key), n)
            }
        }
        function a(e) {
            var t = function(e, t) {
                if ("object" != typeof e || null === e)
                    return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                    var n = r.call(e, t || "default");
                    if ("object" != typeof n)
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === t ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof t ? t : String(t)
        }
        var l = e("buffer").Buffer
          , c = e("util").inspect
          , u = c && c.custom || "inspect";
        t.exports = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            var t, r, n;
            return t = e,
            (r = [{
                key: "push",
                value: function(e) {
                    var t = {
                        data: e,
                        next: null
                    };
                    this.length > 0 ? this.tail.next = t : this.head = t,
                    this.tail = t,
                    ++this.length
                }
            }, {
                key: "unshift",
                value: function(e) {
                    var t = {
                        data: e,
                        next: this.head
                    };
                    0 === this.length && (this.tail = t),
                    this.head = t,
                    ++this.length
                }
            }, {
                key: "shift",
                value: function() {
                    if (0 !== this.length) {
                        var e = this.head.data;
                        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                        --this.length,
                        e
                    }
                }
            }, {
                key: "clear",
                value: function() {
                    this.head = this.tail = null,
                    this.length = 0
                }
            }, {
                key: "join",
                value: function(e) {
                    if (0 === this.length)
                        return "";
                    for (var t = this.head, r = "" + t.data; t = t.next; )
                        r += e + t.data;
                    return r
                }
            }, {
                key: "concat",
                value: function(e) {
                    if (0 === this.length)
                        return l.alloc(0);
                    for (var t, r, n, o = l.allocUnsafe(e >>> 0), i = this.head, s = 0; i; )
                        t = i.data,
                        r = o,
                        n = s,
                        l.prototype.copy.call(t, r, n),
                        s += i.data.length,
                        i = i.next;
                    return o
                }
            }, {
                key: "consume",
                value: function(e, t) {
                    var r;
                    return e < this.head.data.length ? (r = this.head.data.slice(0, e),
                    this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e),
                    r
                }
            }, {
                key: "first",
                value: function() {
                    return this.head.data
                }
            }, {
                key: "_getString",
                value: function(e) {
                    var t = this.head
                      , r = 1
                      , n = t.data;
                    for (e -= n.length; t = t.next; ) {
                        var o = t.data
                          , i = e > o.length ? o.length : e;
                        if (i === o.length ? n += o : n += o.slice(0, e),
                        0 == (e -= i)) {
                            i === o.length ? (++r,
                            t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t,
                            t.data = o.slice(i));
                            break
                        }
                        ++r
                    }
                    return this.length -= r,
                    n
                }
            }, {
                key: "_getBuffer",
                value: function(e) {
                    var t = l.allocUnsafe(e)
                      , r = this.head
                      , n = 1;
                    for (r.data.copy(t),
                    e -= r.data.length; r = r.next; ) {
                        var o = r.data
                          , i = e > o.length ? o.length : e;
                        if (o.copy(t, t.length - e, 0, i),
                        0 == (e -= i)) {
                            i === o.length ? (++n,
                            r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r,
                            r.data = o.slice(i));
                            break
                        }
                        ++n
                    }
                    return this.length -= n,
                    t
                }
            }, {
                key: u,
                value: function(e, t) {
                    return c(this, o(o({}, t), {}, {
                        depth: 0,
                        customInspect: !1
                    }))
                }
            }]) && s(t.prototype, r),
            n && s(t, n),
            Object.defineProperty(t, "prototype", {
                writable: !1
            }),
            e
        }()
    }
    , {
        buffer: 50,
        util: 49
    }],
    97: [function(e, t, r) {
        (function(e) {
            (function() {
                "use strict";
                function r(e, t) {
                    o(e, t),
                    n(e)
                }
                function n(e) {
                    e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close")
                }
                function o(e, t) {
                    e.emit("error", t)
                }
                t.exports = {
                    destroy: function(t, i) {
                        var s = this
                          , a = this._readableState && this._readableState.destroyed
                          , l = this._writableState && this._writableState.destroyed;
                        return a || l ? (i ? i(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0,
                        e.nextTick(o, this, t)) : e.nextTick(o, this, t)),
                        this) : (this._readableState && (this._readableState.destroyed = !0),
                        this._writableState && (this._writableState.destroyed = !0),
                        this._destroy(t || null, (function(t) {
                            !i && t ? s._writableState ? s._writableState.errorEmitted ? e.nextTick(n, s) : (s._writableState.errorEmitted = !0,
                            e.nextTick(r, s, t)) : e.nextTick(r, s, t) : i ? (e.nextTick(n, s),
                            i(t)) : e.nextTick(n, s)
                        }
                        )),
                        this)
                    },
                    undestroy: function() {
                        this._readableState && (this._readableState.destroyed = !1,
                        this._readableState.reading = !1,
                        this._readableState.ended = !1,
                        this._readableState.endEmitted = !1),
                        this._writableState && (this._writableState.destroyed = !1,
                        this._writableState.ended = !1,
                        this._writableState.ending = !1,
                        this._writableState.finalCalled = !1,
                        this._writableState.prefinished = !1,
                        this._writableState.finished = !1,
                        this._writableState.errorEmitted = !1)
                    },
                    errorOrDestroy: function(e, t) {
                        var r = e._readableState
                          , n = e._writableState;
                        r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t)
                    }
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 88
    }],
    98: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
        function o() {}
        t.exports = function e(t, r, i) {
            if ("function" == typeof r)
                return e(t, null, r);
            r || (r = {}),
            i = function(e) {
                var t = !1;
                return function() {
                    if (!t) {
                        t = !0;
                        for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++)
                            n[o] = arguments[o];
                        e.apply(this, n)
                    }
                }
            }(i || o);
            var s = r.readable || !1 !== r.readable && t.readable
              , a = r.writable || !1 !== r.writable && t.writable
              , l = function() {
                t.writable || u()
            }
              , c = t._writableState && t._writableState.finished
              , u = function() {
                a = !1,
                c = !0,
                s || i.call(t)
            }
              , d = t._readableState && t._readableState.endEmitted
              , f = function() {
                s = !1,
                d = !0,
                a || i.call(t)
            }
              , h = function(e) {
                i.call(t, e)
            }
              , p = function() {
                var e;
                return s && !d ? (t._readableState && t._readableState.ended || (e = new n),
                i.call(t, e)) : a && !c ? (t._writableState && t._writableState.ended || (e = new n),
                i.call(t, e)) : void 0
            }
              , g = function() {
                t.req.on("finish", u)
            };
            return !function(e) {
                return e.setHeader && "function" == typeof e.abort
            }(t) ? a && !t._writableState && (t.on("end", l),
            t.on("close", l)) : (t.on("complete", u),
            t.on("abort", p),
            t.req ? g() : t.on("request", g)),
            t.on("end", f),
            t.on("finish", u),
            !1 !== r.error && t.on("error", h),
            t.on("close", p),
            function() {
                t.removeListener("complete", u),
                t.removeListener("abort", p),
                t.removeListener("request", g),
                t.req && t.req.removeListener("finish", u),
                t.removeListener("end", l),
                t.removeListener("close", l),
                t.removeListener("finish", u),
                t.removeListener("end", f),
                t.removeListener("error", h),
                t.removeListener("close", p)
            }
        }
    }
    , {
        "../../../errors": 89
    }],
    99: [function(e, t, r) {
        t.exports = function() {
            throw new Error("Readable.from is not available in the browser")
        }
    }
    , {}],
    100: [function(e, t, r) {
        "use strict";
        var n;
        var o = e("../../../errors").codes
          , i = o.ERR_MISSING_ARGS
          , s = o.ERR_STREAM_DESTROYED;
        function a(e) {
            if (e)
                throw e
        }
        function l(e) {
            e()
        }
        function c(e, t) {
            return e.pipe(t)
        }
        t.exports = function() {
            for (var t = arguments.length, r = new Array(t), o = 0; o < t; o++)
                r[o] = arguments[o];
            var u, d = function(e) {
                return e.length ? "function" != typeof e[e.length - 1] ? a : e.pop() : a
            }(r);
            if (Array.isArray(r[0]) && (r = r[0]),
            r.length < 2)
                throw new i("streams");
            var f = r.map((function(t, o) {
                var i = o < r.length - 1;
                return function(t, r, o, i) {
                    i = function(e) {
                        var t = !1;
                        return function() {
                            t || (t = !0,
                            e.apply(void 0, arguments))
                        }
                    }(i);
                    var a = !1;
                    t.on("close", (function() {
                        a = !0
                    }
                    )),
                    void 0 === n && (n = e("./end-of-stream")),
                    n(t, {
                        readable: r,
                        writable: o
                    }, (function(e) {
                        if (e)
                            return i(e);
                        a = !0,
                        i()
                    }
                    ));
                    var l = !1;
                    return function(e) {
                        if (!a && !l)
                            return l = !0,
                            function(e) {
                                return e.setHeader && "function" == typeof e.abort
                            }(t) ? t.abort() : "function" == typeof t.destroy ? t.destroy() : void i(e || new s("pipe"))
                    }
                }(t, i, o > 0, (function(e) {
                    u || (u = e),
                    e && f.forEach(l),
                    i || (f.forEach(l),
                    d(u))
                }
                ))
            }
            ));
            return r.reduce(c)
        }
    }
    , {
        "../../../errors": 89,
        "./end-of-stream": 98
    }],
    101: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
        t.exports = {
            getHighWaterMark: function(e, t, r, o) {
                var i = function(e, t, r) {
                    return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null
                }(t, o, r);
                if (null != i) {
                    if (!isFinite(i) || Math.floor(i) !== i || i < 0)
                        throw new n(o ? r : "highWaterMark",i);
                    return Math.floor(i)
                }
                return e.objectMode ? 16 : 16384
            }
        }
    }
    , {
        "../../../errors": 89
    }],
    102: [function(e, t, r) {
        t.exports = e("events").EventEmitter
    }
    , {
        events: 54
    }],
    103: [function(e, t, r) {
        (r = t.exports = e("./lib/_stream_readable.js")).Stream = r,
        r.Readable = r,
        r.Writable = e("./lib/_stream_writable.js"),
        r.Duplex = e("./lib/_stream_duplex.js"),
        r.Transform = e("./lib/_stream_transform.js"),
        r.PassThrough = e("./lib/_stream_passthrough.js"),
        r.finished = e("./lib/internal/streams/end-of-stream.js"),
        r.pipeline = e("./lib/internal/streams/pipeline.js")
    }
    , {
        "./lib/_stream_duplex.js": 90,
        "./lib/_stream_passthrough.js": 91,
        "./lib/_stream_readable.js": 92,
        "./lib/_stream_transform.js": 93,
        "./lib/_stream_writable.js": 94,
        "./lib/internal/streams/end-of-stream.js": 98,
        "./lib/internal/streams/pipeline.js": 100
    }],
    104: [function(e, t, r) {
        /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
        var n = e("buffer")
          , o = n.Buffer;
        function i(e, t) {
            for (var r in e)
                t[r] = e[r]
        }
        function s(e, t, r) {
            return o(e, t, r)
        }
        o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? t.exports = n : (i(n, r),
        r.Buffer = s),
        s.prototype = Object.create(o.prototype),
        i(o, s),
        s.from = function(e, t, r) {
            if ("number" == typeof e)
                throw new TypeError("Argument must not be a number");
            return o(e, t, r)
        }
        ,
        s.alloc = function(e, t, r) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            var n = o(e);
            return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0),
            n
        }
        ,
        s.allocUnsafe = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return o(e)
        }
        ,
        s.allocUnsafeSlow = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e)
        }
    }
    , {
        buffer: 50
    }],
    105: [function(e, t, r) {
        const n = Symbol("SemVer ANY");
        class o {
            static get ANY() {
                return n
            }
            constructor(e, t) {
                if (t = i(t),
                e instanceof o) {
                    if (e.loose === !!t.loose)
                        return e;
                    e = e.value
                }
                e = e.trim().split(/\s+/).join(" "),
                c("comparator", e, t),
                this.options = t,
                this.loose = !!t.loose,
                this.parse(e),
                this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version,
                c("comp", this)
            }
            parse(e) {
                const t = this.options.loose ? s[a.COMPARATORLOOSE] : s[a.COMPARATOR]
                  , r = e.match(t);
                if (!r)
                    throw new TypeError(`Invalid comparator: ${e}`);
                this.operator = void 0 !== r[1] ? r[1] : "",
                "=" === this.operator && (this.operator = ""),
                r[2] ? this.semver = new u(r[2],this.options.loose) : this.semver = n
            }
            toString() {
                return this.value
            }
            test(e) {
                if (c("Comparator.test", e, this.options.loose),
                this.semver === n || e === n)
                    return !0;
                if ("string" == typeof e)
                    try {
                        e = new u(e,this.options)
                    } catch (e) {
                        return !1
                    }
                return l(e, this.operator, this.semver, this.options)
            }
            intersects(e, t) {
                if (!(e instanceof o))
                    throw new TypeError("a Comparator is required");
                return "" === this.operator ? "" === this.value || new d(e.value,t).test(this.value) : "" === e.operator ? "" === e.value || new d(this.value,t).test(e.semver) : (!(t = i(t)).includePrerelease || "<0.0.0-0" !== this.value && "<0.0.0-0" !== e.value) && (!(!t.includePrerelease && (this.value.startsWith("<0.0.0") || e.value.startsWith("<0.0.0"))) && (!(!this.operator.startsWith(">") || !e.operator.startsWith(">")) || (!(!this.operator.startsWith("<") || !e.operator.startsWith("<")) || (!(this.semver.version !== e.semver.version || !this.operator.includes("=") || !e.operator.includes("=")) || (!!(l(this.semver, "<", e.semver, t) && this.operator.startsWith(">") && e.operator.startsWith("<")) || !!(l(this.semver, ">", e.semver, t) && this.operator.startsWith("<") && e.operator.startsWith(">")))))))
            }
        }
        t.exports = o;
        const i = e("../internal/parse-options")
          , {safeRe: s, t: a} = e("../internal/re")
          , l = e("../functions/cmp")
          , c = e("../internal/debug")
          , u = e("./semver")
          , d = e("./range")
    }
    , {
        "../functions/cmp": 109,
        "../internal/debug": 134,
        "../internal/parse-options": 137,
        "../internal/re": 138,
        "./range": 106,
        "./semver": 107
    }],
    106: [function(e, t, r) {
        class n {
            constructor(e, t) {
                if (t = i(t),
                e instanceof n)
                    return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new n(e.raw,t);
                if (e instanceof s)
                    return this.raw = e.value,
                    this.set = [[e]],
                    this.format(),
                    this;
                if (this.options = t,
                this.loose = !!t.loose,
                this.includePrerelease = !!t.includePrerelease,
                this.raw = e.trim().split(/\s+/).join(" "),
                this.set = this.raw.split("||").map((e => this.parseRange(e.trim()))).filter((e => e.length)),
                !this.set.length)
                    throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
                if (this.set.length > 1) {
                    const e = this.set[0];
                    if (this.set = this.set.filter((e => !m(e[0]))),
                    0 === this.set.length)
                        this.set = [e];
                    else if (this.set.length > 1)
                        for (const e of this.set)
                            if (1 === e.length && b(e[0])) {
                                this.set = [e];
                                break
                            }
                }
                this.format()
            }
            format() {
                return this.range = this.set.map((e => e.join(" ").trim())).join("||").trim(),
                this.range
            }
            toString() {
                return this.range
            }
            parseRange(e) {
                const t = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + e
                  , r = o.get(t);
                if (r)
                    return r;
                const n = this.options.loose
                  , i = n ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
                e = e.replace(i, T(this.options.includePrerelease)),
                a("hyphen replace", e),
                e = e.replace(c[u.COMPARATORTRIM], d),
                a("comparator trim", e),
                e = e.replace(c[u.TILDETRIM], f),
                a("tilde trim", e),
                e = e.replace(c[u.CARETTRIM], h),
                a("caret trim", e);
                let l = e.split(" ").map((e => v(e, this.options))).join(" ").split(/\s+/).map((e => O(e, this.options)));
                n && (l = l.filter((e => (a("loose invalid filter", e, this.options),
                !!e.match(c[u.COMPARATORLOOSE]))))),
                a("range list", l);
                const b = new Map
                  , y = l.map((e => new s(e,this.options)));
                for (const e of y) {
                    if (m(e))
                        return [e];
                    b.set(e.value, e)
                }
                b.size > 1 && b.has("") && b.delete("");
                const w = [...b.values()];
                return o.set(t, w),
                w
            }
            intersects(e, t) {
                if (!(e instanceof n))
                    throw new TypeError("a Range is required");
                return this.set.some((r => y(r, t) && e.set.some((e => y(e, t) && r.every((r => e.every((e => r.intersects(e, t)))))))))
            }
            test(e) {
                if (!e)
                    return !1;
                if ("string" == typeof e)
                    try {
                        e = new l(e,this.options)
                    } catch (e) {
                        return !1
                    }
                for (let t = 0; t < this.set.length; t++)
                    if (I(this.set[t], e, this.options))
                        return !0;
                return !1
            }
        }
        t.exports = n;
        const o = new (e("../internal/lrucache"))
          , i = e("../internal/parse-options")
          , s = e("./comparator")
          , a = e("../internal/debug")
          , l = e("./semver")
          , {safeRe: c, t: u, comparatorTrimReplace: d, tildeTrimReplace: f, caretTrimReplace: h} = e("../internal/re")
          , {FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g} = e("../internal/constants")
          , m = e => "<0.0.0-0" === e.value
          , b = e => "" === e.value
          , y = (e, t) => {
            let r = !0;
            const n = e.slice();
            let o = n.pop();
            for (; r && n.length; )
                r = n.every((e => o.intersects(e, t))),
                o = n.pop();
            return r
        }
          , v = (e, t) => (a("comp", e, t),
        e = S(e, t),
        a("caret", e),
        e = _(e, t),
        a("tildes", e),
        e = R(e, t),
        a("xrange", e),
        e = x(e, t),
        a("stars", e),
        e)
          , w = e => !e || "x" === e.toLowerCase() || "*" === e
          , _ = (e, t) => e.trim().split(/\s+/).map((e => E(e, t))).join(" ")
          , E = (e, t) => {
            const r = t.loose ? c[u.TILDELOOSE] : c[u.TILDE];
            return e.replace(r, ( (t, r, n, o, i) => {
                let s;
                return a("tilde", e, t, r, n, o, i),
                w(r) ? s = "" : w(n) ? s = `>=${r}.0.0 <${+r + 1}.0.0-0` : w(o) ? s = `>=${r}.${n}.0 <${r}.${+n + 1}.0-0` : i ? (a("replaceTilde pr", i),
                s = `>=${r}.${n}.${o}-${i} <${r}.${+n + 1}.0-0`) : s = `>=${r}.${n}.${o} <${r}.${+n + 1}.0-0`,
                a("tilde return", s),
                s
            }
            ))
        }
          , S = (e, t) => e.trim().split(/\s+/).map((e => A(e, t))).join(" ")
          , A = (e, t) => {
            a("caret", e, t);
            const r = t.loose ? c[u.CARETLOOSE] : c[u.CARET]
              , n = t.includePrerelease ? "-0" : "";
            return e.replace(r, ( (t, r, o, i, s) => {
                let l;
                return a("caret", e, t, r, o, i, s),
                w(r) ? l = "" : w(o) ? l = `>=${r}.0.0${n} <${+r + 1}.0.0-0` : w(i) ? l = "0" === r ? `>=${r}.${o}.0${n} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.0${n} <${+r + 1}.0.0-0` : s ? (a("replaceCaret pr", s),
                l = "0" === r ? "0" === o ? `>=${r}.${o}.${i}-${s} <${r}.${o}.${+i + 1}-0` : `>=${r}.${o}.${i}-${s} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.${i}-${s} <${+r + 1}.0.0-0`) : (a("no pr"),
                l = "0" === r ? "0" === o ? `>=${r}.${o}.${i}${n} <${r}.${o}.${+i + 1}-0` : `>=${r}.${o}.${i}${n} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.${i} <${+r + 1}.0.0-0`),
                a("caret return", l),
                l
            }
            ))
        }
          , R = (e, t) => (a("replaceXRanges", e, t),
        e.split(/\s+/).map((e => M(e, t))).join(" "))
          , M = (e, t) => {
            e = e.trim();
            const r = t.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
            return e.replace(r, ( (r, n, o, i, s, l) => {
                a("xRange", e, r, n, o, i, s, l);
                const c = w(o)
                  , u = c || w(i)
                  , d = u || w(s)
                  , f = d;
                return "=" === n && f && (n = ""),
                l = t.includePrerelease ? "-0" : "",
                c ? r = ">" === n || "<" === n ? "<0.0.0-0" : "*" : n && f ? (u && (i = 0),
                s = 0,
                ">" === n ? (n = ">=",
                u ? (o = +o + 1,
                i = 0,
                s = 0) : (i = +i + 1,
                s = 0)) : "<=" === n && (n = "<",
                u ? o = +o + 1 : i = +i + 1),
                "<" === n && (l = "-0"),
                r = `${n + o}.${i}.${s}${l}`) : u ? r = `>=${o}.0.0${l} <${+o + 1}.0.0-0` : d && (r = `>=${o}.${i}.0${l} <${o}.${+i + 1}.0-0`),
                a("xRange return", r),
                r
            }
            ))
        }
          , x = (e, t) => (a("replaceStars", e, t),
        e.trim().replace(c[u.STAR], ""))
          , O = (e, t) => (a("replaceGTE0", e, t),
        e.trim().replace(c[t.includePrerelease ? u.GTE0PRE : u.GTE0], ""))
          , T = e => (t, r, n, o, i, s, a, l, c, u, d, f) => `${r = w(n) ? "" : w(o) ? `>=${n}.0.0${e ? "-0" : ""}` : w(i) ? `>=${n}.${o}.0${e ? "-0" : ""}` : s ? `>=${r}` : `>=${r}${e ? "-0" : ""}`} ${l = w(c) ? "" : w(u) ? `<${+c + 1}.0.0-0` : w(d) ? `<${c}.${+u + 1}.0-0` : f ? `<=${c}.${u}.${d}-${f}` : e ? `<${c}.${u}.${+d + 1}-0` : `<=${l}`}`.trim()
          , I = (e, t, r) => {
            for (let r = 0; r < e.length; r++)
                if (!e[r].test(t))
                    return !1;
            if (t.prerelease.length && !r.includePrerelease) {
                for (let r = 0; r < e.length; r++)
                    if (a(e[r].semver),
                    e[r].semver !== s.ANY && e[r].semver.prerelease.length > 0) {
                        const n = e[r].semver;
                        if (n.major === t.major && n.minor === t.minor && n.patch === t.patch)
                            return !0
                    }
                return !1
            }
            return !0
        }
    }
    , {
        "../internal/constants": 133,
        "../internal/debug": 134,
        "../internal/lrucache": 136,
        "../internal/parse-options": 137,
        "../internal/re": 138,
        "./comparator": 105,
        "./semver": 107
    }],
    107: [function(e, t, r) {
        const n = e("../internal/debug")
          , {MAX_LENGTH: o, MAX_SAFE_INTEGER: i} = e("../internal/constants")
          , {safeRe: s, t: a} = e("../internal/re")
          , l = e("../internal/parse-options")
          , {compareIdentifiers: c} = e("../internal/identifiers");
        class u {
            constructor(e, t) {
                if (t = l(t),
                e instanceof u) {
                    if (e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease)
                        return e;
                    e = e.version
                } else if ("string" != typeof e)
                    throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
                if (e.length > o)
                    throw new TypeError(`version is longer than ${o} characters`);
                n("SemVer", e, t),
                this.options = t,
                this.loose = !!t.loose,
                this.includePrerelease = !!t.includePrerelease;
                const r = e.trim().match(t.loose ? s[a.LOOSE] : s[a.FULL]);
                if (!r)
                    throw new TypeError(`Invalid Version: ${e}`);
                if (this.raw = e,
                this.major = +r[1],
                this.minor = +r[2],
                this.patch = +r[3],
                this.major > i || this.major < 0)
                    throw new TypeError("Invalid major version");
                if (this.minor > i || this.minor < 0)
                    throw new TypeError("Invalid minor version");
                if (this.patch > i || this.patch < 0)
                    throw new TypeError("Invalid patch version");
                r[4] ? this.prerelease = r[4].split(".").map((e => {
                    if (/^[0-9]+$/.test(e)) {
                        const t = +e;
                        if (t >= 0 && t < i)
                            return t
                    }
                    return e
                }
                )) : this.prerelease = [],
                this.build = r[5] ? r[5].split(".") : [],
                this.format()
            }
            format() {
                return this.version = `${this.major}.${this.minor}.${this.patch}`,
                this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`),
                this.version
            }
            toString() {
                return this.version
            }
            compare(e) {
                if (n("SemVer.compare", this.version, this.options, e),
                !(e instanceof u)) {
                    if ("string" == typeof e && e === this.version)
                        return 0;
                    e = new u(e,this.options)
                }
                return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e)
            }
            compareMain(e) {
                return e instanceof u || (e = new u(e,this.options)),
                c(this.major, e.major) || c(this.minor, e.minor) || c(this.patch, e.patch)
            }
            comparePre(e) {
                if (e instanceof u || (e = new u(e,this.options)),
                this.prerelease.length && !e.prerelease.length)
                    return -1;
                if (!this.prerelease.length && e.prerelease.length)
                    return 1;
                if (!this.prerelease.length && !e.prerelease.length)
                    return 0;
                let t = 0;
                do {
                    const r = this.prerelease[t]
                      , o = e.prerelease[t];
                    if (n("prerelease compare", t, r, o),
                    void 0 === r && void 0 === o)
                        return 0;
                    if (void 0 === o)
                        return 1;
                    if (void 0 === r)
                        return -1;
                    if (r !== o)
                        return c(r, o)
                } while (++t)
            }
            compareBuild(e) {
                e instanceof u || (e = new u(e,this.options));
                let t = 0;
                do {
                    const r = this.build[t]
                      , o = e.build[t];
                    if (n("build compare", t, r, o),
                    void 0 === r && void 0 === o)
                        return 0;
                    if (void 0 === o)
                        return 1;
                    if (void 0 === r)
                        return -1;
                    if (r !== o)
                        return c(r, o)
                } while (++t)
            }
            inc(e, t, r) {
                switch (e) {
                case "premajor":
                    this.prerelease.length = 0,
                    this.patch = 0,
                    this.minor = 0,
                    this.major++,
                    this.inc("pre", t, r);
                    break;
                case "preminor":
                    this.prerelease.length = 0,
                    this.patch = 0,
                    this.minor++,
                    this.inc("pre", t, r);
                    break;
                case "prepatch":
                    this.prerelease.length = 0,
                    this.inc("patch", t, r),
                    this.inc("pre", t, r);
                    break;
                case "prerelease":
                    0 === this.prerelease.length && this.inc("patch", t, r),
                    this.inc("pre", t, r);
                    break;
                case "major":
                    0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++,
                    this.minor = 0,
                    this.patch = 0,
                    this.prerelease = [];
                    break;
                case "minor":
                    0 === this.patch && 0 !== this.prerelease.length || this.minor++,
                    this.patch = 0,
                    this.prerelease = [];
                    break;
                case "patch":
                    0 === this.prerelease.length && this.patch++,
                    this.prerelease = [];
                    break;
                case "pre":
                    {
                        const e = Number(r) ? 1 : 0;
                        if (!t && !1 === r)
                            throw new Error("invalid increment argument: identifier is empty");
                        if (0 === this.prerelease.length)
                            this.prerelease = [e];
                        else {
                            let n = this.prerelease.length;
                            for (; --n >= 0; )
                                "number" == typeof this.prerelease[n] && (this.prerelease[n]++,
                                n = -2);
                            if (-1 === n) {
                                if (t === this.prerelease.join(".") && !1 === r)
                                    throw new Error("invalid increment argument: identifier already exists");
                                this.prerelease.push(e)
                            }
                        }
                        if (t) {
                            let n = [t, e];
                            !1 === r && (n = [t]),
                            0 === c(this.prerelease[0], t) ? isNaN(this.prerelease[1]) && (this.prerelease = n) : this.prerelease = n
                        }
                        break
                    }
                default:
                    throw new Error(`invalid increment argument: ${e}`)
                }
                return this.raw = this.format(),
                this.build.length && (this.raw += `+${this.build.join(".")}`),
                this
            }
        }
        t.exports = u
    }
    , {
        "../internal/constants": 133,
        "../internal/debug": 134,
        "../internal/identifiers": 135,
        "../internal/parse-options": 137,
        "../internal/re": 138
    }],
    108: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e, t) => {
            const r = n(e.trim().replace(/^[=v]+/, ""), t);
            return r ? r.version : null
        }
    }
    , {
        "./parse": 124
    }],
    109: [function(e, t, r) {
        const n = e("./eq")
          , o = e("./neq")
          , i = e("./gt")
          , s = e("./gte")
          , a = e("./lt")
          , l = e("./lte");
        t.exports = (e, t, r, c) => {
            switch (t) {
            case "===":
                return "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e === r;
            case "!==":
                return "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e !== r;
            case "":
            case "=":
            case "==":
                return n(e, r, c);
            case "!=":
                return o(e, r, c);
            case ">":
                return i(e, r, c);
            case ">=":
                return s(e, r, c);
            case "<":
                return a(e, r, c);
            case "<=":
                return l(e, r, c);
            default:
                throw new TypeError(`Invalid operator: ${t}`)
            }
        }
    }
    , {
        "./eq": 115,
        "./gt": 116,
        "./gte": 117,
        "./lt": 119,
        "./lte": 120,
        "./neq": 123
    }],
    110: [function(e, t, r) {
        const n = e("../classes/semver")
          , o = e("./parse")
          , {safeRe: i, t: s} = e("../internal/re");
        t.exports = (e, t) => {
            if (e instanceof n)
                return e;
            if ("number" == typeof e && (e = String(e)),
            "string" != typeof e)
                return null;
            let r = null;
            if ((t = t || {}).rtl) {
                const n = t.includePrerelease ? i[s.COERCERTLFULL] : i[s.COERCERTL];
                let o;
                for (; (o = n.exec(e)) && (!r || r.index + r[0].length !== e.length); )
                    r && o.index + o[0].length === r.index + r[0].length || (r = o),
                    n.lastIndex = o.index + o[1].length + o[2].length;
                n.lastIndex = -1
            } else
                r = e.match(t.includePrerelease ? i[s.COERCEFULL] : i[s.COERCE]);
            if (null === r)
                return null;
            const a = r[2]
              , l = r[3] || "0"
              , c = r[4] || "0"
              , u = t.includePrerelease && r[5] ? `-${r[5]}` : ""
              , d = t.includePrerelease && r[6] ? `+${r[6]}` : "";
            return o(`${a}.${l}.${c}${u}${d}`, t)
        }
    }
    , {
        "../classes/semver": 107,
        "../internal/re": 138,
        "./parse": 124
    }],
    111: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t, r) => {
            const o = new n(e,r)
              , i = new n(t,r);
            return o.compare(i) || o.compareBuild(i)
        }
    }
    , {
        "../classes/semver": 107
    }],
    112: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t) => n(e, t, !0)
    }
    , {
        "./compare": 113
    }],
    113: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t, r) => new n(e,r).compare(new n(t,r))
    }
    , {
        "../classes/semver": 107
    }],
    114: [function(e, t, r) {
        const n = e("./parse.js");
        t.exports = (e, t) => {
            const r = n(e, null, !0)
              , o = n(t, null, !0)
              , i = r.compare(o);
            if (0 === i)
                return null;
            const s = i > 0
              , a = s ? r : o
              , l = s ? o : r
              , c = !!a.prerelease.length;
            if (!!l.prerelease.length && !c)
                return l.patch || l.minor ? a.patch ? "patch" : a.minor ? "minor" : "major" : "major";
            const u = c ? "pre" : "";
            return r.major !== o.major ? u + "major" : r.minor !== o.minor ? u + "minor" : r.patch !== o.patch ? u + "patch" : "prerelease"
        }
    }
    , {
        "./parse.js": 124
    }],
    115: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => 0 === n(e, t, r)
    }
    , {
        "./compare": 113
    }],
    116: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => n(e, t, r) > 0
    }
    , {
        "./compare": 113
    }],
    117: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => n(e, t, r) >= 0
    }
    , {
        "./compare": 113
    }],
    118: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t, r, o, i) => {
            "string" == typeof r && (i = o,
            o = r,
            r = void 0);
            try {
                return new n(e instanceof n ? e.version : e,r).inc(t, o, i).version
            } catch (e) {
                return null
            }
        }
    }
    , {
        "../classes/semver": 107
    }],
    119: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => n(e, t, r) < 0
    }
    , {
        "./compare": 113
    }],
    120: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => n(e, t, r) <= 0
    }
    , {
        "./compare": 113
    }],
    121: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t) => new n(e,t).major
    }
    , {
        "../classes/semver": 107
    }],
    122: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t) => new n(e,t).minor
    }
    , {
        "../classes/semver": 107
    }],
    123: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => 0 !== n(e, t, r)
    }
    , {
        "./compare": 113
    }],
    124: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t, r=!1) => {
            if (e instanceof n)
                return e;
            try {
                return new n(e,t)
            } catch (e) {
                if (!r)
                    return null;
                throw e
            }
        }
    }
    , {
        "../classes/semver": 107
    }],
    125: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e, t) => new n(e,t).patch
    }
    , {
        "../classes/semver": 107
    }],
    126: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e, t) => {
            const r = n(e, t);
            return r && r.prerelease.length ? r.prerelease : null
        }
    }
    , {
        "./parse": 124
    }],
    127: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e, t, r) => n(t, e, r)
    }
    , {
        "./compare": 113
    }],
    128: [function(e, t, r) {
        const n = e("./compare-build");
        t.exports = (e, t) => e.sort(( (e, r) => n(r, e, t)))
    }
    , {
        "./compare-build": 111
    }],
    129: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e, t, r) => {
            try {
                t = new n(t,r)
            } catch (e) {
                return !1
            }
            return t.test(e)
        }
    }
    , {
        "../classes/range": 106
    }],
    130: [function(e, t, r) {
        const n = e("./compare-build");
        t.exports = (e, t) => e.sort(( (e, r) => n(e, r, t)))
    }
    , {
        "./compare-build": 111
    }],
    131: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e, t) => {
            const r = n(e, t);
            return r ? r.version : null
        }
    }
    , {
        "./parse": 124
    }],
    132: [function(e, t, r) {
        const n = e("./internal/re")
          , o = e("./internal/constants")
          , i = e("./classes/semver")
          , s = e("./internal/identifiers")
          , a = e("./functions/parse")
          , l = e("./functions/valid")
          , c = e("./functions/clean")
          , u = e("./functions/inc")
          , d = e("./functions/diff")
          , f = e("./functions/major")
          , h = e("./functions/minor")
          , p = e("./functions/patch")
          , g = e("./functions/prerelease")
          , m = e("./functions/compare")
          , b = e("./functions/rcompare")
          , y = e("./functions/compare-loose")
          , v = e("./functions/compare-build")
          , w = e("./functions/sort")
          , _ = e("./functions/rsort")
          , E = e("./functions/gt")
          , S = e("./functions/lt")
          , A = e("./functions/eq")
          , R = e("./functions/neq")
          , M = e("./functions/gte")
          , x = e("./functions/lte")
          , O = e("./functions/cmp")
          , T = e("./functions/coerce")
          , I = e("./classes/comparator")
          , k = e("./classes/range")
          , N = e("./functions/satisfies")
          , P = e("./ranges/to-comparators")
          , C = e("./ranges/max-satisfying")
          , L = e("./ranges/min-satisfying")
          , j = e("./ranges/min-version")
          , F = e("./ranges/valid")
          , B = e("./ranges/outside")
          , $ = e("./ranges/gtr")
          , D = e("./ranges/ltr")
          , U = e("./ranges/intersects")
          , W = e("./ranges/simplify")
          , V = e("./ranges/subset");
        t.exports = {
            parse: a,
            valid: l,
            clean: c,
            inc: u,
            diff: d,
            major: f,
            minor: h,
            patch: p,
            prerelease: g,
            compare: m,
            rcompare: b,
            compareLoose: y,
            compareBuild: v,
            sort: w,
            rsort: _,
            gt: E,
            lt: S,
            eq: A,
            neq: R,
            gte: M,
            lte: x,
            cmp: O,
            coerce: T,
            Comparator: I,
            Range: k,
            satisfies: N,
            toComparators: P,
            maxSatisfying: C,
            minSatisfying: L,
            minVersion: j,
            validRange: F,
            outside: B,
            gtr: $,
            ltr: D,
            intersects: U,
            simplifyRange: W,
            subset: V,
            SemVer: i,
            re: n.re,
            src: n.src,
            tokens: n.t,
            SEMVER_SPEC_VERSION: o.SEMVER_SPEC_VERSION,
            RELEASE_TYPES: o.RELEASE_TYPES,
            compareIdentifiers: s.compareIdentifiers,
            rcompareIdentifiers: s.rcompareIdentifiers
        }
    }
    , {
        "./classes/comparator": 105,
        "./classes/range": 106,
        "./classes/semver": 107,
        "./functions/clean": 108,
        "./functions/cmp": 109,
        "./functions/coerce": 110,
        "./functions/compare": 113,
        "./functions/compare-build": 111,
        "./functions/compare-loose": 112,
        "./functions/diff": 114,
        "./functions/eq": 115,
        "./functions/gt": 116,
        "./functions/gte": 117,
        "./functions/inc": 118,
        "./functions/lt": 119,
        "./functions/lte": 120,
        "./functions/major": 121,
        "./functions/minor": 122,
        "./functions/neq": 123,
        "./functions/parse": 124,
        "./functions/patch": 125,
        "./functions/prerelease": 126,
        "./functions/rcompare": 127,
        "./functions/rsort": 128,
        "./functions/satisfies": 129,
        "./functions/sort": 130,
        "./functions/valid": 131,
        "./internal/constants": 133,
        "./internal/identifiers": 135,
        "./internal/re": 138,
        "./ranges/gtr": 139,
        "./ranges/intersects": 140,
        "./ranges/ltr": 141,
        "./ranges/max-satisfying": 142,
        "./ranges/min-satisfying": 143,
        "./ranges/min-version": 144,
        "./ranges/outside": 145,
        "./ranges/simplify": 146,
        "./ranges/subset": 147,
        "./ranges/to-comparators": 148,
        "./ranges/valid": 149
    }],
    133: [function(e, t, r) {
        const n = Number.MAX_SAFE_INTEGER || 9007199254740991;
        t.exports = {
            MAX_LENGTH: 256,
            MAX_SAFE_COMPONENT_LENGTH: 16,
            MAX_SAFE_BUILD_LENGTH: 250,
            MAX_SAFE_INTEGER: n,
            RELEASE_TYPES: ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"],
            SEMVER_SPEC_VERSION: "2.0.0",
            FLAG_INCLUDE_PRERELEASE: 1,
            FLAG_LOOSE: 2
        }
    }
    , {}],
    134: [function(e, t, r) {
        (function(e) {
            (function() {
                const r = ("object" == typeof e && e.env,
                () => {}
                );
                t.exports = r
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 88
    }],
    135: [function(e, t, r) {
        const n = /^[0-9]+$/
          , o = (e, t) => {
            const r = n.test(e)
              , o = n.test(t);
            return r && o && (e = +e,
            t = +t),
            e === t ? 0 : r && !o ? -1 : o && !r ? 1 : e < t ? -1 : 1
        }
        ;
        t.exports = {
            compareIdentifiers: o,
            rcompareIdentifiers: (e, t) => o(t, e)
        }
    }
    , {}],
    136: [function(e, t, r) {
        t.exports = class {
            constructor() {
                this.max = 1e3,
                this.map = new Map
            }
            get(e) {
                const t = this.map.get(e);
                return void 0 === t ? void 0 : (this.map.delete(e),
                this.map.set(e, t),
                t)
            }
            delete(e) {
                return this.map.delete(e)
            }
            set(e, t) {
                if (!this.delete(e) && void 0 !== t) {
                    if (this.map.size >= this.max) {
                        const e = this.map.keys().next().value;
                        this.delete(e)
                    }
                    this.map.set(e, t)
                }
                return this
            }
        }
    }
    , {}],
    137: [function(e, t, r) {
        const n = Object.freeze({
            loose: !0
        })
          , o = Object.freeze({});
        t.exports = e => e ? "object" != typeof e ? n : e : o
    }
    , {}],
    138: [function(e, t, r) {
        const {MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: o, MAX_LENGTH: i} = e("./constants")
          , s = e("./debug")
          , a = (r = t.exports = {}).re = []
          , l = r.safeRe = []
          , c = r.src = []
          , u = r.t = {};
        let d = 0;
        const f = "[a-zA-Z0-9-]"
          , h = [["\\s", 1], ["\\d", i], [f, o]]
          , p = (e, t, r) => {
            const n = (e => {
                for (const [t,r] of h)
                    e = e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);
                return e
            }
            )(t)
              , o = d++;
            s(e, o, t),
            u[e] = o,
            c[o] = t,
            a[o] = new RegExp(t,r ? "g" : void 0),
            l[o] = new RegExp(n,r ? "g" : void 0)
        }
        ;
        p("NUMERICIDENTIFIER", "0|[1-9]\\d*"),
        p("NUMERICIDENTIFIERLOOSE", "\\d+"),
        p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`),
        p("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`),
        p("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`),
        p("PRERELEASEIDENTIFIER", `(?:${c[u.NUMERICIDENTIFIER]}|${c[u.NONNUMERICIDENTIFIER]})`),
        p("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NUMERICIDENTIFIERLOOSE]}|${c[u.NONNUMERICIDENTIFIER]})`),
        p("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`),
        p("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`),
        p("BUILDIDENTIFIER", `${f}+`),
        p("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`),
        p("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`),
        p("FULL", `^${c[u.FULLPLAIN]}$`),
        p("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`),
        p("LOOSE", `^${c[u.LOOSEPLAIN]}$`),
        p("GTLT", "((?:<|>)?=?)"),
        p("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),
        p("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`),
        p("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`),
        p("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`),
        p("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`),
        p("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`),
        p("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`),
        p("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`),
        p("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?` + `(?:${c[u.BUILD]})?(?:$|[^\\d])`),
        p("COERCERTL", c[u.COERCE], !0),
        p("COERCERTLFULL", c[u.COERCEFULL], !0),
        p("LONETILDE", "(?:~>?)"),
        p("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0),
        r.tildeTrimReplace = "$1~",
        p("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`),
        p("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`),
        p("LONECARET", "(?:\\^)"),
        p("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0),
        r.caretTrimReplace = "$1^",
        p("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`),
        p("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`),
        p("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`),
        p("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`),
        p("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0),
        r.comparatorTrimReplace = "$1$2$3",
        p("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`),
        p("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`),
        p("STAR", "(<|>)?=?\\s*\\*"),
        p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"),
        p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
    }
    , {
        "./constants": 133,
        "./debug": 134
    }],
    139: [function(e, t, r) {
        const n = e("./outside");
        t.exports = (e, t, r) => n(e, t, ">", r)
    }
    , {
        "./outside": 145
    }],
    140: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e, t, r) => (e = new n(e,r),
        t = new n(t,r),
        e.intersects(t, r))
    }
    , {
        "../classes/range": 106
    }],
    141: [function(e, t, r) {
        const n = e("./outside");
        t.exports = (e, t, r) => n(e, t, "<", r)
    }
    , {
        "./outside": 145
    }],
    142: [function(e, t, r) {
        const n = e("../classes/semver")
          , o = e("../classes/range");
        t.exports = (e, t, r) => {
            let i = null
              , s = null
              , a = null;
            try {
                a = new o(t,r)
            } catch (e) {
                return null
            }
            return e.forEach((e => {
                a.test(e) && (i && -1 !== s.compare(e) || (i = e,
                s = new n(i,r)))
            }
            )),
            i
        }
    }
    , {
        "../classes/range": 106,
        "../classes/semver": 107
    }],
    143: [function(e, t, r) {
        const n = e("../classes/semver")
          , o = e("../classes/range");
        t.exports = (e, t, r) => {
            let i = null
              , s = null
              , a = null;
            try {
                a = new o(t,r)
            } catch (e) {
                return null
            }
            return e.forEach((e => {
                a.test(e) && (i && 1 !== s.compare(e) || (i = e,
                s = new n(i,r)))
            }
            )),
            i
        }
    }
    , {
        "../classes/range": 106,
        "../classes/semver": 107
    }],
    144: [function(e, t, r) {
        const n = e("../classes/semver")
          , o = e("../classes/range")
          , i = e("../functions/gt");
        t.exports = (e, t) => {
            e = new o(e,t);
            let r = new n("0.0.0");
            if (e.test(r))
                return r;
            if (r = new n("0.0.0-0"),
            e.test(r))
                return r;
            r = null;
            for (let t = 0; t < e.set.length; ++t) {
                const o = e.set[t];
                let s = null;
                o.forEach((e => {
                    const t = new n(e.semver.version);
                    switch (e.operator) {
                    case ">":
                        0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0),
                        t.raw = t.format();
                    case "":
                    case ">=":
                        s && !i(t, s) || (s = t);
                        break;
                    case "<":
                    case "<=":
                        break;
                    default:
                        throw new Error(`Unexpected operation: ${e.operator}`)
                    }
                }
                )),
                !s || r && !i(r, s) || (r = s)
            }
            return r && e.test(r) ? r : null
        }
    }
    , {
        "../classes/range": 106,
        "../classes/semver": 107,
        "../functions/gt": 116
    }],
    145: [function(e, t, r) {
        const n = e("../classes/semver")
          , o = e("../classes/comparator")
          , {ANY: i} = o
          , s = e("../classes/range")
          , a = e("../functions/satisfies")
          , l = e("../functions/gt")
          , c = e("../functions/lt")
          , u = e("../functions/lte")
          , d = e("../functions/gte");
        t.exports = (e, t, r, f) => {
            let h, p, g, m, b;
            switch (e = new n(e,f),
            t = new s(t,f),
            r) {
            case ">":
                h = l,
                p = u,
                g = c,
                m = ">",
                b = ">=";
                break;
            case "<":
                h = c,
                p = d,
                g = l,
                m = "<",
                b = "<=";
                break;
            default:
                throw new TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (a(e, t, f))
                return !1;
            for (let r = 0; r < t.set.length; ++r) {
                const n = t.set[r];
                let s = null
                  , a = null;
                if (n.forEach((e => {
                    e.semver === i && (e = new o(">=0.0.0")),
                    s = s || e,
                    a = a || e,
                    h(e.semver, s.semver, f) ? s = e : g(e.semver, a.semver, f) && (a = e)
                }
                )),
                s.operator === m || s.operator === b)
                    return !1;
                if ((!a.operator || a.operator === m) && p(e, a.semver))
                    return !1;
                if (a.operator === b && g(e, a.semver))
                    return !1
            }
            return !0
        }
    }
    , {
        "../classes/comparator": 105,
        "../classes/range": 106,
        "../classes/semver": 107,
        "../functions/gt": 116,
        "../functions/gte": 117,
        "../functions/lt": 119,
        "../functions/lte": 120,
        "../functions/satisfies": 129
    }],
    146: [function(e, t, r) {
        const n = e("../functions/satisfies.js")
          , o = e("../functions/compare.js");
        t.exports = (e, t, r) => {
            const i = [];
            let s = null
              , a = null;
            const l = e.sort(( (e, t) => o(e, t, r)));
            for (const e of l) {
                n(e, t, r) ? (a = e,
                s || (s = e)) : (a && i.push([s, a]),
                a = null,
                s = null)
            }
            s && i.push([s, null]);
            const c = [];
            for (const [e,t] of i)
                e === t ? c.push(e) : t || e !== l[0] ? t ? e === l[0] ? c.push(`<=${t}`) : c.push(`${e} - ${t}`) : c.push(`>=${e}`) : c.push("*");
            const u = c.join(" || ")
              , d = "string" == typeof t.raw ? t.raw : String(t);
            return u.length < d.length ? u : t
        }
    }
    , {
        "../functions/compare.js": 113,
        "../functions/satisfies.js": 129
    }],
    147: [function(e, t, r) {
        const n = e("../classes/range.js")
          , o = e("../classes/comparator.js")
          , {ANY: i} = o
          , s = e("../functions/satisfies.js")
          , a = e("../functions/compare.js")
          , l = [new o(">=0.0.0-0")]
          , c = [new o(">=0.0.0")]
          , u = (e, t, r) => {
            if (e === t)
                return !0;
            if (1 === e.length && e[0].semver === i) {
                if (1 === t.length && t[0].semver === i)
                    return !0;
                e = r.includePrerelease ? l : c
            }
            if (1 === t.length && t[0].semver === i) {
                if (r.includePrerelease)
                    return !0;
                t = c
            }
            const n = new Set;
            let o, u, h, p, g, m, b;
            for (const t of e)
                ">" === t.operator || ">=" === t.operator ? o = d(o, t, r) : "<" === t.operator || "<=" === t.operator ? u = f(u, t, r) : n.add(t.semver);
            if (n.size > 1)
                return null;
            if (o && u) {
                if (h = a(o.semver, u.semver, r),
                h > 0)
                    return null;
                if (0 === h && (">=" !== o.operator || "<=" !== u.operator))
                    return null
            }
            for (const e of n) {
                if (o && !s(e, String(o), r))
                    return null;
                if (u && !s(e, String(u), r))
                    return null;
                for (const n of t)
                    if (!s(e, String(n), r))
                        return !1;
                return !0
            }
            let y = !(!u || r.includePrerelease || !u.semver.prerelease.length) && u.semver
              , v = !(!o || r.includePrerelease || !o.semver.prerelease.length) && o.semver;
            y && 1 === y.prerelease.length && "<" === u.operator && 0 === y.prerelease[0] && (y = !1);
            for (const e of t) {
                if (b = b || ">" === e.operator || ">=" === e.operator,
                m = m || "<" === e.operator || "<=" === e.operator,
                o)
                    if (v && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === v.major && e.semver.minor === v.minor && e.semver.patch === v.patch && (v = !1),
                    ">" === e.operator || ">=" === e.operator) {
                        if (p = d(o, e, r),
                        p === e && p !== o)
                            return !1
                    } else if (">=" === o.operator && !s(o.semver, String(e), r))
                        return !1;
                if (u)
                    if (y && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === y.major && e.semver.minor === y.minor && e.semver.patch === y.patch && (y = !1),
                    "<" === e.operator || "<=" === e.operator) {
                        if (g = f(u, e, r),
                        g === e && g !== u)
                            return !1
                    } else if ("<=" === u.operator && !s(u.semver, String(e), r))
                        return !1;
                if (!e.operator && (u || o) && 0 !== h)
                    return !1
            }
            return !(o && m && !u && 0 !== h) && (!(u && b && !o && 0 !== h) && (!v && !y))
        }
          , d = (e, t, r) => {
            if (!e)
                return t;
            const n = a(e.semver, t.semver, r);
            return n > 0 ? e : n < 0 || ">" === t.operator && ">=" === e.operator ? t : e
        }
          , f = (e, t, r) => {
            if (!e)
                return t;
            const n = a(e.semver, t.semver, r);
            return n < 0 ? e : n > 0 || "<" === t.operator && "<=" === e.operator ? t : e
        }
        ;
        t.exports = (e, t, r={}) => {
            if (e === t)
                return !0;
            e = new n(e,r),
            t = new n(t,r);
            let o = !1;
            e: for (const n of e.set) {
                for (const e of t.set) {
                    const t = u(n, e, r);
                    if (o = o || null !== t,
                    t)
                        continue e
                }
                if (o)
                    return !1
            }
            return !0
        }
    }
    , {
        "../classes/comparator.js": 105,
        "../classes/range.js": 106,
        "../functions/compare.js": 113,
        "../functions/satisfies.js": 129
    }],
    148: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e, t) => new n(e,t).set.map((e => e.map((e => e.value)).join(" ").trim().split(" ")))
    }
    , {
        "../classes/range": 106
    }],
    149: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e, t) => {
            try {
                return new n(e,t).range || "*"
            } catch (e) {
                return null
            }
        }
    }
    , {
        "../classes/range": 106
    }],
    150: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer
          , o = n.isEncoding || function(e) {
            switch ((e = "" + e) && e.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
                return !0;
            default:
                return !1
            }
        }
        ;
        function i(e) {
            var t;
            switch (this.encoding = function(e) {
                var t = function(e) {
                    if (!e)
                        return "utf8";
                    for (var t; ; )
                        switch (e) {
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return e;
                        default:
                            if (t)
                                return;
                            e = ("" + e).toLowerCase(),
                            t = !0
                        }
                }(e);
                if ("string" != typeof t && (n.isEncoding === o || !o(e)))
                    throw new Error("Unknown encoding: " + e);
                return t || e
            }(e),
            this.encoding) {
            case "utf16le":
                this.text = l,
                this.end = c,
                t = 4;
                break;
            case "utf8":
                this.fillLast = a,
                t = 4;
                break;
            case "base64":
                this.text = u,
                this.end = d,
                t = 3;
                break;
            default:
                return this.write = f,
                void (this.end = h)
            }
            this.lastNeed = 0,
            this.lastTotal = 0,
            this.lastChar = n.allocUnsafe(t)
        }
        function s(e) {
            return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2
        }
        function a(e) {
            var t = this.lastTotal - this.lastNeed
              , r = function(e, t, r) {
                if (128 != (192 & t[0]))
                    return e.lastNeed = 0,
                    "�";
                if (e.lastNeed > 1 && t.length > 1) {
                    if (128 != (192 & t[1]))
                        return e.lastNeed = 1,
                        "�";
                    if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2]))
                        return e.lastNeed = 2,
                        "�"
                }
            }(this, e);
            return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed),
            this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length),
            void (this.lastNeed -= e.length))
        }
        function l(e, t) {
            if ((e.length - t) % 2 == 0) {
                var r = e.toString("utf16le", t);
                if (r) {
                    var n = r.charCodeAt(r.length - 1);
                    if (n >= 55296 && n <= 56319)
                        return this.lastNeed = 2,
                        this.lastTotal = 4,
                        this.lastChar[0] = e[e.length - 2],
                        this.lastChar[1] = e[e.length - 1],
                        r.slice(0, -1)
                }
                return r
            }
            return this.lastNeed = 1,
            this.lastTotal = 2,
            this.lastChar[0] = e[e.length - 1],
            e.toString("utf16le", t, e.length - 1)
        }
        function c(e) {
            var t = e && e.length ? this.write(e) : "";
            if (this.lastNeed) {
                var r = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, r)
            }
            return t
        }
        function u(e, t) {
            var r = (e.length - t) % 3;
            return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r,
            this.lastTotal = 3,
            1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2],
            this.lastChar[1] = e[e.length - 1]),
            e.toString("base64", t, e.length - r))
        }
        function d(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
        }
        function f(e) {
            return e.toString(this.encoding)
        }
        function h(e) {
            return e && e.length ? this.write(e) : ""
        }
        r.StringDecoder = i,
        i.prototype.write = function(e) {
            if (0 === e.length)
                return "";
            var t, r;
            if (this.lastNeed) {
                if (void 0 === (t = this.fillLast(e)))
                    return "";
                r = this.lastNeed,
                this.lastNeed = 0
            } else
                r = 0;
            return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
        }
        ,
        i.prototype.end = function(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + "�" : t
        }
        ,
        i.prototype.text = function(e, t) {
            var r = function(e, t, r) {
                var n = t.length - 1;
                if (n < r)
                    return 0;
                var o = s(t[n]);
                if (o >= 0)
                    return o > 0 && (e.lastNeed = o - 1),
                    o;
                if (--n < r || -2 === o)
                    return 0;
                if (o = s(t[n]),
                o >= 0)
                    return o > 0 && (e.lastNeed = o - 2),
                    o;
                if (--n < r || -2 === o)
                    return 0;
                if (o = s(t[n]),
                o >= 0)
                    return o > 0 && (2 === o ? o = 0 : e.lastNeed = o - 3),
                    o;
                return 0
            }(this, e, t);
            if (!this.lastNeed)
                return e.toString("utf8", t);
            this.lastTotal = r;
            var n = e.length - (r - this.lastNeed);
            return e.copy(this.lastChar, 0, n),
            e.toString("utf8", t, n)
        }
        ,
        i.prototype.fillLast = function(e) {
            if (this.lastNeed <= e.length)
                return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
                this.lastChar.toString(this.encoding, 0, this.lastTotal);
            e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
            this.lastNeed -= e.length
        }
    }
    , {
        "safe-buffer": 104
    }],
    151: [function(e, t, r) {
        !function(e, n) {
            "object" == typeof r && void 0 !== t ? n(r) : "function" == typeof define && define.amd ? define(["exports"], n) : n((e = "undefined" != typeof globalThis ? globalThis : e || self).Superstruct = {})
        }(this, (function(e) {
            "use strict";
            class t extends TypeError {
                constructor(e, t) {
                    let r;
                    const {message: n, explanation: o, ...i} = e
                      , {path: s} = e
                      , a = 0 === s.length ? n : `At path: ${s.join(".")} -- ${n}`;
                    super(o ?? a),
                    null != o && (this.cause = a),
                    Object.assign(this, i),
                    this.name = this.constructor.name,
                    this.failures = () => r ?? (r = [e, ...t()])
                }
            }
            function r(e) {
                return "object" == typeof e && null != e
            }
            function n(e) {
                if ("[object Object]" !== Object.prototype.toString.call(e))
                    return !1;
                const t = Object.getPrototypeOf(e);
                return null === t || t === Object.prototype
            }
            function o(e) {
                return "symbol" == typeof e ? e.toString() : "string" == typeof e ? JSON.stringify(e) : `${e}`
            }
            function i(e, t, r, n) {
                if (!0 === e)
                    return;
                !1 === e ? e = {} : "string" == typeof e && (e = {
                    message: e
                });
                const {path: i, branch: s} = t
                  , {type: a} = r
                  , {refinement: l, message: c=`Expected a value of type \`${a}\`${l ? ` with refinement \`${l}\`` : ""}, but received: \`${o(n)}\``} = e;
                return {
                    value: n,
                    type: a,
                    refinement: l,
                    key: i[i.length - 1],
                    path: i,
                    branch: s,
                    ...e,
                    message: c
                }
            }
            function *s(e, t, n, o) {
                var s;
                r(s = e) && "function" == typeof s[Symbol.iterator] || (e = [e]);
                for (const r of e) {
                    const e = i(r, t, n, o);
                    e && (yield e)
                }
            }
            function *a(e, t, n={}) {
                const {path: o=[], branch: i=[e], coerce: s=!1, mask: l=!1} = n
                  , c = {
                    path: o,
                    branch: i
                };
                if (s && (e = t.coercer(e, c),
                l && "type" !== t.type && r(t.schema) && r(e) && !Array.isArray(e)))
                    for (const r in e)
                        void 0 === t.schema[r] && delete e[r];
                let u = "valid";
                for (const r of t.validator(e, c))
                    r.explanation = n.message,
                    u = "not_valid",
                    yield[r, void 0];
                for (let[d,f,h] of t.entries(e, c)) {
                    const t = a(f, h, {
                        path: void 0 === d ? o : [...o, d],
                        branch: void 0 === d ? i : [...i, f],
                        coerce: s,
                        mask: l,
                        message: n.message
                    });
                    for (const n of t)
                        n[0] ? (u = null != n[0].refinement ? "not_refined" : "not_valid",
                        yield[n[0], void 0]) : s && (f = n[1],
                        void 0 === d ? e = f : e instanceof Map ? e.set(d, f) : e instanceof Set ? e.add(f) : r(e) && (void 0 !== f || d in e) && (e[d] = f))
                }
                if ("not_valid" !== u)
                    for (const r of t.refiner(e, c))
                        r.explanation = n.message,
                        u = "not_refined",
                        yield[r, void 0];
                "valid" === u && (yield[void 0, e])
            }
            class l {
                constructor(e) {
                    const {type: t, schema: r, validator: n, refiner: o, coercer: i=(e => e), entries: a=function*() {}
                    } = e;
                    this.type = t,
                    this.schema = r,
                    this.entries = a,
                    this.coercer = i,
                    this.validator = n ? (e, t) => s(n(e, t), t, this, e) : () => [],
                    this.refiner = o ? (e, t) => s(o(e, t), t, this, e) : () => []
                }
                assert(e, t) {
                    return c(e, this, t)
                }
                create(e, t) {
                    return u(e, this, t)
                }
                is(e) {
                    return f(e, this)
                }
                mask(e, t) {
                    return d(e, this, t)
                }
                validate(e, t={}) {
                    return h(e, this, t)
                }
            }
            function c(e, t, r) {
                const n = h(e, t, {
                    message: r
                });
                if (n[0])
                    throw n[0]
            }
            function u(e, t, r) {
                const n = h(e, t, {
                    coerce: !0,
                    message: r
                });
                if (n[0])
                    throw n[0];
                return n[1]
            }
            function d(e, t, r) {
                const n = h(e, t, {
                    coerce: !0,
                    mask: !0,
                    message: r
                });
                if (n[0])
                    throw n[0];
                return n[1]
            }
            function f(e, t) {
                return !h(e, t)[0]
            }
            function h(e, r, n={}) {
                const o = a(e, r, n)
                  , i = function(e) {
                    const {done: t, value: r} = e.next();
                    return t ? void 0 : r
                }(o);
                if (i[0]) {
                    return [new t(i[0],(function*() {
                        for (const e of o)
                            e[0] && (yield e[0])
                    }
                    )), void 0]
                }
                return [void 0, i[1]]
            }
            function p(e, t) {
                return new l({
                    type: e,
                    schema: null,
                    validator: t
                })
            }
            function g() {
                return p("never", ( () => !1))
            }
            function m(e) {
                const t = e ? Object.keys(e) : []
                  , n = g();
                return new l({
                    type: "object",
                    schema: e || null,
                    *entries(o) {
                        if (e && r(o)) {
                            const r = new Set(Object.keys(o));
                            for (const n of t)
                                r.delete(n),
                                yield[n, o[n], e[n]];
                            for (const e of r)
                                yield[e, o[e], n]
                        }
                    },
                    validator: e => r(e) || `Expected an object, but received: ${o(e)}`,
                    coercer: e => r(e) ? {
                        ...e
                    } : e
                })
            }
            function b(e) {
                return new l({
                    ...e,
                    validator: (t, r) => void 0 === t || e.validator(t, r),
                    refiner: (t, r) => void 0 === t || e.refiner(t, r)
                })
            }
            function y() {
                return p("string", (e => "string" == typeof e || `Expected a string, but received: ${o(e)}`))
            }
            function v(e) {
                const t = Object.keys(e);
                return new l({
                    type: "type",
                    schema: e,
                    *entries(n) {
                        if (r(n))
                            for (const r of t)
                                yield[r, n[r], e[r]]
                    },
                    validator: e => r(e) || `Expected an object, but received: ${o(e)}`,
                    coercer: e => r(e) ? {
                        ...e
                    } : e
                })
            }
            function w() {
                return p("unknown", ( () => !0))
            }
            function _(e, t, r) {
                return new l({
                    ...e,
                    coercer: (n, o) => f(n, t) ? e.coercer(r(n, o), o) : e.coercer(n, o)
                })
            }
            function E(e) {
                return e instanceof Map || e instanceof Set ? e.size : e.length
            }
            function S(e, t, r) {
                return new l({
                    ...e,
                    *refiner(n, o) {
                        yield*e.refiner(n, o);
                        const i = s(r(n, o), o, e, n);
                        for (const e of i)
                            yield{
                                ...e,
                                refinement: t
                            }
                    }
                })
            }
            e.Struct = l,
            e.StructError = t,
            e.any = function() {
                return p("any", ( () => !0))
            }
            ,
            e.array = function(e) {
                return new l({
                    type: "array",
                    schema: e,
                    *entries(t) {
                        if (e && Array.isArray(t))
                            for (const [r,n] of t.entries())
                                yield[r, n, e]
                    },
                    coercer: e => Array.isArray(e) ? e.slice() : e,
                    validator: e => Array.isArray(e) || `Expected an array value, but received: ${o(e)}`
                })
            }
            ,
            e.assert = c,
            e.assign = function(...e) {
                const t = "type" === e[0].type
                  , r = e.map((e => e.schema))
                  , n = Object.assign({}, ...r);
                return t ? v(n) : m(n)
            }
            ,
            e.bigint = function() {
                return p("bigint", (e => "bigint" == typeof e))
            }
            ,
            e.boolean = function() {
                return p("boolean", (e => "boolean" == typeof e))
            }
            ,
            e.coerce = _,
            e.create = u,
            e.date = function() {
                return p("date", (e => e instanceof Date && !isNaN(e.getTime()) || `Expected a valid \`Date\` object, but received: ${o(e)}`))
            }
            ,
            e.defaulted = function(e, t, r={}) {
                return _(e, w(), (e => {
                    const o = "function" == typeof t ? t() : t;
                    if (void 0 === e)
                        return o;
                    if (!r.strict && n(e) && n(o)) {
                        const t = {
                            ...e
                        };
                        let r = !1;
                        for (const e in o)
                            void 0 === t[e] && (t[e] = o[e],
                            r = !0);
                        if (r)
                            return t
                    }
                    return e
                }
                ))
            }
            ,
            e.define = p,
            e.deprecated = function(e, t) {
                return new l({
                    ...e,
                    refiner: (t, r) => void 0 === t || e.refiner(t, r),
                    validator: (r, n) => void 0 === r || (t(r, n),
                    e.validator(r, n))
                })
            }
            ,
            e.dynamic = function(e) {
                return new l({
                    type: "dynamic",
                    schema: null,
                    *entries(t, r) {
                        const n = e(t, r);
                        yield*n.entries(t, r)
                    },
                    validator: (t, r) => e(t, r).validator(t, r),
                    coercer: (t, r) => e(t, r).coercer(t, r),
                    refiner: (t, r) => e(t, r).refiner(t, r)
                })
            }
            ,
            e.empty = function(e) {
                return S(e, "empty", (t => {
                    const r = E(t);
                    return 0 === r || `Expected an empty ${e.type} but received one with a size of \`${r}\``
                }
                ))
            }
            ,
            e.enums = function(e) {
                const t = {}
                  , r = e.map((e => o(e))).join();
                for (const r of e)
                    t[r] = r;
                return new l({
                    type: "enums",
                    schema: t,
                    validator: t => e.includes(t) || `Expected one of \`${r}\`, but received: ${o(t)}`
                })
            }
            ,
            e.func = function() {
                return p("func", (e => "function" == typeof e || `Expected a function, but received: ${o(e)}`))
            }
            ,
            e.instance = function(e) {
                return p("instance", (t => t instanceof e || `Expected a \`${e.name}\` instance, but received: ${o(t)}`))
            }
            ,
            e.integer = function() {
                return p("integer", (e => "number" == typeof e && !isNaN(e) && Number.isInteger(e) || `Expected an integer, but received: ${o(e)}`))
            }
            ,
            e.intersection = function(e) {
                return new l({
                    type: "intersection",
                    schema: null,
                    *entries(t, r) {
                        for (const n of e)
                            yield*n.entries(t, r)
                    },
                    *validator(t, r) {
                        for (const n of e)
                            yield*n.validator(t, r)
                    },
                    *refiner(t, r) {
                        for (const n of e)
                            yield*n.refiner(t, r)
                    }
                })
            }
            ,
            e.is = f,
            e.lazy = function(e) {
                let t;
                return new l({
                    type: "lazy",
                    schema: null,
                    *entries(r, n) {
                        t ?? (t = e()),
                        yield*t.entries(r, n)
                    },
                    validator: (r, n) => (t ?? (t = e()),
                    t.validator(r, n)),
                    coercer: (r, n) => (t ?? (t = e()),
                    t.coercer(r, n)),
                    refiner: (r, n) => (t ?? (t = e()),
                    t.refiner(r, n))
                })
            }
            ,
            e.literal = function(e) {
                const t = o(e)
                  , r = typeof e;
                return new l({
                    type: "literal",
                    schema: "string" === r || "number" === r || "boolean" === r ? e : null,
                    validator: r => r === e || `Expected the literal \`${t}\`, but received: ${o(r)}`
                })
            }
            ,
            e.map = function(e, t) {
                return new l({
                    type: "map",
                    schema: null,
                    *entries(r) {
                        if (e && t && r instanceof Map)
                            for (const [n,o] of r.entries())
                                yield[n, n, e],
                                yield[n, o, t]
                    },
                    coercer: e => e instanceof Map ? new Map(e) : e,
                    validator: e => e instanceof Map || `Expected a \`Map\` object, but received: ${o(e)}`
                })
            }
            ,
            e.mask = d,
            e.max = function(e, t, r={}) {
                const {exclusive: n} = r;
                return S(e, "max", (r => n ? r < t : r <= t || `Expected a ${e.type} less than ${n ? "" : "or equal to "}${t} but received \`${r}\``))
            }
            ,
            e.min = function(e, t, r={}) {
                const {exclusive: n} = r;
                return S(e, "min", (r => n ? r > t : r >= t || `Expected a ${e.type} greater than ${n ? "" : "or equal to "}${t} but received \`${r}\``))
            }
            ,
            e.never = g,
            e.nonempty = function(e) {
                return S(e, "nonempty", (t => E(t) > 0 || `Expected a nonempty ${e.type} but received an empty one`))
            }
            ,
            e.nullable = function(e) {
                return new l({
                    ...e,
                    validator: (t, r) => null === t || e.validator(t, r),
                    refiner: (t, r) => null === t || e.refiner(t, r)
                })
            }
            ,
            e.number = function() {
                return p("number", (e => "number" == typeof e && !isNaN(e) || `Expected a number, but received: ${o(e)}`))
            }
            ,
            e.object = m,
            e.omit = function(e, t) {
                const {schema: r} = e
                  , n = {
                    ...r
                };
                for (const e of t)
                    delete n[e];
                return "type" === e.type ? v(n) : m(n)
            }
            ,
            e.optional = b,
            e.partial = function(e) {
                const t = e instanceof l ? {
                    ...e.schema
                } : {
                    ...e
                };
                for (const e in t)
                    t[e] = b(t[e]);
                return m(t)
            }
            ,
            e.pattern = function(e, t) {
                return S(e, "pattern", (r => t.test(r) || `Expected a ${e.type} matching \`/${t.source}/\` but received "${r}"`))
            }
            ,
            e.pick = function(e, t) {
                const {schema: r} = e
                  , n = {};
                for (const e of t)
                    n[e] = r[e];
                return m(n)
            }
            ,
            e.record = function(e, t) {
                return new l({
                    type: "record",
                    schema: null,
                    *entries(n) {
                        if (r(n))
                            for (const r in n) {
                                const o = n[r];
                                yield[r, r, e],
                                yield[r, o, t]
                            }
                    },
                    validator: e => r(e) || `Expected an object, but received: ${o(e)}`
                })
            }
            ,
            e.refine = S,
            e.regexp = function() {
                return p("regexp", (e => e instanceof RegExp))
            }
            ,
            e.set = function(e) {
                return new l({
                    type: "set",
                    schema: null,
                    *entries(t) {
                        if (e && t instanceof Set)
                            for (const r of t)
                                yield[r, r, e]
                    },
                    coercer: e => e instanceof Set ? new Set(e) : e,
                    validator: e => e instanceof Set || `Expected a \`Set\` object, but received: ${o(e)}`
                })
            }
            ,
            e.size = function(e, t, r=t) {
                const n = `Expected a ${e.type}`
                  , o = t === r ? `of \`${t}\`` : `between \`${t}\` and \`${r}\``;
                return S(e, "size", (e => {
                    if ("number" == typeof e || e instanceof Date)
                        return t <= e && e <= r || `${n} ${o} but received \`${e}\``;
                    if (e instanceof Map || e instanceof Set) {
                        const {size: i} = e;
                        return t <= i && i <= r || `${n} with a size ${o} but received one with a size of \`${i}\``
                    }
                    {
                        const {length: i} = e;
                        return t <= i && i <= r || `${n} with a length ${o} but received one with a length of \`${i}\``
                    }
                }
                ))
            }
            ,
            e.string = y,
            e.struct = function(e, t) {
                return console.warn("superstruct@0.11 - The `struct` helper has been renamed to `define`."),
                p(e, t)
            }
            ,
            e.trimmed = function(e) {
                return _(e, y(), (e => e.trim()))
            }
            ,
            e.tuple = function(e) {
                const t = g();
                return new l({
                    type: "tuple",
                    schema: null,
                    *entries(r) {
                        if (Array.isArray(r)) {
                            const n = Math.max(e.length, r.length);
                            for (let o = 0; o < n; o++)
                                yield[o, r[o], e[o] || t]
                        }
                    },
                    validator: e => Array.isArray(e) || `Expected an array, but received: ${o(e)}`
                })
            }
            ,
            e.type = v,
            e.union = function(e) {
                const t = e.map((e => e.type)).join(" | ");
                return new l({
                    type: "union",
                    schema: null,
                    coercer(t) {
                        for (const r of e) {
                            const [e,n] = r.validate(t, {
                                coerce: !0
                            });
                            if (!e)
                                return n
                        }
                        return t
                    },
                    validator(r, n) {
                        const i = [];
                        for (const t of e) {
                            const [...e] = a(r, t, n)
                              , [o] = e;
                            if (!o[0])
                                return [];
                            for (const [t] of e)
                                t && i.push(t)
                        }
                        return [`Expected the value to satisfy a union of \`${t}\`, but received: ${o(r)}`, ...i]
                    }
                })
            }
            ,
            e.unknown = w,
            e.validate = h
        }
        ))
    }
    , {}],
    152: [function(e, t, r) {
        (function(e) {
            (function() {
                function r(t) {
                    try {
                        if (!e.localStorage)
                            return !1
                    } catch (e) {
                        return !1
                    }
                    var r = e.localStorage[t];
                    return null != r && "true" === String(r).toLowerCase()
                }
                t.exports = function(e, t) {
                    if (r("noDeprecation"))
                        return e;
                    var n = !1;
                    return function() {
                        if (!n) {
                            if (r("throwDeprecation"))
                                throw new Error(t);
                            r("traceDeprecation") ? console.trace(t) : console.warn(t),
                            n = !0
                        }
                        return e.apply(this, arguments)
                    }
                }
            }
            ).call(this)
        }
        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {}],
    153: [function(e, t, r) {
        !function(e, n) {
            if ("function" == typeof define && define.amd)
                define("webextension-polyfill", ["module"], n);
            else if (void 0 !== r)
                n(t);
            else {
                var o = {
                    exports: {}
                };
                n(o),
                e.browser = o.exports
            }
        }("undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : this, (function(e) {
            "use strict";
            if ("undefined" == typeof browser || Object.getPrototypeOf(browser) !== Object.prototype) {
                const t = "The message port closed before a response was received."
                  , r = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"
                  , n = e => {
                    const n = {
                        alarms: {
                            clear: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            clearAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            get: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        bookmarks: {
                            create: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getChildren: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getRecent: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getSubTree: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTree: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            move: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeTree: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        browserAction: {
                            disable: {
                                minArgs: 0,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            enable: {
                                minArgs: 0,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            getBadgeBackgroundColor: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getBadgeText: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getPopup: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTitle: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            openPopup: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            setBadgeBackgroundColor: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setBadgeText: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setIcon: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            setPopup: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setTitle: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        browsingData: {
                            remove: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            removeCache: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeCookies: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeDownloads: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeFormData: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeHistory: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeLocalStorage: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removePasswords: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removePluginData: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            settings: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        commands: {
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        contextMenus: {
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        cookies: {
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAllCookieStores: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            set: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        devtools: {
                            inspectedWindow: {
                                eval: {
                                    minArgs: 1,
                                    maxArgs: 2,
                                    singleCallbackArg: !1
                                }
                            },
                            panels: {
                                create: {
                                    minArgs: 3,
                                    maxArgs: 3,
                                    singleCallbackArg: !0
                                },
                                elements: {
                                    createSidebarPane: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                }
                            }
                        },
                        downloads: {
                            cancel: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            download: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            erase: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getFileIcon: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            open: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            pause: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeFile: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            resume: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            show: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        extension: {
                            isAllowedFileSchemeAccess: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            isAllowedIncognitoAccess: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        history: {
                            addUrl: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            deleteAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            deleteRange: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            deleteUrl: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getVisits: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        i18n: {
                            detectLanguage: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAcceptLanguages: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        identity: {
                            launchWebAuthFlow: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        idle: {
                            queryState: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        management: {
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getSelf: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            setEnabled: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            uninstallSelf: {
                                minArgs: 0,
                                maxArgs: 1
                            }
                        },
                        notifications: {
                            clear: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            create: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getPermissionLevel: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        pageAction: {
                            getPopup: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTitle: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            hide: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setIcon: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            setPopup: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setTitle: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            show: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        permissions: {
                            contains: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            request: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        runtime: {
                            getBackgroundPage: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getPlatformInfo: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            openOptionsPage: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            requestUpdateCheck: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            sendMessage: {
                                minArgs: 1,
                                maxArgs: 3
                            },
                            sendNativeMessage: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            setUninstallURL: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        sessions: {
                            getDevices: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getRecentlyClosed: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            restore: {
                                minArgs: 0,
                                maxArgs: 1
                            }
                        },
                        storage: {
                            local: {
                                clear: {
                                    minArgs: 0,
                                    maxArgs: 0
                                },
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                remove: {
                                    minArgs: 1,
                                    maxArgs: 1
                                },
                                set: {
                                    minArgs: 1,
                                    maxArgs: 1
                                }
                            },
                            managed: {
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                }
                            },
                            sync: {
                                clear: {
                                    minArgs: 0,
                                    maxArgs: 0
                                },
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                remove: {
                                    minArgs: 1,
                                    maxArgs: 1
                                },
                                set: {
                                    minArgs: 1,
                                    maxArgs: 1
                                }
                            }
                        },
                        tabs: {
                            captureVisibleTab: {
                                minArgs: 0,
                                maxArgs: 2
                            },
                            create: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            detectLanguage: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            discard: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            duplicate: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            executeScript: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getCurrent: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getZoom: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getZoomSettings: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            goBack: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            goForward: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            highlight: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            insertCSS: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            move: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            query: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            reload: {
                                minArgs: 0,
                                maxArgs: 2
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeCSS: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            sendMessage: {
                                minArgs: 2,
                                maxArgs: 3
                            },
                            setZoom: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            setZoomSettings: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            update: {
                                minArgs: 1,
                                maxArgs: 2
                            }
                        },
                        topSites: {
                            get: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        webNavigation: {
                            getAllFrames: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getFrame: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        webRequest: {
                            handlerBehaviorChanged: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        windows: {
                            create: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getCurrent: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getLastFocused: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        }
                    };
                    if (0 === Object.keys(n).length)
                        throw new Error("api-metadata.json has not been included in browser-polyfill");
                    class o extends WeakMap {
                        constructor(e, t=void 0) {
                            super(t),
                            this.createItem = e
                        }
                        get(e) {
                            return this.has(e) || this.set(e, this.createItem(e)),
                            super.get(e)
                        }
                    }
                    const i = (t, r) => (...n) => {
                        e.runtime.lastError ? t.reject(new Error(e.runtime.lastError.message)) : r.singleCallbackArg || n.length <= 1 && !1 !== r.singleCallbackArg ? t.resolve(n[0]) : t.resolve(n)
                    }
                      , s = e => 1 == e ? "argument" : "arguments"
                      , a = (e, t, r) => new Proxy(t,{
                        apply: (t, n, o) => r.call(n, e, ...o)
                    });
                    let l = Function.call.bind(Object.prototype.hasOwnProperty);
                    const c = (e, t={}, r={}) => {
                        let n = Object.create(null)
                          , o = {
                            has: (t, r) => r in e || r in n,
                            get(o, u, d) {
                                if (u in n)
                                    return n[u];
                                if (!(u in e))
                                    return;
                                let f = e[u];
                                if ("function" == typeof f)
                                    if ("function" == typeof t[u])
                                        f = a(e, e[u], t[u]);
                                    else if (l(r, u)) {
                                        let t = ( (e, t) => function(r, ...n) {
                                            if (n.length < t.minArgs)
                                                throw new Error(`Expected at least ${t.minArgs} ${s(t.minArgs)} for ${e}(), got ${n.length}`);
                                            if (n.length > t.maxArgs)
                                                throw new Error(`Expected at most ${t.maxArgs} ${s(t.maxArgs)} for ${e}(), got ${n.length}`);
                                            return new Promise(( (o, s) => {
                                                if (t.fallbackToNoCallback)
                                                    try {
                                                        r[e](...n, i({
                                                            resolve: o,
                                                            reject: s
                                                        }, t))
                                                    } catch (i) {
                                                        console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, i),
                                                        r[e](...n),
                                                        t.fallbackToNoCallback = !1,
                                                        t.noCallback = !0,
                                                        o()
                                                    }
                                                else
                                                    t.noCallback ? (r[e](...n),
                                                    o()) : r[e](...n, i({
                                                        resolve: o,
                                                        reject: s
                                                    }, t))
                                            }
                                            ))
                                        }
                                        )(u, r[u]);
                                        f = a(e, e[u], t)
                                    } else
                                        f = f.bind(e);
                                else if ("object" == typeof f && null !== f && (l(t, u) || l(r, u)))
                                    f = c(f, t[u], r[u]);
                                else {
                                    if (!l(r, "*"))
                                        return Object.defineProperty(n, u, {
                                            configurable: !0,
                                            enumerable: !0,
                                            get: () => e[u],
                                            set(t) {
                                                e[u] = t
                                            }
                                        }),
                                        f;
                                    f = c(f, t[u], r["*"])
                                }
                                return n[u] = f,
                                f
                            },
                            set: (t, r, o, i) => (r in n ? n[r] = o : e[r] = o,
                            !0),
                            defineProperty: (e, t, r) => Reflect.defineProperty(n, t, r),
                            deleteProperty: (e, t) => Reflect.deleteProperty(n, t)
                        }
                          , u = Object.create(e);
                        return new Proxy(u,o)
                    }
                      , u = e => ({
                        addListener(t, r, ...n) {
                            t.addListener(e.get(r), ...n)
                        },
                        hasListener: (t, r) => t.hasListener(e.get(r)),
                        removeListener(t, r) {
                            t.removeListener(e.get(r))
                        }
                    })
                      , d = new o((e => "function" != typeof e ? e : function(t) {
                        const r = c(t, {}, {
                            getContent: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        });
                        e(r)
                    }
                    ));
                    let f = !1;
                    const h = new o((e => "function" != typeof e ? e : function(t, n, o) {
                        let i, s, a = !1, l = new Promise((e => {
                            i = function(t) {
                                f || (console.warn(r, (new Error).stack),
                                f = !0),
                                a = !0,
                                e(t)
                            }
                        }
                        ));
                        try {
                            s = e(t, n, i)
                        } catch (e) {
                            s = Promise.reject(e)
                        }
                        const c = !0 !== s && ((u = s) && "object" == typeof u && "function" == typeof u.then);
                        var u;
                        if (!0 !== s && !c && !a)
                            return !1;
                        const d = e => {
                            e.then((e => {
                                o(e)
                            }
                            ), (e => {
                                let t;
                                t = e && (e instanceof Error || "string" == typeof e.message) ? e.message : "An unexpected error occurred",
                                o({
                                    __mozWebExtensionPolyfillReject__: !0,
                                    message: t
                                })
                            }
                            )).catch((e => {
                                console.error("Failed to send onMessage rejected reply", e)
                            }
                            ))
                        }
                        ;
                        return d(c ? s : l),
                        !0
                    }
                    ))
                      , p = ({reject: r, resolve: n}, o) => {
                        e.runtime.lastError ? e.runtime.lastError.message === t ? n() : r(new Error(e.runtime.lastError.message)) : o && o.__mozWebExtensionPolyfillReject__ ? r(new Error(o.message)) : n(o)
                    }
                      , g = (e, t, r, ...n) => {
                        if (n.length < t.minArgs)
                            throw new Error(`Expected at least ${t.minArgs} ${s(t.minArgs)} for ${e}(), got ${n.length}`);
                        if (n.length > t.maxArgs)
                            throw new Error(`Expected at most ${t.maxArgs} ${s(t.maxArgs)} for ${e}(), got ${n.length}`);
                        return new Promise(( (e, t) => {
                            const o = p.bind(null, {
                                resolve: e,
                                reject: t
                            });
                            n.push(o),
                            r.sendMessage(...n)
                        }
                        ))
                    }
                      , m = {
                        devtools: {
                            network: {
                                onRequestFinished: u(d)
                            }
                        },
                        runtime: {
                            onMessage: u(h),
                            onMessageExternal: u(h),
                            sendMessage: g.bind(null, "sendMessage", {
                                minArgs: 1,
                                maxArgs: 3
                            })
                        },
                        tabs: {
                            sendMessage: g.bind(null, "sendMessage", {
                                minArgs: 2,
                                maxArgs: 3
                            })
                        }
                    }
                      , b = {
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
                    return n.privacy = {
                        network: {
                            "*": b
                        },
                        services: {
                            "*": b
                        },
                        websites: {
                            "*": b
                        }
                    },
                    c(e, m, n)
                }
                ;
                if ("object" != typeof chrome || !chrome || !chrome.runtime || !chrome.runtime.id)
                    throw new Error("This script should only be loaded in a browser extension.");
                e.exports = n(chrome)
            } else
                e.exports = browser
        }
        ))
    }
    , {}],
    154: [function(e, t, r) {
        t.exports = function e(t, r) {
            if (t && r)
                return e(t)(r);
            if ("function" != typeof t)
                throw new TypeError("need wrapper function");
            return Object.keys(t).forEach((function(e) {
                n[e] = t[e]
            }
            )),
            n;
            function n() {
                for (var e = new Array(arguments.length), r = 0; r < e.length; r++)
                    e[r] = arguments[r];
                var n = t.apply(this, e)
                  , o = e[e.length - 1];
                return "function" == typeof n && n !== o && Object.keys(o).forEach((function(e) {
                    n[e] = o[e]
                }
                )),
                n
            }
        }
    }
    , {}],
    155: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.UNKNOWN_TICKER_SYMBOL = r.SNAP_MANAGE_ACCOUNTS_CONFIRMATION_TYPES = r.SNAP_DIALOG_TYPES = r.SMART_TRANSACTION_CONFIRMATION_TYPES = r.POLLING_TOKEN_ENVIRONMENT_TYPES = r.PLATFORM_OPERA = r.PLATFORM_FIREFOX = r.PLATFORM_EDGE = r.PLATFORM_CHROME = r.PLATFORM_BRAVE = r.ORIGIN_METAMASK = r.METAMASK_PROD_CHROME_ID = r.METAMASK_MMI_PROD_CHROME_ID = r.METAMASK_MMI_BETA_CHROME_ID = r.METAMASK_FLASK_CHROME_ID = r.METAMASK_BETA_CHROME_ID = r.MESSAGE_TYPE = r.FIREFOX_BUILD_IDS = r.EXTENSION_MESSAGES = r.ENVIRONMENT_TYPE_POPUP = r.ENVIRONMENT_TYPE_NOTIFICATION = r.ENVIRONMENT_TYPE_FULLSCREEN = r.ENVIRONMENT_TYPE_BACKGROUND = r.CHROME_BUILD_IDS = void 0;
        var n = e("@metamask/snaps-sdk")
          , o = e("./permissions");
        const i = r.ENVIRONMENT_TYPE_POPUP = "popup"
          , s = r.ENVIRONMENT_TYPE_NOTIFICATION = "notification"
          , a = r.ENVIRONMENT_TYPE_FULLSCREEN = "fullscreen"
          , l = r.ENVIRONMENT_TYPE_BACKGROUND = "background"
          , c = (r.PLATFORM_BRAVE = "Brave",
        r.PLATFORM_CHROME = "Chrome",
        r.PLATFORM_EDGE = "Edge",
        r.PLATFORM_FIREFOX = "Firefox",
        r.PLATFORM_OPERA = "Opera",
        r.MESSAGE_TYPE = {
            ADD_ETHEREUM_CHAIN: "wallet_addEthereumChain",
            ETH_ACCOUNTS: o.RestrictedMethods.eth_accounts,
            ETH_DECRYPT: "eth_decrypt",
            ETH_CHAIN_ID: "eth_chainId",
            ETH_GET_ENCRYPTION_PUBLIC_KEY: "eth_getEncryptionPublicKey",
            ETH_GET_BLOCK_BY_NUMBER: "eth_getBlockByNumber",
            ETH_REQUEST_ACCOUNTS: "eth_requestAccounts",
            ETH_SEND_TRANSACTION: "eth_sendTransaction",
            ETH_SEND_RAW_TRANSACTION: "eth_sendRawTransaction",
            ETH_SIGN: "eth_sign",
            ETH_SIGN_TRANSACTION: "eth_signTransaction",
            ETH_SIGN_TYPED_DATA: "eth_signTypedData",
            ETH_SIGN_TYPED_DATA_V1: "eth_signTypedData_v1",
            ETH_SIGN_TYPED_DATA_V3: "eth_signTypedData_v3",
            ETH_SIGN_TYPED_DATA_V4: "eth_signTypedData_v4",
            GET_PROVIDER_STATE: "metamask_getProviderState",
            LOG_WEB3_SHIM_USAGE: "metamask_logWeb3ShimUsage",
            PERSONAL_SIGN: "personal_sign",
            SEND_METADATA: "metamask_sendDomainMetadata",
            SWITCH_ETHEREUM_CHAIN: "wallet_switchEthereumChain",
            TRANSACTION: "transaction",
            WALLET_REQUEST_PERMISSIONS: "wallet_requestPermissions",
            WATCH_ASSET: "wallet_watchAsset",
            WATCH_ASSET_LEGACY: "metamask_watchAsset",
            SNAP_DIALOG_ALERT: `${o.RestrictedMethods.snap_dialog}:alert`,
            SNAP_DIALOG_CONFIRMATION: `${o.RestrictedMethods.snap_dialog}:confirmation`,
            SNAP_DIALOG_PROMPT: `${o.RestrictedMethods.snap_dialog}:prompt`
        })
          , u = (r.SNAP_DIALOG_TYPES = {
            [n.DialogType.Alert]: c.SNAP_DIALOG_ALERT,
            [n.DialogType.Confirmation]: c.SNAP_DIALOG_CONFIRMATION,
            [n.DialogType.Prompt]: c.SNAP_DIALOG_PROMPT
        },
        r.SNAP_MANAGE_ACCOUNTS_CONFIRMATION_TYPES = {
            confirmAccountCreation: "snap_manageAccounts:confirmAccountCreation",
            confirmAccountRemoval: "snap_manageAccounts:confirmAccountRemoval",
            showSnapAccountRedirect: "showSnapAccountRedirect"
        },
        r.SMART_TRANSACTION_CONFIRMATION_TYPES = {
            showSmartTransactionStatusPage: "smartTransaction:showSmartTransactionStatusPage"
        },
        r.EXTENSION_MESSAGES = {
            CONNECTION_READY: "CONNECTION_READY",
            READY: "METAMASK_EXTENSION_READY"
        },
        r.POLLING_TOKEN_ENVIRONMENT_TYPES = {
            [i]: "popupGasPollTokens",
            [s]: "notificationGasPollTokens",
            [a]: "fullScreenGasPollTokens",
            [l]: "none"
        },
        r.ORIGIN_METAMASK = "metamask",
        r.METAMASK_BETA_CHROME_ID = "pbbkamfgmaedccnfkmjcofcecjhfgldn")
          , d = r.METAMASK_PROD_CHROME_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn"
          , f = r.METAMASK_FLASK_CHROME_ID = "ljfoeinjpaedjfecbmggjgodbgkmjkjk"
          , h = r.METAMASK_MMI_BETA_CHROME_ID = "kmbhbcbadohhhgdgihejcicbgcehoaeg"
          , p = r.METAMASK_MMI_PROD_CHROME_ID = "ikkihjamdhfiojpdbnfllpjigpneipbc";
        r.CHROME_BUILD_IDS = [u, d, f, h, p],
        r.FIREFOX_BUILD_IDS = ["webextension-beta@metamask.io", "webextension@metamask.io", "webextension-flask@metamask.io"],
        r.UNKNOWN_TICKER_SYMBOL = "UNKNOWN"
    }
    , {
        "./permissions": 156,
        "@metamask/snaps-sdk": 17
    }],
    156: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = {
            CaveatTypes: !0,
            RestrictedMethods: !0,
            ConnectionPermission: !0
        };
        r.RestrictedMethods = r.ConnectionPermission = r.CaveatTypes = void 0;
        var o = e("./snaps/permissions");
        Object.keys(o).forEach((function(e) {
            "default" !== e && "__esModule" !== e && (Object.prototype.hasOwnProperty.call(n, e) || e in r && r[e] === o[e] || Object.defineProperty(r, e, {
                enumerable: !0,
                get: function() {
                    return o[e]
                }
            }))
        }
        ));
        r.CaveatTypes = Object.freeze({
            restrictReturnedAccounts: "restrictReturnedAccounts",
            restrictNetworkSwitching: "restrictNetworkSwitching"
        }),
        r.RestrictedMethods = Object.freeze({
            eth_accounts: "eth_accounts",
            snap_dialog: "snap_dialog",
            snap_notify: "snap_notify",
            snap_manageState: "snap_manageState",
            snap_getBip32PublicKey: "snap_getBip32PublicKey",
            snap_getBip32Entropy: "snap_getBip32Entropy",
            snap_getBip44Entropy: "snap_getBip44Entropy",
            snap_getEntropy: "snap_getEntropy",
            snap_getLocale: "snap_getLocale",
            wallet_snap: "wallet_snap",
            snap_manageAccounts: "snap_manageAccounts"
        }),
        r.ConnectionPermission = Object.freeze({
            connection_permission: "connection_permission"
        })
    }
    , {
        "./snaps/permissions": 157
    }],
    157: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.ExcludedSnapPermissions = r.ExcludedSnapEndowments = r.EndowmentPermissions = r.DynamicSnapPermissions = void 0;
        r.EndowmentPermissions = Object.freeze({
            "endowment:network-access": "endowment:network-access",
            "endowment:transaction-insight": "endowment:transaction-insight",
            "endowment:cronjob": "endowment:cronjob",
            "endowment:ethereum-provider": "endowment:ethereum-provider",
            "endowment:rpc": "endowment:rpc",
            "endowment:webassembly": "endowment:webassembly",
            "endowment:lifecycle-hooks": "endowment:lifecycle-hooks",
            "endowment:page-home": "endowment:page-home",
            "endowment:signature-insight": "endowment:signature-insight",
            "endowment:keyring": "endowment:keyring"
        }),
        r.ExcludedSnapPermissions = Object.freeze({
            eth_accounts: "eth_accounts is disabled. For more information please see https://github.com/MetaMask/snaps/issues/990."
        }),
        r.ExcludedSnapEndowments = Object.freeze({
            "endowment:name-lookup": "This endowment is experimental and therefore not available."
        }),
        r.DynamicSnapPermissions = Object.freeze(["eth_accounts"])
    }
    , {}],
    158: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.checkForLastError = l,
        r.checkForLastErrorAndLog = function() {
            const e = l();
            e && i.default.error(e);
            return e
        }
        ,
        r.checkForLastErrorAndWarn = function() {
            const e = l();
            e && console.warn(e);
            return e
        }
        ,
        r.getIsBrowserPrerenderBroken = function(e=n.default.getParser(window.navigator.userAgent)) {
            return (e.satisfies(s.BROKEN_PRERENDER_BROWSER_VERSIONS) && !e.satisfies(s.FIXED_PRERENDER_BROWSER_VERSIONS)) ?? !1
        }
        ;
        var n = a(e("bowser"))
          , o = a(e("webextension-polyfill"))
          , i = a(e("loglevel"))
          , s = e("../../ui/helpers/constants/common");
        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function l() {
            const {lastError: e} = o.default.runtime;
            if (e)
                return e.stack && e.message ? e : new Error(e.message)
        }
    }
    , {
        "../../ui/helpers/constants/common": 161,
        bowser: 48,
        loglevel: 83,
        "webextension-polyfill": 153
    }],
    159: [function(e, t, r) {
        (function(e) {
            (function() {
                "use strict";
                var t, n, o;
                Object.defineProperty(r, "__esModule", {
                    value: !0
                }),
                r.isOffscreenAvailable = r.isMv3ButOffscreenDocIsMissing = r.isManifestV3 = void 0;
                const i = (null === (t = e.chrome) || void 0 === t ? void 0 : t.runtime.getManifest()) || (null === (n = e.browser) || void 0 === n ? void 0 : n.runtime.getManifest())
                  , s = r.isManifestV3 = !i || 3 === i.manifest_version
                  , a = r.isOffscreenAvailable = Boolean(null === (o = e.chrome) || void 0 === o ? void 0 : o.offscreen);
                r.isMv3ButOffscreenDocIsMissing = s && !a
            }
            ).call(this)
        }
        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {}],
    160: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.default = function() {
            return function() {
                const {doctype: e} = window.document;
                if (e)
                    return "html" === e.name;
                return !0
            }() && function() {
                const e = [/\.xml$/u, /\.pdf$/u]
                  , t = window.location.pathname;
                for (let r = 0; r < e.length; r++)
                    if (e[r].test(t))
                        return !1;
                return !0
            }() && function() {
                const e = document.documentElement.nodeName;
                if (e)
                    return "html" === e.toLowerCase();
                return !0
            }() && !function() {
                const e = ["execution.consensys.io", "execution.metamask.io", "uscourts.gov", "dropbox.com", "webbyawards.com", "adyen.com", "gravityforms.com", "harbourair.com", "ani.gamer.com.tw", "blueskybooking.com", "sharefile.com", "battle.net"]
                  , t = ["cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html"]
                  , {hostname: r, pathname: n} = window.location
                  , o = e => e.endsWith("/") ? e.slice(0, -1) : e;
                return e.some((e => e === r || r.endsWith(`.${e}`))) || t.some((e => o(e) === o(r + n)))
            }()
        }
    }
    , {}],
    161: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.SUPPORT_REQUEST_LINK = r.SECONDARY = r.PRIMARY = r.PASSWORD_MIN_LENGTH = r.OUTDATED_BROWSER_VERSIONS = r.METAMETRICS_SETTINGS_LINK = r.FIXED_PRERENDER_BROWSER_VERSIONS = r.CONTRACT_ADDRESS_LINK = r.BROKEN_PRERENDER_BROWSER_VERSIONS = void 0;
        r.PRIMARY = "PRIMARY",
        r.SECONDARY = "SECONDARY",
        r.METAMETRICS_SETTINGS_LINK = "https://support.metamask.io/privacy-and-security/how-to-manage-your-metametrics-settings",
        r.SUPPORT_REQUEST_LINK = "https://metamask.zendesk.com/hc/en-us",
        r.CONTRACT_ADDRESS_LINK = "https://metamask.zendesk.com/hc/en-us/articles/360020028092-What-is-the-known-contract-address-warning-",
        r.PASSWORD_MIN_LENGTH = 8,
        r.OUTDATED_BROWSER_VERSIONS = {
            chrome: "<109",
            edge: "<109",
            firefox: "<91",
            opera: "<95"
        },
        r.BROKEN_PRERENDER_BROWSER_VERSIONS = {
            chrome: ">=113",
            edge: ">=113"
        },
        r.FIXED_PRERENDER_BROWSER_VERSIONS = {
            windows: {
                chrome: ">=120",
                edge: ">=120"
            },
            macos: {
                chrome: ">=120",
                edge: ">=120"
            },
            chrome: ">=121",
            edge: ">=121"
        }
    }
    , {}]
}, {}, [1]);
