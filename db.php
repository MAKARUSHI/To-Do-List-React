<?php
// Include DB credentials
require_once __DIR__ . "/dbConfig.php";

// Data source name (which DB to use)
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
$options = [
    // Throw exceptions when query fails
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // Fetch rows as arrays
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // Disable SQL injections
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // attemp DB connection
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

function encryptString($data, $key) {
    if (empty($data)) return $data;
    $method = "AES-256-CBC";
    $ivLength = openssl_cipher_iv_length($method);
    $iv = openssl_random_pseudo_bytes($ivLength);
    $encrypted = openssl_encrypt($data, $method, $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}