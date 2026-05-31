<?php
declare(strict_types=1);

// Rating endpoint:
// - sets/updates rating between 1..10
// - rating=0 acts as "remove my rating"
// - returns updated average for immediate UI refresh
require_once __DIR__ . '/_common.php';
require_method('POST');
$u = require_login($pdo);
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$rating = (int) ($in['rating'] ?? -1);
if ($itemId === '') {
    json_response(['ok' => false, 'error' => 'missing_item'], 400);
}

// Ensure rating target exists.
$st = $pdo->prepare('SELECT id FROM content_items WHERE id = ?');
$st->execute([$itemId]);
if (!$st->fetch()) {
    json_response(['ok' => false, 'error' => 'not_found'], 404);
}

// 0 means "clear rating".
if ($rating === 0) {
    $pdo->prepare('DELETE FROM ratings WHERE user_id = ? AND item_id = ?')->execute([$u['id'], $itemId]);
} else {
    // Guard rating range to keep DB and UI scale consistent.
    if ($rating < 1 || $rating > 10) {
        json_response(['ok' => false, 'error' => 'invalid_rating'], 400);
    }
    // REPLACE = insert new or overwrite existing user/item rating.
    $pdo->prepare('REPLACE INTO ratings (user_id, item_id, rating) VALUES (?,?,?)')->execute([$u['id'], $itemId, $rating]);
}

// Average excludes unrated/removed entries by rule (rating > 0).
$st = $pdo->prepare('SELECT ROUND(AVG(rating),1) FROM ratings WHERE item_id = ? AND rating > 0');
$st->execute([$itemId]);
$avg = $st->fetchColumn();
$avgOut = ($avg === null || $avg === false) ? 0 : (float) $avg;
json_response(['ok' => true, 'avg_rating' => $avgOut == 0 ? 0 : (string) round($avgOut, 1)]);
