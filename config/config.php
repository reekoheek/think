<?php

return array(

    'bono.providers' => array(
        '\\Bono\\Provider\\ContentNegotiatorProvider',
        '\\Norm\\NormProvider',
        '\\App\\Provider\\SchemaProvider',
        '\\Bono\\Provider\\ControllerProvider',
    ),

    'bono.view' => array(
        'default' => '\\Bono\\View\\LayoutedView',
        'layout' => 'layout',
    ),

    'bono.controller' => array(
        'default' => '\\App\\Controllers\\RestController',
        'mapping' => array(
            'user' => '\\App\\Controllers\\User',
            'task' => NULL,
        ),
    ),

    'norm.databases' => array(
        'mongo' => array(
            'driver' => '\\Norm\\Connection\\MongoConnection',
            'database' => 'think',
        ),
    ),

    // 'bono.forceMimeType' => 'json'
);