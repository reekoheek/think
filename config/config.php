<?php

use Norm\Schema;

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
            'anu' => NULL,
        ),
    ),

    'norm.databases' => array(
        'mongo' => array(
            'driver' => '\\Norm\\Connection\\MongoConnection',
            'database' => 'think',
        ),
    ),

    'schema.schemes' => array(
        'User' => array(
            'username' => Schema::TYPE_STRING,
            'password' => Schema::TYPE_STRING,
        ),
        'Task' => array(
            'subject' => Schema::TYPE_STRING,
        ),
    ),

    // 'bono.forceMimeType' => 'json'
);