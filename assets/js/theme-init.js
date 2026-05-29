/* Resolve the color theme before first paint, to avoid a flash of the wrong
   theme. Uses the visitor's saved choice if present, else their OS preference.
   Must be loaded as a render-blocking <script src> in <head> (no defer/async).
   header.js wires the nav toggle and persists changes to localStorage. */
(function () {
    try {
        var saved = localStorage.getItem('theme');
        var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
})();
