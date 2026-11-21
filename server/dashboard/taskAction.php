<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allowed origin for calling functions
$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost",
    "https://localhost",
    "capacitor://localhost",
    "https://webtrac.duckdns.org",
    "http://192.168.1.18"
];

if (isset($_SERVER["HTTP_ORIGIN"])) {
    $origin = $_SERVER["HTTP_ORIGIN"];
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
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

    $action = $data["action"] ?? "";
    $username = $data["username"] ?? "";
    $idQuest = $data["idQuest"] ?? null;
    $shared = $data["shared"] ?? false;

    // Basic validation
    if (empty($username)) {
        http_response_code(400);
        echo json_encode(["status" => false, "error" => "No username provided"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id_user FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $idUser = $stmt->fetchColumn();
            
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

            http_response_code(200);
            echo json_encode(["status" => true, "message" => "Task action executed"]);
            exit;
        } else if ($action === "edit") {
            $title = trim($data["title"] ?? "");
            $description = trim($data["description"] ?? "");
            $members = $data["members"] ?? null;
            $shared = isset($data["shared"]) ? ($data["shared"] ? 1 : 0) : 0;

            $encryptedTitle = encryptString($title, $encryptionKey);
            $encryptedDescription = encryptString($description, $encryptionKey);

            $stmt = $pdo->prepare("UPDATE quests SET title = ?, description = ?, shared = ? WHERE id_quest = ?");
            $stmt->execute([$encryptedTitle, $encryptedDescription, $shared, $idQuest]);

            if (is_array($members)) {
                $stmt = $pdo->prepare("DELETE FROM quest_assignees WHERE id_quest = ?");
                $stmt->execute([$idQuest]);

                foreach ($members as $memberName) {
                    $stmt = $pdo->prepare("SELECT id_user FROM users WHERE username = ?");
                    $stmt->execute([trim($memberName)]);
                    $assigneeUserId = $stmt->fetchColumn();

                    if ($assigneeUserId) {
                        $assignStmt = $pdo->prepare("INSERT INTO quest_assignees (id_quest, id_user) VALUES (?, ?) ON CONFLICT DO NOTHING");
                        $assignStmt->execute([$idQuest, $assigneeUserId]);
                    }
                }
            }

            http_response_code(200);
            echo json_encode(["status" => true, "message" => "Task updated"]);
            exit;
        } else {
            http_response_code(400);
            echo json_encode(["status" => false, "error" => "Invalid action"]);
            exit;
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => false, "error" => $e->getMessage()]);
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => false, "error" => "Method not allowed"]);
    exit;
}
?>