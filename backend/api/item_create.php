<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_method('POST');
require_admin($pdo);

$in = json_body();
$primaryType = trim((string) ($in['primaryType'] ?? 'Movie'));
$title = sanitize_text(trim((string) ($in['title'] ?? '')));
$desc = sanitize_text(trim((string) ($in['desc'] ?? '')));
$img = (string) ($in['img'] ?? '');
$tags = is_array($in['tags'] ?? null) ? $in['tags'] : [];
$year = trim((string) ($in['year'] ?? date('Y')));
$length = trim((string) ($in['length'] ?? 'N/A'));
$creatorName = sanitize_text(trim((string) ($in['creator'] ?? 'Cultify')));
$age = trim((string) ($in['age'] ?? '+13'));

if ($title === '') {
    json_response(['ok' => false, 'error' => 'missing_title'], 400);
}

$imageUrl = (strpos($img, 'data:image/') === 0) ? save_data_url_as_upload($img, $title) : trim($img);
if ($imageUrl === '') {
    $imageUrl = '../images/book.png';
}

$newId = 'item_' . bin2hex(random_bytes(6));
$categoryIdIn = isset($in['categoryId']) ? (int) $in['categoryId'] : 0;

$pdo->beginTransaction();
try {
    $categoryId = null;
    if ($categoryIdIn > 0) {
        $stmtById = $pdo->prepare('SELECT id, name FROM categories WHERE id = ?');
        $stmtById->execute([$categoryIdIn]);
        $catRow = $stmtById->fetch(PDO::FETCH_ASSOC);
        if ($catRow) {
            $categoryId = (int) $catRow['id'];
            $primaryType = (string) $catRow['name'];
        }
    }
    if ($categoryId === null) {
        $stmtCat = $pdo->prepare('SELECT id, name FROM categories WHERE name = ?');
        $stmtCat->execute([$primaryType]);
        $rowCat = $stmtCat->fetch(PDO::FETCH_ASSOC);
        if (!$rowCat) {
            $stmtCat->execute(['Movie']);
            $rowCat = $stmtCat->fetch(PDO::FETCH_ASSOC);
        }
        $categoryId = (int) ($rowCat['id'] ?? 1);
        $primaryType = (string) ($rowCat['name'] ?? 'Movie');
    }

    $extraTags = [];
    foreach ($tags as $tag) {
        $t = trim((string) $tag);
        if ($t !== '' && $t !== $primaryType) {
            $extraTags[] = $t;
        }
    }
    $extraTags = array_values(array_unique($extraTags));

    $pdo->prepare('INSERT INTO content_items (id, title, description, image_url, category_id, year, length, age_rating) VALUES (?,?,?,?,?,?,?,?)')
        ->execute([$newId, $title, $desc, $imageUrl, $categoryId, $year, $length, $age]);

    $stmtCreator = $pdo->prepare('SELECT id FROM creators WHERE name = ?');
    $stmtCreator->execute([$creatorName]);
    $creatorId = $stmtCreator->fetchColumn();
    if (!$creatorId) {
        $pdo->prepare('INSERT INTO creators (name) VALUES (?)')->execute([$creatorName]);
        $creatorId = $pdo->lastInsertId();
    }
    $pdo->prepare('INSERT INTO content_creators (item_id, creator_id) VALUES (?,?)')->execute([$newId, $creatorId]);

    if ($extraTags) {
        $stmtGenre = $pdo->prepare('SELECT id FROM genres WHERE name = ?');
        $stmtInsertGenre = $pdo->prepare('INSERT INTO content_genres (item_id, genre_id) VALUES (?,?)');
        foreach ($extraTags as $tagName) {
            $stmtGenre->execute([$tagName]);
            $genreId = $stmtGenre->fetchColumn();
            if (!$genreId) {
                $pdo->prepare('INSERT INTO genres (name) VALUES (?)')->execute([$tagName]);
                $genreId = $pdo->lastInsertId();
            }
            $stmtInsertGenre->execute([$newId, $genreId]);
        }
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Cultify item_create error: ' . $e->getMessage());
    json_response(['ok' => false, 'error' => 'db_transaction_failed'], 500);
}

json_response(['ok' => true, 'id' => $newId]);