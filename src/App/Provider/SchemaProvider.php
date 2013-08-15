<?php

namespace App\Provider;

use Norm\Norm;
use Norm\Schema;

class SchemaProvider {
    public function initialize($app) {
        Norm::hook('norm.after.factory', function($collection) {
            switch ($collection->clazz) {
                case 'User':
                    $collection->schema(new Schema(array(
                        'username' => Schema::TYPE_STRING,
                        'password' => Schema::TYPE_STRING,
                    )));
                    break;
                case 'Task':
                    $collection->schema(new Schema(array(
                        'subject' => Schema::TYPE_STRING,
                    )));
                    break;
                default:
            }
        });
    }
}