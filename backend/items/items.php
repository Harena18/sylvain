<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../db.php";

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $clothes = $pdo->query("SELECT i.id, i.name, c.size FROM Items i JOIN Clothes c ON i.id = c.item_id")->fetchAll(PDO::FETCH_ASSOC);
        $tarpaulin = $pdo->query("SELECT i.id, i.name, t.length, t.width FROM Items i JOIN Tarpaulin t ON i.id = t.item_id")->fetchAll(PDO::FETCH_ASSOC);
        $display = $pdo->query("SELECT i.id, i.name, d.format FROM Items i JOIN Display d ON i.id = d.item_id")->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "clothes" => $clothes,
            "tarpaulin" => $tarpaulin,
            "display" => $display
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status"=>"error","message"=>$e->getMessage()]);
    }
    exit;
}


    else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $object = $data['object'] ?? null;

        if (!$object) { 
            http_response_code(400); 
            echo json_encode(["status"=>"error","message"=>"No object sent"]); 
            exit; 
        }

        $clientId = $object['client_id'] ?? null;
        $name = $object['name'] ?? '';
        $type = $object['type'] ?? '';

        $stmt = $pdo->prepare("INSERT INTO Items (name, type) VALUES (:name, :type)");
        $stmt->execute([":name" => $name, ":type" => $type]);
        $itemId = $pdo->lastInsertId();

        if ($type === 'Clothes') {
            $stmt2 = $pdo->prepare("INSERT INTO Clothes (item_id, size) VALUES (:item_id, :size)");
            $stmt2->execute([":item_id"=>$itemId, ":size"=>$object['size'] ?? null]);
        } elseif ($type === 'Tarpaulin') {
            $stmt2 = $pdo->prepare("INSERT INTO Tarpaulin (item_id, length, width) VALUES (:item_id,:length,:width)");
            $stmt2->execute([":item_id"=>$itemId, ":length"=>$object['length'] ?? null, ":width"=>$object['width'] ?? null]);
        } elseif ($type === 'Display') {
            $stmt2 = $pdo->prepare("INSERT INTO Display (item_id, format) VALUES (:item_id,:format)");
            $stmt2->execute([":item_id"=>$itemId, ":format"=>$object['format'] ?? null]);
        }

        if ($clientId) {
            $stmt3 = $pdo->prepare("INSERT INTO Client_Items (client_id, item_id) VALUES (:client_id,:item_id)");
            $stmt3->execute([":client_id"=>$clientId, ":item_id"=>$itemId]);
        }

        echo json_encode(["status" => "ok", "item_id" => $itemId]);
        exit;

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
        parse_str($query, $params);
        $id = $params['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT type FROM Items WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Item not found"]);
            exit;
        }

        $type = $row['type'];

        if ($type === 'Clothes') {
            $pdo->prepare("DELETE FROM Clothes WHERE item_id = ?")->execute([$id]);
        } elseif ($type === 'Tarpaulin') {
            $pdo->prepare("DELETE FROM Tarpaulin WHERE item_id = ?")->execute([$id]);
        } elseif ($type === 'Display') {
            $pdo->prepare("DELETE FROM Display WHERE item_id = ?")->execute([$id]);
        }

        $pdo->prepare("DELETE FROM Client_Items WHERE item_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM Personalisations WHERE item_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM Items WHERE id = ?")->execute([$id]);

        $pdo->commit();
        echo json_encode(["status" => "ok"]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage(),   
        ]);
    }
}

