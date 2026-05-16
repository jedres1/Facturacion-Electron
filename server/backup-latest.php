<?php
declare(strict_types=1);

// Endpoint simple para Hostinger/PHP.
// Sube este archivo fuera de la app Electron, por ejemplo a public_html/api/backups/latest.php.
// Cambia el token o configuralo como variable de entorno BACKUP_TOKEN.
$expectedToken = getenv('BACKUP_TOKEN') ?: 'CAMBIA_ESTE_TOKEN';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metodo no permitido']);
    exit;
}

$authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_replace('/^Bearer\s+/i', '', $authorization);

if (!$expectedToken || !hash_equals($expectedToken, $token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token invalido']);
    exit;
}

if (!isset($_FILES['backup']) || $_FILES['backup']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Archivo de backup no recibido']);
    exit;
}

$empresaNit = preg_replace('/[^A-Za-z0-9_-]/', '', $_POST['empresaNit'] ?? 'sin_nit');
$empresaKey = $empresaNit !== '' ? sha1($empresaNit) : 'sin_nit';
$baseDir = dirname(__DIR__) . '/private_backups/' . $empresaKey;

if (!is_dir($baseDir) && !mkdir($baseDir, 0750, true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'No se pudo crear directorio de backup']);
    exit;
}

$latestPath = $baseDir . '/facturacion-latest.db.gz.enc';
$metaPath = $baseDir . '/facturacion-latest.json';
$tmpPath = $_FILES['backup']['tmp_name'];
$checksum = $_POST['checksum'] ?? '';

if ($checksum !== '') {
    $actualChecksum = hash_file('sha256', $tmpPath);
    if (!hash_equals($checksum, $actualChecksum)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Checksum no coincide']);
        exit;
    }
}

if (!move_uploaded_file($tmpPath, $latestPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'No se pudo guardar el backup']);
    exit;
}

$metadata = [
    'success' => true,
    'filename' => 'facturacion-latest.db.gz.enc',
    'empresaNit' => $empresaNit,
    'empresaNombre' => $_POST['empresaNombre'] ?? '',
    'compression' => $_POST['compression'] ?? 'gzip',
    'encryption' => $_POST['encryption'] ?? 'aes-256-gcm',
    'generatedAt' => $_POST['generatedAt'] ?? null,
    'receivedAt' => gmdate('c'),
    'sizeBytes' => filesize($latestPath),
    'checksum' => $checksum ?: hash_file('sha256', $latestPath),
];

file_put_contents($metaPath, json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode($metadata);
