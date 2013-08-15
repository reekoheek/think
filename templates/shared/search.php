<?php $schemes = $collection->schema() ? $collection->schema()->toArray() : array() ?>

<div class="table-holder table-bordered">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>

                <?php foreach ($schemes as $name => $scheme): ?>
                <th><?php echo strtoupper($name) ?></th>
                <?php endforeach ?>

                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($entries)): ?>
            <tr>
                <td colspan="1000" style="text-align: center">No records</td>
            </tr>
            <?php endif ?>
            <?php foreach ($entries as $entry): ?>
            <tr>
                <td><?php echo $entry->get('$id') ?></td>

                <?php foreach ($schemes as $name => $scheme): ?>
                <td><?php echo $entry->get($name) ?></td>
                <?php endforeach ?>

                <td>
                    <a href="<?php echo siteUrl($collection->name.'/'.$entry->get('$id').'/update') ?>" class="glyphicon glyphicon-edit"></a>
                    <a href="<?php echo siteUrl($collection->name.'/'.$entry->get('$id').'/delete') ?>" class="glyphicon glyphicon-trash"></a>
                </td>
            </tr>
            <?php endforeach ?>
        </tbody>
    </table>
</div>
