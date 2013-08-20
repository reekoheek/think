<?php

namespace App\Controllers;

use \Bono\Controller\RestController;
use \Norm\Norm;

class User extends RestController {
    public function check() {
        return ($this->getUser()) ? true : false;
    }

    public function getUser() {
        $token = $this->app->request->headers('X-Auth-Token');
        if ($token) {
            $user = Norm::factory('User')->findOne(array(
                'token' => $token,
            ));
        }
        return $user;
    }

    public function generateToken($entry) {
        $token = Norm::factory('Token')->newInstance();
        $token->set('user_id', $entry->get('$id'));
        $token->save();
        $result = $token->getId();
        $token->remove();

        return $result;
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
                    $user->save();

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
                    $entry->save();

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

        });


        parent::register();
    }
}