<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('GET');

$u = current_user($pdo);
if (!$u) {
    json_response(['ok' => false, 'error' => 'unauthorized'], 401);
}

$st = $pdo->prepare('
    SELECT c.id, c.item_id, c.user_id, c.body AS text, c.created_at AS date, c.status,
           u.first_name, u.last_name, u.avatar,
           COALESCE(r.rating, 0) AS user_item_rating
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN ratings r ON r.user_id = c.user_id AND r.item_id = c.item_id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
');
$st->execute([$u['id']]);
$out = [];

while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $stars = (int) $row['user_item_rating'];
    if ($stars < 0) $stars = 0;
    if ($stars > 10) $stars = 10;
    
    $fn = $row['first_name'] ?? '';
    $ln = $row['last_name'] ?? '';
    $handle = strtolower(preg_replace('/\s+/', '', $fn . $ln));
    
    $out[] = [
        'id' => $row['id'],
        'itemId' => $row['item_id'],
        'userId' => $row['user_id'],
        'text' => $row['text'],
        'date' => $row['date'],
        'status' => $row['status'],
        'stars' => $stars,
        'userName' => trim($fn . ' ' . $ln),
        'userHandle' => $handle,
        'userAvatar' => $row['avatar'] ?? 'fa-solid fa-user',
    ];
}
json_response(['ok' => true, 'comments' => $out]);
