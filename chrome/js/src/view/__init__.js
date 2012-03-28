
define(['jquery', 'use!underscore', 'use!backbone', 'mustache', 'text!template/__init__.html', 'model/account', 'view/header', 'view/footer', 'view/zaps/__init__', 'view/account/__init__'], function($, _, Backbone, MustacheWrapper, InitTemplate, Account, HeaderView, FooterView, ZapsView, AccountView) {
  var Viewport;
  Viewport = Backbone.View.extend({
    /*
          Top level view which controls entire viewport
    */
    events: {
      'click li[data-tab]': 'tabClick',
      'click *[data-navlink]': 'navClick'
    },
    initialize: function(options) {
      var _this = this;
      _.bindAll(this);
      this.setElement($('body'));
      (this.account = new Account()).fetch({
        error: function(account, e) {
          return account.trigger('reset');
        }
      });
      this.account.on('change reset', this.verifyLoggedIn);
      return this.render();
    },
    render: function(appView, options) {
      var defaults, view, _ref, _ref2;
      if (appView != null) {
        if (((_ref = this.appView) != null ? _ref.unload : void 0) != null) {
          this.appView.unload.call(this.appView);
        }
        if (((_ref2 = this.appView) != null ? _ref2.undelegateEvents : void 0) != null) {
          this.appView.undelegateEvents();
        }
        defaults = {
          el: this.$('*[data-app]'),
          account: this.account,
          headerView: this.headerView,
          footerView: this.footerView
        };
        return this.appView = new appView($.extend(defaults, options));
      } else {
        view = {
          place: 'holder'
        };
        this.$el.html(Mustache.to_html(InitTemplate, view));
        this.headerView = new HeaderView({
          el: this.$('div[data-header=true]'),
          account: this.account
        });
        return this.footerView = new FooterView({
          el: this.$('div[data-footer=true]'),
          account: this.account
        });
      }
    },
    navigate: function(path) {
      chrome.tabs.create({
        url: "" + window.domain + "/" + path
      });
      return window.close();
    },
    verifyLoggedIn: function() {
      if (!this.account.isLoggedIn()) return this.navigate('app/login');
    },
    tabClick: function(e) {
      var load, tab,
        _this = this;
      tab = $(e.currentTarget).attr('data-tab');
      load = function(tab, view, options) {
        log(_this.$('ul[data-tabs]').find('li'));
        _this.$('ul[data-tabs]').find('li').removeClass('selected');
        _this.$('ul[data-tabs]').find("li[data-tab=" + tab + "]").addClass('selected');
        return _this.render(view, options);
      };
      switch (tab) {
        case "zaps":
          load(tab, ZapsView, {});
          break;
        case "account":
          load(tab, AccountView, {});
      }
      return false;
    },
    navClick: function(e) {
      var path;
      path = $(e.currentTarget).attr('data-navlink');
      this.navigate(path);
      return false;
    }
  });
  return Viewport;
});
