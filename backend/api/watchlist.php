<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// Include common functions and database connection.
require_once __DIR__ . '/_common.php';

// SECURITY WALL: Only logged-in users (with a VIP Wristband/Session) can access the Watchlist page.
$u = require_login($pdo);

/*
 * ====================================================================
 * SECTION 1: FETCH WATCHLIST (GET REQUEST)
 * When the user opens the page, we retrieve the movies/series they previously added.
 * ====================================================================
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch the item IDs from the user's watchlist, ordering them from newest to oldest.
    $st = $pdo->prepare('SELECT item_id FROM watchlist WHERE user_id = ? ORDER BY created_at DESC');
    $st->execute([$u['id']]);
    
    // Fill an empty array (basket) with the incoming data.
    $ids = [];
    while ($r = $st->fetch(PDO::FETCH_ASSOC)) {
        $ids[] = $r['item_id'];
    }
    
    // Send the basket to JavaScript (Frontend) as JSON.
    json_response(['ok' => true, 'item_ids' => $ids]);
}

/*
 * ====================================================================
 * SECTION 2: ADD TO OR REMOVE FROM WATCHLIST (POST REQUEST)
 * Triggered when a user clicks "Add to List" or "Remove from List".
 * ====================================================================
 */

// Only allow POST requests (prevents manual access via URL).
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

// CSRF PROTECTION: Check the security key (Token) to prevent fake form submissions from other sites.
$csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!hash_equals($_SESSION['csrf_token'] ?? '', $csrfToken)) {
    json_response(['ok' => false, 'error' => 'csrf_invalid'], 403);
}

// Read the incoming data from JavaScript (Which item? What is the action?)
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$action = trim((string) ($in['action'] ?? '')); // 'add' or 'remove'

// Stop the process if the data is empty or invalid.
if ($itemId === '' || !in_array($action, ['add', 'remove'], true)) {
    json_response(['ok' => false, 'error' => 'invalid_body'], 400);
}

// EXECUTION TIME
if ($action === 'add') {
    // Add: Save the User ID and Item ID to the database.
    // We use INSERT IGNORE so it won't crash if the user tries to add an item that is already in their list.
    $pdo->prepare('INSERT IGNORE INTO watchlist (user_id, item_id) VALUES (?, ?)')->execute([$u['id'], $itemId]);
} else {
    // Remove: Delete this specific pairing from the database.
    $pdo->prepare('DELETE FROM watchlist WHERE user_id = ? AND item_id = ?')->execute([$u['id'], $itemId]);
}

// After the operation, fetch the user's UPDATED watchlist.
$st = $pdo->prepare('SELECT item_id FROM watchlist WHERE user_id = ? ORDER BY created_at DESC');
$st->execute([$u['id']]);

$ids = [];
while ($r = $st->fetch(PDO::FETCH_ASSOC)) {
    $ids[] = $r['item_id'];
}

// Send the updated list back to JavaScript for an instant UI update.
json_response(['ok' => true, 'item_ids' => $ids]);
