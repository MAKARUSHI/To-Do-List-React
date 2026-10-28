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
        // Check if username or email are available (never used)
        $stmt = $pdo->prepare("SELECT username, email FROM users WHERE username = ? OR email = ?");
        // execute query with parameters
        $stmt->execute([$username, $email]);
        $user = $stmt->fetchAll();

        if (!empty($user)) {
            $usernameExisting = null;
            $emailExisting = null;
            foreach ($user as $row) {
                if ($row["username"] === $username) {
                    $usernameExisting = true;
                }
                if ($row["email"] === $email) {
                    $emailExisting = true;
                }
            }

            http_response_code(409);
            if ($usernameExisting && $emailExisting) {
                echo json_encode(["status" => false, "error" => "Email and username not available"]);
                exit;
            } else if ($usernameExisting) {
                echo json_encode(["status" => false, "error" => "Username is not available"]);
                exit;
            } else if ($emailExisting) {
                echo json_encode(["status" => false, "error" => "Email is not available"]);
                exit;
            }

            if ($password !== $confirmPassword) {
                http_response_code(422);
                echo json_encode(["status" => false, "error" => "Passwords are not matching"]);
                exit;
            }
            
        }
        
        // hash registered password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        // create SQL query
        $stmt = $pdo->prepare("INSERT INTO users (email, first_name, last_name, date_of_birth, username, password, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id_user, first_name username, email, gender");
        // execute query with parameters
        $stmt->execute([$email, $firstName, $lastName, $birthDay, $username, $passwordHash, $gender]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(500);
            echo json_encode(["status" => false, "message" => "User registration failed"]);
            exit;    
        }

        http_response_code(201);
        echo json_encode(["status" => true, "message" => "User registered successfully", "user" => $user]);

        $stmt = $pdo->prepare("UPDATE users SET is_active = true WHERE username = ?");
        // execute query with parameter
        $stmt->execute([$username]);
        exit;
    } catch (\PDOException $e) {
        if (!$usernameExisting && !$emailExisting) {
            http_response_code(500);
            echo json_encode(["status" => false, "error" => $e->getMessage()]);
            exit;
        }
        
        
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}
?>