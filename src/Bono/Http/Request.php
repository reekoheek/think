<?php

namespace Bono\Http;

class Request extends \Slim\Http\Request {

    protected $MIME_TYPE = array(
        'json' => array(
            'extension' => array( 'json' ),
            'contentType' => array( 'application/json' ),
        ),
        'html' => array(
            'extension' => array( 'html' ),
            'contentType' => array( 'text/html' ),
        ),
    );

    public function getMimeClass() {
        $extension = $this->getExtension();
        if (!empty($extension)) {
            foreach ($this->MIME_TYPE as $mimeClass => $mimeConfig) {
                if (in_array($extension, $mimeConfig['extension'])) {
                    return $mimeClass;
                }
            }
        }

        $accepts = array_map(function($accept) {
            return $accept['contentType'];
        }, $this->getAccepts());

        foreach ($this->MIME_TYPE as $mimeClass => $mimeConfig) {
            foreach ($mimeConfig['contentType'] as $contentType) {
                if (in_array($contentType, $accepts)) {
                    return $mimeClass;
                }
            }
        }
    }

    public function getResourceUri() {
        $pathinfo = pathinfo($this->getPathInfo());
        return $pathinfo['dirname'].'/'.$pathinfo['filename'];
    }

    public function getExtension() {
        return pathinfo($this->getPathInfo(), PATHINFO_EXTENSION);
    }

    public function getAccepts() {
        $results = array();

        $accepts = explode(',', $this->env['HTTP_ACCEPT']);
        foreach ($accepts as $accept) {
            $accept = explode(';', $accept);
            $result = array(
                'contentType' => $accept[0],
                'q' => 1.0
            );
            if (isset($accept[1])) {
                $result['q'] = (double) explode('=', $accept[1])[1];
            }
            $results[] = $result;
        }
        return $results;
    }
}