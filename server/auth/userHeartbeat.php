<?php
// allowed origin for calling functions
$allowedOrigins = [
    "http://localhost:5173",
    "https://webtrac.duckdns.org",
    "http://192.168.1.18"
];

// Check if the incoming request has an origin header
if (isset($_SERVER["HTTP_ORIGIN"])) {
    $origin = $_SERVER["HTTP_ORIGIN"];
    
    // If the incoming origin is in our allowed list
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Vary: Origin");
    }
}

// Allow necessary HTTP methods and headers
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // store incoming data
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $userId = trim($data["id_user"] ?? '');
    $deleteAccount = $data["deleteAccount"];

    try {
        // create SQL query
        $stmt = $pdo->prepare("UPDATE users SET is_active = true, last_active = NOW() WHERE id_user = ?");
        // execute query with parameter
        $stmt->execute([$userId]);

        $stmt = $pdo->prepare("UPDATE users SET is_active = false WHERE last_active < NOW() - INTERVAL '3 minutes' AND is_active = true");
        $stmt->execute();

        if ($deleteAccount) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id_user = ?");
            $stmt->execute([$userId]);
        }
        exit;
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}
?>