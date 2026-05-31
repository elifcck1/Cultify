<?php
/**
 * 3NF Optimized Setup: Creates fully normalized tables, demo content, and admin account.
 */
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

$adminEmail = getenv('CULTIFY_ADMIN_EMAIL') ?: 'admin@cultify.local';
$adminPass = getenv('CULTIFY_ADMIN_PASSWORD') ?: 'Admin123!';

try {
    // 1. Create the database (if it doesn't exist)
    $pdoBare = new PDO(
        sprintf(
            'mysql:host=%s;port=%d;charset=%s',
            $config['db_host'],
            (int) ($config['db_port'] ?? 3306),
            $config['db_charset']
        ),
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $pdoBare->exec('CREATE DATABASE IF NOT EXISTS `' . str_replace('`', '``', $config['db_name']) . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $pdoBare = null;

    // 2. Connect to the database
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $config['db_host'],
        (int) ($config['db_port'] ?? 3306),
        $config['db_name'],
        $config['db_charset']
    );
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // --- CLEANUP OPERATION (Dropping old tables) ---
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    $oldTables = [
        'watchlist',
        'comments',
        'ratings',
        'content_genres',
        'content_creators',
        'content_items',
        'creators',
        'genres',
        'categories',
        'users',
        'users_eski_yedek',
        'media',
        'media_creators',
        'media_genres',
        'review_rating',
        'user_list'
    ];
    foreach ($oldTables as $tbl) {
        $pdo->exec("DROP TABLE IF EXISTS `$tbl`");
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

    // --- CREATING 3NF NORMALIZED TABLES ---
    $pdo->exec('
        CREATE TABLE users (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            role ENUM("user","admin") NOT NULL DEFAULT "user",
            avatar VARCHAR(255) NOT NULL DEFAULT "fa-solid fa-user",
            about_me TEXT,
            join_year SMALLINT UNSIGNED NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE genres (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE creators (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE content_items (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            description TEXT,
            image_url VARCHAR(1024) NOT NULL,
            category_id INT NOT NULL,
            year VARCHAR(20) NOT NULL DEFAULT "",
            length VARCHAR(50) NOT NULL DEFAULT "N/A",
            age_rating VARCHAR(20) NOT NULL DEFAULT "+13",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_ci_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE content_genres (
            item_id VARCHAR(64) NOT NULL,
            genre_id INT NOT NULL,
            PRIMARY KEY (item_id, genre_id),
            CONSTRAINT fk_cg_item FOREIGN KEY (item_id) REFERENCES content_items(id) ON DELETE CASCADE,
            CONSTRAINT fk_cg_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE content_creators (
            item_id VARCHAR(64) NOT NULL,
            creator_id INT NOT NULL,
            PRIMARY KEY (item_id, creator_id),
            CONSTRAINT fk_cc_item FOREIGN KEY (item_id) REFERENCES content_items(id) ON DELETE CASCADE,
            CONSTRAINT fk_cc_creator FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE ratings (
            user_id VARCHAR(64) NOT NULL,
            item_id VARCHAR(64) NOT NULL,
            rating TINYINT UNSIGNED NOT NULL,
            PRIMARY KEY (user_id, item_id),
            CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_ratings_item FOREIGN KEY (item_id) REFERENCES content_items(id) ON DELETE CASCADE,
            CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 10)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE comments (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            item_id VARCHAR(64) NOT NULL,
            user_id VARCHAR(64) NOT NULL,
            body TEXT NOT NULL,
            status ENUM("pending","approved") NOT NULL DEFAULT "pending",
            created_at DATETIME NOT NULL,
            CONSTRAINT fk_comments_item FOREIGN KEY (item_id) REFERENCES content_items(id) ON DELETE CASCADE,
            CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE watchlist (
            user_id VARCHAR(64) NOT NULL,
            item_id VARCHAR(64) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, item_id),
            CONSTRAINT fk_wl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_wl_item FOREIGN KEY (item_id) REFERENCES content_items(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ');

    // --- INSERTING STATIC DATA (Categories, Genres, Creators) ---
    $pdo->exec("INSERT INTO categories (id, name) VALUES (1, 'Movie'), (2, 'Series'), (3, 'Book'), (4, 'Game')");
    $pdo->exec("INSERT INTO genres (id, name) VALUES (1, 'Action'), (2, 'Adventure'), (3, 'Crime'), (4, 'Drama'), (5, 'Fantasy'), (6, 'Horror'), (7, 'RPG'), (8, 'Sci-Fi')");
    $pdo->exec("INSERT INTO creators (id, name) VALUES (1, 'Cultify'), (2, 'Christopher Nolan'), (3, 'Denis Villeneuve')");

    // --- INSERTING DEMO CONTENT ---
    $count = (int) $pdo->query('SELECT COUNT(*) FROM content_items')->fetchColumn();
    if ($count === 0) {
        // [id, title, img, category_id, creator_id, [genre_ids]]
        $demo = [
            ['item_1', 'The Dark Knight', '../images/Movies/The Dark Knight.png', 1, 2, [3, 1]], // Movie, Nolan, Crime/Action
            ['item_2', 'Cars', '../images/Movies/Cars.jpg', 1, 1, [2]],
            ['item_3', 'Toy Story', '../images/Movies/Toy Story.jpg', 1, 1, [2]],
            ['item_4', 'Avatar', '../images/Movies/Avatar.jpg', 1, 1, [8, 1]],
            ['item_5', 'Inception', '../images/Movies/Inception.jpg', 1, 2, [8]],
        ];

        $insItem = $pdo->prepare('INSERT INTO content_items (id, title, description, image_url, category_id, year, length, age_rating) VALUES (?,?,?,?,?,?,?,?)');
        $insGenre = $pdo->prepare('INSERT INTO content_genres (item_id, genre_id) VALUES (?,?)');
        $insCreator = $pdo->prepare('INSERT INTO content_creators (item_id, creator_id) VALUES (?,?)');

        foreach ($demo as $row) {
            [$id, $title, $img, $cat_id, $creator_id, $genre_ids] = $row;

            // Insert the main item
            $insItem->execute([$id, $title, 'Explore the details of ' . $title . '.', $img, $cat_id, '2024', 'N/A', '+13']);

            // Link the creator
            $insCreator->execute([$id, $creator_id]);

            // Link the genres
            foreach ($genre_ids as $g_id) {
                $insGenre->execute([$id, $g_id]);
            }
        }
    }

    // --- CREATING THE MASTER ADMIN ---
    $st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $st->execute([$adminEmail]);
    if (!$st->fetch()) {
        $id = 'admin_1_' . bin2hex(random_bytes(4));
        $pdo->prepare('INSERT INTO users (id,email,password_hash,first_name,last_name,role,avatar,about_me,join_year) VALUES (?,?,?,?,?,?,?,?,?)')
            ->execute([$id, $adminEmail, password_hash($adminPass, PASSWORD_DEFAULT), 'Master', 'Admin', 'admin', 'fa-solid fa-user-shield', 'Platform administrator', (int) date('Y')]);
    }

    $msg = "Install OK.\nDatabase successfully created following strict 3NF (Third Normal Form) standards!\nSeparate relational tables created for Categories, Creators, and Genres.";
    if (PHP_SAPI === 'cli') {
        echo $msg;
    } else {
        header('Content-Type: text/plain; charset=utf-8');
        echo nl2br(htmlspecialchars($msg, ENT_QUOTES, 'UTF-8'));
    }
} catch (Throwable $e) {
    $err = 'Install failed: ' . $e->getMessage();
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, $err . "\n");
    } else {
        header('Content-Type: text/plain; charset=utf-8');
        echo $err;
    }
    exit(1);
}