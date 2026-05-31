<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// Bring in our common tools and database connection.
require_once __DIR__ . '/_common.php';

// GATE CONTROL: Ensure this endpoint is only accessed to "GET" data, not modify it.
require_method('GET');

// Create an empty box (array) where we will collect all the movies, series, and games.
$map = [];

/*
 * ====================================================================
 * STEP 1: FETCH MAIN CONTENT & CATEGORIES
 * ====================================================================
 * We join the 'content_items' (movies) table with the 'categories' table.
 * We also use a subquery to calculate the Average Rating for each item on the fly.
 */
$queryItems = $pdo->query("
    SELECT 
        c.id, 
        c.category_id,
        c.title, 
        c.description AS `desc`, 
        c.image_url AS img, 
        c.year, 
        c.length, 
        c.age_rating AS age,
        c.created_at,
        cat.name AS category_name,
        (SELECT ROUND(AVG(rating), 1) FROM ratings WHERE item_id = c.id AND rating > 0) AS avg_rating
    FROM content_items c
    JOIN categories cat ON c.category_id = cat.id
");

// Loop through the results row by row...
while ($row = $queryItems->fetch(PDO::FETCH_ASSOC)) {
    
    // Grab the unique ID for the current movie/game.
    $id = $row['id'];
    
    // Pack this item into our $map box, formatting it exactly how the Frontend (JavaScript) expects it.
    $map[$id] = [
        'id'         => $id,
        'category_id'=> isset($row['category_id']) ? (int)$row['category_id'] : null,
        'title'      => $row['title'],
        'desc'       => $row['desc'],
        'img'        => $row['img'],
        'year'       => $row['year'],
        'length'     => $row['length'],
        'age'        => $row['age'],
        // If no one rated it yet (null), set it to 0. Otherwise, ensure it's a decimal number (float).
        'avg_rating' => $row['avg_rating'] !== null ? (float)$row['avg_rating'] : 0,
        
        // CRITICAL FOR FRONTEND: Our app.js expects the very first tag to be the Category (e.g., "Movie").
        // So we always put the category name at index [0] of the tags list.
        'tags'       => [$row['category_name']], 
        
        // We leave the Creator/Director empty for now. We will fetch and fill this in Step 3.
        'creator'    => '',
        'created_at' => $row['created_at']
    ];
}

/*
 * ====================================================================
 * STEP 2: FETCH GENRES & ATTACH THEM TO ITEMS
 * ====================================================================
 * We join the linking table 'content_genres' with the actual 'genres' table.
 */
$queryGenres = $pdo->query("
    SELECT cg.item_id, g.name AS genre_name 
    FROM content_genres cg
    JOIN genres g ON cg.genre_id = g.id
");

// Loop through all the genre tags...
while ($row = $queryGenres->fetch(PDO::FETCH_ASSOC)) {
    $itemId = $row['item_id'];
    
    // If the movie/game for this tag exists in our $map...
    if (isset($map[$itemId])) {
        // Append this genre (e.g., "Action" or "Sci-Fi") to the end of its tags list.
        $map[$itemId]['tags'][] = $row['genre_name'];
    }
}

/*
 * ====================================================================
 * STEP 3: FETCH CREATORS & ATTACH THEM TO ITEMS
 * ====================================================================
 * We join the linking table 'content_creators' with the actual 'creators' table.
 */
$queryCreators = $pdo->query("
    SELECT cc.item_id, c.name AS creator_name 
    FROM content_creators cc
    JOIN creators c ON cc.creator_id = c.id
");

// Create a temporary list to hold creators, since a movie can have multiple directors.
$tempCreators = [];
while ($row = $queryCreators->fetch(PDO::FETCH_ASSOC)) {
    $itemId = $row['item_id'];
    $tempCreators[$itemId][] = $row['creator_name'];
}

// Now take those grouped creators and attach them to the actual movies in our $map.
foreach ($tempCreators as $itemId => $creatorList) {
    if (isset($map[$itemId])) {
        // 'implode' converts an array into a single text string separated by commas.
        // Example: ["Nolan", "Tarantino"] becomes "Nolan, Tarantino"
        $map[$itemId]['creator'] = implode(', ', $creatorList);
    }
}

/*
 * ====================================================================
 * FINAL STEP: SEND THE DATA TO JAVASCRIPT
 * ====================================================================
 * We have successfully gathered all scattered 3NF data into one clean list.
 * We approve the request ('ok' => true) and send the finalized package to the site!
 */
json_response(['ok' => true, 'items' => $map]);