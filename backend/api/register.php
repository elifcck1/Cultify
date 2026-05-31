<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

/*
 * ====================================================================
 * REGISTRATION ENDPOINT (The Front Desk)
 * This file handles new users signing up. It checks their info,
 * makes sure they meet our rules, securely hides their password,
 * and finally creates their account in our database.
 * ====================================================================
 */

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Only accept POST requests.
require_method('POST');

// Read the JSON data sent from the frontend registration form.
$in = json_body();

// Extract the user's input, cleaning up any accidental spaces (trim) 
// and neutralizing harmful HTML tags (sanitize_text).
$first = sanitize_text(trim((string) ($in['firstName'] ?? '')));
$last = sanitize_text(trim((string) ($in['lastName'] ?? '')));
$email = trim((string) ($in['email'] ?? ''));
$pass = (string) ($in['password'] ?? '');
$avatar = trim((string) ($in['avatar'] ?? 'fa-solid fa-user'));

// RULE 1: No empty fields allowed.
if ($first === '' || $last === '' || $email === '' || $pass === '') {
    json_response(['ok' => false, 'error' => 'missing_fields'], 400);
}

// RULE 2: Length limits (so our database doesn't overflow).
if (mb_strlen($first, 'UTF-8') > 15) {
    json_response(['ok' => false, 'error' => 'first_name_too_long'], 400);
}
if (mb_strlen($last, 'UTF-8') > 15) {
    json_response(['ok' => false, 'error' => 'last_name_too_long'], 400);
}
if (mb_strlen($email, 'UTF-8') > 63) {
    json_response(['ok' => false, 'error' => 'email_too_long'], 400);
}

// RULE 3: Email Format Check. Does it actually look like an email? (e.g., has an @ sign)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'invalid_email'], 400);
}

// RULE 4: Specific Project Policy. Only ".com" emails are allowed to register.
if (!preg_match('/^[^@\s]+@[^@\s]+\.com$/i', $email)) {
    json_response(['ok' => false, 'error' => 'email_must_end_with_com'], 400);
}

// RULE 5: Password Policy. Too short is easily hacked, too long might break things.
if (strlen($pass) < 6) {
    json_response(['ok' => false, 'error' => 'password_too_short'], 400);
}
if (strlen($pass) > 30) {
    json_response(['ok' => false, 'error' => 'password_too_long'], 400);
}

// RULE 6: Uniqueness. Has someone already registered with this exact email?
$st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$st->execute([$email]);
if ($st->fetch()) {
    // 409 Conflict: This email is already taken.
    json_response(['ok' => false, 'error' => 'email_taken'], 409);
}

/*
 * ====================================================================
 * ALL CHECKS PASSED: CREATE THE ACCOUNT
 * ====================================================================
 */

// Generate a random, unique ID for the user (e.g., "user_a1b2c3d4").
$id = 'user_' . bin2hex(random_bytes(8));

// Save everything into the database.
$pdo->prepare('INSERT INTO users (id,email,password_hash,first_name,last_name,role,avatar,about_me,join_year) VALUES (?,?,?,?,?,?,?,?,?)')
    ->execute([
        $id,
        $email,
        // CRITICAL SECURITY: Never save plain text passwords. We use password_hash to turn it into unreadable gibberish.
        password_hash($pass, PASSWORD_DEFAULT),
        $first,
        $last,
        'user', // Everyone starts as a standard user.
        $avatar !== '' ? $avatar : 'fa-solid fa-user',
        '', // Empty 'About Me' by default.
        (int) date('Y'),
    ]);

// Prepare the user info to send back to JavaScript.
$user = [
    'id' => $id,
    'email' => $email,
    'first_name' => $first,
    'last_name' => $last,
    'role' => 'user',
    'avatar' => $avatar !== '' ? $avatar : 'fa-solid fa-user',
    'about_me' => '',
    'join_year' => (int) date('Y'),
];

// USER EXPERIENCE (UX) BOOST: Automatically log them in right after they register.
session_regenerate_id(true); // Give them a fresh VIP wristband.
$_SESSION['user_id'] = $id;

// Send success response back to the frontend.
json_response(['ok' => true, 'user' => user_for_json($user)]);
