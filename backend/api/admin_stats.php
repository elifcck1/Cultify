<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Ensure this endpoint is only accessed to "GET" data, not modify it.
require_method('GET');

// SECURITY WALL: "Hold on, who are you?" 
// Only users with an 'admin' role are allowed to see these sensitive statistics.
require_admin($pdo);

/*
 * ====================================================================
 * GATHERING STATISTICS (The Accounting Department)
 * ====================================================================
 * We ask the database specific questions (Queries) and save the returning numbers (COUNT) into variables.
 */

// Question 1: How many total registered users do we have in our system?
$users = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

// Question 2: How many items (movies, games, books, series) exist in our library?
$items = (int) $pdo->query('SELECT COUNT(*) FROM content_items')->fetchColumn();

// Question 3: How many total comments have users written so far?
$comments = (int) $pdo->query('SELECT COUNT(*) FROM comments')->fetchColumn();

// Question 4: How many items do we have per category? (Dynamically fetched from the categories table)
$stCatStats = $pdo->prepare('
    SELECT cat.id, cat.name, COUNT(c.id) AS item_count
    FROM categories cat
    LEFT JOIN content_items c ON c.category_id = cat.id
    GROUP BY cat.id, cat.name
    ORDER BY cat.id ASC
');
$stCatStats->execute();
$category_stats = [];
while ($row = $stCatStats->fetch(PDO::FETCH_ASSOC)) {
    $category_stats[] = [
        'id' => (int) $row['id'],
        'name' => (string) $row['name'],
        'count' => (int) $row['item_count'],
    ];
}

// Question 5: How many comments are waiting for admin approval? ('pending')
// (This powers the little red notification bubble in the admin panel)
$pending = (int) $pdo->query("SELECT COUNT(*) FROM comments WHERE status = 'pending'")->fetchColumn();

// Question 6: Daily Activity Stats (How active were users today?)
$today = date('Y-m-d');
$stDailyComments = $pdo->prepare('SELECT COUNT(*) FROM comments WHERE created_at = ?');
$stDailyComments->execute([$today]);
$dailyComments = (int) $stDailyComments->fetchColumn();

$stDailyWatchlist = $pdo->prepare('SELECT COUNT(*) FROM watchlist WHERE DATE(created_at) = ?');
$stDailyWatchlist->execute([$today]);
$dailyWatchlist = (int) $stDailyWatchlist->fetchColumn();

// Combine comments and watchlist additions to estimate total "daily views" or activity.
$dailyViews = $dailyComments + $dailyWatchlist;

/*
 * ====================================================================
 * SENDING RESULTS TO THE FRONTEND
 * ====================================================================
 */
// Package all these collected numbers into a clean box and send them to the JavaScript Admin Dashboard!
json_response([
    'ok' => true,
    'users' => $users,
    'content_total' => $items,
    'comments_total' => $comments,
    'category_stats' => $category_stats,
    'comments_pending' => $pending,
    'daily_views' => $dailyViews,
]);