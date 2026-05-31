<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Ensure this endpoint is only accessed to "GET" data.
require_method('GET');

// ====================================================================
// THE COMMUNITY VOICES (Random Reviews Engine)
// This query gathers all approved comments and their associated ratings 
// to display on the homepage as "Community Reviews".
// ====================================================================
$sql = '
    SELECT c.id, c.item_id, c.user_id, c.body AS text, c.created_at AS date, c.status,
           u.first_name, u.last_name, u.avatar,
           COALESCE(r.rating, 0) AS user_item_rating
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN ratings r ON r.user_id = c.user_id AND r.item_id = c.item_id
    WHERE c.status = ?
    ORDER BY RAND()
';
$st = $pdo->prepare($sql);

// SECURITY & MODERATION: Only let "approved" comments appear on the public homepage.
$st->execute(['approved']); 
$out = [];

while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    // Sanity check for star ratings to ensure they stay between 0 and 10.
    $stars = (int) $row['user_item_rating'];
    if ($stars < 0) {
        $stars = 0;
    }
    if ($stars > 10) {
        $stars = 10;
    }
    
    // Generate a unique URL handle for the user based on their name (e.g., John Doe -> johndoe).
    $fn = $row['first_name'] ?? '';
    $ln = $row['last_name'] ?? '';
    $handle = strtolower(preg_replace('/\s+/', '', $fn . $ln));
    
    // Build the clean dictionary format that the JavaScript frontend expects.
    $out[] = [
        'id' => $row['id'],
        'itemId' => $row['item_id'],
        'userId' => $row['user_id'],
        'text' => $row['text'],
        'date' => $row['date'],
        'stars' => $stars,
        'userName' => trim($fn . ' ' . $ln),
        'userHandle' => $handle,
        'userAvatar' => $row['avatar'] ?? 'fa-solid fa-user',
    ];
}

// Package everything up and send it to the frontend!
json_response(['ok' => true, 'reviews' => $out]);