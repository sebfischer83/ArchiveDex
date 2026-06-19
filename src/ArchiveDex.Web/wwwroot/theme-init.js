// Runs synchronously in <head> to set data-theme before first paint.
// Prevents flash of wrong theme when user has a stored preference.
(function () {
    var t = localStorage.getItem('ad-theme');
    if (t === 'dark' || t === 'light') {
        document.documentElement.setAttribute('data-theme', t);
    }
}());
