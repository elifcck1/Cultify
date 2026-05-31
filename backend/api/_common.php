<?php
// STRICT RULES: Instruct PHP not to ignore even minor errors.
declare(strict_types=1);

// SESSION INITIALIZATION (VIP WRISTBAND)
// We give logged-in users a "VIP Wristband" (Session) so they don't get logged out while browsing.
session_start([
    'cookie_httponly' => true,  // Prevents hackers from stealing cookies (wristbands) via JavaScript.
    'cookie_samesite' => 'Lax', // Prevents fake cross-site requests.
    'use_strict_mode' => true,  // Enforces secure session IDs.
]);

// CSRF TOKEN: Generate a unique security key for each session.
// This token verifies that POST requests are genuinely coming from the user's own browser.
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// RESPONSE FORMAT: We specify that our site will always send JSON (software language packages) to the outside (JavaScript).
header('Content-Type: application/json; charset=utf-8');

/*
 * ====================================================================
 * SECTION 1: DATABASE CONNECTION (Courier System)
 * ====================================================================
 */
// Go up one folder and read our safe key, config.php.
$config = require __DIR__ . '/../config.php';

// Prepare the database address (DSN).
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $config['db_host'],
    (int)($config['db_port'] ?? 3306),
    $config['db_name'],   // This will point to the correct address (cultify_db)
    $config['db_charset']
);

// Try to establish the connection (try-catch)
try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,      // Do not hide errors, show them
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch data as a clean list
    ]);
} catch (PDOException $e) {
    // If there's an error, don't crash the site, log the error and stop (exit).
    http_response_code(500);
    error_log('Cultify DB connection error: ' . $e->getMessage());
    echo json_encode(['ok' => false, 'error' => 'db_error']);
    exit;
}

/*
 * ====================================================================
 * SECTION 2: HELPER FUNCTIONS THAT KEEP THE SITE RUNNING
 * ====================================================================
 */

// 1. RESPONSE SENDER: Allows us to print results to JavaScript.
function json_response(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit; // Finish the process
}

// 1b. SECURITY: Cleans HTML/JS codes in user-submitted texts (XSS protection)
// This function prevents users from writing harmful HTML tags like <script> or <h1>.
function sanitize_text(string $input): string {
    // First remove all HTML tags, then encode special characters
    return htmlspecialchars(strip_tags($input), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

// 2. GATE CONTROL: Ensures the page is only accessed with the requested method (E.g., POST only).
function require_method(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_response(['ok' => false, 'error' => 'method_not_allowed'], 405);
    }
    // CSRF PROTECTION: Automatically verify the security token in POST requests.
    // Frontend must send the X-CSRF-Token header in every POST request.
    if ($method === 'POST') {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
            json_response(['ok' => false, 'error' => 'csrf_invalid'], 403);
        }
    }
}

// 3. PACKAGE OPENER: Reads data (JSON) coming from JavaScript and converts it to a list (array) that PHP understands.
function json_body(): array {
    $raw = file_get_contents('php://input');
    $d = json_decode($raw ?: '{}', true);
    return is_array($d) ? $d : [];
}

// 4. PASSWORD HIDER: Removes the user's password from the list before sending their info to the screen (Profile etc.).
function user_for_json(array $u): array {
    return [
        'id'        => $u['id'],
        'email'     => $u['email'],
        'firstName' => $u['first_name'],
        'lastName'  => $u['last_name'],
        'role'      => $u['role'],
        'avatar'    => $u['avatar'],
        'aboutMe'   => $u['about_me'] ?? '',
        'joinYear'  => (int) ($u['join_year'] ?? date('Y')),
    ];
}

// 5. IDENTITY CHECK: Finds out who the current visitor is from the database.
function current_user(PDO $pdo): ?array {
    if (!isset($_SESSION['user_id'])) {
        return null; // No one is logged in yet
    }
    // Fetches all info from the database based on the ID in the visitor's VIP wristband (Session).
    $st = $pdo->prepare('SELECT id, email, first_name, last_name, role, avatar, about_me, join_year FROM users WHERE id = ?');
    $st->execute([$_SESSION['user_id']]);
    $u = $st->fetch(PDO::FETCH_ASSOC);
    return $u ?: null;
}

// 6. SECURITY WALL: "Only logged-in members can perform this action".
function require_login(PDO $pdo): array {
    $u = current_user($pdo);
    if (!$u) { // If not logged in, give an error and reject
        json_response(['ok' => false, 'error' => 'unauthorized'], 401);
    }
    return $u;
}

// 7. BOSS WALL: "Only users with Admin privileges can perform this action".
function require_admin(PDO $pdo): array {
    $u = require_login($pdo); // First check if logged in
    if (($u['role'] ?? '') !== 'admin') { // Then check if the role is admin
        json_response(['ok' => false, 'error' => 'forbidden'], 403);
    }
    return $u;
}

// 8. NAME MERGER: Combines first and last name and removes spaces (E.g., "John Doe" becomes "johndoe").
function user_handle(array $userRow): string {
    return strtolower(preg_replace('/\s+/', '', ($userRow['first_name'] ?? '') . ($userRow['last_name'] ?? '')));
}

// 9. IMAGE UPLOADER: Saves the image selected from the internet or computer to the /uploads folder on the server.
function save_data_url_as_upload(string $dataUrl, string $itemId): string {
    // Find the type of the image (png, jpg, etc.)
    if (!preg_match('#^data:image/(png|jpeg|jpg|gif|webp);base64,(.+)$#i', $dataUrl, $m)) {
        return '';
    }
    $ext = strtolower($m[1] === 'jpeg' ? 'jpg' : $m[1]);
    $bin = base64_decode($m[2], true); // Convert the image to a format the computer understands (binary)
    
    if ($bin === false || $bin === '') {
        return '';
    }

    // SECURITY: File size check (maximum 5MB)
    if (strlen($bin) > 5 * 1024 * 1024) {
        return '';
    }

    // SECURITY: Check the real file type (magic bytes verification)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->buffer($bin);
    $allowedMimes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowedMimes, true)) {
        return '';
    }
    
    // Determine the folder to save (/uploads)
    $dir = dirname(__DIR__) . '/uploads';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true); // Create the uploads folder automatically if it doesn't exist on the system
    }
    
    // Give a random and unique name so images don't clash (E.g., item123_a8b4.jpg)
    $fn = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $itemId) . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $path = $dir . '/' . $fn;
    
    // Physically save the image into the folder
    if (file_put_contents($path, $bin) === false) {
        return '';
    }
    
    // Send back the address (link) so JavaScript can show this image on the screen
    return '../../backend/uploads/' . $fn;
}