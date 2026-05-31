<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Ensure this endpoint is only accessed to "GET" data.
require_method('GET');

// Get the requested handle from the URL (e.g., website.com/profile.html?handle=johndoe)
// Convert it to lowercase and trim any accidental spaces.
$handle = strtolower(trim((string) ($_GET['handle'] ?? '')));
if ($handle === '') {
    json_response(['ok' => false, 'error' => 'missing_handle'], 400);
}

// ====================================================================
// THE USER LOCATOR (Profile Finder)
// ====================================================================
// We avoid downloading the entire user table into PHP (which would be slow and unsafe).
// Instead, we use SQL to dynamically glue the first_name and last_name together,
// remove the spaces, make it lowercase, and search for an exact match.
// This is heavily optimized for performance and protects against DoS attacks.
$st = $pdo->prepare(
    "SELECT id, email, first_name, last_name, role, avatar, about_me, join_year
     FROM users
     WHERE LOWER(REPLACE(CONCAT(COALESCE(first_name, ''), COALESCE(last_name, '')), ' ', '')) = ?"
);
$st->execute([$handle]);

// Fetch the matched user
$row = $st->fetch(PDO::FETCH_ASSOC);

// If we found them, clean their data (remove password hashes, etc.) and send it to the frontend!
if ($row) {
    json_response(['ok' => true, 'user' => user_for_json($row)]);
}

// If no user matches the handle, send a 404 Not Found error.
json_response(['ok' => false, 'error' => 'not_found'], 404);
