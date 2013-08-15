<?php

namespace App\Controllers;

use \Bono\Controller\RestController;
use \Norm\Norm;

class User extends RestController {
    public function register() {
        $app = $this->app;

        $this->app->post('/'.$this->name.'/login', function() {
            $form = $this->app->request->post();

            $entry = Norm::factory('User')->findOne($this->app->request->post());

            if (isset($entry)) {
                $token = Norm::factory('Token')->newInstance();
                $token->set('user_id', $entry->get('$id'));
                $token->save();

                $entry->set('token', $token->getId());
                $entry->save();

                $token->remove();

                $entry->set('password', NULL);

                return $this->app->data = array(
                    'entry' => $entry,
                );
            } else {
                $this->app->status = 401;
                return $this->app->data = array(
                    'error' => 'Unknown login',
                );
            }
        });

        $this->app->post('/'.$this->name.'/logout', function() {
            $form = $this->app->request->post();

            $entry = Norm::factory('User')->findOne($this->app->request->post());

            if (isset($entry)) {
                $entry->set('token', NULL);
                $entry->save();

                $entry->set('password', NULL);

                return $this->app->data = array(
                    'entry' => $entry,
                );
            } else {
                $this->app->status = 401;
                return $this->app->data = array(
                    'error' => 'Unknown token',
                );
            }
        });
        parent::register();
    }
}