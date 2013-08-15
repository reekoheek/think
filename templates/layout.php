<!doctype html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Think</title>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />

    <link rel="apple-touch-icon" href="<?php echo baseUrl() ?>vendor/think/img/favicon.png" />
    <link rel="apple-touch-startup-image" href="<?php echo baseUrl() ?>vendor/think/img/splash/splash-ipadh.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />
    <link rel="apple-touch-startup-image" href="<?php echo baseUrl() ?>vendor/think/img/splash/splash-ipadv.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />
    <link rel="apple-touch-startup-image" href="<?php echo baseUrl() ?>vendor/think/img/splash/splash-iphoneh.png" media="screen and (min-device-width: 321px) and (min-device-width: 480px)" />
    <link rel="apple-touch-startup-image" href="<?php echo baseUrl() ?>vendor/think/img/splash/splash-iphonev.png" media="screen and (max-device-width: 320px)" />

    <link rel="icon" type="image/ico" href="<?php echo baseUrl() ?>vendor/think/img/favicon.ico" />
    <link rel="shortcut icon" type="image/x-ico" href="<?php echo baseUrl() ?>vendor/think/img/favicon.ico" />

    <link rel="stylesheet" type="text/css" href="<?php echo baseUrl() ?>vendor/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo baseUrl() ?>vendor/bootstrap/css/bootstrap-glyphicons.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo baseUrl() ?>vendor/think/css/global.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo baseUrl() ?>vendor/xin/css/xin.css" />
</head>

<body>
    <nav class="navbar" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="<?php echo siteUrl('') ?>"><i class="glyphicon glyphicon-home"></i></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav">
                <li><a href="<?php echo siteUrl('user') ?>">User</a></li>
                <li><a href="<?php echo siteUrl('task') ?>">Task</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </nav>

    <div class="container">
        <?php echo $content ?>
    </div>

    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/zepto/zepto.min.js"></script>
    <!-- workaround script to mimick jquery for zepto -->
    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/zepto/data.js"></script>
    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/simply-deferred/deferred.js"></script>
    <script type="text/javascript">
        jQuery = $;
    </script>
    <!-- end workaround script to mimick jquery for zepto -->

    <!-- underscore and backbone
    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/underscore/underscore-min.js"></script>
    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/backbone/backbone.js"></script>
    <!-- end underscore and backbone -->

    <script type="text/javascript" src="<?php echo baseUrl() ?>vendor/bootstrap/js/bootstrap.min.js"></script>
</html>
