<?php

namespace App\Controllers;

use Bono\Controller;
use Norm\Norm;

class Task extends Controller {

    public function search() {
        $entries = Norm::factory($this->clazz)->find();

        return array(
            'entries' => $entries,
        );
    }

    public function create() {
        $model = Norm::factory($this->clazz)->newInstance();
        $model->set($this->app->request->post());
        $result = $model->save();

        return array(
            'entry' => $model->toArray(),
        );
    }

    public function read($id) {
        $criteria = array( '$id' => $id );
        $model = Norm::factory($this->clazz)->findOne($criteria);
        if ($model) {
            return array(
                'entry' => $model->toArray(),
            );
        }
    }

    public function update($id) {

    }

    public function delete($id) {
        $criteria = array( '$id' => $id );
        $model = Norm::factory($this->clazz)->findOne($criteria);
        if ($model) {
            $model->remove();
        }
    }

    public function getViewFor($for) {
        if (is_readable($this->app->config('templates.path').'/'.$this->name.'/'.$for.'.php')) {
            return $this->name.'/'.$for;
        }

        return $for;
    }

    public function register() {
        $app = $this->app;

        $this->app->group('/'.$this->name, function() {

            // search entries
            $this->app->get('/', function() {
                $this->app->viewTemplate = $this->getViewFor('search');
                return $this->app->data = $this->search();
            });

            // add new entry
            $this->app->post('/', function() {
                $this->app->viewTemplate = $this->getViewFor('create');
                return $this->app->data = $this->create();
            });

            // get entry
            $this->app->get('/:id', function($id) {
                $this->app->viewTemplate = $this->getViewFor('read');
                return $this->app->data = $this->read($id);
            });

            // update entry
            $this->app->put('/:id', function($id) {
                $this->app->viewTemplate = $this->getViewFor('update');
                return $this->app->data = $this->update($id);
            });

            // delete entry
            $this->app->delete('/:id', function($id) {
                $this->app->viewTemplate = $this->getViewFor('delete');
                return $this->app->data = $this->delete($id);
            });

        });
    }

}