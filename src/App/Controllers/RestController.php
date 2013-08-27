<?php

namespace App\Controllers;

use Norm\Norm;

class RestController extends \Bono\Controller\RestController {

    public function delete($id) {

        $criteria = array( '$id' => $id );
        $model = Norm::factory($this->clazz)->findOne($criteria);

        $deleted = Norm::factory($this->clazz.'Deleted')->newInstance($model);
        $deleted->set('time', new \MongoDate());
        $deleted->save();

        if ($model) {
            $model->remove();
        }

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

    public function register() {

        // FIXME move this as middleware
        $token = $this->app->request->headers('X-Auth-Token');
        if (empty($token)) {
            $this->app->get('/'.$this->name.'.*', function() {
                $this->app->response->setStatus(401);
                return $this->app->data = array(
                    'error' => 'Unauthorized'
                );
            });
            return;
        }

        $user = $this->getUser();

        if ($user) {
            Norm::factory($this->clazz)->filter(array('user_id' => $user->get('$id')));
        } else {
            Norm::factory($this->clazz)->filter(array('user_id' => ''));
        }

        parent::register();

    }
}