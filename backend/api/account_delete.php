<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
$auth = require_login($pdo);
$pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$auth['id']]);
$_SESSION = [];
session_destroy();
json_response(['ok' => true]);
