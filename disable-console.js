!function e(n, t, r) {
    function o(u, c) {
        if (!t[u]) {
            if (!n[u]) {
                var f = "function" == typeof require && require;
                if (!c && f)
                    return f(u, !0);
                if (i)
                    return i(u, !0);
                var s = new Error("Cannot find module '" + u + "'");
                throw s.code = "MODULE_NOT_FOUND",
                s
            }
            var l = t[u] = {
                exports: {}
            };
            n[u][0].call(l.exports, (function(e) {
                return o(n[u][1][e] || e)
            }
            ), l, l.exports, e, n, t, r)
        }
        return t[u].exports
    }
    for (var i = "function" == typeof require && require, u = 0; u < r.length; u++)
        o(r[u]);
    return o
}({
    1: [function(e, n, t) {
        (function(e) {
            (function() {
                "use strict";
                function e() {}
                "undefined" != typeof console && (console.log = e,
                console.info = e,
                console.warn = e)
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 2
    }],
    2: [function(e, n, t) {
        var r, o, i = n.exports = {};
        function u() {
            throw new Error("setTimeout has not been defined")
        }
        function c() {
            throw new Error("clearTimeout has not been defined")
        }
        function f(e) {
            if (r === setTimeout)
                return setTimeout(e, 0);
            if ((r === u || !r) && setTimeout)
                return r = setTimeout,
                setTimeout(e, 0);
            try {
                return r(e, 0)
            } catch (n) {
                try {
                    return r.call(null, e, 0)
                } catch (n) {
                    return r.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                r = "function" == typeof setTimeout ? setTimeout : u
            } catch (e) {
                r = u
            }
            try {
                o = "function" == typeof clearTimeout ? clearTimeout : c
            } catch (e) {
                o = c
            }
        }();
        var s, l = [], a = !1, h = -1;
        function p() {
            a && s && (a = !1,
            s.length ? l = s.concat(l) : h = -1,
            l.length && m())
        }
        function m() {
            if (!a) {
                var e = f(p);
                a = !0;
                for (var n = l.length; n; ) {
                    for (s = l,
                    l = []; ++h < n; )
                        s && s[h].run();
                    h = -1,
                    n = l.length
                }
                s = null,
                a = !1,
                function(e) {
                    if (o === clearTimeout)
                        return clearTimeout(e);
                    if ((o === c || !o) && clearTimeout)
                        return o = clearTimeout,
                        clearTimeout(e);
                    try {
                        return o(e)
                    } catch (n) {
                        try {
                            return o.call(null, e)
                        } catch (n) {
                            return o.call(this, e)
                        }
                    }
                }(e)
            }
        }
        function d(e, n) {
            this.fun = e,
            this.array = n
        }
        function T() {}
        i.nextTick = function(e) {
            var n = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var t = 1; t < arguments.length; t++)
                    n[t - 1] = arguments[t];
            l.push(new d(e,n)),
            1 !== l.length || a || f(m)
        }
        ,
        d.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        i.title = "browser",
        i.browser = !0,
        i.env = {},
        i.argv = [],
        i.version = "",
        i.versions = {},
        i.on = T,
        i.addListener = T,
        i.once = T,
        i.off = T,
        i.removeListener = T,
        i.removeAllListeners = T,
        i.emit = T,
        i.prependListener = T,
        i.prependOnceListener = T,
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
    , {}]
}, {}, [1]);
