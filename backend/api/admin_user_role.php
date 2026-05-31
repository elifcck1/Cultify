<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
$admin = require_admin($pdo);
$in = json_body();
$id = trim((string) ($in['user_id'] ?? ''));
$role = (string) ($in['role'] ?? '');
if ($id === '' || !in_array($role, ['user', 'admin'], true)) {
    json_response(['ok' => false, 'error' => 'invalid_body'], 400);
}
if ($id === $admin['id']) {
    json_response(['ok' => false, 'error' => 'cannot_change_self'], 400);
}
$pdo->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$role, $id]);
json_response(['ok' => true]);
