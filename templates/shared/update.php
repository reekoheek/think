<?php $schemes = $collection->schema() ? $collection->schema()->toArray() : array() ?>

<h1><?php echo $collection->name ?></h1>

<div>

    <div class="row">
        <div class="col-xs-5">ID</div>
        <div class="col-xs-7"><?php echo $entry->get('$id') ?></div>
    </div>

    <?php foreach ($schemes as $name => $scheme): ?>
    <div class="row">
        <div class="col-xs-5"><?php echo strtoupper($name) ?></div>
        <div class="col-xs-7"><?php echo $entry->get($name) ?></div>
    </div>
    <?php endforeach ?>

</div>
