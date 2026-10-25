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

    $firstName = trim($data["firstName"] ?? "");
    $lastName = trim($data["lastName"] ?? "");
    $username = trim($data["username"] ?? "");
    $email = trim($data["email"] ?? "");
    $birthDay = $data["formattedBirthday"] ?? "";
    $gender = $data["gender"] ?? "";
    $password = $data["password"] ?? "";
    $confirmPassword = $data["confirmPassword"] ?? "";

    if (empty($username) || empty($email) || empty($gender) || empty($password) || empty($confirmPassword)) {
        http_response_code(400);
        echo json_encode(["error" => "All fields are required"]);
        exit;
    }

    try {
        // hash registered password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        // create SQL query
        $stmt = $pdo->prepare("INSERT INTO users (email, first_name, last_name, date_of_birth, username, password, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id_user, username, email");
        // execute query with parameters
        $stmt->execute([$email, $firstName, $lastName, $birthDay, $username, $passwordHash, $gender]);
        $user = $stmt->fetch();

        http_response_code(201);
        echo json_encode(["message" => "User registered successfully", "user" => $user]);
    } catch (\PDOException $e) {
        http_response_code(500);
        // SQL error code for already existing unique stored value
        if ($e->getCode() === "23505") {
            http_response_code(409);
            echo json_encode(["error" => "Email or username already exists"]);
        } else {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>