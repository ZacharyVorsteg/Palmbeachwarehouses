// Mobile overlay navigation for the archive and repaired secondary entry pages.
(() => {
    const button = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('mobileNav');
    let previousOverflow = '';
    function setMobileOpen(open, returnFocus = false) {
        if (open) previousOverflow = document.body.style.overflow;
        button.classList.toggle('open', open);
        button.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : previousOverflow;
        if (open) nav.querySelector('a[href]').focus({preventScroll: true});
        else if (returnFocus) button.focus({preventScroll: true});
    }
    button.addEventListener('click', () => {
        const open = !nav.classList.contains('open');
        setMobileOpen(open, !open);
    });
    nav.addEventListener('click', event => {
        if (event.target.closest('a[href]')) setMobileOpen(false);
    });
    // Match the shared stylesheet's mobile navigation breakpoint.
    window.matchMedia('(min-width: 1025px)').addEventListener('change', event => {
        if (event.matches && nav.classList.contains('open')) {
            const returnFocus = nav.contains(document.activeElement) || document.activeElement === button;
            setMobileOpen(false);
            if (returnFocus) document.querySelector('.nav-desktop a[href]').focus({preventScroll: true});
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            event.preventDefault();
            setMobileOpen(false, true);
        }
    });
})();
