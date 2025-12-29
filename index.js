/*!
 * LaraReact PJAX Navigation
 * Author: Saed
 * Version: 1.0.0
 * Safe for payments & forms
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
     | GLOBAL CONFIG (FROM HOST APP)
     |------------------------------------------------------------------ */

    const DEFAULT_EXCLUDES = [
       //
    ];

    const CONFIG = window.PJAX_CONFIG || {};

    const EXCLUDED_ROUTES = [
        ...DEFAULT_EXCLUDES,
        ...(Array.isArray(CONFIG.exclude) ? CONFIG.exclude : [])
    ];

    /* ------------------------------------------------------------------
     | CLICK INTERCEPTOR
     |------------------------------------------------------------------ */

    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        /* ---------- BASIC SAFETY ---------- */

        // External link
        if (link.origin !== window.location.origin) return;

        // Anchor or empty
        if (href.startsWith('#')) return;

        // New tab
        if (link.target === '_blank') return;

        // Manual opt-out
        if (link.hasAttribute('data-no-pjax')) return;

        /* ---------- GLOBAL EXCLUDES ---------- */

        if (EXCLUDED_ROUTES.some(route => href.includes(route))) {
            return;
        }

        /* ---------- PJAX LOAD ---------- */

        e.preventDefault();
        loadPage(link.href);
    });

    /* ------------------------------------------------------------------
     | LOAD PAGE VIA FETCH
     |------------------------------------------------------------------ */

    function loadPage(url) {
        const container = document.getElementById('app-content');
        if (!container) return location.href = url;

        if (typeof window.startSilentLoading === 'function') {
            window.startSilentLoading();
        }

        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        })
            .then(res => res.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const newContent = doc.getElementById('app-content');

                if (!newContent) {
                    location.href = url;
                    return;
                }

                container.innerHTML = newContent.innerHTML;
                document.title = doc.title;
                history.pushState({}, '', url);

                rebindScripts(container);

                window.stopSilentLoading?.();
            })
            .catch(() => {
                window.stopSilentLoading?.();
                location.href = url;
            });
    }

    /* ------------------------------------------------------------------
     | BACK / FORWARD BUTTON SUPPORT
     |------------------------------------------------------------------ */

    window.addEventListener('popstate', function () {
        loadPage(location.href);
    });

    /* ------------------------------------------------------------------
     | RE-EXECUTE INLINE SCRIPTS
     |------------------------------------------------------------------ */

    function rebindScripts(container) {
        const scripts = container.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const script = document.createElement('script');

            if (oldScript.src) {
                script.src = oldScript.src;
                script.async = false;
            } else {
                script.textContent = oldScript.textContent;
            }

            oldScript.replaceWith(script);
        });
    }

})();
