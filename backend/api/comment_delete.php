<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
require_admin($pdo);
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$commentId = trim((string) ($in['comment_id'] ?? ''));
if ($itemId === '' || $commentId === '') {
    json_response(['ok' => false, 'error' => 'missing_fields'], 400);
}
$pdo->prepare('DELETE FROM comments WHERE id = ? AND item_id = ?')->execute([$commentId, $itemId]);
json_response(['ok' => true]);
