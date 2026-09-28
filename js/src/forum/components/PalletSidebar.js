import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Avatar from 'flarum/common/components/Avatar';
import Button from 'flarum/common/components/Button';
import Separator from 'flarum/common/components/Separator';
import ItemList from 'flarum/common/utils/ItemList';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import listItems from 'flarum/common/helpers/listItems';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/utils/humanTime';
import formatNumber from 'flarum/common/utils/formatNumber';

// Tag links belong in the in-page navigation of a tag page, not in the global sidebar.
const TAG_ITEM = /^(tag\d+|moreTags|separator)$/;

/**
 * The `PalletSidebar` component is the fixed left column: a user card (or a
 * greeting for guests), the forum navigation, and the session links.
 */
export default class PalletSidebar extends Component {
  view() {
    return (
      <div className="PalletSidebar-container">
        <div className="PalletSidebar-user">{app.session.user ? this.userView(app.session.user) : this.guestView()}</div>
        <nav className="PalletSidebar-nav">
          <ul>{listItems(this.items().toArray())}</ul>
        </nav>
      </div>
    );
  }

  userView(user) {
    return (
      <div className="PalletSidebar-loggedIn">
        <div className="PalletSidebar-avatar">
          <Avatar user={user} />
          <ul className="badges">{listItems(user.badges().toArray())}</ul>
        </div>
        <h4 className="PalletSidebar-username">{username(user)}</h4>
        <p className="PalletSidebar-joined">{app.translator.trans('core.forum.user.joined_date_text', { ago: humanTime(user.joinTime()) })}</p>
        <div className="PalletSidebar-stats">
          <div className="PalletSidebar-stat">
            <span>{app.translator.trans('core.forum.user.posts_link')}</span>
            <span>{formatNumber(user.commentCount() || 0)}</span>
          </div>
          <div className="PalletSidebar-stat">
            <span>{app.translator.trans('core.forum.user.discussions_link')}</span>
            <span>{formatNumber(user.discussionCount() || 0)}</span>
          </div>
        </div>
      </div>
    );
  }

  guestView() {
    return (
      <div className="PalletSidebar-guest">
        <h4>{app.translator.trans('soup-97-palette-theme.forum.howdy')}</h4>
        <p>{app.translator.trans('soup-97-palette-theme.forum.involve')}</p>
        <div className="PalletSidebar-guestButtons">{this.guestButtons().toArray()}</div>
      </div>
    );
  }

  guestButtons() {
    const items = new ItemList();

    if (app.forum.attribute('allowSignUp')) {
      items.add(
        'signUp',
        <Button className="Button Button--block" onclick={() => app.modal.show(() => import('flarum/forum/components/SignUpModal'))}>
          {app.translator.trans('core.forum.header.sign_up_link')}
        </Button>,
        20
      );
    }

    items.add(
      'logIn',
      <Button className="Button Button--block" onclick={() => app.modal.show(() => import('flarum/forum/components/LogInModal'))}>
        {app.translator.trans('core.forum.header.log_in_link')}
      </Button>,
      10
    );

    return items;
  }

  /**
   * The navigation list: the index page's nav items (minus individual tags),
   * followed by the session dropdown's items for logged-in users. Reusing both
   * lists means links added by other extensions show up here too.
   */
  items() {
    const items = new ItemList();
    const nav = new IndexSidebar().navItems();

    for (const key of Object.keys(nav.toObject())) {
      if (!TAG_ITEM.test(key)) items.add(key, nav.get(key), 100 + nav.getPriority(key));
    }

    if (app.session.user) {
      items.add('pallet-separator', <Separator />, 0);

      const session = SessionDropdown.prototype.items.call(new SessionDropdown());

      for (const key of Object.keys(session.toObject())) {
        if (key !== 'separator') items.add('session-' + key, session.get(key), session.getPriority(key) - 200);
      }
    }

    return items;
  }
}
