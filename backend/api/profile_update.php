<?php
declare(strict_types=1);

/*
 * Optional future column (not used by this app — UI uses first/last name for display):
 * ALTER TABLE users ADD COLUMN username VARCHAR(64) NULL UNIQUE AFTER last_name;
 */

require_once __DIR__ . '/_common.php';
require_method('POST');
$auth = require_login($pdo);
$in = json_body();

$fields = [];
$params = [];

if (array_key_exists('firstName', $in)) {
    $first = sanitize_text(trim((string) $in['firstName']));
    if ($first === '') {
        json_response(['ok' => false, 'error' => 'First name cannot be empty'], 400);
    }
    if (mb_strlen($first, 'UTF-8') > 15) {
        json_response(['ok' => false, 'error' => 'Max first name length: 15 characters'], 400);
    }
    $fields[] = 'first_name = ?';
    $params[] = $first;
}
if (array_key_exists('lastName', $in)) {
    $last = sanitize_text(trim((string) $in['lastName']));
    if ($last === '') {
        json_response(['ok' => false, 'error' => 'Last name cannot be empty'], 400);
    }
    if (mb_strlen($last, 'UTF-8') > 15) {
        json_response(['ok' => false, 'error' => 'Max last name length: 15 characters'], 400);
    }
    $fields[] = 'last_name = ?';
    $params[] = $last;
}
if (array_key_exists('aboutMe', $in)) {
    $about = sanitize_text(trim((string) $in['aboutMe']));
    if (mb_strlen($about, 'UTF-8') > 255) {
        json_response(['ok' => false, 'error' => 'Max about me length: 255 characters'], 400);
    }
    $fields[] = 'about_me = ?';
    $params[] = $about;
}
if (array_key_exists('email', $in)) {
    $email = trim((string) $in['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(['ok' => false, 'error' => 'invalid_email'], 400);
    }
    if (mb_strlen($email, 'UTF-8') > 63) {
        json_response(['ok' => false, 'error' => 'Max email length: 63 characters'], 400);
    }
    $currentEmail = (string) ($auth['email'] ?? '');
    if ($email !== $currentEmail) {
        $stCheck = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stCheck->execute([$email, $auth['id']]);
        if ($stCheck->fetch()) {
            json_response(['ok' => false, 'error' => 'email_taken'], 409);
        }
        $fields[] = 'email = ?';
        $params[] = $email;
    }
}
$avatar = isset($in['avatar']) ? trim((string) $in['avatar']) : null;
if ($avatar !== null && $avatar !== '') {
    $fields[] = 'avatar = ?';
    $params[] = $avatar;
}

if (empty($fields)) {
    json_response(['ok' => false, 'error' => 'no_updates'], 400);
}

$params[] = $auth['id'];
$sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
$pdo->prepare($sql)->execute($params);

$st = $pdo->prepare('SELECT id, email, first_name, last_name, role, avatar, about_me, join_year FROM users WHERE id = ?');
$st->execute([$auth['id']]);
$u = $st->fetch(PDO::FETCH_ASSOC);
json_response(['ok' => true, 'user' => user_for_json($u)]);
