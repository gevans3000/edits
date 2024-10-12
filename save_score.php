<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
$servername = "localhost";
$username = "tzjwuepq_gamedata";  // replace with your MySQL username
$password = "$1L0ven0w9";  // replace with your MySQL password
$dbname = "tzjwuepq_gamedata";  // replace with the name of your database

// Create connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection and handle error
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);  // Return connection error in JSON format
    exit();
}

// Get POST data from the frontend
$wallet = $_POST['wallet'] ?? null;
$score = $_POST['score'] ?? null;
$action = $_POST['action'] ?? 'save';  // Action: 'save' or 'fetch'

// Handle fetching the highest score (lifetime score)
if ($action == 'fetch' && $wallet) {
    $sql = "SELECT score, first_login_timestamp FROM players WHERE wallet = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "SQL error: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $stmt->bind_result($currentScore, $firstLoginTimestamp);

    if ($stmt->fetch()) {
        echo json_encode([
            "message" => "Score and hours fetched successfully", 
            "currentScore" => $currentScore, 
            "firstLoginTimestamp" => $firstLoginTimestamp
        ]);
    } else {
        echo json_encode(["error" => "No score found for wallet"]);
    }
    $stmt->close();
    exit();  // End here for fetch action
}

// Handle saving the score and updating lifetime score
if ($action == 'save' && $wallet && $score) {
    $sql = "SELECT score FROM players WHERE wallet = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "SQL error: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $stmt->bind_result($currentScore);

    if ($stmt->fetch()) {
        $stmt->free_result();

        // Add the new score to the current score (lifetime score)
        $newScore = $currentScore + $score;

        // Update the existing record with new score and last login timestamp
        $updateSql = "UPDATE players SET score = ?, last_login_timestamp = NOW() WHERE wallet = ?";
        $updateStmt = $conn->prepare($updateSql);
        if (!$updateStmt) {
            echo json_encode(["error" => "SQL error: " . $conn->error]);
            exit();
        }
        $updateStmt->bind_param("is", $newScore, $wallet);
        if ($updateStmt->execute()) {
            echo json_encode(["message" => "Score updated successfully", "newScore" => $newScore]);
        } else {
            echo json_encode(["error" => "Error updating score"]);
        }
        $updateStmt->close();
    } else {
        $stmt->free_result();

        // Insert a new record if no wallet exists in the database
        $insertSql = "INSERT INTO players (wallet, score, first_login_timestamp, last_login_timestamp) VALUES (?, ?, NOW(), NOW())";
        $insertStmt = $conn->prepare($insertSql);
        if (!$insertStmt) {
            echo json_encode(["error" => "SQL error: " . $conn->error]);
            exit();
        }
        $insertStmt->bind_param("si", $wallet, $score);
        if ($insertStmt->execute()) {
            echo json_encode(["message" => "New score saved successfully", "newScore" => $score]);
        } else {
            echo json_encode(["error" => "Error saving new score"]);
        }
        $insertStmt->close();
    }
    $stmt->close();
}

$conn->close();
