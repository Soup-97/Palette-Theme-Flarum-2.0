<?php

/*
 * Palette theme for Flarum 2.0.
 *
 * Based on the Pallet theme by Hasan Özbey (the-turk/flarum-pallet-theme)
 * and its 1.x fork by Adrian McCay (madeyedeer/flarum-pallet-theme).
 *
 * For the full copyright and license information, please view the
 * LICENSE.md file that was distributed with this source code.
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Settings())
        ->default('soup-97-palette-theme.show_side_nav_to_guests', true)
        ->serializeToForum('palletShowSideNavToGuests', 'soup-97-palette-theme.show_side_nav_to_guests', 'boolval'),
];
