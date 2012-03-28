
define(['jquery', 'use!underscore', 'use!backbone', 'mustache', 'text!template/account/__init__.html', 'md5'], function($, _, Backbone, MustacheWrapper, InitTemplate, Md5Wrapper) {
  var AccountView;
  AccountView = Backbone.View.extend({
    /*
          Account view
    */
    initialize: function(options) {
      _.bindAll(this);
      this.account = options.account;
      this.headerView = options.headerView;
      this.footerView = options.footerView;
      return this.render();
    },
    render: function() {
      var view;
      view = {
        username: this.account.get('username'),
        email: this.account.get('email'),
        emailHash: hex_md5($.trim(this.account.get('email')).toLowerCase()).toLowerCase()
      };
      return this.$el.html(Mustache.to_html(InitTemplate, view));
    }
  });
  return AccountView;
});
