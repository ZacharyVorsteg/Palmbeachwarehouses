// Shared dropdown state for button navigation and older link-based headers.
(() => {
    const items = Array.from(document.querySelectorAll('.nav-dropdown')).map((dropdown, index) => {
        const toggle = dropdown.querySelector(':scope > .nav-dropdown-toggle, :scope > .nav-link');
        const menu = dropdown.querySelector(':scope > .nav-dropdown-menu, :scope > .nav-menu');
        if (!toggle || !menu) return null;
        if (!menu.id) menu.id = 'site-nav-menu-' + index;
        toggle.setAttribute('aria-controls', menu.id);
        if (toggle.tagName === 'A') toggle.setAttribute('role', 'button');
        dropdown.classList.add('nav-managed');
        return {dropdown, toggle, menu, legacy: toggle.classList.contains('nav-link')};
    }).filter(Boolean);

    function setOpen(item, open) {
        item.dropdown.classList.toggle('open', open);
        item.toggle.setAttribute('aria-expanded', String(open));
        item.menu.style.display = open ? 'block' : 'none';
    }
    function closeAll() { items.forEach(item => setOpen(item, false)); }
    function openOnly(item) { closeAll(); setOpen(item, true); }
    closeAll();

    items.forEach(item => {
        item.toggle.addEventListener('click', event => {
            event.preventDefault();
            if (item.legacy && event.detail > 0) { openOnly(item); return; }
            const wasOpen = item.dropdown.classList.contains('open');
            closeAll();
            if (!wasOpen) setOpen(item, true);
        });
        item.toggle.addEventListener('keydown', event => {
            if (event.key === ' ' && item.toggle.tagName === 'A') {
                event.preventDefault(); item.toggle.click();
            } else if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey && item.dropdown.classList.contains('open'))) {
                event.preventDefault(); openOnly(item);
                const first = item.menu.querySelector('a[href], button');
                if (first) first.focus();
            }
        });
        item.dropdown.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            event.preventDefault(); event.stopPropagation();
            closeAll(); item.toggle.focus();
        });
        item.dropdown.addEventListener('focusout', event => {
            if (!item.dropdown.contains(event.relatedTarget)) setOpen(item, false);
        });
        item.menu.addEventListener('click', event => {
            if (event.target.closest('a[href]')) closeAll();
        });
        // Keep the legacy pointer behavior, retaining the menu while keyboard
        // focus is inside it. Click-only button headers keep their behavior.
        if (item.legacy) {
            item.dropdown.addEventListener('mouseenter', () => openOnly(item));
            item.dropdown.addEventListener('mouseleave', () => {
                if (!item.dropdown.contains(document.activeElement)) setOpen(item, false);
            });
        }
    });
    document.addEventListener('click', event => {
        if (!items.some(item => item.dropdown.contains(event.target))) closeAll();
    });
})();
