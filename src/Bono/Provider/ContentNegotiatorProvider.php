<?php

namespace Bono\Provider;

class ContentNegotiatorProvider {
    protected $app;

    public function initialize($app) {
        $this->app = $app;

        $app->container->singleton('request', function ($c) {
            return new \Bono\Http\Request($c['environment']);
        });

        $app->hook('slim.after.router', function() use ($app) {
            if ($app->request->getMimeClass() == 'json') {
                echo json_encode($app->data);
            } elseif ($app->viewTemplate) {
                if (!is_array($app->data)) {
                   $app->data = array();
                }
                $app->render($app->viewTemplate.'.php', $app->data);
            }
        });
    }
}