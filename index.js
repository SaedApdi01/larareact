 document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            // 1️⃣ External links → normal browser behavior
            if (link.origin !== window.location.origin) return;

            // 2️⃣ Empty or anchor links (#) → normal behavior
            if (!href || href.startsWith('#')) return;

            // 3️⃣ Open in new tab → normal behavior
            if (link.target === '_blank') return;

            // 4️⃣ Logout → normal behavior
            if (href.includes('logout')) return;

            // 5️⃣ 🚨 CHECKOUT & PAYMENTS (DO NOT USE PJAX HERE)
            if (
                href.includes('checkout') ||
                // href.includes('cart') ||
                href.includes('payment') ||
                href.includes('paypal') ||
                href.includes('stripe') ||
                href.includes('sifalo') ||
                href.includes('dodo') ||
                href.includes('watch-course') ||
                href.includes('moon')
            ) {
                return; // let browser reload page
            }

            // 6️⃣ Optional: manual opt-out
            if (link.dataset.noPjax === 'true') return;

            // Otherwise → load page inside app
            e.preventDefault();
            loadPage(link.href);
        });

        /*
        |--------------------------------------------------------------------------
        | LOAD PAGE WITHOUT FULL REFRESH
        |--------------------------------------------------------------------------
        */
        function loadPage(url) {
            const content = document.getElementById('app-content');
            if (!content) return;

            // Show silent top loader (if exists)
            if (typeof startSilentLoading === 'function') {
                startSilentLoading();
            }

            fetch(url, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(res => res.text())
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const newContent = doc.getElementById('app-content');

                    if (!newContent) {
                        stopSilentLoading?.();
                        return;
                    }

                    content.innerHTML = newContent.innerHTML;
                    document.title = doc.title;
                    history.pushState({}, '', url);

                    stopSilentLoading?.();
                })
                .catch(() => {
                    stopSilentLoading?.();
                    location.reload(); // fallback
                });
        }

        /*
        |--------------------------------------------------------------------------
        | HANDLE BACK / FORWARD BUTTONS
        |--------------------------------------------------------------------------
        */
        window.addEventListener('popstate', function() {
            loadPage(location.href);
        });
