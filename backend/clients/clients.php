<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../db.php";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT * FROM Clients"); // table avec majuscule
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "ok", "clients" => $clients]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $client = $data['client'] ?? null;

        if (!$client) {
            http_response_code(400);
            echo json_encode(["status"=>"error","message"=>"No client data sent"]);
            exit;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO Clients (lastname, firstname, phone, email) 
             VALUES (:lastname, :firstname, :phone, :email)"
        );
        $stmt->execute([
            ":lastname" => $client['lastname'] ?? '',
            ":firstname" => $client['firstname'] ?? '',
            ":phone" => $client['phone'] ?? '',
            ":email" => $client['email'] ?? null
        ]);

        $id = $pdo->lastInsertId();
        echo json_encode(["status" => "ok", "client" => ["id" => $id, ...$client]]);
        exit;
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
}
?>

