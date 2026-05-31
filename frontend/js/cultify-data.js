/**
 * Server-backed state (PHP session + MySQL). Replaces former testData.js mocks.
 */
(function (global) {
    'use strict';

    // XSS PROTECTION (The Filter): 
    // Encodes special characters before writing user input to the screen.
    // This ensures tags like <script> or <h1> are displayed as harmless plain text and not executed as code.
    global.escapeHtml = function (str) {
        if (str === null || str === undefined) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    };

    global.contentDB = global.contentDB || {};
    global.__sessionUser = null;
    global.__watchlistIds = [];
    global.__myRatings = {};
    global.__commentsCache = {};
    global.__communityReviews = [];
    global.__myComments = [];

    function setSessionUser(u) {
        // Keep in-memory session synchronized with lightweight localStorage mirror.
        // localStorage is used only for UI convenience, not for authorization.
        global.__sessionUser = u || null;
        if (u) {
            global.localStorage.setItem('cultify_logged_in', 'true');
            global.localStorage.setItem('cultify_user_name', u.firstName + ' ' + u.lastName);
            global.localStorage.setItem('cultify_user_role', u.role);
            global.localStorage.setItem('cultify_user_avatar', u.avatar);
            global.localStorage.setItem('cultify_user_id', u.id);
        } else {
            global.localStorage.removeItem('cultify_logged_in');
            global.localStorage.removeItem('cultify_user_name');
            global.localStorage.removeItem('cultify_user_role');
            global.localStorage.removeItem('cultify_user_avatar');
            global.localStorage.removeItem('cultify_user_id');
        }
    }

    async function refreshMyWatchlist() {
        // Pull current user's watchlist from API and cache it for instant UI usage.
        var r = await cultifyFetch('watchlist.php', { method: 'GET' });
        if (r.res.status === 401) {
            global.__watchlistIds = [];
            return;
        }
        if (!r.data.ok) {
            throw new Error(r.data.error || 'watchlist');
        }
        global.__watchlistIds = r.data.item_ids || [];
    }

    async function refreshMyRatings() {
        // Pull current user's ratings map once, then use cached reads in UI.
        var r = await cultifyFetch('rating_my.php', { method: 'GET' });
        if (r.res.status === 401) {
            global.__myRatings = {};
            return;
        }
        if (!r.data.ok) {
            throw new Error(r.data.error || 'ratings');
        }
        global.__myRatings = r.data.ratings || {};
    }

    async function refreshMyComments() {
        var r = await cultifyFetch('comments_my.php', { method: 'GET' });
        if (r.res.status === 401) {
            global.__myComments = [];
            return;
        }
        if (r.data.ok) {
            global.__myComments = r.data.comments || [];
        } else {
            global.__myComments = [];
        }
    }

    global.cultifyInit = async function () {
        // App bootstrap order:
        // 1) load content catalogue
        // 2) load session user
        // 3) if logged in, hydrate watchlist+ratings caches
        var ir = await cultifyFetch('items.php', { method: 'GET' });
        if (!ir.data.ok) {
            throw new Error(ir.data.error || 'items');
        }
        global.contentDB = ir.data.items || {};

        var mr = await cultifyFetch('me.php', { method: 'GET' });
        if (!mr.data.ok) {
            throw new Error(mr.data.error || 'me');
        }
        global.__sessionUser = mr.data.user || null;
        if (global.__sessionUser) {
            setSessionUser(global.__sessionUser);
            await refreshMyWatchlist();
            await refreshMyRatings();
            await refreshMyComments();
        } else {
            setSessionUser(null);
            global.__watchlistIds = [];
            global.__myRatings = {};
            global.__myComments = [];
        }
    };



    global.cultifyLoadCommunityReviews = async function () {
        var r = await cultifyFetch('community_reviews.php', { method: 'GET' });
        if (r.data.ok) {
            global.__communityReviews = r.data.reviews || [];
        } else {
            global.__communityReviews = [];
        }
    };

    global.cultifyEnsureComments = async function (itemId) {
        var r = await cultifyFetch('comments_item.php?item_id=' + encodeURIComponent(itemId), { method: 'GET' });
        if (!r.data.ok) {
            global.__commentsCache[itemId] = [];
            return;
        }
        global.__commentsCache[itemId] = r.data.comments || [];
    };

    global.getCurrentUserId = function () {
        return global.__sessionUser && global.__sessionUser.id ? global.__sessionUser.id : null;
    };

    global.getCurrentUser = function () {
        return global.__sessionUser;
    };

    global.isLoggedIn = function () {
        return !!(global.__sessionUser && global.__sessionUser.id);
    };

    global.getContentDB = function () {
        return global.contentDB;
    };

    global.getUserList = function (userId) {
        if (userId === global.getCurrentUserId()) {
            return global.__watchlistIds.slice();
        }
        return [];
    };

    global.getUserRatings = function (userId) {
        if (userId === global.getCurrentUserId()) {
            return Object.assign({}, global.__myRatings);
        }
        return {};
    };

    global.getRating = function (userId, itemId) {
        if (userId === global.getCurrentUserId()) {
            return global.__myRatings[itemId] || 0;
        }
        return 0;
    };

    global.getItemAverageRating = function (itemId) {
        var it = global.contentDB[itemId];
        if (!it) {
            return 0;
        }
        var a = it.avg_rating;
        if (a === undefined || a === null || a === '' || a === 0) {
            return 0;
        }
        return typeof a === 'string' ? parseFloat(a) : a;
    };

    global.getCommentsForItem = function (itemId) {
        return global.__commentsCache[itemId] ? global.__commentsCache[itemId].slice() : [];
    };

    global.getCommunityReviews = function () {
        return global.__communityReviews.slice();
    };

    global.getMyComments = function () {
        return global.__myComments.slice();
    };

    global.getUserByHandle = async function (handle) {
        var r = await cultifyFetch('user_by_handle.php?handle=' + encodeURIComponent(handle || ''), { method: 'GET' });
        if (r.res.status === 404 || !r.data.ok) {
            return null;
        }
        return r.data.user;
    };

    global.getPublicProfileDetails = async function (handle) {
        var r = await cultifyFetch('user_public_details.php?handle=' + encodeURIComponent(handle || ''), { method: 'GET' });
        if (!r.data.ok) {
            return null;
        }
        return r.data;
    };



    global.loginWithApi = async function (email, password) {
        // Sends credentials and, on success, hydrates user-specific caches.
        var r = await cultifyFetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
        });
        if (!r.data.ok) {
            return null;
        }
        global.__sessionUser = r.data.user;
        setSessionUser(global.__sessionUser);
        await refreshMyWatchlist();
        await refreshMyRatings();
        return r.data.user;
    };

    global.logoutWithApi = async function () {
        await cultifyFetch('logout.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        global.__sessionUser = null;
        setSessionUser(null);
        global.__watchlistIds = [];
        global.__myRatings = {};
    };

    global.registerWithApi = async function (userData) {
        // Creates account and mirrors backend validation errors to user-friendly messages.
        var r = await cultifyFetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                avatar: userData.avatar || 'fa-solid fa-user',
            }),
        });
        if (!r.data.ok) {
            var err = r.data.error || 'unknown';
            if (err === 'email_taken') {
                return { success: false, message: 'This email is already registered.' };
            }
            if (err === 'email_must_end_with_com') {
                return { success: false, message: 'Email address must end with .com.' };
            }
            if (err === 'password_too_short') {
                return { success: false, message: 'Password must be at least 6 characters.' };
            }
            if (err === 'password_too_long') {
                return { success: false, message: 'Password must be at most 30 characters.' };
            }
            if (err === 'first_name_too_long') {
                return { success: false, message: 'Max first name length: 15 characters' };
            }
            if (err === 'last_name_too_long') {
                return { success: false, message: 'Max last name length: 15 characters' };
            }
            if (err === 'email_too_long') {
                return { success: false, message: 'Max email length: 63 characters' };
            }
            return { success: false, message: 'Registration failed.' };
        }
        global.__sessionUser = r.data.user;
        setSessionUser(global.__sessionUser);
        await refreshMyWatchlist();
        await refreshMyRatings();
        return { success: true, user: r.data.user };
    };

    global.addToUserList = async function (userId, itemId) {
        if (userId !== global.getCurrentUserId()) {
            return;
        }
        var r = await cultifyFetch('watchlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, action: 'add' }),
        });
        if (r.data.ok) {
            global.__watchlistIds = r.data.item_ids || [];
            global.dispatchEvent(new CustomEvent('cultify:watchlist-changed', { detail: { itemIds: global.__watchlistIds.slice() } }));
        }
    };

    global.removeFromUserList = async function (userId, itemId) {
        if (userId !== global.getCurrentUserId()) {
            return;
        }
        var r = await cultifyFetch('watchlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, action: 'remove' }),
        });
        if (r.data.ok) {
            global.__watchlistIds = r.data.item_ids || [];
            global.dispatchEvent(new CustomEvent('cultify:watchlist-changed', { detail: { itemIds: global.__watchlistIds.slice() } }));
        }
    };

    global.setRating = async function (userId, itemId, rating) {
        if (userId !== global.getCurrentUserId()) {
            return;
        }
        // Persist rating server-side, then update local cache and broadcast UI event.
        var r = await cultifyFetch('rating_set.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, rating: rating }),
        });
        if (r.data.ok) {
            if (rating === 0) {
                delete global.__myRatings[itemId];
            } else {
                global.__myRatings[itemId] = rating;
            }
            var avg = r.data.avg_rating;
            if (global.contentDB[itemId]) {
                global.contentDB[itemId].avg_rating = avg;
            }
            var avgNum = typeof avg === 'number' ? avg : parseFloat(String(avg != null ? avg : '0').replace(',', '.')) || 0;
            global.dispatchEvent(new CustomEvent('cultify:item-rating-changed', {
                detail: { itemId: itemId, avg_rating: avgNum },
            }));
            return avg;
        }
        return null;
    };

    global.addComment = async function (itemId, userId, text) {
        try {
            // Comment creation is server-authoritative; frontend only sends item + text.
            var r = await cultifyFetch('comment_add.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: itemId, text: text }),
            });
            if (r.data.ok) {
                var avgRaw = r.data.avg_rating;
                if (global.contentDB[itemId] && avgRaw !== undefined && avgRaw !== null) {
                    global.contentDB[itemId].avg_rating = typeof avgRaw === 'number' ? avgRaw : parseFloat(avgRaw);
                }
                if (r.data.user_rating !== undefined && r.data.user_rating !== null) {
                    // Sync star widget if backend returns a rating for this item/user pair.
                    global.__myRatings[itemId] = r.data.user_rating;
                }
                // Refresh comment list so pending/approved states reflect latest data.
                await global.cultifyEnsureComments(itemId);
                await refreshMyComments();
                var avgNum = typeof r.data.avg_rating === 'number' ? r.data.avg_rating : parseFloat(String(r.data.avg_rating != null ? r.data.avg_rating : '0').replace(',', '.')) || 0;
                global.dispatchEvent(new CustomEvent('cultify:item-rating-changed', {
                    detail: { itemId: itemId, avg_rating: avgNum },
                }));
                return Object.assign({ ok: true }, r.data);
            }
            return {
                ok: false,
                error: r.data.error || 'unknown',
                detail: r.data.detail || '',
                status: r.res ? r.res.status : 0,
            };
        } catch (e) {
            // Return structured error so UI can show compact or debug-friendly messages.
            return {
                ok: false,
                error: 'request_failed',
                detail: e && e.message ? e.message : 'Request failed',
                status: 0,
            };
        }
    };

    global.editComment = async function (itemId, commentId, newText) {
        await cultifyFetch('comment_edit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, comment_id: commentId, text: newText }),
        });
        await global.cultifyEnsureComments(itemId);
        await refreshMyComments();
    };

    global.deleteCommentSelf = async function (itemId, commentId) {
        await cultifyFetch('comment_delete_self.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, comment_id: commentId }),
        });
        await global.cultifyEnsureComments(itemId);
        await refreshMyComments();
    };

    global.updateUserProfile = async function (userId, updates) {
        if (userId !== global.getCurrentUserId()) {
            return { ok: false, error: 'forbidden' };
        }
        var r = await cultifyFetch('profile_update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (r.data.ok) {
            global.__sessionUser = r.data.user;
            setSessionUser(global.__sessionUser);
            return { ok: true };
        }
        return { ok: false, error: r.data.error || 'unknown' };
    };

    global.deleteOwnAccountWithApi = async function () {
        await cultifyFetch('account_delete.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        global.__sessionUser = null;
        setSessionUser(null);
        global.__watchlistIds = [];
        global.__myRatings = {};
    };

})(window);
