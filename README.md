# Palette Theme for Flarum 2.0

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Flarum](https://img.shields.io/badge/flarum-2.0.0--rc.8-%23e7672e?logo=flarum)

A port of the [Pallet theme](https://discuss.flarum.org/d/34569-pallet-theme-new) to **Flarum 2.0**.

- A fixed left sidebar with a user card (avatar, badges, join date, post/discussion counts), or a greeting with sign-up / log-in buttons for guests
- Forum navigation and account links (profile, settings, administration, log out) in the sidebar, including links added by other extensions
- A "Start a Discussion" button in the header
- On tag pages, an in-page navigation that lists only the current tag's family
- Card-style tag tiles on the Tags page, with a colored accent line
- Highlighted sticky discussions and Montserrat typography
- Works with Flarum 2.0's light, dark and high-contrast color schemes

On phones and tablets the sidebar is hidden and Flarum's own mobile navigation is used.

## Requirements

- Flarum `^2.0.0-rc.8`
- `flarum/tags`
- PHP 8.3+

## Installation

If the original theme is installed, remove it first:

```sh
composer remove the-turk/flarum-pallet-theme madeyedeer/flarum-pallet-theme
```

This package is not on Packagist yet, so install it from GitHub:

```sh
composer config repositories.palette vcs https://github.com/Soup-97/Palette-Theme-Flarum-2.0
composer require soup-97/flarum-palette-theme:dev-main
php flarum cache:clear
```

Then enable **Palette Theme** in the admin panel.

## Settings

- **Show the side navigation menu to guests** (on by default). When this is off, guests see the forum without the sidebar.

## Development

```sh
cd js
npm install
npm run dev     # watch
npm run build   # production build into js/dist
```

`js/dist` is committed so that Composer installs work without a build step. Rebuild it before you commit JS changes.

## Credits

- Original theme by [Hasan Özbey (the-turk)](https://github.com/the-turk/flarum-pallet-theme)
- 1.x maintenance fork by [Adrian McCay (MadEyeDeer)](https://github.com/MadEyeDeer/flarum-pallet-theme)

Released under the [MIT License](LICENSE.md).
