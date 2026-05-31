<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
$admin = require_admin($pdo);
$in = json_body();
$id = trim((string) ($in['user_id'] ?? ''));
if ($id === '') {
    json_response(['ok' => false, 'error' => 'missing_id'], 400);
}
if ($id === $admin['id']) {
    json_response(['ok' => false, 'error' => 'cannot_delete_self'], 400);
}
$pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
json_response(['ok' => true]);
