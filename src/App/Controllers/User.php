<?php

namespace App\Controllers;

use \Bono\Controller\RestController;
use \Norm\Norm;

class User extends RestController {
    public function check() {
        return ($this->getUser()) ? true : false;
    }

    public function getUser() {
        $user = null;

        $token = $this->app->request->headers('X-Auth-Token');
        if ($token) {
            $criteria = array( '$id' => $token );
            $token = Norm::factory('Token')->findOne($criteria);

            if ($token) {
                $user = Norm::factory('User')->findOne(array('$id' => $token->get('user_id')));
            }
        }
        return $user;
    }

    public function generateToken($entry) {
        $criteria = array(
            'user_id' => $entry->get('$id'),
            'user_agent' => $this->app->request->getUserAgent(),
        );
        Norm::factory('Token')->remove($criteria);
        $token = Norm::factory('Token')->newInstance($criteria);
        $token->save();
        return $token->getId();
    }

    public function register() {
        $app = $this->app;

        $this->app->group('/'.$this->name, function() use ($app) {

            $this->app->post('/signup', function() {
                $post = $this->app->request->post();
                $user = Norm::factory('User')->findOne(array('username' => $post['username']));
                if (!$user) {
                    $user = Norm::factory('User')->newInstance($post);
                    $user->set('retype', NULL);
                    $user->set('password', md5($user->get('password')));
                    $user->save();

                    $user->set('token', $this->generateToken($user));
                    $user->set('password', NULL);
                }

                return $this->app->data = array(
                    'entry' => $user,
                );
            });

            $this->app->get('/check', function() use ($app) {
                $valid = $this->check();

                if (!$valid) {
                    $this->app->status = 401;
                }

                return $this->app->data = array(
                    'valid' => $valid,
                );
            });

            $this->app->post('/login', function() {
                $form = $this->app->request->post();

                $entry = Norm::factory('User')->findOne(array('username' => $form['login']));

                if ($entry->get('password') === md5($form['password'])) {
                    $entry->set('token', $this->generateToken($entry));
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

            $this->app->get('/logout', function() {

                $entry = $this->getUser();

                if (isset($entry)) {
                    $criteria = array(
                        'user_id' => $entry->get('$id'),
                        'user_agent' => $this->app->request->getUserAgent(),
                    );
                    Norm::factory('Token')->remove($criteria);

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

        });

        parent::register();
    }
}