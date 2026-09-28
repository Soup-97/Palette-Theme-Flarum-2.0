import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';

export const extend = [
  new Extend.Admin().setting(() => ({
    setting: 'soup-97-palette-theme.show_side_nav_to_guests',
    type: 'boolean',
    label: app.translator.trans('soup-97-palette-theme.admin.show_side_nav_to_guests_label'),
    help: app.translator.trans('soup-97-palette-theme.admin.show_side_nav_to_guests_help'),
  })),
];

app.initializers.add('soup-97-palette-theme', () => {});
