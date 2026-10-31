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
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../db.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $username = $_GET["username"] ?? "";

    if (empty($username)) {
        http_response_code(400);
        echo json_encode(["status" => false, "error" => "No username"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id_user, username FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user) {
            http_response_code(200);
            // FIXED: Return just the numeric ID so the frontend can store it correctly
            echo json_encode([
                "status" => true, 
                "message" => "Username found", 
                "idUser" => $user['id_user'] 
            ]);
        } else {
            http_response_code(200);
            echo json_encode(["status" => false, "error" => "No username"]);
        }
        exit;
        
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => false, "error" => $e->getMessage()]);
        exit;
    }
}

function encryptString($data, $key) {
    if (empty($data)) return $data;
    $method = "AES-256-CBC";
    $ivLength = openssl_cipher_iv_length($method);
    $iv = openssl_random_pseudo_bytes($ivLength);
    $encrypted = openssl_encrypt($data, $method, $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $username = trim($data["username"]) ?? null;
    $members = $data["members"] ?? null;
    $title = trim($data["title"] ?? "");
    $description = trim($data["description"] ?? "");
    $shared = $data["shared"] ?? false;
    
    if (empty($username)) {
        http_response_code(400);
        echo json_encode(["error" => "No username provided"]);
        exit;
    }

    try {
        // 1. Create a dedicated statement for looking up user IDs by username
        $userLookupStmt = $pdo->prepare("SELECT id_user FROM users WHERE username = ?");
        
        // 2. Fetch the creator's ID first
        $userLookupStmt->execute([$username]);
        $creatorUser = $userLookupStmt->fetch();

        if (!$creatorUser) {
            http_response_code(400);
            echo json_encode(["status" => false, "error" => "Creator username not found"]);
            exit;
        }

        $encryptedTitle = encryptString($title, $encryptionKey);
        $encryptedDescription = encryptString($description, $encryptionKey);

        $creatorId = $creatorUser["id_user"];

        $stmt = $pdo->prepare("INSERT INTO quests (title, description, shared, creator) 
                                VALUES (?, ?, ?, ?) RETURNING id_quest");
        $stmt->bindValue(1, $encryptedTitle, PDO::PARAM_STR);
        $stmt->bindValue(2, $encryptedDescription, PDO::PARAM_STR);
        $stmt->bindValue(3, $shared, PDO::PARAM_BOOL);
        $stmt->bindValue(4, $creatorId, PDO::PARAM_INT);
        $stmt->execute();
        
        $taskId = $stmt->fetchColumn();

        $assignStmt = $pdo->prepare("INSERT INTO quest_assignees (id_quest, id_user) VALUES (?, ?) ON CONFLICT DO NOTHING");

        foreach ($members as $memberName) {
            $userLookupStmt->execute([trim($memberName)]);
            $assigneeUser = $userLookupStmt->fetch();

            if ($assigneeUser) {
                $assignStmt->execute([$taskId, $assigneeUser["id_user"]]);
            }
        }
        
        http_response_code(200);
        echo json_encode(["status" => true, "message" => "Task created", "id_quest" => $taskId]);
        exit;

    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => false, 
            "error" => $e->getMessage(),
            "code" => $e->getCode(),
            "detail" => $e->errorInfo[2] ?? null
        ]);
        exit;
    }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>