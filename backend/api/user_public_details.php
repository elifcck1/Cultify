<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('GET');

$handle = strtolower(trim((string) ($_GET['handle'] ?? '')));
if ($handle === '') {
    json_response(['ok' => false, 'error' => 'missing_handle'], 400);
}

// 1. Fetch User Info
$st = $pdo->prepare(
    "SELECT id, first_name, last_name, role, avatar, about_me, join_year
     FROM users
     WHERE LOWER(REPLACE(CONCAT(COALESCE(first_name, ''), COALESCE(last_name, '')), ' ', '')) = ?"
);
$st->execute([$handle]);
$user = $st->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    json_response(['ok' => false, 'error' => 'not_found'], 404);
}

$userId = $user['id'];

// 2. Fetch User Ratings
$st = $pdo->prepare('SELECT item_id, rating FROM ratings WHERE user_id = ?');
$st->execute([$userId]);
$ratings = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $ratings[$row['item_id']] = (int) $row['rating'];
}

// 3. Fetch User Comments (Only Approved)
$st = $pdo->prepare('
    SELECT c.id, c.item_id, c.body AS text, c.created_at AS date
    FROM comments c
    WHERE c.user_id = ? AND c.status = ?
    ORDER BY c.created_at DESC
');
$st->execute([$userId, 'approved']);
$comments = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $comments[] = [
        'id' => $row['id'],
        'itemId' => $row['item_id'],
        'text' => $row['text'],
        'date' => $row['date']
    ];
}

json_response([
    'ok' => true,
    'user' => [
        'id' => $user['id'],
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name'],
        'role' => $user['role'],
        'avatar' => $user['avatar'],
        'aboutMe' => $user['about_me'],
        'joinYear' => $user['join_year']
    ],
    'ratings' => $ratings,
    'comments' => $comments
]);
