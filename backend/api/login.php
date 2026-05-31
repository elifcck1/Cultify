<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

/*
 * ====================================================================
 * LOGIN ENDPOINT (The Bouncer)
 * This file checks the user's ID and password. If they match, 
 * it gives them a VIP wristband (Session) to enter the site.
 * ====================================================================
 */

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Only accept data sent via POST method (like a hidden envelope).
require_method('POST');

// Read the JSON data (the envelope) sent by the frontend login form.
$in = json_body();

// Extract the email and password from the envelope, trimming accidental spaces.
$email = trim((string) ($in['email'] ?? ''));
$pass = (string) ($in['password'] ?? '');

// SECURITY: If either field is completely empty, reject them immediately.
// We return a generic error so hackers don't know exactly what went wrong.
if ($email === '' || $pass === '') {
    json_response(['ok' => false, 'error' => 'invalid_credentials'], 401);
}

// 1. LOOKUP: Try to find this email in our database (Guest List).
$st = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$st->execute([$email]);
$user = $st->fetch(PDO::FETCH_ASSOC);

// 2. VERIFY: Did we find the user? And does the provided password match our secure hash?
// NOTE: We use the exact same error for "user not found" and "wrong password" 
// so attackers can't guess which emails are registered on our site (Security Best Practice).
if (!$user || !password_verify($pass, $user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'invalid_credentials'], 401);
}

// 3. SUCCESS! The credentials are correct. 
// SECURITY: Prevent "Session Fixation" attacks by giving them a brand new VIP wristband ID.
session_regenerate_id(true);

// Put the user's ID inside their VIP wristband so we remember them on other pages.
$_SESSION['user_id'] = $user['id'];

// Send the good news back to JavaScript, along with their sanitized profile info.
json_response(['ok' => true, 'user' => user_for_json($user)]);
