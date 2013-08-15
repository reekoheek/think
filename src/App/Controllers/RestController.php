<?php

namespace App\Controllers;

use Norm\Norm;

class RestController extends \Bono\Controller\RestController {
    public function register() {
        $token = $this->app->request->headers('X-Auth-Token');
        if ($token) {

            $user = Norm::factory('User')->findOne(array(
                'token' => $token,
            ));

            Norm::factory($this->clazz)->filter(array('userId' => $user->get('$id')));
        } else {
            Norm::factory($this->clazz)->filter(array('userId' => ''));
        }
        parent::register();
    }
}