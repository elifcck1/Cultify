(function (global) {
    'use strict';

    /*
     * ====================================================================
     * URL BUILDER (The Map)
     * Helps us build the correct API address. It ensures we don't accidentally
     * get double slashes like '/backend/api//login.php'.
     * ====================================================================
     */
    function joinBase(file) {
        var b = (global.CULTIFY_API_BASE || '/backend/api').replace(/\/+$/, '');
        return b + '/' + file.replace(/^\/+/, '');
    }

    /*
     * ====================================================================
     * THE MASTER MESSENGER (cultifyFetch)
     * This is our custom fetch function. EVERY single request from the 
     * frontend to the backend goes through this messenger.
     * ====================================================================
     * @param {string} file e.g. 'me.php'
     * @param {RequestInit} options e.g. { method: 'POST', body: ... }
     */
    global.cultifyFetch = async function (file, options) {
        var url = joinBase(file);
        
        // Merge default settings with whatever the developer asked for.
        // We strictly enforce 'same-origin' to protect our cookies/sessions.
        var init = Object.assign(
            {
                credentials: 'same-origin',
                headers: {},
            },
            options || {}
        );

        // CSRF PROTECTION (The Secret Handshake):
        // If this is a POST request (we are sending/changing data), we MUST 
        // automatically attach our secret CSRF token to prove we are legitimate.
        if (init.method && init.method.toUpperCase() === 'POST' && global.__csrfToken) {
            init.headers['X-CSRF-Token'] = global.__csrfToken;
        }

        // Send the request and wait for the response.
        var res = await fetch(url, init);
        var text = await res.text();
        var data = null;
        
        // Try to decode the package (JSON). If the backend crashed and sent HTML errors, 
        // this will safely catch it instead of crashing the browser.
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            throw new Error('Invalid JSON from ' + file + ': ' + text.slice(0, 200));
        }

        // AUTO-SAVE NEW TOKENS:
        // If the backend sent us a fresh security token, save it immediately 
        // so our next POST request has the correct handshake.
        if (data && data.csrfToken) {
            global.__csrfToken = data.csrfToken;
        }

        // CRITICAL DATABASE FAILURE:
        // If the backend couldn't reach the database, loudly complain so the developer knows.
        if (!res.ok && data && data.error === 'database_connection_failed') {
            throw new Error(data.detail || 'Database connection failed');
        }
        
        // Return both the raw response (for status codes) and the readable data.
        return { res: res, data: data };
    };
})(window);
