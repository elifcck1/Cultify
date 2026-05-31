<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
require_admin($pdo);
$in = json_body();
$id = trim((string) ($in['id'] ?? ''));
if ($id === '') {
    json_response(['ok' => false, 'error' => 'missing_id'], 400);
}
$pdo->prepare('DELETE FROM content_items WHERE id = ?')->execute([$id]);
json_response(['ok' => true]);
