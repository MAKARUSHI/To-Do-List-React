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
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $id_user = $data["idUser"];

    // Basic validation
    if (empty($id_user)) {
        http_response_code(400);
        echo json_encode(["error" => "No user ID"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT quests.id_quest, quests.title, quests.description FROM quests
        JOIN quest_assignees ON quests.id_quest = quest_assignees.id_quest
        JOIN users ON quest_assignees.id_user = users.id_user WHERE users.id_user = ?");
        $stmt->execute([$id_user]);
        $tasks = $stmt->fetchAll();

        
        http_response_code(200);
        echo json_encode(["message" => "Tasks found", "tasks" => $tasks]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>