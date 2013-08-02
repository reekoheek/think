
<table>
    <thead>
        <tr>
            <td></td>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($entries as $entry): ?>
        <tr>
            <td>
                <?php var_dump($entry->toArray()) ?>
            </td>
        </tr>
        <?php endforeach ?>
    </tbody>
</table>
