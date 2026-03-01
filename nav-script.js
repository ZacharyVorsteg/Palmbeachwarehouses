// Desktop dropdown toggles
document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.parentElement;
        const wasOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        if (!wasOpen) dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', !wasOpen);
    });
});
document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
});
