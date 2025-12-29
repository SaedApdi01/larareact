LaraReact PJAX Navigation

Lightweight PJAX navigation for Laravel, Blade templates, and classic HTML.
SPA-like speed without Vue, React, or build tools.

✨ Features

Fast in-app navigation (no full reloads)

Works with Laravel & Blade

Uses one container

Safe for checkout & payments

Back / forward button support

Global & per-link exclusions

Zero dependencies

🧱 Requirement

Your layout must contain one main container:

<div id="app-content">
    <!-- page content -->
</div>


Only this container is replaced during navigation.

📦 Installation

Add before </body>:

<script src="https://saedapdi01.github.io/larareact/index.js"></script>

⚙️ Excluding Pages (Recommended)

Exclude pages like checkout, payments, dashboards, etc.

<script>
    window.PJAX_CONFIG = {
        exclude: [
            'checkout',
            'payment',
        ]
    };
</script>

<script src="https://saedapdi01.github.io/larareact/index.js"></script>


If a link’s href contains any excluded keyword, PJAX is skipped.

🔗 Disable PJAX for a Single Link
<a href="/checkout" data-no-pjax>Checkout</a>

🔒 Automatically Ignored Links

External links

# anchor links

target="_blank"

data-no-pjax

Excluded routes

Safe for auth, logout, payments.

🧩 Laravel Blade Example
<div class="container-fluid" id="app-content">
    @yield('content')
</div>


Works with Laravel Blade and plain HTML.

📄 License

MIT — free to use and modify.

👤 Author

Saed Mohamed 
