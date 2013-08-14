<?php

return array(
    'bono.providers' => array(
        '\\Norm\\NormProvider',
    ),
    'norm.databases' => array(
        'mongo' => array(
            'driver' => '\\Norm\\Connection\\MongoConnection',
            'database' => 'think',
        ),
    ),
    'bono.forceMimeType' => 'json'
);