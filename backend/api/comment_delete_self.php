<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
$auth = require_login($pdo);
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$commentId = trim((string) ($in['comment_id'] ?? ''));
if ($itemId === '' || $commentId === '') {
    json_response(['ok' => false, 'error' => 'missing_fields'], 400);
}
$st = $pdo->prepare('SELECT user_id FROM comments WHERE id = ? AND item_id = ?');
$st->execute([$commentId, $itemId]);
$row = $st->fetch(PDO::FETCH_ASSOC);
if (!$row || $row['user_id'] !== $auth['id']) {
    json_response(['ok' => false, 'error' => 'forbidden'], 403);
}
$pdo->prepare('DELETE FROM comments WHERE id = ? AND item_id = ?')->execute([$commentId, $itemId]);
json_response(['ok' => true]);
