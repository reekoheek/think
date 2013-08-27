<?php

namespace App\Provider;

use Norm\Norm;
use Norm\Schema;

class SchemaProvider {
    public function initialize($app) {
        Norm::hook('norm.after.factory', function($collection) use ($app) {
            $config = $app->config('schema.schemes');
            if (isset($config[$collection->clazz])) {
                $collection->schema(new Schema($config[$collection->clazz]));
            }
        });
    }
}