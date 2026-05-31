<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('GET');
$itemId = trim((string) ($_GET['item_id'] ?? ''));
if ($itemId === '') {
    json_response(['ok' => false, 'error' => 'missing_item_id'], 400);
}
$u = current_user($pdo);
$st = $pdo->prepare(
    'SELECT c.*, u.first_name AS fn, u.last_name AS ln, u.avatar AS ua
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.item_id = ?
     ORDER BY c.created_at DESC, c.id DESC'
);
$st->execute([$itemId]);
$list = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    if ($row['status'] === 'pending') {
        if (!$u || $u['id'] !== $row['user_id']) {
            continue;
        }
    }
    $handle = strtolower(preg_replace('/\s+/', '', ($row['fn'] ?? '') . ($row['ln'] ?? '')));
    $list[] = [
        'id' => $row['id'],
        'itemId' => $row['item_id'],
        'userId' => $row['user_id'],
        'text' => $row['body'],
        'date' => $row['created_at'],
        'status' => $row['status'],
        'userName' => trim(($row['fn'] ?? '') . ' ' . ($row['ln'] ?? '')),
        'userHandle' => $handle,
        'userAvatar' => $row['ua'] ?? 'fa-solid fa-user',
    ];
}
json_response(['ok' => true, 'comments' => $list]);
