<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('GET');
require_admin($pdo);
$st = $pdo->query('SELECT id, email, first_name, last_name, role, avatar, about_me, join_year FROM users ORDER BY created_at ASC');
$list = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $list[] = [
        'id' => $row['id'],
        'email' => $row['email'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'role' => $row['role'],
        'avatar' => $row['avatar'] ?? 'fa-solid fa-user',
        'aboutMe' => $row['about_me'] ?? '',
        'joinYear' => (int) ($row['join_year'] ?? date('Y')),
    ];
}
json_response(['ok' => true, 'users' => $list]);
