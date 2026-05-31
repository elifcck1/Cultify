<?php
declare(strict_types=1);

// Admin-only list endpoint for moderation table.
// Returns all comments (pending + approved) with user identity fields.
require_once __DIR__ . '/_common.php';
require_method('GET');
require_admin($pdo);
$st = $pdo->query(
    'SELECT c.*, u.first_name, u.last_name, u.email FROM comments c JOIN users u ON u.id = c.user_id ORDER BY c.created_at DESC, c.id DESC'
);
$list = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    // Transform DB column names to frontend-friendly camelCase payload.
    $list[] = [
        'id' => $row['id'],
        'itemId' => $row['item_id'],
        'userId' => $row['user_id'],
        'text' => $row['body'],
        'date' => $row['created_at'],
        'status' => $row['status'],
        'userName' => trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')),
        'userEmail' => $row['email'],
    ];
}
json_response(['ok' => true, 'comments' => $list]);
