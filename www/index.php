<?php
require '../vendor/autoload.php';

function baseUrl() {
    static $baseUrl;
    if (!$baseUrl) {
        $baseUrl = str_replace('index.php', '', $_SERVER['SCRIPT_NAME']);
    }
    return $baseUrl;
}

function siteUrl($uri) {
    return baseUrl().'index.php/'.$uri;
}

$app = new \Bono\App(array(
    'mode' => 'development',
    'config.path' => '../config',
    'ns' => '\\App'
));

$app->get('/', function() {
    echo 'Hello World!';
});

$app->run();
