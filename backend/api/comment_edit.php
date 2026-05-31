<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
$auth = require_login($pdo);
$in = json_body();
$itemId = trim((string) ($in['item_id'] ?? ''));
$commentId = trim((string) ($in['comment_id'] ?? ''));
$text = sanitize_text(trim((string) ($in['text'] ?? '')));
if ($itemId === '' || $commentId === '' || $text === '') {
    json_response(['ok' => false, 'error' => 'missing_fields'], 400);
}
$st = $pdo->prepare('SELECT * FROM comments WHERE id = ? AND item_id = ?');
$st->execute([$commentId, $itemId]);
$c = $st->fetch(PDO::FETCH_ASSOC);
if (!$c || $c['user_id'] !== $auth['id']) {
    json_response(['ok' => false, 'error' => 'forbidden'], 403);
}
$date = date('Y-m-d');
$pdo->prepare('UPDATE comments SET body = ?, status = ?, created_at = ? WHERE id = ?')
    ->execute([$text, 'pending', $date, $commentId]);
json_response(['ok' => true]);
