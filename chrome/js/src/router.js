
define(['jquery', 'use!underscore', 'use!backbone', 'view/__init__', 'view/zaps/__init__', 'view/account/__init__'], function($, _, Backbone, ViewportView, ZapsView, AccountView) {
  var AppRouter;
  AppRouter = Backbone.Router.extend({
    /*
          App and Router. All requests come through this. Each route requires a specific
          page init file which sets up all the classes on the page. This also allows the
          browser/requirejs to only load necessary page modules defined in each /init/ file
    */
    routes: {
      '': 'zaps',
      '/': 'zaps',
      'account': 'account',
      'account/': 'account'
    },
    initialize: function() {
      return this.viewport = new ViewportView({
        router: this
      });
    },
    load: function(view, options) {
      return this.viewport.render(view, options);
    },
    zaps: function() {
      return this.load(ZapsView, {
        loginRequired: false
      });
    },
    account: function() {
      return this.load(AccountView, {
        loginRequired: false
      });
    }
  });
  return AppRouter;
});
