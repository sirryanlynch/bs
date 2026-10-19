/* TripUp analytics loader.
   Reads window.GA_MEASUREMENT_ID (see config.js). No measurement id: no-op.
   Do Not Track or Global Privacy Control: consent stays denied and gtag.js is not loaded.
   Otherwise analytics_storage is granted, ads stay denied, and IP anonymization is on.
   Set window.TRIPUP_GA_MANUAL_PAGEVIEW to send page views yourself.
   Set window.TRIPUP_GA_SCROLL to record case-study scroll depth. */
(function (w, d) {
  var id = String(w.GA_MEASUREMENT_ID || "").trim();
  var marks = { 25: false, 50: false, 75: false, 100: false };

  function blocked() {
    var nav = w.navigator || {};
    var dnt = nav.doNotTrack || w.doNotTrack || nav.msDoNotTrack;
    if (dnt === "1" || dnt === "yes" || dnt === 1) return true;
    if (nav.globalPrivacyControl === true) return true;
    return false;
  }

  function destination(anchor) {
    var raw = anchor.getAttribute("href") || "";
    if (!raw || raw.charAt(0) === "#") return "";
    var url;
    try { url = new URL(anchor.href, w.location.href); } catch (e) { return ""; }
    if (url.hostname === "figma.com" || url.hostname === "www.figma.com") return "figma";
    if (url.origin !== w.location.origin) return "";
    var path = url.pathname.replace(/\/+$/, "");
    if (/\/storybook$/.test(path)) return "storybook";
    if (/\/prototype$/.test(path)) return "prototype";
    return "";
  }

  w.tripupTrack = function () {};

  function bindBehaviors() {
    d.addEventListener("click", function (event) {
      var node = event.target;
      if (!node || !node.closest) return;
      var anchor = node.closest("a");
      if (!anchor) return;
      var dest = destination(anchor);
      if (!dest) return;
      w.tripupTrack("outbound_click", { destination: dest, link_url: anchor.href });
    }, true);

    if (!w.TRIPUP_GA_SCROLL) return;
    var scheduled = false;
    function measure() {
      scheduled = false;
      var el = d.documentElement;
      var height = Math.max(el.scrollHeight, d.body ? d.body.scrollHeight : 0);
      var seen = (w.scrollY || el.scrollTop || 0) + (w.innerHeight || el.clientHeight || 0);
      var pct = height <= 0 ? 100 : Math.min(100, (seen / height) * 100);
      [25, 50, 75, 100].forEach(function (mark) {
        var reached = mark === 100 ? seen >= height - 2 : pct >= mark;
        if (!marks[mark] && reached) {
          marks[mark] = true;
          w.tripupTrack("scroll_depth", { percent: mark });
        }
      });
    }
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      w.requestAnimationFrame(measure);
    }
    w.addEventListener("scroll", onScroll, { passive: true });
    if (d.readyState === "complete") measure();
    else w.addEventListener("load", measure);
  }

  bindBehaviors();

  if (!id || blocked()) return;

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = gtag;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", id, {
    anonymize_ip: true,
    send_page_view: !w.TRIPUP_GA_MANUAL_PAGEVIEW,
  });

  var script = d.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  d.head.appendChild(script);

  w.tripupTrack = function (name, params) {
    gtag("event", name, params || {});
  };
})(window, document);
