/*!
 * LaraReact PJAX Navigation
 * Author: Saed
 * Version: 1.0.1
 * Safe for payments, forms, modals & UI interactions
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
     | GLOBAL CONFIG
     |------------------------------------------------------------------ */

    const CONFIG = window.PJAX_CONFIG || {};
    const EXCLUDED_ROUTES = Array.isArray(CONFIG.exclude) ? CONFIG.exclude : [];

    /* ------------------------------------------------------------------
     | CLICK INTERCEPTOR
     |------------------------------------------------------------------ */

    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        /* ---------- UI & JS SAFETY (CRITICAL) ---------- */

        // Bootstrap / UI triggers
        if (
            link.hasAttribute('data-bs-toggle') ||
            link.hasAttribute('data-toggle') ||
            link.getAttribute('role') === 'button'
        ) {
            return;
        }

        // javascript:void(0)
        if (href.startsWith('javascript:')) return;

        // Inside modal
        if (link.closest('.modal')) return;

        /* ---------- BASIC SAFETY ---------- */

        if (link.origin !== window.location.origin) return;
        if (href.startsWith('#')) return;
        if (link.target === '_blank') return;
        if (link.hasAttribute('data-no-pjax')) return;

        /* ---------- GLOBAL EXCLUDES ---------- */

        if (EXCLUDED_ROUTES.some(route => href.includes(route))) return;

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

        window.startSilentLoading?.();

        fetch(url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
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
     | BACK / FORWARD SUPPORT
     |------------------------------------------------------------------ */

    window.addEventListener('popstate', function () {
        loadPage(location.href);
    });

    /* ------------------------------------------------------------------
     | SCRIPT RE-EXECUTION (SAFE)
     |------------------------------------------------------------------ */

    function rebindScripts(container) {
        container.querySelectorAll('script').forEach(oldScript => {
            const script = document.createElement('script');

            if (oldScript.src) {
                script.src = oldScript.src;
                script.defer = true;
            } else {
                script.textContent = oldScript.textContent;
            }

            oldScript.replaceWith(script);
        });
    }

})();
