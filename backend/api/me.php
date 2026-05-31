<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

/*
 * ====================================================================
 * "WHO AM I?" ENDPOINT
 * Whenever the website reloads, it asks this file: "Is someone logged in? 
 * If so, what is their name, profile picture, and their secret security token?"
 * ====================================================================
 */

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Ensure this endpoint is only accessed to "GET" data.
require_method('GET');

// Ask the "Identity Check" function from _common.php if someone holds a valid VIP wristband.
$u = current_user($pdo);

// Send the response back to JavaScript. 
// If someone is logged in ($u exists), send their sanitized profile info (user_for_json).
// If not, send 'user' => null. 
// ALWAYS send the CSRF security token so the frontend can securely make POST requests later.
json_response([
    'ok' => true, 
    'user' => $u ? user_for_json($u) : null, 
    'csrfToken' => $_SESSION['csrf_token'] ?? ''
]);
