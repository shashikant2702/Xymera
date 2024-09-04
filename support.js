( () => {
    "use strict";
    const t = "Mino"
      , o = ("".concat(t, "InstantPriceContainer"),
    "".concat(t, "FeatureContainer"),
    "".concat(t, "OffersContainer"),
    "".concat(t, "StockContainer"),
    "".concat(t, "StockNotificationContainer"),
    "".concat(t, "CashbackCheckoutBtn"),
    "".concat(t, "CashbackNotificationContainer"),
    "".concat(t, "DropdownBoxContainer"),
    "".concat(t.toUpperCase(), "_EXECUTOR_SCRIPT"),
    "".concat(t.toUpperCase(), "_OVERRIDE_NATIVE_DIALOG_SCRIPT"),
    "".concat(t.toLowerCase(), "-extension-install"))
      , c = ("http://localhost:".concat({
        BABEL_ENV: "production",
        EXT_APP_ENV: "production",
        EXT_OUTPUT_FOLDER: "release",
        EXT_DEBUG_MODE: !1
    }.EXT_SERVER_PORT),
    "gomino.com")
      , n = "https://www.".concat("loveminty.net")
      , e = ("https://www.".concat("loveminty.fr"),
    "https://www.".concat("loveminty.de"),
    "https://www.".concat("loveminty.co.uk"),
    "https://www.".concat("loveminty.net"),
    "https://www.".concat(c))
      , a = ("https://ca.".concat("gomino.com"),
    "https://au.".concat("gomino.com"),
    "https://accounts.".concat(c),
    "mino.org")
      , i = ("fr.".concat(a),
    "de.".concat(a),
    "uk.".concat(a),
    "www.".concat(a),
    "ca.".concat(a),
    "au.".concat(a),
    "https://fr.".concat(a),
    "https://de.".concat(a),
    "https://uk.".concat(a),
    "https://www.".concat(a),
    "https://ca.".concat(a),
    "https://au.".concat(a),
    "".concat(n, "/tracking/detect"),
    "".concat(n, "/mino_box/images/alert/stores_logo/{domain}@2x.jpg"),
    "".concat(e, "/complete/google-oauth2/"),
    "".concat(e, "/complete/facebook/"),
    "".concat(e, "/logged-in"),
    /Edg(e)?\/\d/.test(navigator.userAgent))
      , s = i ? "https://microsoftedge.microsoft.com/addons/detail/peiccloacjolgidjioebbjbeeigcogmb" : "https://chromewebstore.google.com/detail/fefnkplkicihcoenmljhbihhaaagjhpp"
      , r = (i || "".concat(s, "/reviews"),
    "ENABLE_POPUP");
    if ("supported" === document.documentElement.getAttribute(o)) {
        document.documentElement.setAttribute(o, "installed");
        let t = "?homepage=search";
        "gewinnspiel.getminty.de" === window.location.hostname && (t = "?homepage=search&activityPage=raffle"),
        chrome.runtime.sendMessage({
            type: r,
            data: {
                badge: 0,
                params: t
            }
        })
    }
}
)();
