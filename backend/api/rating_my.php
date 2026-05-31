<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('GET');
$auth = require_login($pdo);
$st = $pdo->prepare('SELECT item_id, rating FROM ratings WHERE user_id = ?');
$st->execute([$auth['id']]);
$ratings = [];
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $ratings[$row['item_id']] = (int) $row['rating'];
}
json_response(['ok' => true, 'ratings' => $ratings]);
