<?php
declare(strict_types=1);

// Adds a new user comment for a content item.
// New comments are created with "pending" status and require admin approval.
require_once __DIR__ . '/_common.php';
require_method('POST');

// User must be logged in to write a comment.
$auth = require_login($pdo);
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$text = sanitize_text(trim((string) ($in['text'] ?? '')));
if ($itemId === '' || $text === '') {
    json_response(['ok' => false, 'error' => 'missing_fields'], 400);
}

// Validate target item exists before inserting comment.
$st = $pdo->prepare('SELECT id FROM content_items WHERE id = ?');
$st->execute([$itemId]);
if (!$st->fetch()) {
    json_response(['ok' => false, 'error' => 'not_found'], 404);
}

// Generate comment id and timestamp once for consistent storage/response.
$id = 'c_' . date('YmdHis') . '_' . bin2hex(random_bytes(4));
$date = date('Y-m-d H:i:s');

// Use transaction to keep write safe if future operations are added.
$pdo->beginTransaction();
try {
    $pdo->prepare('INSERT INTO comments (id,item_id,user_id,body,status,created_at) VALUES (?,?,?,?,?,?)')
        ->execute([$id, $itemId, $auth['id'], $text, 'pending', $date]);
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Cultify comment_add error: ' . $e->getMessage());
    json_response(['ok' => false, 'error' => 'db_failed'], 500);
}

// Average only considers ratings > 0 (same rule used across app).
$stAvg = $pdo->prepare('SELECT ROUND(AVG(rating), 1) FROM ratings WHERE item_id = ? AND rating > 0');
$stAvg->execute([$itemId]);
$avgRaw = $stAvg->fetchColumn();
$avgOut = ($avgRaw === null || $avgRaw === false) ? 0.0 : (float) $avgRaw;

// Read current user's rating for UI sync on detail page.
$stUserR = $pdo->prepare('SELECT rating FROM ratings WHERE user_id = ? AND item_id = ?');
$stUserR->execute([$auth['id'], $itemId]);
$userRating = (int) ($stUserR->fetchColumn() ?: 0);

json_response(['ok' => true, 'comment' => [
    'id' => $id,
    'itemId' => $itemId,
    'userId' => $auth['id'],
    'text' => $text,
    'date' => $date,
    'status' => 'pending',
], 'avg_rating' => $avgOut, 'user_rating' => $userRating]);
