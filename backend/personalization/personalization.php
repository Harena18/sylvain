<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../db.php";

$method = $_SERVER['REQUEST_METHOD'];

try {
    $now = date('Y-m-d H:i:s');
    $pdo->exec("
        UPDATE Personalisations
        SET statut = 'en retard'
        WHERE statut = 'en cours' AND date_fin IS NOT NULL AND date_fin < '$now'
    ");

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("
                SELECT p.*, CONCAT(c.firstname, ' ', c.lastname) AS client_nom, i.name AS item_nom
                FROM Personalisations p
                LEFT JOIN Clients c ON p.client_id = c.id
                LEFT JOIN Items i ON p.item_id = i.id
                WHERE p.id = ?
            ");
            $stmt->execute([$_GET['id']]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "ok", "personnalisation" => $data]);
        } else {
            $stmt = $pdo->query("
                SELECT p.*, CONCAT(c.firstname, ' ', c.lastname) AS client_nom, i.name AS item_nom
                FROM Personalisations p
                LEFT JOIN Clients c ON p.client_id = c.id
                LEFT JOIN Items i ON p.item_id = i.id
            ");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "ok", "personnalisations" => $data]);
        }
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input || !isset($input['client_id'], $input['item_id'], $input['motif'], $input['date_fin'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid input"]);
            exit;
        }

        $client_id = (int)$input['client_id'];
        $item_id   = (int)$input['item_id'];
        $motif     = trim($input['motif']);
        $date_fin  = !empty($input['date_fin']) ? date('Y-m-d H:i:s', strtotime($input['date_fin'])) : null;
        $validStatus = ["en cours", "terminé", "en retard", "récupéré", "livré"];
        $statut = (isset($input['statut']) && in_array($input['statut'], $validStatus)) ? $input['statut'] : "en cours";
        $nombre_exemplaires = isset($input['nombre_exemplaires']) 
            ? (int)$input['nombre_exemplaires'] 
            : 1;

        $stmt = $pdo->prepare("
            INSERT INTO Personalisations 
                (client_id, item_id, motif, date_debut, date_fin, statut, nombre_exemplaires)
            VALUES 
                (:client_id, :item_id, :motif, NOW(), :date_fin, :statut, :nombre_exemplaires)
        ");
        $stmt->execute([
            ":client_id" => $client_id,
            ":item_id" => $item_id,
            ":motif" => $motif,
            ":date_fin" => $date_fin,
            ":statut" => $statut,
            ":nombre_exemplaires" => $nombre_exemplaires
        ]);


        echo json_encode(["status" => "ok", "id" => $pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid input"]);
            exit;
        }
        if (isset($input['nombre_exemplaires'])) {
            $fields[] = "nombre_exemplaires = :nombre_exemplaires";
            $params[":nombre_exemplaires"] = (int)$input['nombre_exemplaires'];
        }


        $fields = [];
        $params = [":id" => (int)$input['id']];
        if (isset($input['motif'])) {
            $fields[] = "motif = :motif";
            $params[":motif"] = trim($input['motif']);
        }
        if (isset($input['date_fin'])) {
            $fields[] = "date_fin = :date_fin";
            $params[":date_fin"] = date('Y-m-d H:i:s', strtotime($input['date_fin']));
        }
        if (isset($input['statut'])) {
            $validStatus = ["en cours", "terminé", "en retard", "récupéré", "livré"];
            if (!in_array($input['statut'], $validStatus)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid statut"]);
                exit;
            }
            $fields[] = "statut = :statut";
            $params[":statut"] = $input['statut'];
        }

        if (!$fields) {
            echo json_encode(["status" => "error", "message" => "Nothing to update"]);
            exit;
        }

        $sql = "UPDATE Personalisations SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(["status" => "ok"]);
        exit;
    }

    if ($method === 'DELETE') {
        parse_str(file_get_contents("php://input"), $input);
        $id = $_GET['id'] ?? $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM Personalisations WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "ok"]);
        exit;
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit;
}
