/*
    script.js
    Fade text in from its parent's background color to its normal color over 3 seconds.

    Usage:
        - Add class "fade-from-bg" to any element whose text should fade in.
        - Optionally set data-duration-ms on the element to override the 3000ms default.
*/

(function () {
    const DEFAULT_DURATION = 3000;

    function getEffectiveBackgroundColor(el) {
        while (el && el !== document.documentElement) {
            const bg = getComputedStyle(el).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
            el = el.parentElement;
        }
        // fallback
        return getComputedStyle(document.documentElement).backgroundColor || 'white';
    }

    function fadeFromBackground(el, duration = DEFAULT_DURATION) {
        // remember the final (computed) text color
        const finalColor = getComputedStyle(el).color;
        const bgColor = getEffectiveBackgroundColor(el.parentElement || el);

        // prepare element for transition
        el.style.transition = `color ${duration}ms ease`;
        el.style.webkitTransition = `color ${duration}ms ease`;

        // start with background color (so text is invisible/blended)
        el.style.color = bgColor;

        // force reflow then set to final color to trigger transition
        // using requestAnimationFrame to ensure the initial color is applied
        requestAnimationFrame(() => {
            // small timeout ensures transition occurs even when added very early
            setTimeout(() => {
                el.style.color = finalColor;
            }, 10);
        });
    }

    function init() {
        const nodes = document.querySelectorAll('.fade-from-bg');
        nodes.forEach(node => {
            const durAttr = parseInt(node.getAttribute('data-duration-ms'), 10);
            const duration = Number.isFinite(durAttr) ? durAttr : DEFAULT_DURATION;
            fadeFromBackground(node, duration);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();