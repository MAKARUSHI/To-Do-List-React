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

    $username = trim($data["username"] ?? '');
    $password = $data["password"] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    try {
        // create SQL query
        $stmt = $pdo->prepare("SELECT id_user, username, first_name, email, gender, password FROM users WHERE username = ?");
        // execute query with parameter
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        // compare user password
        if ($user === false || !password_verify($password, $user["password"])) {
            http_response_code(401);
            echo json_encode(["status" => false, "error" => "Invalid username or password"]);  
            exit;  
        }

        // delete saved password BEFORE sent response
        unset($user["password"]);

        http_response_code(200);
        echo json_encode(["status" => true, "message" => "User found", "user" => $user]);

        $stmt = $pdo->prepare("UPDATE users SET is_active = true WHERE username = ?");
        // execute query with parameter
        $stmt->execute([$username]);
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