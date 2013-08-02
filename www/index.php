<?php
require '../vendor/autoload.php';

$app = new \Bono\App(array(
    'mode' => 'development',
    'config.path' => '../config',
    'ns' => '\\App'
));

$app->get('/', function() {
    echo 'hello';
});

$app->run();
