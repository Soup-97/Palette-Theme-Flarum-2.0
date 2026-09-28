import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import ForumApplication from 'flarum/forum/ForumApplication';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import classList from 'flarum/common/utils/classList';
import humanTime from 'flarum/common/helpers/humanTime';
import TagsPage from 'ext:flarum/tags/forum/components/TagsPage';
import tagIcon from 'ext:flarum/tags/common/helpers/tagIcon';
import sortTags from 'ext:flarum/tags/common/utils/sortTags';

import PalletSidebar from './components/PalletSidebar';

export { PalletSidebar };

function sidebarEnabled() {
  return !!app.session.user || app.forum.attribute('palletShowSideNavToGuests') !== false;
}

app.initializers.add('soup-97-palette-theme', () => {
  // ------------------------------------------------------------------
  // Fixed left sidebar, mounted next to the header drawer.

  extend(ForumApplication.prototype, 'mount', () => {
    if (!sidebarEnabled()) return;

    const appEl = document.getElementById('app');
    const drawer = document.getElementById('drawer');
    if (!appEl || !drawer) return;

    const sidebar = document.createElement('aside');
    sidebar.className = 'App-sidebar PalletSidebar';
    drawer.after(sidebar);
    appEl.classList.add('Pallet--withSidebar');

    m.mount(sidebar, PalletSidebar);
  });

  // ------------------------------------------------------------------
  // "Start a Discussion" moves into the header on desktop.

  extend(HeaderSecondary.prototype, 'items', (items) => {
    const canStartDiscussion = app.forum.attribute('canStartDiscussion') || !app.session.user;

    items.add(
      'newDiscussion',
      <Button
        icon="fas fa-edit"
        className="Button Button--primary PalletHeader-newDiscussion"
        disabled={!canStartDiscussion}
        onclick={() => IndexSidebar.prototype.newDiscussionAction().catch(() => {})}
      >
        {app.translator.trans(`core.forum.index.${canStartDiscussion ? 'start_discussion_button' : 'cannot_start_discussion_button'}`)}
      </Button>,
      19
    );
  });

  // ------------------------------------------------------------------
  // The in-page side nav only appears on tag pages (on desktop), where it
  // lists the current tag's family. Elsewhere the fixed sidebar replaces it.
  // On phones and tablets it is left alone, as it doubles as the title control.

  extend(IndexSidebar.prototype, 'view', function (vdom) {
    if (!vdom || !vdom.attrs) return;

    vdom.attrs.className = classList(vdom.attrs.className, app.currentTag?.() ? 'PalletTagNav' : 'sideNav--hidden');
  });

  extend(IndexSidebar.prototype, 'navItems', function (items) {
    // The fixed sidebar instantiates IndexSidebar without attrs; it filters tags itself.
    if (!this.attrs) return;

    const current = app.currentTag?.();
    if (!current) return;

    const family = new Set([current, current.parent()].filter(Boolean));

    app.store.all('tags').forEach((tag) => {
      if (tag.position() === null) return;

      const inFamily = family.has(tag) || (tag.isChild() && family.has(tag.parent()));
      if (!inFamily && items.has('tag' + tag.id())) items.remove('tag' + tag.id());
    });
  });

  // ------------------------------------------------------------------
  // Sticky / locked discussions get their own look in the list.

  extend(DiscussionListItem.prototype, 'elementAttrs', function (attrs) {
    const discussion = this.attrs.discussion;

    attrs.className = classList(attrs.className, {
      'DiscussionListItem--sticky': discussion.attribute('isSticky'),
      'DiscussionListItem--locked': discussion.attribute('isLocked'),
    });
  });

  // ------------------------------------------------------------------
  // Tags page: Pallet-style tag cards.

  override(TagsPage.prototype, 'tagTileListView', function (original, pinned) {
    return <ul className="PalletTagTiles">{pinned.map(this.tagTileView.bind(this))}</ul>;
  });

  override(TagsPage.prototype, 'tagTileView', function (original, tag) {
    const lastPostedDiscussion = tag.lastPostedDiscussion();
    const children = sortTags(tag.children() || []);

    return (
      <li className={classList('PalletTagCard', { colored: tag.color() })} style={{ '--tag-color': tag.color() || 'var(--control-bg)' }}>
        <div className="PalletTagCard-main">
          {tag.icon() && <div className="PalletTagCard-icon">{tagIcon(tag, { className: 'fa-3x' }, { useColor: false })}</div>}
          <div className="PalletTagCard-info">
            <Link className="PalletTagCard-title" href={app.route.tag(tag)}>
              {tag.name()}
            </Link>
            {tag.description() && <p className="PalletTagCard-description">{tag.description()}</p>}
            {children.length > 0 && (
              <div className="PalletTagCard-children">
                {children.map((child) => [<Link href={app.route.tag(child)}>{child.name()}</Link>, ' '])}
              </div>
            )}
          </div>
        </div>
        {lastPostedDiscussion && (
          <Link
            className="PalletTagCard-lastPostedDiscussion"
            href={app.route.discussion(lastPostedDiscussion, lastPostedDiscussion.lastPostNumber())}
          >
            <span className="PalletTagCard-lastPostedDiscussion-title">{lastPostedDiscussion.title()}</span>
            {humanTime(lastPostedDiscussion.lastPostedAt())}
          </Link>
        )}
      </li>
    );
  });
});
