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

    $action = $data["action"];
    $idUser = $data["idUser"];
    $idQuest = $data["idQuest"];

    // Basic validation
    if (empty($idUser)) {
        http_response_code(400);
        echo json_encode(["error" => "No user ID"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT shared FROM quests WHERE id_quest = ?");
        $stmt->execute([$idQuest]);
        $shared = $stmt->fetchColumn();

        
            
        if ($action === "delete" || $action === "complete") {
            if ($action === "complete") {
                if ($shared) {
                    $stmt = $pdo->prepare("UPDATE quest_assignees SET is_completed = true WHERE id_quest = ?");
                    $stmt->execute([$idQuest]);

                    $stmt = $pdo->prepare("UPDATE users SET finished_tasks = finished_tasks + 1 FROM quest_assignees 
                    WHERE users.id_user = quest_assignees.id_user AND quest_assignees.id_quest = ?");
                    $stmt->execute([$idQuest]);
                    
                } else {
                    $stmt = $pdo->prepare("UPDATE quest_assignees SET is_completed = true WHERE id_quest = ? AND id_user = ?");
                    $stmt->execute([$idQuest, $idUser]);

                    $stmt = $pdo->prepare("UPDATE users SET finished_tasks = finished_tasks + 1 WHERE id_user = ?");
                    $stmt->execute([$idUser]);
                }
            }

            if ($shared) {
                $stmt = $pdo->prepare("DELETE FROM quest_assignees WHERE id_quest = ?");
                $stmt->execute([$idQuest]);    
            } else {
                $stmt = $pdo->prepare("DELETE FROM quest_assignees WHERE id_quest = ? AND id_user = ?");
                $stmt->execute([$idQuest, $idUser]);
            }

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM quest_assignees WHERE id_quest = ?");
            $stmt->execute([$idQuest]);
            $remaining = $stmt->fetchColumn();

            if ($remaining == 0) {
                $stmt = $pdo->prepare("DELETE FROM quests WHERE id_quest = ?");
                $stmt->execute([$idQuest]);
            }
        }
        
        
        http_response_code(200);
        echo json_encode(["message" => "Tasks action executed"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>