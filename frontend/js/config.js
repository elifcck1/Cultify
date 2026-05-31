/**
 * Resolves PHP API base relative to /frontend/pages/ URLs.
 * Override before this file: window.CULTIFY_API_BASE = 'https://your.host/backend/api';
 */
(function () {
    if (window.CULTIFY_API_BASE) {
        return;
    }
    var path = window.location.pathname.replace(/\\/g, '/');
    var idx = path.indexOf('/frontend/pages/');
    if (idx !== -1) {
        window.CULTIFY_API_BASE = path.substring(0, idx) + '/backend/api';
        return;
    }
    idx = path.indexOf('/frontend/');
    if (idx !== -1) {
        window.CULTIFY_API_BASE = path.substring(0, idx) + '/backend/api';
        return;
    }
    window.CULTIFY_API_BASE = '/backend/api';
})();
