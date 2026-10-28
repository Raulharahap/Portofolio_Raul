/*!
 * liquid-glass.js — Apple-style liquid glass refraction for any element.
 *
 * Usage:
 *   <script src="liquid-glass.js"></script>
 *   const glass = liquidGlass(document.querySelector('.my-card'), { scale: -112 });
 *
 * The module owns the SVG filter, displacement map, backdrop-filter wiring,
 * resize handling, and the frosted-blur fallback for browsers that can't do
 * SVG-filtered backdrops (Safari, Firefox). Visual dressing (tint, inner
 * highlight, glare, shadows) stays in your CSS.
 *
 * Technique per https://aave.com/design/building-glass-for-the-web and
 * https://github.com/deepika-builds/liquid-glass
 */
(function (global) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  let uid = 0;
  let svgDefs = null;

  // Chromium can apply SVG filters via backdrop-filter; Safari and Firefox
  // get the tuned frosted fallback instead.
  const supported = (() => {
    const ua = navigator.userAgent;
    const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Brave/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isSafari || isFirefox) return false;
    
    // Check backdrop-filter capability
    const canBackdrop = (typeof CSS !== "undefined" && CSS.supports)
      ? (CSS.supports("backdrop-filter", "url(#lg)") || 
         CSS.supports("-webkit-backdrop-filter", "url(#lg)") ||
         CSS.supports("backdrop-filter", "blur(10px)") ||
         CSS.supports("-webkit-backdrop-filter", "blur(10px)"))
      : false;
      
    if (!canBackdrop) return false;
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 4;
      c.getContext("2d").getImageData(0, 0, 1, 1);
      return true;
    } catch (_) {
      return false;
    }
  })();

  function ensureDefs() {
    if (svgDefs) return svgDefs;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";
    svg.style.opacity = "0";
    svgDefs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(svgDefs);
    document.body.appendChild(svg);
    return svgDefs;
  }

  // Displacement map, gradient-difference method: a red left->right ramp
  // encodes X displacement, a blue top->bottom ramp encodes Y ("difference"
  // keeps both since the channels are disjoint). A blurred, inset 50%-gray
  // rounded rect neutralizes the interior, confining the refraction bulge to
  // an edge band whose curvature is set by the blur radius.
  function makeMap(w, h, radius, border, mapBlur) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(w, 2);
    canvas.height = Math.max(h, 2);
    const ctx = canvas.getContext("2d");

    const gx = ctx.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, "rgb(0,0,0)");
    gx.addColorStop(1, "rgb(255,0,0)");
    ctx.fillStyle = gx;
    ctx.fillRect(0, 0, w, h);

    const gy = ctx.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, "rgb(0,0,0)");
    gy.addColorStop(1, "rgb(0,0,255)");
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = gy;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "source-over";
    const inset = Math.max(border * Math.min(w, h), 4);
    ctx.filter = "blur(" + mapBlur + "px)";
    ctx.fillStyle = "rgba(128,128,128,0.93)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(inset, inset, Math.max(w - inset * 2, 2), Math.max(h - inset * 2, 2),
                    Math.max(radius - inset, 2));
    } else {
      ctx.rect(inset, inset, Math.max(w - inset * 2, 2), Math.max(h - inset * 2, 2));
    }
    ctx.fill();
    ctx.filter = "none";
    return canvas.toDataURL();
  }

  // Three displacement passes at staggered scales (R strongest), channels
  // isolated with feColorMatrix and recombined with screen blends — the
  // faint prism fringe at the rim.
  function buildFilter(id, scales) {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "100%");
    filter.setAttribute("height", "100%");
    // Critical: filters default to linearRGB, which re-maps neutral gray 128 to ~0.216.
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const feImage = document.createElementNS(SVG_NS, "feImage");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("result", "map");
    feImage.setAttribute("preserveAspectRatio", "none");
    filter.appendChild(feImage);

    const keep = [
      "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
    ];
    const channels = [];
    for (let i = 0; i < 3; i++) {
      const disp = document.createElementNS(SVG_NS, "feDisplacementMap");
      disp.setAttribute("in", "SourceGraphic");
      disp.setAttribute("in2", "map");
      disp.setAttribute("scale", scales[i]);
      disp.setAttribute("xChannelSelector", "R");
      disp.setAttribute("yChannelSelector", "B");
      disp.setAttribute("result", "d" + i);
      filter.appendChild(disp);

      const cm = document.createElementNS(SVG_NS, "feColorMatrix");
      cm.setAttribute("in", "d" + i);
      cm.setAttribute("type", "matrix");
      cm.setAttribute("values", keep[i]);
      cm.setAttribute("result", "c" + i);
      filter.appendChild(cm);
      channels.push("c" + i);
    }

    const blend1 = document.createElementNS(SVG_NS, "feBlend");
    blend1.setAttribute("in", channels[0]);
    blend1.setAttribute("in2", channels[1]);
    blend1.setAttribute("mode", "screen");
    blend1.setAttribute("result", "c01");
    filter.appendChild(blend1);

    const blend2 = document.createElementNS(SVG_NS, "feBlend");
    blend2.setAttribute("in", "c01");
    blend2.setAttribute("in2", channels[2]);
    blend2.setAttribute("mode", "screen");
    filter.appendChild(blend2);

    ensureDefs().appendChild(filter);
    return { filter, feImage };
  }

  function resolveRadius(el, w, h, override) {
    if (override != null) return override;
    const raw = getComputedStyle(el).borderTopLeftRadius || "28px";
    const v = parseFloat(raw) || 28;
    return raw.trim().endsWith("%") ? (v / 100) * Math.min(w, h) : v;
  }

  /**
   * Apply liquid glass to an element.
   *
   * @param {Element} el
   * @param {Object} [opts]
   * @param {number} [opts.scale=-95]      Displacement strength (negative = magnifying bulge).
   * @param {number} [opts.chroma=5]       Per-channel scale stagger; 0 disables prism fringe.
   * @param {number} [opts.border=0.07]    Neutral inset fraction of the smaller side.
   * @param {number} [opts.mapBlur=10]     Edge-curvature softness of the map's gray inset.
   * @param {number} [opts.blur=4]         Backdrop blur behind the glass interior.
   * @param {number} [opts.saturate=1.5]   Backdrop saturation boost.
   * @param {number} [opts.radius]         Corner radius override (px).
   * @param {number} [opts.fallbackBlur=18] Frosted blur where refraction is unsupported.
   * @returns {{supported: boolean, refresh: Function, destroy: Function}}
   */
  function liquidGlass(el, opts) {
    if (!el) return { supported: false, refresh: function () {}, destroy: function () {} };

    const o = Object.assign(
      { scale: -95, chroma: 5, border: 0.07, mapBlur: 10,
        blur: 4, saturate: 1.5, radius: null, fallbackBlur: 18 },
      opts
    );

    if (!supported) {
      const frosted = "blur(" + o.fallbackBlur + "px) saturate(" + o.saturate + ")";
      el.style.backdropFilter = frosted;
      el.style.webkitBackdropFilter = frosted;
      el.classList.add("lg-fallback");
      return { supported: false, refresh: function () {}, destroy: function () {
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
        el.classList.remove("lg-fallback");
      } };
    }

    const id = "lg-filter-" + (++uid);
    const scales = [o.scale, o.scale + o.chroma, o.scale + 2 * o.chroma];
    const parts = buildFilter(id, scales);

    function refresh() {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const radius = resolveRadius(el, w, h, o.radius);
      const mapUri = makeMap(w, h, radius, o.border, o.mapBlur);
      parts.feImage.setAttribute("href", mapUri);
      try {
        parts.feImage.setAttributeNS(XLINK_NS, "xlink:href", mapUri);
      } catch (_) {}
      parts.feImage.setAttribute("width", w);
      parts.feImage.setAttribute("height", h);
    }

    refresh();
    const filterStyle = "url(#" + id + ") blur(" + o.blur + "px) saturate(" + o.saturate + ")";
    el.style.backdropFilter = filterStyle;
    el.style.webkitBackdropFilter = filterStyle;

    let timer = null;
    const ro = new ResizeObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(refresh, 100);
    });
    ro.observe(el);

    return {
      supported: true,
      refresh: refresh,
      destroy: function () {
        ro.disconnect();
        clearTimeout(timer);
        parts.filter.remove();
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
      },
    };
  }

  function applyLiquidGlassToAll(selector, opts) {
    const sel = selector || ".apple-glass-card";
    const els = document.querySelectorAll(sel);
    const instances = [];
    els.forEach(function (el) {
      instances.push(liquidGlass(el, opts));
    });
    return instances;
  }

  global.liquidGlass = liquidGlass;
  global.applyLiquidGlassToAll = applyLiquidGlassToAll;
})(window);
